# Edge autofill hover crash

Reduced page for the Edge tab crash. Hovering a saved form suggestion on the second order ends the tab with `STATUS_ACCESS_VIOLATION`.

Copy this folder’s contents into the root of a newly initialized repository. Do not publish it from the product app or on the product domain.

## Run

```bash
npm install
npm run dev
```

Open the printed local URL in Edge. Suggestions belong to that origin, so a save on another host will not fill this page.

1. On EX-1001, type a plant city and a ship-to, then Save order.
2. The page returns on EX-1002 with those fields empty.
3. Focus Plant city and hover the suggestion from EX-1001. Do not click it.

Start over clears the step cookie.

## Publish

```bash
npm run build
npm start
```

`npm start` serves `dist/` on `http://127.0.0.1:4173` and accepts the save request. Put that process on a host that is not the product domain. The page sends `noindex`.

Plant city and Customer ship-to name and location keep the labels from the crashing form. The page has no product name, logo, or links to another site.
