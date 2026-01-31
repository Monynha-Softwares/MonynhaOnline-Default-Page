# Why global mutable state is forbidden

Global mutable state hides data flow and makes refactoring risky. Flyweights exist to share **immutable** intrinsic state, not to store application logic or runtime data.

## Risks of mutable globals

* **Implicit coupling** between unrelated features
* **State leaks** across tests and user sessions
* **Non-deterministic bugs** caused by mutation order
* **Hard-to-reason code** for humans and AI agents

## Preferred approach

* Keep intrinsic data in flyweights and freeze it.
* Keep extrinsic, runtime data in hooks or component props.
* Pass data explicitly between components.

This preserves testability and keeps the architecture explicit and scalable.
