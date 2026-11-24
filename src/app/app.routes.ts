import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Imprint } from './pages/imprint/imprint';
import { Privacy } from './pages/privacy/privacy';

export const routes: Routes = [
  { path: '', component: Home },
  // Bewusst nicht von der Startseite verlinkt.
  { path: 'ueber-mich', component: About, title: 'Über mich | Alex Scheidegger Photography' },
  { path: 'impressum', component: Imprint, title: 'Impressum | Alex Scheidegger Photography' },
  { path: 'datenschutz', component: Privacy, title: 'Datenschutz | Alex Scheidegger Photography' },
  { path: '**', redirectTo: '' }
];
