import { Injectable, signal } from '@angular/core';

interface OfferSelection {
  title: string;
  nonce: number;
}

@Injectable({ providedIn: 'root' })
export class OfferSelectionService {
  private readonly _selection = signal<OfferSelection | null>(null);
  readonly selection = this._selection.asReadonly();

  select(title: string) {
    this._selection.set({ title, nonce: Date.now() });
  }
}
