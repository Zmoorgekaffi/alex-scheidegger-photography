import { Component } from '@angular/core';
import { Gallery } from '../../sections/gallery/gallery';
import { Offers } from '../../sections/offers/offers';
import { Contact } from '../../sections/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Gallery, Offers, Contact],
  template: `
    <app-gallery />
    <app-offers />
    <app-contact />
  `
})
export class Home {}
