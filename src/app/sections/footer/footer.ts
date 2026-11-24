import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html'
})
export class Footer {
  private readonly router = inject(Router);
  private readonly routerEvents = toSignal(this.router.events);

  readonly year = new Date().getFullYear();
  // Home scrolls to the top; every other page links back to the start page.
  readonly isHome = computed(() => {
    this.routerEvents();
    return this.router.url.split(/[?#]/)[0] === '/';
  });
}
