# Little Garden — UX case study

Static site (HTML, CSS, JS). No build step.

## Put it live on GitHub Pages (github.io)

1. Create a repository on GitHub. For a clean address name it `<your-username>.github.io`
   (the site will be at `https://<your-username>.github.io/`). Any other name also works
   (the site will be at `https://<your-username>.github.io/<repo-name>/`).
2. Upload everything in this folder to the repository root (`index.html`, `css/`, `js/`, `assets/`, `.nojekyll`).
   Drag and drop on github.com works, or use git:
   ```
   git init && git add . && git commit -m "Little Garden case study"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main`, folder = `/ (root)`. Save. After 1–2 minutes the site is live.

## Where to edit
- Copy and layout: `index.html`
- Styles and design tokens: `css/style.css` (`:root` variables at the top)
- Interactive flow and wireframes: `js/main.js`
- Images: `assets/orig` (prototype screens), `assets/src` (plant photos), `assets/research` (sketches)
