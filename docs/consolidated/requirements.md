# SplitSmart Consolidated Requirements

## 1. Purpose, authority, and scope

SplitSmart helps people share expenses in groups, review expense submissions, track pairwise balances, record repayments, and view summaries. `UserRequirement.md` remains the authoritative customer request and is preserved unchanged. This document organizes its requirements with the detailed feature rules in `specs/001-shared-expense-tracking/spec.md`.

The customer product vision is primarily web-based and includes Android and iOS applications. For this course MVP, the implementation constraint is a Java 21 desktop application using Swing, Maven, JUnit 5, `BigDecimal`, and local file persistence. The desktop MVP is a scoped course deliverable, not a replacement for the full product vision. The selected design is Hexagonal Architecture; this is an implementation decision, not a customer requirement.

## 2. Actors and roles

- **Account holder:** Creates an account, signs in, and accesses authorized personal/group records.
- **Group member:** Participates in a group, expenses, and payment activity.
- **Group manager:** Creates/manages a group and controls adding/removing members under the clarified rule.
- **Expense submitter/payer:** A group member who submits an expense they paid and includes themselves as a participant.
- **Expense reviewer:** A person authorized by a group's configured review process. Authorization and self-approval rules remain unresolved.
- **Payment recorder/payer:** The user who made a payment and records its amount, recipient, and date.

## 3. User stories

1. As a group member, I want to record an expense and choose participants and split method so each person's share is clear.
2. As a reviewer or group member, I want expenses reviewed before they affect balances and want to see pairwise amounts owed.
3. As a user who made a payment, I want to record it against a balance so the amount still owed is accurate.
4. As an account holder, I want to create/manage groups and access my own expense and balance information.
5. As a group member, I want notifications about other members' new expenses and summaries of expenses, balances, and payments.

## 4. Functional requirements

The IDs below retain the detailed specification's stable identifiers.

| ID | Requirement |
|---|---|
| FR-001 | The system shall provide individual accounts, email/password sign-in, and recovery through the account's verified email address. |
| FR-002 | After sign-in, a user shall be able to access their own expense and balance information, subject to authorization. |
| FR-003 | A user shall be able to create/manage groups. Only a group manager may add or remove members; members may leave. Leaving/removal shall not delete historical expenses or balances from group history. |
| FR-004 | A group member shall be able to enter a positive expense amount, date, and description only for an expense they paid. `submitterUserId` must equal `payerUserId`; the payer must be a participant. Zero or negative amounts and payer/submitter mismatch are rejected. |
| FR-005 | An expense shall support equal splitting. Currency-unit remainders after rounding shall be distributed in participant-selection order. |
| FR-006 | An expense shall support percentage splitting. Participant percentages must total exactly 100%; other totals are rejected, not normalized. Currency-unit remainders after rounding shall be distributed in participant-selection order. |
| FR-007 | The submitter shall specify expense participants and include themselves as payer. |
| FR-008 | An expense may have an optional receipt image; absence of an image shall not prevent submission. |
| FR-009 | On creation of a group member's expense, the system shall provide a notification to the other group members through the configured mechanism. Delivery details remain unresolved. |
| FR-010 | Submitted expenses shall enter a review workflow before being included in balances. |
| FR-011 | The system shall record approval decisions and support the group's configured single- or multiple-review process. An expense affects balances only after all approvals required by that process are recorded. |
| FR-012 | The system shall track pairwise amounts owed based on approved expenses and recorded payments. |
| FR-013 | A user who made a payment shall be able to record its amount, recipient, and date against an outstanding balance. |
| FR-014 | Recording a payment shall immediately be reflected in the relevant balance. |
| FR-015 | The system shall provide summaries of a user's accessible expenses, balances, and payments. |
| FR-016 | A user shall be able to request a report for a specified date range and apply other supported report parameters. The full parameter set remains unresolved. |

## 5. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-001 | The full customer product shall support a primarily web-based experience and applications that run on Android and iOS. The Swing MVP is distinct from this platform vision. |
| NFR-002 | A user shall only access personal or group information for which they are authorized. |
| NFR-003 | In usability testing with first-time users given basic instructions, at least 90% shall create a group expense and locate the resulting balance within five minutes. This is a proposed initial quality target in the detailed spec. |
| NFR-004 | For a group with up to 1,000 recorded expenses, at least 95% of ordinary expense, balance, payment, and report-view requests shall produce visible results within three seconds under normal operating conditions. This is a proposed initial quality target in the detailed spec. |
| NFR-005 | Each expense and payment shall retain enough information for an authorized user to identify its recorded details and current review/payment state. |

### Course implementation constraints

These are implementation constraints rather than additions to customer requirements: Java 21, Maven, Java Swing, JUnit 5, `BigDecimal` for monetary calculations, local file-based persistence, and separation of business logic from UI. Hexagonal Architecture is the selected design for this consolidated set. Human review of generated artifacts is required by the project constitution.

