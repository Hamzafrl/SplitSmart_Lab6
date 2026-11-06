# SplitSmart Architecture Decisions and Open Items

## 1. Selected architecture

**Decision: Use Hexagonal Architecture (Ports and Adapters) for the consolidated Java Swing MVP design.** The application/domain core owns use cases and business policy. Input ports expose user goals; output ports abstract persistence, notifications, and supporting services. Swing is a driving adapter; local-file repositories are driven adapters. Dependencies point inward.

## 2. Options considered

### Original layered architecture

The preserved Spec Kit plan groups a single Maven application into `model`, `service`, `persistence`, `validation`, and `ui` packages. It is familiar, direct, and economical for a small application. Package separation alone does not make dependency direction explicit, so services can become coupled to storage and UI code can absorb business rules if discipline slips.

### Alternative Hexagonal Architecture

The preserved alternative in `architecture/alternative/` organizes around a domain/application core with ports and replaceable adapters. It makes the separation of Swing, local files, and notifications explicit and supports business tests with fakes. It adds interfaces, request/result types, and wiring overhead.

## 3. Why Hexagonal was selected

The course requires business rules to be independently testable and separated from Swing. The MVP also has distinct external boundaries (desktop UI, local-file persistence, notification/receipt mechanisms). Hexagonal Architecture makes those boundaries explicit without requiring an enterprise framework. The choice has costs in setup and vocabulary; it is an assignment decision, not a claim that layered design is universally inferior.

## 4. Requirements conflict resolution log

| Topic | Conflicting source statements | Consolidated decision |
|---|---|---|
| Payer/submitter identity | Detailed `specs/001-shared-expense-tracking/spec.md` FR-004 and AC-004 require the submitter to have paid and be a participant. The checked-in `data-model.md` says the submitter may differ; `research.md` also says the payer may be another member and need not be a participant. | Follow the user's explicit consolidation instruction: `submitterUserId == payerUserId`; the payer must also be an expense participant. This is the consolidated rule. Record the actual data-model and research contradictions here rather than silently treating those source statements as consistent. Original sources remain unchanged. |
| Historical group data | Earlier general requirements are underspecified; detailed specification says leaving/removal preserves records. | Preserve historical expenses and balances, as detailed in FR-003. |
| Expense/payment balances | Requirements state approval gate and immediate payment update. | Only expenses with all required approvals count; recorded payments immediately affect derived balances. |

## 5. Confirmed constraints and MVP assumptions

- Java 21, Maven, Java Swing, JUnit 5, `BigDecimal`, local file-based persistence.
- Full customer vision remains primarily web with Android/iOS apps; Swing is the course subset.
- Keep core business logic independent from UI and persistence details.
- Preserve expenses/payments and membership history; balances rebuild from approved expense shares and payment records.
- Notification and receipt adapters are architectural boundaries. Their concrete local delivery/storage design is not a customer decision.
- The MVP may limit UI/report breadth only when assignment scope confirms it; do not delete product requirements from the requirements inventory.

## 6. Unresolved business decisions requiring clarification before implementation

1. Which reviewers are authorized? Can the submitter approve their own expense?
2. How many approvals are required, in what order, and how are multiple reviewers selected?
3. What state/action follows `REJECT`? Can the expense be edited/resubmitted, or is it terminal?
4. What does `REQUEST_CHANGES` do to state, shares, audit history, and resubmission?
5. How are duplicate payments detected/handled? Are over-balance payments rejected, accepted as credit, or otherwise represented? How are misdirected payments handled?
6. Which currencies and maximum amounts are supported; what currency scale/rounding mode applies?
7. Which notification delivery channel and preferences are required, and what happens on delivery failure?
8. Which receipt image types/size limits/access rules apply?
9. Which report filters, parameters, and export formats are required?
10. Which product features are in the graded Java Swing MVP versus the full customer product?
11. How should a removed member's membership state be distinguished from voluntary leave, and may former members be selected in new expenses?
12. What canonical pairwise balance sign/direction and payment treatment apply when payments exceed an obligation?

No answers to these questions are invented in the consolidated architecture. The approval and payment activity diagrams show decision branches as unresolved policy points.
