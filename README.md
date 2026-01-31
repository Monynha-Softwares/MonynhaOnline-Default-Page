# Monynha Online

Static landing site for the Monynha infrastructure hub. Built with [Vite](https://vitejs.dev/), React and Tailwind CSS.

## Flyweight architecture

To keep immutable data consistent and shared across the UI, the application layer uses the Flyweight pattern. This reduces memory duplication and keeps architectural intent explicit for both humans and automation tooling. Flyweights live in `src/flyweights/` and provide factory-style APIs that cache frozen instances for reuse.

### Why Flyweight

The UI previously duplicated icons, language codes, and repeated Tailwind classes across components. Flyweights centralize these intrinsic values so that UI components only supply extrinsic state (like per-video labels, counters, or layout variants).

### Using flyweights

* Use `getIcon(name)` to render lucide icons instead of importing from `lucide-react`.
* Use `getLanguage(code)` and `getSupportedLanguageCodes()` instead of hardcoding language strings.
* Use `getStyle(key)` for shared Tailwind class groups, then compose with `cn(...)`.
* Use the category and role factories to cache immutable metadata shared across the UI.

See the docs in `docs/flyweights/` for design rationale and extension guidance.

## Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with hot reload enabled.

## Build

```bash
npm run build
```

A production-ready static bundle is generated in the `dist/` directory.

## Preview

```bash
npm run preview
```

Serves the contents of `dist/` locally to verify the static build.

## Deployment

Upload the files in `dist/` to any static hosting provider such as Netlify, Vercel, or GitHub Pages. No server-side rendering is required.

## License

MIT
