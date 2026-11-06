# SplitSmart Alternative Architecture: Hexagonal Architecture

## 1. Purpose and scope

This document defines an alternative design for the SplitSmart Java 21 desktop MVP. It uses Hexagonal Architecture (Ports and Adapters) to keep expense and balance rules independent of Swing and local-file details. It is a design option for comparison; it does not replace the existing layered design in `specs/001-shared-expense-tracking/plan.md`.

The proposed application uses Java 21, Maven, Swing, JUnit 5, `BigDecimal` for money, and local file-based persistence. The Java Swing application remains a course MVP subset; it does not fulfill the original web and mobile platform vision.

## 2. Architectural style and rationale

The application is organized around a domain core. The core defines domain objects and use cases, and declares ports for external capabilities it needs. Adapters implement those ports for Swing, local files, notifications, and system services. Dependencies point inward: adapters depend on application/domain abstractions, while domain rules do not depend on Swing, file formats, or frameworks.

This style suits the MVP because expense approval and balance rules can be exercised with JUnit 5 without constructing Swing screens or accessing the file system. It also allows file and UI adapters to change independently. The additional interfaces and wiring create more structure and indirection than a small layered application needs, so boundaries should stay focused on real external interactions.

## 3. Main components and responsibilities

| Component | Responsibility |
|---|---|
| Domain model | Own invariants and behavior for `User`, `Group`, `Expense`, participants/shares, approval events, payments, and balance summaries. Monetary values use `BigDecimal`. |
| Domain policies | Calculate equal and percentage shares, enforce positive amounts and exact 100% percentage totals, distribute rounding remainders in participant order, and derive balances from approved expenses and payments. |
| Application use cases | Orchestrate account/group operations, expense submission, approval/rejection, payment recording, and report queries. Load and save state through output ports. |
| Input ports | Define application actions for the UI, such as `SubmitExpense`, `ReviewExpense`, and `RecordPayment`. |
| Output ports | Define required persistence, notification, and supporting services without binding to implementations. |
| Swing adapter | Convert UI events into input-port requests and present returned results/errors. It contains no expense or balance policy. |
| Local-file persistence adapter | Load and save users, groups, expenses, approvals, payments, and derived data through repositories. It owns serialization and file access. |
| Notification adapter | Deliver or record notifications through a configured local mechanism. Exact channel and audience behavior remains subject to the specification's open question. |
| Composition root | Construct adapters, use cases, and the Swing application at startup and inject dependencies. |

## 4. Domain model organization

Domain types are grouped by business concept rather than by technical layer:

- **Accounts and groups:** `User`, `Group`, and `GroupMember`. A manager controls adding/removing members; leaving/removal preserves historical records.
- **Expenses:** `Expense`, `ExpenseParticipant`, and `SplitType`. The expense amount is positive. Per `spec.md` and `data-model.md`, the submitter is the payer and must be a participant. Expense state progresses from draft/submitted pending review to approved or rejected; only approved expenses affect balances.
- **Review:** `ApprovalEvent` records reviewer, decision, optional comment, and time. Reviewer authorization, whether the submitter may approve, the required number of approvals, and post-rejection behavior remain unresolved.
- **Payments and balances:** `Payment` records payer, recipient, amount, and date. Recording a valid payment immediately changes the derived pairwise balance; payment does not rewrite historical expenses.
- **Reports and notifications:** report results are query results over domain records. A notification is an effect triggered by expense creation; recipients and delivery channel remain to be clarified.

Equal and percentage share calculation belongs in domain policy/domain behavior, not in Swing or persistence code. Percentage totals must equal exactly 100%. Shares use currency precision and leftover units are distributed by participant sequence order. Supported currencies and currency precision policy remain open where the specification does not define them.

## 5. Ports and adapters

### Input ports (driving ports)

The application exposes interfaces such as `CreateGroupUseCase`, `SubmitExpenseUseCase`, `ReviewExpenseUseCase`, `RecordPaymentUseCase`, and `GetReportUseCase`. Request/response objects keep Swing widgets out of the application boundary. These interfaces represent user goals, not screen actions.

### Output ports (driven ports)

Use cases depend on abstractions such as `UserRepository`, `GroupRepository`, `ExpenseRepository`, `PaymentRepository`, and `NotificationPort`. A `ClockPort` or injected Java clock can make timestamps deterministic. Repositories should expose operations at a useful aggregate boundary and avoid exposing a file format to the core.

### Adapters

