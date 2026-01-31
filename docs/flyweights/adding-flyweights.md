# Adding a new flyweight

Follow this checklist when introducing another flyweight to the application layer.

1. **Create a dedicated module** in `src/flyweights/`.
2. **Define immutable intrinsic data** in a local map or record.
3. **Use a cache** (`Map`) to ensure the same key returns the same instance.
4. **Freeze shared objects** with `Object.freeze` before caching.
5. **Expose a factory API** (`getX`, `getSupportedX`) with clear names.
6. **Keep business logic out** of the flyweight. It should only store shared data.
7. **Write unit tests** that cover:
   - Same key returns same instance
   - Different keys return different instances
   - Returned objects are immutable
8. **Update documentation** if the flyweight introduces new intrinsic state.

If the flyweight touches UI components, add a component test that verifies the component consumes the flyweight instead of duplicating the data locally.
