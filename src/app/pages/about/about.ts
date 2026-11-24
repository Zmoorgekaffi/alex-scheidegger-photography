import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html'
})
export class About {
  // Below 1330px the text sits on top of the photo and can be faded out to see the picture.
  readonly showText = signal(true);

  toggleText() {
    this.showText.update((v) => !v);
  }

  readonly topics = ['Events & Clubs', 'Bands & Musiklabels', 'Portraits', 'Vernissagen'];

  readonly references = [
    'Ozora Festival 2026, Ungarn: Offizieller Fotograf des Duos Wavecheck',
    'Zürcher Unterländer, 2015: Bildveröffentlichung zum Theaterstück Radio Luna-tic'
  ];
}
