# Projektplanung: One-Pager (Übergangslösung) – alex scheidegger photography
 
## Zweck
Schnelle Übergangs-Website (One-Pager) für Alex Scheidegger, die online geht, bis das finale (grössere) Website-Design – siehe `planung-website.md` – fertig ist.
 
---
 
## 1. Tech-Stack
 
| Bereich | Wahl |
|---|---|
| Framework | Angular – **Zoneless** (`provideZonelessChangeDetection`), ausschliesslich **Signals**, **kein RxJS** |
| Styling | Tailwind CSS – neue **`@theme`**-Funktion |
| Slider/Lightbox | **Swiper.js** als **Custom Element**, direkt ins Projekt eingebaut (registriert via `register()`, **nicht** per externer API/CDN eingebunden) |
 
---
 
## 2. Design-Richtung
 
- Helles, leichtes Design (kein dunkles/dramatisches Theme wie beim Haupt-Website-Entwurf).
- Der Vibe soll sich am Logo orientieren:
  - Schriftmix: „alex" fett/serif, „scheidegger" dünn/serif (mit verspielten Unterlängen), „photography" fett/serif-slab, klar editorial.
  - Grafisches Element: zwei offene Eckrahmen (oben links / unten rechts) als wiederkehrendes Rahmen-Motiv – liesse sich z. B. im Header/Footer oder um die Galerie-Bilder wieder aufgreifen.
  - Farbwelt: Schwarz/Weiss/Grau, viel Weissraum.
---
 
## 3. Seitenstruktur (One-Pager, alles auf einer Seite via Anchor-Scroll)
 
1. **Header** – Logo, Navigation (Anchor-Links zu den Sections)
2. **Hero**
3. **Galerie** – Bilder von Alex im Rasterlayout (siehe Referenz-Wireframe unten). Klick auf ein Bild öffnet eine **Fotolightbox**, in der man mit einem **Swiper** durch alle Bilder swipen/blättern kann.
4. **Angebote**
5. **Kontakt** – Kontaktinfos + Kontaktformular
6. **Footer**
### Referenz-Wireframe Galerie-Raster
Gemischtes Grid-Layout (kein starres gleichmässiges Raster):
- Reihe 1: zwei kleine Quadrate nebeneinander + ein hohes Rechteck rechts (spannt über zwei Reihen)
- Reihe 2: ein breites Rechteck unter den zwei Quadraten
- Reihe 3: ein extra-breites Rechteck über die volle Breite
→ Als CSS-Grid mit unterschiedlichen `grid-column`/`grid-row`-Spans umsetzbar, responsive auf Mobile zu einer einfachen 1-2-spaltigen Anordnung zusammenfallend.
 
---
 
## 4. Offene Punkte / Platzhalter
 
- **Angebote**: Inhalte/Pakete/Preise noch nicht definiert → Platzhalter-Texte bis Alex Infos liefert.
- **Kontaktformular**: Felder noch offen (Standardannahme: Name, E-Mail, Nachricht) – Ziel-Backend/Versandweg noch zu klären.
- **Bilder**: Echte Fotos von Alex für die Galerie noch zu liefern → vorerst Platzhalterbilder.
- **Domain/Hosting** für den Übergangs-One-Pager noch offen.
---
 
## 5. Nächste Schritte
- [ ] Design (Design-Canvas) für den One-Pager erstellen
- [ ] Angular-Grundgerüst mit Tailwind `@theme` aufsetzen
- [ ] Swiper als Custom Element ins Projekt einbinden
- [ ] Galerie-Grid + Lightbox-Komponente (mit Swiper) bauen
- [ ] Angebote-Section mit Platzhaltertexten
- [ ] Kontakt-Section + Kontaktformular
- [ ] Header/Footer