## 6. Acceptance criteria

The AC identifiers match the detailed feature specification, including its non-sequential `AC-017`.

- **AC-001 (FR-001):** Valid email/password credentials create or access an individual account; invalid credentials do not grant access; recovery is requested through the verified email address.
- **AC-002 (FR-002, NFR-002):** A signed-in user can access their expense and balance information, and unauthorized records are not exposed.
- **AC-003 (FR-003):** A group manager can add/remove members, a member can leave, and leaving/removal preserves historical expenses and balances.
- **AC-004 (FR-004, FR-007):** A group member can submit a positive dated/described expense they paid and include themselves as a participant; a different payer or missing submitter participant is rejected.
- **AC-005 (FR-005, FR-007):** Equal shares are rounded to the currency's smallest unit and remainder units follow participant selection order.
- **AC-006 (FR-006, FR-007):** Percentage shares totaling exactly 100% are recorded, rounded, and remainder units distributed in participant selection order; other totals are rejected.
- **AC-017 (FR-004):** A zero or negative expense amount is rejected and not submitted.
- **AC-007 (FR-008):** An attached receipt image is associated with the expense; an expense can be submitted without one.
- **AC-008 (FR-009):** Each other group member is notified of a new expense through the configured mechanism.
- **AC-009 (FR-010, FR-011):** An expense is excluded from balances until all approvals required by its configured workflow are recorded.
- **AC-010 (FR-012):** Pairwise balances reflect approved expense shares less recorded payments using the confirmed split/rounding rules.
- **AC-011 (FR-013, FR-014):** A payment's amount, recipient, and date are retained and the relevant balance is immediately reduced by its recorded amount.
- **AC-012 (FR-015, FR-016):** A report summarizes accessible expense, balance, and payment records and applies the requested date range and supported parameters.
- **AC-013 (NFR-003):** At least 90% of instructed first-time users complete group creation, expense entry, and balance lookup within five minutes.
- **AC-014 (NFR-004):** At least 95% of ordinary requests for groups with up to 1,000 expenses show results within three seconds under normal conditions.
- **AC-015 (NFR-005):** Authorized users can identify recorded expense/payment details and current review/payment state.
- **AC-016 (NFR-001):** The full product's required capabilities are available through its web experience and Android/iOS applications.

## 7. Business rules

1. `submitterUserId == payerUserId`, and that user must appear among the expense participants. This is the controlling rule for the consolidated set, per the user's explicit direction; the checked-in data-model and research files contain contradictory wording, recorded in the decision log.
2. Expense amount must be positive. Payment amount must be positive as stated in the data model.
3. Split method is `EQUAL` or `PERCENTAGE`. Percentage shares total exactly 100%; do not silently normalize.
4. Monetary values use `BigDecimal`. Round to the currency's smallest unit and distribute remainder units in participant-selection order. Supported currencies/precision remain to be specified.
5. Only expenses for which the configured workflow is complete and approved affect balances. Rejected expenses do not affect balances.
6. Recorded payments change the relevant balance immediately and do not alter expense history.
7. Balances are derivable from approved expense shares and payment records. Group departure/removal does not erase historical records.

## 8. Approval and payment requirements

Review decisions must be recorded. The configured workflow may require one or multiple approvals, and balance eligibility waits for all required approvals. The source specifies `APPROVE`, `REJECT`, and `REQUEST_CHANGES` as decision values, but leaves reviewer eligibility, self-approval, the exact meaning/result of request-changes, and post-rejection handling open. These policies must be clarified before implementing the final workflow.

Payments retain amount, recipient, and date and affect a balance immediately on recording. Duplicate detection, overpayment/over-balance behavior, misdirected payments, payer identity verification, and whether settlement suggestions are needed must be clarified before implementation. The design must preserve payment records so balances can be reconstructed.

## 9. Notifications, reporting, assumptions, and unresolved questions

Notifications are required for other group members when a member creates an expense, but delivery channel, preference controls, failure behavior, and MVP delivery method are unresolved. Reports include expenses, balances, and payments; custom filters/parameters and export formats are unresolved.

Confirmed assumptions from the detailed specification: a member can leave; managers control membership additions/removals; historical records remain; submitted expenses are pending until the configured workflow approves them; and a recorded payment is reflected immediately. The course MVP is a Swing desktop subset; the complete web/mobile product remains a customer requirement.

Clarify before implementation: reviewer authorization, creator self-approval, required number/order of approvals, rejection and request-changes transitions, duplicate/overpayment/misdirected-payment policies, supported currencies and maximum amount, notification delivery/preferences, custom report parameters/exports, receipt formats/limits/access, and which customer features the course MVP must include. These are not silently resolved here.
