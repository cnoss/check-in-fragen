# Check-in

Check-in-Fragen zum Durchwischen auf dem Smartphone – für Lehrveranstaltungen, Workshops und Meetings.
Funktioniert als Progressive Web App: auf den Homescreen legen, läuft dann auch offline.

Die Seite ist eine schlichte Jekyll-Seite und wird direkt von GitHub Pages gebaut – kein Build-Schritt, keine Abhängigkeiten.

## Fragen hinzufügen

**Direkt (auch im GitHub-Webeditor):** Einen Listenpunkt in der passenden Datei in `_stacks/` ergänzen.
Jeder Listenpunkt ist eine Karte. Im Frontmatter stehen Titel, Beschreibung,
die Maximalzahl an Fragen (`max`), Tags und die Position in der Übersicht (`reihenfolge`).

**Gesammelt:** Fragen als beliebige Datei in `inbox/` legen und später einsortieren lassen.

Tags (festes Set, in `_config.yml`): `leicht`, `persönlich`, `kennenlernen`, `laufende-gruppe`.

## Einrichten

Einmalig im Repo unter *Settings → Pages*: Source „Deploy from a branch“, Branch `main`, Ordner `/ (root)`.
Danach baut GitHub Pages die Seite bei jedem Push neu.
