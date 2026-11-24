import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
  viewChildren
} from '@angular/core';
import gsap from 'gsap';
import { Lightbox } from '../lightbox/lightbox';

// Matches the grid's `auto-rows-0.25` (1px) track height in gallery.html.
const ROW_UNIT_PX = 1;

@Component({
  selector: 'app-gallery',
  imports: [Lightbox],
  templateUrl: './gallery.html'
})
export class Gallery {
  // Fallback for prerender and local dev (no PHP); replaced by list-images.php in the browser.
  readonly images = signal(Array.from({ length: 30 }, (_, i) => `gallery-pics/gallery-${i + 1}.webp`));

  readonly activeIndex = signal<number | null>(null);

  private readonly grid = viewChild<ElementRef<HTMLElement>>('grid');
  private readonly tiles = viewChildren<ElementRef<HTMLElement>>('tile');
  private readonly destroyRef = inject(DestroyRef);

  private browserReady = false;
  private observer?: IntersectionObserver;
  private readonly prepared = new WeakSet<HTMLElement>();

  constructor() {
    // Picks up tiles that appear after the folder listing replaced the fallback images.
    effect(() => {
      const els = this.tiles().map((tile) => tile.nativeElement);
      if (this.browserReady) untracked(() => this.prepareTiles(els));
    });

    afterNextRender(() => {
      this.browserReady = true;
      this.prepareTiles(this.tiles().map((tile) => tile.nativeElement));

      const gridEl = this.grid()?.nativeElement;
      if (gridEl) {
        let raf = 0;
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => this.layoutMasonry());
        });
        resizeObserver.observe(gridEl);
        this.destroyRef.onDestroy(() => {
          cancelAnimationFrame(raf);
          resizeObserver.disconnect();
        });
      }

      this.destroyRef.onDestroy(() => this.observer?.disconnect());
      void this.loadImageList();
    });
  }

  private async loadImageList(): Promise<void> {
    try {
      const response = await fetch('list-images.php');
      if (!response.ok) return;
      const list: unknown = await response.json();
      if (!Array.isArray(list) || list.length === 0 || !list.every((x) => typeof x === 'string')) return;
      const current = this.images();
      if (list.length === current.length && list.every((x, i) => x === current[i])) return;
      this.images.set(list);
    } catch {
      // keep the fallback list
    }
  }

  private prepareTiles(els: HTMLElement[]): void {
    const fresh = els.filter((el) => !this.prepared.has(el));
    if (!fresh.length) return;

    this.layoutMasonry();
    gsap.set(fresh, { opacity: 0, y: 70 });

    // IntersectionObserver reacts to actual visibility, not pre-measured
    // scroll offsets — unlike ScrollTrigger it stays correct even though
    // tiles keep shifting size as their (lazy-loaded, uncropped) images land.
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          gsap.to(entry.target, { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' });
          this.observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.0, rootMargin: '0px 0px 0px 0px' }
    );

    for (const el of fresh) {
      this.prepared.add(el);
      this.observer.observe(el);
    }
  }

  onImageLoad(event: Event) {
    const tile = (event.target as HTMLElement).closest('.gallery-tile') as HTMLElement | null;
    tile?.classList.add('is-loaded');
    // The tile's row-span was set from a placeholder ratio (see layoutMasonry);
    // once the real image lands, recompute it from the image's true proportions
    // so the masonry packing matches the actual photo.
    if (tile) this.layoutTile(tile);
  }

  /**
   * Emulates CSS masonry on top of a real grid: each tile spans a variable
   * number of 1px auto-rows (see `auto-rows-0.25` in gallery.html) so items
   * keep DOM/reading order (1,2,3,4 across, then 5,6,7,8, ...) while still
   * packing at their natural image height instead of a uniform row height.
   */
  private layoutMasonry(): void {
    for (const tile of this.tiles()) {
      this.layoutTile(tile.nativeElement);
    }
  }

  private layoutTile(tile: HTMLElement): void {
    const gridEl = this.grid()?.nativeElement;
    if (!gridEl) return;

    const rowGap = parseFloat(getComputedStyle(gridEl).rowGap) || 0;
    const img = tile.querySelector('img') as HTMLImageElement | null;
    const width = tile.offsetWidth;
    if (!width) return;

    const ratio = img?.complete && img.naturalWidth
      ? img.naturalHeight / img.naturalWidth
      : 5 / 4; // placeholder ratio until the real image loads
    const height = width * ratio;
    const span = Math.max(1, Math.ceil((height + rowGap) / (ROW_UNIT_PX + rowGap)));
    tile.style.gridRowEnd = `span ${span}`;
  }

  open(index: number) {
    this.activeIndex.set(index);
  }

  close() {
    this.activeIndex.set(null);
  }
}
