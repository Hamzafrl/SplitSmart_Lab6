# Research: Shared Expense Tracking

## Decision

The MVP will implement a Java 21 / Maven / Swing desktop application that models the core expense-sharing workflow: user accounts, group membership, expense entry, split policies, approval review, balance settlement, and summaries. Monetary values will be stored and computed using `BigDecimal` to avoid floating-point drift, with currency-aware rounding to the smallest unit and leftover-cent distribution applied in participant-selection order.

## Rationale

The customer request and the project constitution both require a Java Swing MVP with testable business rules and explicit money handling. The clarified requirements already resolve the largest behavioral ambiguities:

- The payer may be a group member or another group member; the submitter need not be the payer.
- Only a group manager may add or remove members; members may leave without deleting historical records.
- Expense amounts must be greater than zero; percentage shares must total exactly 100%; rounding follows the currency minimum unit with leftover units distributed in participant order.
- Users authenticate via email and password with recovery through the verified email.
- A payment is recorded by the payer with amount, recipient, and payment date, and it immediately reduces the recorded balance.

These decisions keep the design aligned with the original request while preventing silent assumptions in the remainder of the implementation.

## Alternatives considered

1. Single-source-of-truth GUI-only design
   - Rejected because the constitution requires separation of GUI and business logic, testability, and clear boundaries.

2. Float-based money calculations
   - Rejected because `BigDecimal` is mandatory for monetary correctness and avoids rounding drift.

3. Unlimited approval complexity (multiple approval levels, dynamic reviewer roles)
   - Rejected for the course MVP because the clarified requirement allows a review workflow without requiring a complex enterprise policy; a simple review/approval state is sufficient.

4. Directly exposing all reports as ad hoc SQL or UI queries
   - Rejected because the domain requires explicit summary entities and testable aggregation logic.

5. Requiring the payer to also be a participant
   - Rejected because the clarifications explicitly allow the payer to be another group member who is not a participant.

## Open issues resolved in planning

- Group management: manager-only membership changes; historical expenses and balances remain.
- Approval workflow: reviewed expense enters pending state before it affects balances; approved expenses then participate in calculations.
- Reporting: the MVP supports summary reports by expense, balance, and payment records, with filters for date range and basic scope parameters.
- Data persistence: the Swing MVP may use a local persistence layer or in-memory repository during the course implementation, with business logic independent from the chosen storage mechanism.
