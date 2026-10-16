# Check-in

Check-in-Fragen zum Durchwischen auf dem Smartphone – für Lehrveranstaltungen, Workshops und Meetings.
Funktioniert als Progressive Web App: auf den Homescreen legen, läuft dann auch offline.

## Fragen hinzufügen

**Schnell:** Fragen als beliebige Datei in `inbox/` legen und später einsortieren (lassen).

**Direkt:** Einen Listenpunkt in der passenden Datei in `stacks/` ergänzen.
Jeder Listenpunkt ist eine Karte. Im Frontmatter stehen Titel, Beschreibung,
die Maximalzahl an Fragen (`max`), Tags und die Position in der Übersicht.

Tags (festes Set): `leicht`, `persönlich`, `kennenlernen`, `laufende-gruppe`.

## Lokal

```sh
npm run dev
```

Öffnet unter http://localhost:8000. Braucht nur Node. Die Konsole zeigt auch eine URL fürs Smartphone im selben WLAN.

## Deployment

Push auf `main` → GitHub Action baut `questions.json` und deployt `site/` auf GitHub Pages.
Einmalig im Repo unter *Settings → Pages → Source* „GitHub Actions“ auswählen.
