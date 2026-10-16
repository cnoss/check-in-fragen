# Check-in

Kleine PWA mit Check-in-Fragen. Jekyll-Seite, die GitHub Pages direkt aus dem Repo baut (Deploy from branch, kein Action-Workflow, kein Node). Bewusst schlicht: kein Framework, keine Abhängigkeiten.

## Aufbau

- `_stacks/*.md` – Jekyll-Collection, ein Stack pro Datei (Frontmatter + Markdown-Liste, ein Listenpunkt = eine Karte)
- `inbox/` – hier legt der Nutzer neue Fragen in beliebigem Format ab (von Jekyll ausgeschlossen)
- `index.html` – rendert alle Stacks per Liquid in ein `<template id="data">`; `assets/app.js` liest daraus
- `_config.yml` – enthält das feste Tag-Set (`stack_tags`)
- `sw.js` – Service Worker; Cache-Version kommt automatisch aus `site.time`

## „Inbox einsortieren“

Wenn der Nutzer sagt, die Inbox soll einsortiert werden:

1. Alle Dateien in `inbox/` lesen (außer `README.md`).
2. Jede Frage dem passenden Stack in `_stacks/` zuordnen. Fragen mit mehreren Teilen (z. B. eine Liste von Begriffspaaren) in einzelne Karten aufteilen.
3. Formulierung behutsam vereinheitlichen (Fragezeichen, Rechtschreibung), Sinn und Ton nicht verändern. **Anrede immer „Sie“** (Du-Formulierungen umschreiben).
4. Dubletten und sehr ähnliche Fragen nicht doppelt aufnehmen, sondern melden.
5. **`max` im Frontmatter beachten.** Ist ein Stack voll, Fragen nicht anhängen, sondern in `inbox/` liegen lassen und dem Nutzer sagen, welche übrig sind.
6. Passt eine Frage in keinen Stack: nicht raten, sondern nachfragen oder einen neuen Stack vorschlagen.
7. Nur Tags aus `stack_tags` in `_config.yml` verwenden.
8. Einsortierte Inbox-Dateien löschen, danach mit `jekyll build -d <scratchpad>` prüfen, dass der Build durchläuft.
9. Kurz berichten: was wohin, was übrig, was unklar war.

## Stack-Format

```markdown
---
titel: Begriffspaare
beschreibung: Schnelle Entweder-oder-Fragen zum Warmwerden
max: 50
tags: [leicht, kennenlernen]
reihenfolge: 1
---

- Schokolade oder Chips?
- Tee oder Kaffee?
```
