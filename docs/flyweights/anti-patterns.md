# Flyweight anti-patterns

Avoid the following pitfalls when working with flyweights:

* **Embedding business logic** inside a flyweight module. Flyweights are infrastructure-level helpers, not domain services.
* **Returning mutable objects** from a factory. All shared instances must be frozen to prevent accidental mutation.
* **Bypassing factories** by importing constants directly. Always use the factory API (`getIcon`, `getStyle`, etc.).
* **Over-centralizing UI state**. Interactive state (selection, hover, user input) is extrinsic and must remain in components/hooks.
* **Caching extrinsic data** (like per-video metadata) in flyweights. This makes logic hard to test and scale.
