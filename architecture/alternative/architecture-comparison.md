# Architecture Comparison: Layered and Hexagonal Options

## Purpose

This document compares the current layered architecture in `specs/001-shared-expense-tracking/plan.md` with the alternative Hexagonal Architecture in this directory. It presents tradeoffs for review and does not select a final winner.

## Structural differences

| Concern | Existing layered option | Alternative hexagonal option |
|---|---|---|
| Primary organization | Technical packages: `model`, `service`, `persistence`, `validation`, and `ui`. | Domain and use cases at the center; Swing, local files, and notification mechanisms attach as adapters through ports. |
| Dependency expression | The plan separates responsibilities by package; dependency direction is less explicitly stated. | Adapters depend on inward-facing interfaces; the core does not depend on Swing or file details. |
| UI interaction | UI calls service-layer operations. | Swing controllers call input ports and translate requests/results. |
| Persistence | Repository abstraction and file repository sit in a persistence package. | Repositories are output ports defined for core needs; local-file adapters implement them. |
| Testing | Services/domain can be tested separately if they avoid direct UI and storage dependencies. | Use cases and domain policies can be tested with fake output-port adapters by design. |
| Extending interfaces | A new UI or storage option may require careful edits across layer boundaries. | Another driving adapter can use the same input ports; another storage adapter can implement existing output ports. |

## Benefits and limitations

### Existing layered architecture

The layered plan is compact and familiar. Package names make broad responsibilities easy to understand, and it can be implemented with fewer interfaces and wiring steps. For a small Swing MVP, that simplicity may help the team move quickly.

Its main limitation is that package separation alone does not enforce dependency direction. A service can become coupled to a specific file repository, and GUI code can accumulate business rules unless the team maintains those boundaries. Replacing an external mechanism may then affect code outside its intended layer.

### Hexagonal alternative

Hexagonal Architecture makes external interactions explicit as ports and adapters. It gives business use cases a clear boundary for independent JUnit 5 testing and supports substituting UI, persistence, and notification implementations. This is useful when the same rules may later be driven by another interface or when persistence behavior changes.

Its costs include more interfaces, request/response types, dependency injection, and architectural vocabulary. For a small application with one UI and one local store, some of this structure may add overhead without immediate user-visible benefit. Ports also do not automatically make file writes safe or settle unresolved product rules.

## Shared requirements and behavior

Both options can satisfy Java 21, Maven, Swing, JUnit 5, `BigDecimal`, local file persistence, and separation of business logic from the UI. Both must preserve the detailed rules: positive expense amounts; equal or percentage splits; exact 100% percentage totals; rounding remainders assigned in participant order; expenses affect balances only after approval; and payments update relevant balances immediately.

The domain rule source documents conflict on payer identity. `spec.md` and `data-model.md` require the submitter to be the payer and a participant. `research.md` says the payer may be another group member and need not be a participant. The alternative design documents this conflict and follows the detailed spec/data model for its illustrated flow pending human resolution. Reviewer authorization and rejection details also remain open. Architectural style does not resolve those requirement questions.

## Tradeoffs to consider

- **MVP speed:** Layered organization has less setup; Hexagonal has stronger explicit boundaries.
- **Test isolation:** Both can be tested well, but Hexagonal makes substitution of external dependencies a first-class design feature.
- **Changeability:** Hexagonal can isolate UI/storage changes better when adapters remain replaceable; that flexibility has an upfront maintenance cost.
- **Team familiarity:** Layered architecture is broadly familiar; Hexagonal requires consistent understanding of ports, adapters, and dependency direction.
- **Project scale:** The smaller the feature set and expected change, the less value extra abstractions may provide. More interfaces and external mechanisms can make Hexagonal boundaries more useful.

The team should compare these factors against assignment goals, expected future interfaces, and the amount of change anticipated. This comparison does not declare either architecture the final winner.
