# Monynha Online

Static landing site for the Monynha infrastructure hub. Built with [Vite](https://vitejs.dev/), React, Tailwind CSS, and a futuristic cyber/neon design system.

## Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` with hot reload enabled.

## Linting & Formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

## Testing

```bash
npm run test
npm run test:watch
```

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

## Contributing

Husky and lint-staged are configured to run ESLint and Prettier before commits. Run `npm run prepare` if you need to reinstall the git hooks.

## License

MIT
