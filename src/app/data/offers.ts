export interface Offer {
  title: string;
  description: string;
}

export const OFFERS: Offer[] = [
  {
    title: 'Musikszene',
    description:
      'Clubs, Partys, Labels und DJs. Bilder, die zeigen, wie sich eure Nacht anfühlt, und euer nächstes Event voll machen.'
  },
  {
    title: 'Firmen und Kultur',
    description:
      'Firmenfeste, Launches, Vernissagen und Businessporträts. Mit Charakter statt Standardbild.'
  },
  {
    title: 'Andere Anfrage?',
    description: 'Private Porträts oder eine eigene Idee? Schreib mir kurz, worum es geht.'
  }
];
