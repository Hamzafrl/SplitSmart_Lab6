# SplitSmart Consolidated Architecture

## 1. Overview and rationale

The selected architecture is **Hexagonal Architecture (Ports and Adapters)** for a Java 21, Maven, Swing desktop MVP. A small application/domain core owns use cases and business rules. It declares input ports for user goals and output ports for capabilities it needs. Swing and local-file implementations are adapters outside the core. Dependencies point inward toward the application/domain core.

This keeps expense splitting, approval, and balance rules testable with JUnit 5 without launching Swing or touching disk. It also makes the external boundaries visible while keeping the design small: use ordinary Java interfaces and constructor injection; do not introduce a framework or elaborate message infrastructure without a requirement.

## 2. Architecture principles

- Domain policy is independent of Swing, persistence formats, and filesystem paths.
- Application use cases coordinate domain behavior and port calls; they do not own Swing widgets or serialization.
- Input ports describe application operations; output ports describe external capabilities required by the core.
- Swing controllers are input adapters. Swing screens format/display data and collect input only.
- Local file repositories implement output ports. File formats and atomic-write details stay in adapters.
- Notifications are an output adapter behind a port; delivery mechanism is unresolved.
- `BigDecimal` is used for money; local file persistence is used for the course MVP.
- Balances are computed from approved expense source records and payments, not trusted as unrecoverable stored totals.

## 3. Core domain responsibilities

The domain contains `User`, `Group`, `GroupMember`, `Expense`, `ExpenseParticipant`, `ApprovalEvent`, `Payment`, and `BalanceSummary`. Domain policies validate positive amounts, payer identity/participation, split totals, rounding, expense lifecycle, and balance derivation. The submitter is payer and participant. Only fully approved expenses affect balances. Payments reduce relevant pairwise amounts when recorded. Group history remains after departure/removal.

The domain has no Swing classes, file paths, JSON classes, or desktop notification dependencies. Authentication/recovery, permissions, approval workflow configuration, and payment exception policy may have supporting interfaces or policies after unresolved behavior is clarified.

## 4. Application use cases and ports

### Input ports

- `CreateAccountUseCase`, `SignInUseCase`, `RecoverAccountUseCase`, `ViewPersonalRecordsUseCase`
- `CreateGroupUseCase`, `ManageMembershipUseCase`
- `SubmitExpenseUseCase`, `ReviewExpenseUseCase`
- `ViewBalancesUseCase`, `RecordPaymentUseCase`, `GenerateReportUseCase`

Input requests/results are plain application data objects, independent of Swing. A use case validates request shape, loads needed domain state through output ports, invokes domain rules, persists changes, and returns a result or domain/application error.

### Output ports

- `UserRepository`, `GroupRepository`, `ExpenseRepository`, `PaymentRepository`
- `NotificationPort` for expense-created notification requests
- `ReceiptStoragePort` for optional receipt-image storage/reference resolution
- `PasswordRecoveryPort` for verified-email account recovery
- `ClockPort` (or injected `java.time.Clock`) for consistent timestamps

Repositories return domain records or aggregates and do not expose file formats. An `ExpenseRepository` may save an expense with participants and approval events at one consistency boundary.

## 5. Adapters and responsibilities

| Adapter | Responsibility |
|---|---|
| Swing controllers | Translate Swing actions into input-port calls; translate results/errors into view models and UI feedback. |
| Swing screens | Collect/display user input and state; no split, approval, balance, or persistence rules. |
| Local-file repositories | Implement repository ports; serialize and validate stored representation; preserve source records and recoverable consistency. |
| Receipt file adapter | Store/resolve receipt references under local storage; exact format/size/access rules await clarification. |
| Notification adapter | Deliver or record notification requests through the configured mechanism; audience is other group members, channel is unresolved. |
| Composition root | Construct adapters and use-case implementations and inject their interfaces at startup. |
| Test adapters | In-memory repositories, fake notification and clock adapters for deterministic JUnit 5 tests. |

## 6. Data flow

### Expense creation

Swing gathers details and calls `SubmitExpenseUseCase`. The use case loads group membership, validates submitter/payer equality and participant inclusion, positive amount, participant eligibility, split data and optional receipt reference. Domain split policy computes shares using `BigDecimal`; percentage input must total exactly 100% and remainder units follow participant order. The use case saves a `PENDING_REVIEW` expense and requests a notification. A pending expense has no balance effect.

### Approval

The review controller calls `ReviewExpenseUseCase` with an expense, reviewer, decision, and optional comment. The use case requires a pending expense, records an `ApprovalEvent`, and applies the configured approval policy. When all required approvals are present, status becomes approved and the expense becomes eligible for balance calculation. Rejection excludes it. Request-changes is represented as a decision, but resulting status/resubmission behavior is unresolved; see the diagram and decisions document.

### Payment

The payment controller calls `RecordPaymentUseCase`. The use case validates required amount, recipient, date, and positive amount, persists the payment, then recalculates the relevant balance from source records before returning. Duplicate and over-balance outcomes remain policy questions; no final behavior is assumed.

### Reporting

`GenerateReportUseCase` reads authorized source records through repository ports, applies confirmed date range/scope filters, derives balances as needed, and returns a presentation-neutral report result. Swing renders the result. Additional report parameters are supported only after clarification.

## 7. Persistence

Use local files behind repository ports. Persist users (with password hashes, never plaintext), groups and membership history, expenses and ordered participants, approval events, payments, and receipt references. Balance summaries may be recomputed from approved expenses and payments; any persisted balance is only a rebuildable cache. File format, schema versioning, atomic replacement, recovery/backup, concurrent access, and local data protection are adapter design details to settle before implementation. Historical expenses/payments and group references must remain reconstructible after a member leaves or is removed.

## 8. Testing strategy

Use Maven and JUnit 5. Unit-test domain rules (amount validation, payer/participant invariant, equal/percentage split, exact percentage total, remainder order, lifecycle, and balance calculation) without Swing. Use-case tests inject in-memory repositories, a fixed clock, and notification fakes to verify port calls, persistence outcomes, and errors. Adapter tests cover serialization round trips and failure/atomicity behavior. Swing tests should remain focused on event-to-port wiring and presentation; core correctness must not require GUI interaction.

## 9. Advantages and tradeoffs

Hexagonal boundaries isolate the core rules, support JUnit testing without infrastructure, and make UI/storage replacement possible. The tradeoff is additional interfaces, request/response types, and constructor wiring. For a student MVP, define ports only for actual boundaries and use straightforward Java; the architecture does not itself settle requirements ambiguity, provide multi-platform clients, or make local file persistence automatically reliable.

## 10. Architecture component diagram

See [`diagrams/architecture-component.puml`](diagrams/architecture-component.puml). Swing controllers depend on input ports; application services implement those ports and depend on output-port abstractions; external adapters implement output ports. The component and port names are shared with `design.md` and `class-diagram.puml`.
