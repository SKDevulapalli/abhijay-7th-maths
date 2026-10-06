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

## Open in a browser with GitHub Pages

The repository includes an automatic deployment workflow. In GitHub, open **Settings → Pages**, then select **GitHub Actions** under **Build and deployment → Source**. If GitHub requires a public repository or an eligible paid plan for Pages, resolve that requirement in GitHub before deploying; the workflow does not change repository visibility.

Open **Actions → Deploy math app to GitHub Pages → Run workflow** and select `main` to trigger the first deployment. Future pushes to `main` deploy automatically after tests and the build succeed.

After a successful deployment, open:

https://skdevulapalli.github.io/abhijay-7th-maths/

No downloads or local server are needed for the hosted version. LocalStorage progress is tied to the website origin, so progress from a local server is separate from the hosted site's progress. New deployments preserve hosted progress in the same browser.
