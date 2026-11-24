import { Component, effect, inject, signal } from '@angular/core';
import { OFFERS } from '../../data/offers';
import { OfferSelectionService } from '../../offer-selection.service';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html'
})
export class Contact {
  private readonly offerSelection = inject(OfferSelectionService);

  readonly offerTitles = OFFERS.map((offer) => offer.title);
  readonly selectedOffer = signal('');
  readonly status = signal<SubmitStatus>('idle');

  constructor() {
    effect(() => {
      const selection = this.offerSelection.selection();
      if (selection) {
        this.selectedOffer.set(selection.title);
      }
    });
  }

  onOfferChange(event: Event) {
    this.selectedOffer.set((event.target as HTMLSelectElement).value);
  }

  async onSubmit(event: Event, form: HTMLFormElement) {
    event.preventDefault();

    const data = new FormData(form);
    // Honeypot: real visitors never fill this hidden field, bots usually do.
    if ((data.get('website') as string)?.trim()) {
      this.status.set('success');
      form.reset();
      this.selectedOffer.set('');
      return;
    }

    this.status.set('sending');

    try {
      const response = await fetch('send-mail.php', { method: 'POST', body: data });
      if (!response.ok) throw new Error('request_failed');
      this.status.set('success');
      form.reset();
      this.selectedOffer.set('');
    } catch {
      this.status.set('error');
    }
  }
}
