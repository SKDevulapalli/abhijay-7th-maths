# 7th Grade Math

A minimal, local math practice app using React, TypeScript, and Vite. No backend, login, external API, or network connection is needed during practice.

## Run

```sh
npm install
npm run dev
```

Open the address Vite reports. Run `npm run build` for a production build, `npm run preview` to serve it, and `npm test` for generator and scoring tests (Node 22.6+).

Chapter 1 covers equations; Chapter 3 covers inequalities with number lines. Medium and Hard inequalities include negative coefficients and explain sign reversal. Chapter 2 is a placeholder. Questions have integer solutions and are unique within a session.

Each first valid answer is final. Active sessions and progress are saved together in LocalStorage, including the submitted answer, so a refresh preserves the question lock. Progress is specific to this browser and origin; clearing browser storage removes it. Invalid numeric input is not scored. Leaving practice preserves it until a new session replaces it. Best score is based on completed sessions.
