# Spelloggen

A log of the games I play: what I play, on which platform, my rank, hours played and notes.
The theme is gaming, but there is no game logic anywhere. It is a list you can read, add to,
change, and put cover images on.

This repo is the **web app**, built with React and Vite.
The **backend** is a separate repo: https://github.com/ThanosMakedas/spelloggen-api

Both have to run at the same time. Everything you need is below.

## Before you start

| Needed | Version | Check with |
|---|---|---|
| .NET SDK | 10.0 | `dotnet --version` |
| Node.js | 20.19 or later, or 22.12 or later | `node --version` |

Nothing else. No database to install, no Docker, no accounts, no API keys.

## 1. Start the backend

```
git clone https://github.com/ThanosMakedas/spelloggen-api.git
cd spelloggen-api
dotnet run
```

The API now runs on **http://localhost:5080**. Leave that terminal open.

On the first run it creates `spelloggen.db` (SQLite) and fills it with six games, so there
is something to look at right away. To check that the API works on its own, open
http://localhost:5080/swagger

## 2. Start the web app

In a **second terminal**, so the API keeps running in the first one:

```
git clone https://github.com/ThanosMakedas/spelloggen-web.git
cd spelloggen-web
npm install
npm run dev
```

The app now runs on **http://localhost:5173**. Open that address in a browser.

If port 5173 is busy, the app stops with an error instead of moving to another port.
That is on purpose: the API only allows 5173 through CORS, so any other port would make
every request fail. Free the port and start again.

## What you can do in the app

- See every game as a cover card, most recently played first
- **+ Lägg till spel** adds a game
- **Redigera** on a card changes that game
- **Ladda upp bild** or **Byt bild** puts a cover image on a game (jpg, png or webp, max 5 MB)

Two of the six seeded games have no rank, and one has no cover image. That is deliberate:
it shows that empty fields and the image placeholder do not break the page.

## Try the error handling

1. Stop the API with Ctrl+C in its terminal
2. Reload the web app

The page shows a red message, "Kunde inte nå API:et", with a **Försök igen** button. It does
not crash and it does not freeze. Start the API again, press the button, and the list is back.

## Two screen sizes

- **Desktop**: a grid of cover cards, as many per row as fit
- **Phone**, 600 px and below: one card per row, a full width button, and the form in one column

Quickest way to see it: F12 in the browser, then Ctrl+Shift+M to switch to phone width.

## Technical choices

**React with Vite, and plain JavaScript.**
Vite starts in about a second and updates the page while you edit, which matters more in a
small project than any build feature. JavaScript rather than TypeScript because there is only
one kind of object here, a game with nine fields, and the API is the only place it comes from.
Types would be more ceremony than help at this size.

**Every API call goes through one file, `src/api.js`.**
No component calls `fetch` by itself. The address of the API, the 10 second timeout, and the
translation of a failed response into a readable Swedish sentence all live in one place. That
is also why the same error handling works the same way in every part of the app.

**The list lives in `App.jsx` and is passed down as props.**
No state library. There is one list and one open form, so passing two props down two levels is
less code, and less to explain, than any store would be.

**Plain CSS, no UI library.**
The look is a dark page with neon accents, which is a handful of colors and shadows. A UI
library would be a large dependency to install and then fight with, for a design it does not
have anyway. The colors are CSS variables at the top of `index.css`, so the whole theme is a
few lines to change.

**One component per file, with its CSS beside it.**
`SpelCard.jsx` and `SpelCard.css` sit next to each other, and class names are prefixed
(`.card-title`, `.card-cover`), so styles do not leak between components. That keeps the
structure readable without any CSS framework or naming tricks.

**The API address is in `.env`.**
`VITE_API_URL=http://localhost:5080`. It is the only thing to change if the API runs somewhere
else, for example when a phone has to reach it over the local network.

**Errors are never silent.**
`api.js` throws an `Error` with a Swedish message whatever goes wrong: the API is not running,
it did not answer within 10 seconds, or it answered 400 with a validation message. Loading and
upload errors show up in the red banner, saving errors show up inside the form so nothing you
typed is lost. The page always says what happened.

### On the backend side

SQLite, because it needs no server installed and the data still survives a restart, which the
mobile app depends on. Controllers rather than minimal API, and the controller talks straight
to the `DbContext`, since there is no logic to put in a service layer. CORS is a named policy
that allows exactly the web app's origin. The full reasoning is in the
[API README](https://github.com/ThanosMakedas/spelloggen-api#technical-choices).

## The API

| Method | Route | What it does |
|---|---|---|
| GET | `/api/spel` | List all games |
| GET | `/api/spel/{id}` | One game |
| POST | `/api/spel` | Create a game |
| PUT | `/api/spel/{id}` | Update a game |
| POST | `/api/spel/{id}/bild` | Upload a cover image |
| DELETE | `/api/spel/{id}` | Delete a game |

## Project structure

```
src/
  api.js                  every call to the API, in one place
  App.jsx                 the list, loading, errors and the open form
  index.css               colors, base styles, buttons
  components/
    Header.jsx            title and the add button
    SpelGrid.jsx          the responsive grid
    SpelCard.jsx          one game: cover, facts and buttons
    StatusBadge.jsx       the status, with its own neon color
    SpelForm.jsx          the form, used for both adding and editing
    ImageUpload.jsx       the upload button and the hidden file input
    ErrorBanner.jsx       the red message with Försök igen
    Loading.jsx           shown while the list is loading
```