- `SwingExpenseController` and related controllers are driving adapters implementing interaction with input ports.
- `JsonFile...Repository` (or an equivalent documented local format) implements repository output ports and persists to local files.
- `DesktopNotificationAdapter` or a local notification/log adapter implements `NotificationPort`; the selected delivery mechanism must follow clarified product rules.
- Test fakes/in-memory adapters implement the same output ports for isolated use-case tests.

The class diagram gives representative interfaces and adapters. Names are architectural roles, not a claim that source classes already exist.

## 6. Data flow

### Expense submission

1. A user enters expense details in Swing; the controller creates a request and calls `SubmitExpenseUseCase`.
2. The use case loads group membership and related records through output ports, then asks domain behavior/policies to validate the positive amount, payer/submitter/participant relationship, split rules, and shares.
3. The use case creates a pending-review expense and persists it through `ExpenseRepository`.
4. The use case emits the expense-created notification through `NotificationPort` according to configured behavior. Notification audience/channel is unresolved; notification failure handling must be selected as an implementation policy.
5. The controller presents the pending status. No balance is changed at this stage.

### Approval and balance update

1. An authorized reviewer action reaches `ReviewExpenseUseCase` through a Swing controller.
2. The use case verifies the expense is pending, applies the configured reviewer authorization rule, and records an `ApprovalEvent`.
3. On approval, the expense transitions to approved and the balance view/calculation includes it. On rejection, it remains excluded. The requirements do not settle authorization, multi-level review, or rejection/edit behavior; those rules must be clarified before implementation.
4. Balance summaries are derived from approved expense shares and recorded payments. Implementations may cache/rebuild them, but persisted derived balances must be recoverable from source records.

### Payment and reports

A payment request is validated and persisted via the payment port. The resulting balance is immediately recomputed or updated from the payment record. Report queries gather expense, payment, and balance data through output ports and return a presentation-neutral result to Swing.

## 7. Persistence approach

The local persistence adapter stores data in local files; the domain and use-case layers see repositories, not paths or serialization formats. A single versioned data file or several entity files are both possible, provided writes preserve referential consistency and a failed write does not leave partially updated business state. The concrete format, atomic-write strategy, backup/recovery policy, and protection of credentials/receipt files are implementation decisions to document before coding.

Persist source records (users, groups/membership, expenses/participants, approval events, and payments). Treat balances as derived from approved expenses and payments, or persist them only as a rebuildable cache. Store receipt images as local files with a persisted reference; permitted image formats, size limits, and access rules are open. Passwords must be stored as hashes, never plaintext, as required by the data model.

## 8. Advantages and disadvantages

### Advantages

- Business rules can be tested independently of Swing and disk I/O.
- Local storage can change without rewriting use cases or domain logic.
- Clear ports make external effects and failure points visible.
- Domain rules have a natural home and are less likely to be duplicated in UI and persistence code.
- Test adapters can support deterministic tests without production infrastructure.

### Disadvantages

- More interfaces, request/response types, and wiring are needed than in a compact layered MVP.
- Developers must understand dependency direction and avoid turning every class into a port.
- File persistence still requires careful handling of consistency, recovery, concurrent access, and sensitive data.
- Hexagonal boundaries do not resolve requirements ambiguity or guarantee correct business rules by themselves.
- A future web/mobile interface could reuse core use cases, but this desktop architecture alone does not supply those clients or a remote service.

## 9. Comparison with the existing layered architecture

The existing plan groups code by technical role (`model`, `service`, `persistence`, `validation`, `ui`) in one Maven project. That is straightforward for a small MVP and communicates the intended separation. The alternative groups the design around a dependency rule: use cases and domain concepts are central, and UI/persistence are replaceable adapters attached through explicit ports. The layered plan can achieve good separation when dependencies are carefully managed; the hexagonal version makes those boundaries and external dependencies more explicit, at the cost of additional abstractions and setup. Neither structure is inherently superior for every team or project size.

## 10. Specification conflicts and unresolved rules

The detailed `specs/001-shared-expense-tracking/spec.md` and `data-model.md` say the submitter records only expenses they paid and must be a participant. `specs/001-shared-expense-tracking/research.md` contradicts this by saying the payer may be another group member who is not a participant and the submitter need not be the payer. This architecture follows the detailed spec/data model for its flow and records the conflict here for human resolution; it does not alter those source documents. Reviewer authorization, review count, rejection outcome, notification channel/audience, supported currencies, receipt constraints, and several payment edge cases also remain open in the specification.
