import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostListener,
  input,
  output,
  viewChild
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Lightbox implements AfterViewInit {
  images = input.required<string[]>();
  activeIndex = input(0);
  closed = output<void>();

  private readonly swiperRef = viewChild.required<ElementRef<SwiperContainer>>('swiperEl');

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closed.emit();
  }

  close() {
    this.closed.emit();
  }

  ngAfterViewInit() {
    const swiperEl = this.swiperRef().nativeElement;
    Object.assign(swiperEl, {
      slidesPerView: 1,
      initialSlide: this.activeIndex(),
      loop: true,
      keyboard: { enabled: true },
      navigation: true,
      injectStyles: [
        `.swiper-button-next, .swiper-button-prev { color: #ffffff; }`
      ]
    });
    swiperEl.initialize();
  }
}
