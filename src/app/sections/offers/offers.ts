import { Component, inject } from '@angular/core';
import { OFFERS } from '../../data/offers';
import { OfferSelectionService } from '../../offer-selection.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.html'
})
export class Offers {
  private readonly offerSelection = inject(OfferSelectionService);

  readonly offers = OFFERS;

  selectOffer(title: string) {
    this.offerSelection.select(title);
  }
}
