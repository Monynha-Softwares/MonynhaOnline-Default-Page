# Intrinsic vs. extrinsic state

Flyweights store **intrinsic state**: immutable, shared values that are safe to reuse across the UI. Components pass **extrinsic state** at runtime.

## Intrinsic state (shared)

* Icon components (lucide-react icons)
* Language metadata and codes
* Category metadata (id, name, color, icon)
* Collaborator roles
* Base Tailwind class groups

Intrinsic state is cached in `src/flyweights/` and returned by factory functions that always reuse the same instance per key.

## Extrinsic state (contextual)

* Video titles, descriptions, durations, and view counts
* Component variants and layout-specific props
* User-entered data or runtime flags
* Selection, hover, and local UI state

Extrinsic state stays inside components, hooks, or view models. Keep it out of flyweights to preserve testability and avoid hidden coupling.
