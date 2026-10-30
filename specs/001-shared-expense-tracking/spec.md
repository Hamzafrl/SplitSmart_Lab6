# Feature Specification: Shared Expense Tracking

**Feature Branch**: Not established  
**Created**: 2026-10-29  
**Status**: Draft  
**Input**: The authoritative customer requirements in `UserRequirement.md`, requesting SplitSmart for sharing expenses among individuals and groups.

## Clarifications

### Session 2026-10-29

- Q: Must an expense’s payer also be one of its participants, and may the submitter record another group member as the payer? → A: The payer may be a participant or another group member; the submitter may record either as payer.
- Q: Who should be allowed to add or remove group members, and what should happen to past expenses when someone leaves? → A: A group manager adds or removes members; members may leave; past expenses and balances remain in group history.
- Q: What rules should SplitSmart use to reject invalid expense amounts and make split shares add up to the expense total? → A: Reject zero or negative amounts; require percentage shares to total exactly 100%; round to the currency’s smallest unit and distribute any leftover units in participant selection order.
- Q: How should a person create an account, sign in, and regain access if they cannot sign in? → A: Use an email address and password, with password recovery through the verified email address.
- Q: What information should a user enter when recording a payment, and when should that payment reduce the recorded balance? → A: The payer records the amount, recipient, and payment date; the balance updates immediately.

## User Scenarios & Testing

### Actors

- **Account holder**: A person who signs in and accesses their own expense and balance information.
- **Group member**: A user who participates in a shared-expense group.
- **Group manager**: The group creator or a designated user who may add or remove group members.
- **Expense submitter**: A group member who enters an expense and identifies its participants.
- **Expense approver**: A person authorized by the group’s review process to review an expense.
- **Payment recorder**: A user who records a payment made toward an outstanding balance.

### User Story 1 - Record a shared expense (Priority: P1)

As a group member, I want to record an expense, choose who shared it, and specify how it is split so that everyone’s share is clear.

**Why this priority**: Entering shared expenses is the core value of SplitSmart and supplies the records needed for balances and reports.

**Independent Test**: Create a group and an expense with its amount, date, description, payer (who may be a different group member from the submitter), participants, and split method; verify the expense is saved for review with those details.

**Acceptance Scenarios**:

1. **Given** a group with members, **When** a member enters an expense with valid details, identifies a group member who paid, and selects equal splitting and participants, **Then** the expense is recorded with those details and awaits the configured review.
2. **Given** a group with members, **When** a member enters an expense with valid details, identifies a group member who paid, and assigns percentage shares to participants, **Then** the expense is recorded with those shares and awaits the configured review.
3. **Given** an expense being entered, **When** the submitter attaches a receipt image, **Then** the image is associated with the expense; **When** no image is attached, **Then** the expense can still be submitted.

### User Story 2 - Review expenses and track balances (Priority: P1)

As an authorized approver or group member, I want expenses reviewed before affecting balances and want to see the amounts owed between members so that balances reflect accepted expenses.

**Why this priority**: Review and accurate balances prevent unapproved expenses from changing what members owe.

**Independent Test**: Submit an expense, verify it does not affect balances while awaiting review, approve it through the configured workflow, and verify the resulting pairwise balances.

**Acceptance Scenarios**:

1. **Given** an expense awaiting review, **When** an authorized approver approves it, **Then** the approval is recorded and the expense is included in relevant balances.
2. **Given** an expense awaiting review, **When** it has not received all approvals required by the configured workflow, **Then** it is not included in balances.
3. **Given** approved expenses, **When** a member views group balances, **Then** the system shows the amount owed between each relevant pair of users.

### User Story 3 - Settle an outstanding balance (Priority: P2)

As a user who has made a payment, I want to record it against the relevant balance so that the amount still owed is accurate.

**Why this priority**: Recording repayment completes the expense-sharing and settlement cycle.

**Independent Test**: Record a payment toward an outstanding balance and verify that the payment appears in the records and the balance reflects it.

**Acceptance Scenarios**:

1. **Given** an outstanding balance between users, **When** a user records a payment toward it, **Then** the payment is recorded and the relevant balance is reduced by the recorded amount.
2. **Given** a payment record, **When** a user views the related payment history, **Then** the payment is included in that user’s accessible records.

### User Story 4 - Organize groups and access personal records (Priority: P2)

As a user, I want an account and groups for the people I share expenses with so that my own expense and balance information is organized and accessible.

**Why this priority**: Accounts and groups establish the context and access needed to use shared-expense features.

**Independent Test**: Sign in, create a group, manage its membership under the confirmed membership rules, and view the signed-in user’s expense and balance information.

**Acceptance Scenarios**:

1. **Given** a person with a valid account, **When** they sign in, **Then** they can access their own expense and balance information.
2. **Given** a signed-in user, **When** they create a group and manage its members, **Then** the group and its membership are available for shared-expense tracking.

### User Story 5 - Receive expense notifications and reports (Priority: P3)

As a group member, I want to be notified about other members’ new expenses and review summaries so that I can stay informed about group spending and settlement.

**Why this priority**: Notifications and reports improve visibility across group activity but depend on expense, balance, and payment records.

**Independent Test**: Create an expense as one member and verify other group members are notified; then request a report and verify it summarizes available expenses, balances, and payments.

**Acceptance Scenarios**:

1. **Given** a member creates a new group expense, **When** the expense is created, **Then** the other group members are notified through the configured notification mechanism.
2. **Given** expense, balance, and payment records, **When** a user requests a summary, **Then** the report includes the available relevant records.
3. **Given** a report request with a date range and other supported parameters, **When** the request is run, **Then** the report applies those filters to the included records.

### Edge Cases

- An expense without an optional receipt image remains submittable.
- An expense awaiting review, or awaiting any required approval, does not affect balances.
- Only a group manager may add or remove a member; a member may leave, and leaving does not delete past expenses or balances from group history.
- The expense creator chooses the participants; the payer must be a group member but need not be a participant, and the submitter may enter an expense paid by another group member.
- Expense amounts of zero or less are rejected.
- Percentage shares must total exactly 100%; other totals are rejected rather than silently normalized.
- Equal or percentage shares are rounded to the currency’s smallest unit; any leftover units are distributed in participant selection order.
- Handling a payment larger than the outstanding amount, a duplicate payment, or a payment recorded against the wrong users remains unresolved.
- A user who is not authorized to access a group’s records must not see its expenses, receipts, balances, or payments.
- Empty report results and date ranges with no matching records must be shown as empty results rather than as missing or failed reports.

## Requirements

### Functional Requirements

- **FR-001 — Accounts and sign-in**: The system MUST let each person create an individual account and sign in using an email address and password. It MUST provide account recovery through the account’s verified email address.
- **FR-002 — Personal records**: After sign-in, a user MUST be able to access their own expense and balance information.
- **FR-003 — Group management**: A user MUST be able to create and manage groups of people for shared-expense tracking. Only a group manager may add or remove a member; a member MUST be able to leave; leaving or removal MUST NOT delete past expenses or balances from group history.
- **FR-004 — Expense details**: A group member MUST be able to enter a positive expense amount, date, description, and payer; the payer MUST be a member of the expense’s group but need not be a participant, and the submitter MUST be able to record another group member as payer. The system MUST reject amounts of zero or less.
- **FR-005 — Equal splitting**: A group member MUST be able to choose an equal split for an expense; any leftover currency units after rounding MUST be distributed in participant selection order.
- **FR-006 — Percentage splitting**: A group member MUST be able to choose a percentage-based split and provide each participant’s percentage share. Shares MUST total exactly 100%; other totals MUST be rejected, not silently normalized. Any leftover currency units after rounding MUST be distributed in participant selection order.
- **FR-007 — Expense participants**: The submitter MUST be able to specify which users are involved in an expense.
- **FR-008 — Optional receipt**: The system MUST allow an optional receipt image to be associated with an expense.
- **FR-009 — Expense notifications**: When a group member creates a new expense, the system MUST provide a notification to the other members of that group through the configured notification mechanism.
- **FR-010 — Pre-balance review**: The system MUST place submitted expenses into a review workflow before they are included in balances.
- **FR-011 — Approval workflow**: The system MUST record approval decisions and support the group’s configured review process, whether it requires one review or multiple approval levels. An expense MUST affect balances only after all required approvals are recorded.
- **FR-012 — Pairwise balances**: The system MUST track the amount each user owes to every other relevant user based on approved expenses and recorded payments.
- **FR-013 — Payment recording**: A user who made a payment MUST be able to record its amount, recipient, and date against an outstanding balance.
- **FR-014 — Payment balance update**: When a payer records a payment, the system MUST immediately reflect it in the relevant balance.
- **FR-015 — Expense, balance, and payment summaries**: The system MUST provide users summaries of their accessible expenses, balances, and payments.
- **FR-016 — Custom reports**: The system MUST allow a user to request a report for a specified date range and apply other supported report parameters.

### Non-Functional Requirements

- **NFR-001 — Customer platform vision**: The full product MUST support a primarily web-based experience and applications that can run on Android and iOS. This customer requirement is distinct from the Java Swing MVP subset below.
- **NFR-002 — Private access**: A user MUST only be able to access personal or group information for which they are authorized.
- **NFR-003 — Usable core flow**: In a usability test with first-time users given basic instructions, at least 90% MUST be able to create a group expense and locate the resulting balance within five minutes.
- **NFR-004 — Timely feedback**: For a group with up to 1,000 recorded expenses, at least 95% of ordinary expense, balance, payment, and report-view requests MUST produce visible results within three seconds under normal operating conditions.
- **NFR-005 — Reviewability**: Each expense and payment MUST retain enough information to identify its recorded details and current review or payment state to an authorized user.

### Acceptance Criteria

- **AC-001 (FR-001)**: Given a person creating an account, when they provide a valid email address and password, then the system creates an individual account; given an existing account, valid email and password grant access, invalid credentials do not grant access, and a user who cannot sign in can request recovery through the verified email address.
- **AC-002 (FR-002, NFR-002)**: Given a signed-in user, when they open personal records, then their expense and balance information is available and records outside their authorization are not exposed.
- **AC-003 (FR-003)**: Given a signed-in user, when they create a group, then they can manage membership as its manager; only a manager can add or remove members, a member can leave, and leaving or removal does not delete past expenses or balances from group history.
- **AC-004 (FR-004)**: Given an expense entry, when a member provides its amount, date, description, and a payer who belongs to the group, then those values are retained with the submitted expense, whether or not the payer is a participant and whether or not the payer is the submitter.
- **AC-005 (FR-005, FR-007)**: Given an expense with selected participants, when the submitter chooses equal splitting, then the expense records equal shares rounded to the currency’s smallest unit and distributes any leftover units in participant selection order.
- **AC-006 (FR-006, FR-007)**: Given an expense with selected participants, when the submitter assigns percentage shares totaling exactly 100%, then the expense records each assigned share and percentage, rounds to the currency’s smallest unit, and distributes any leftover units in participant selection order; a total other than 100% is rejected.
- **AC-017 (FR-004)**: Given an expense entry, when the amount is zero or negative, then the system rejects it and does not submit the expense.
- **AC-007 (FR-008)**: Given an expense entry, when the submitter attaches a receipt image, then it is associated with the expense; when no image is attached, the expense can still be submitted.
- **AC-008 (FR-009)**: Given a new expense created by a group member, when the system processes the expense, then each other group member receives a notification through the configured mechanism.
- **AC-009 (FR-010, FR-011)**: Given a submitted expense, when it has not yet received all approvals required by its configured workflow, then it is excluded from balances; after all required approvals are recorded, it is included.
- **AC-010 (FR-012)**: Given approved expenses and their confirmed split and rounding rules, when a user views balances, then the amounts owed between relevant user pairs match those expense shares less recorded payments.
- **AC-011 (FR-013, FR-014)**: Given an outstanding balance, when the payer records the amount, recipient, and date of a payment, then the system retains the payment and immediately reduces the relevant balance by the recorded amount.
- **AC-012 (FR-015, FR-016)**: Given accessible expense, balance, and payment records, when a user requests a report, then the report summarizes those records and applies the requested date range and supported parameters.
- **AC-013 (NFR-003)**: Given first-time users who receive basic instructions, when they attempt the core group-expense and balance flow, then at least 90% complete it within five minutes.
- **AC-014 (NFR-004)**: Given a group with up to 1,000 recorded expenses, when ordinary expense, balance, payment, or report-view requests are measured under normal operating conditions, then at least 95% produce visible results within three seconds.
- **AC-015 (NFR-005)**: Given an authorized user, when they review an expense or payment, then the recorded details and current review or payment state are identifiable.
- **AC-016 (NFR-001)**: Given a user accessing the full product, when they use its primary experience on the web or an application that runs on Android or iOS, then the required SplitSmart expense-sharing capabilities are available on that platform.

### Original Customer Requirements Inventory

| Original customer feature | Coverage |
|---|---|
| Individual user accounts and login | FR-001 |
| Access to own expense and balance information | FR-002 |
| Create and manage groups of people | FR-003 |
| Create expenses with amount, date, description, split manner, and optional receipt image | FR-004–FR-008 |
| Specify other users involved in an expense | FR-007 |
| Notify users about new expenses created by other group members | FR-009 |
| Review and approve expenses before balance adjustments, with one or multiple approval levels | FR-010–FR-011 |
| Track amounts owed by each user to every other user | FR-012 |
| Record payments and reflect them in balances | FR-013–FR-014 |
| Summaries and reports of expenses, balances, and payments, including custom date ranges and parameters | FR-015–FR-016 |
| Primarily web-based product with Android and iOS applications | NFR-001 |

### Java Swing MVP Subset (separate from the customer product vision)

The course MVP is a proposed subset implemented as a Java Swing desktop application. Its candidate scope is account/sign-in flow, group representation and membership, expense entry with equal and percentage splits, optional receipt association, expense review state, balance tracking, payment recording, and basic summaries. Notification delivery, configurable multi-level approval, custom report parameters, and the full web/Android/iOS platform vision are not assumed to be part of the Swing MVP unless the instructor confirms them. This subset does not replace or remove any item from the original customer requirements inventory above.

### Key Entities

- **User account**: A person’s sign-in identity and access to their own records.
- **Group**: A collection of users organized for shared expenses and balances.
- **Expense**: A dated, described amount submitted by a user, with payer, participants, a split method, optional receipt image, and review state.
- **Expense share**: The amount or percentage assigned to one participant in an expense.
- **Approval decision**: A review action and state for an expense, associated with the configured approval process.
- **Balance**: The amount owed between two relevant users based on approved expenses and recorded payments.
- **Payment**: A record of the amount, recipient, and date for a payment made toward a balance.
- **Report**: A summary of expenses, balances, and payments selected by a user and optional filters.
- **Notification**: An alert to a group member about a new expense created by another member.

## Success Criteria

### Measurable Outcomes

- **SC-001**: At least 90% of first-time test users with basic instructions complete group creation, expense entry, and balance lookup within five minutes.
- **SC-002**: In all approved-expense calculation test cases, shares rounded to the currency’s smallest unit add up exactly to the expense total, with leftover units distributed in participant selection order.
- **SC-003**: At least 95% of ordinary expense, balance, payment, and report-view requests for groups with up to 1,000 expenses show visible results within three seconds under normal operating conditions.
- **SC-004**: Every approved expense and recorded payment in the test dataset is reflected in the corresponding balance and report results.
- **SC-005**: In a usability review, at least 4 out of 5 representative users rate the expense-and-balance flow as understandable.

## Assumptions

- The full product vision remains the primarily web-based service plus Android and iOS applications stated in `UserRequirement.md`.
- The Java Swing application is a course MVP subset, not a change to the customer’s requested product platforms.
- Submitted expenses are pending until the configured approval workflow is complete; only approved expenses affect balances.
- Each expense identifies a group-member payer, who may be different from the submitter or the expense participants.
- A recorded payment represents a completed payment by its payer; it is reflected in the relevant balance immediately upon recording.
- Other group members are the notification audience for a new expense; exact channel and delivery preferences remain undecided.
- NFR-003 and NFR-004 are proposed initial quality targets to make the specification measurable, not targets stated by the customer.
- The system will retain enough recorded expense and payment details to explain its balances and reports to authorized users.
- `UserRequirement.md` remains the authoritative customer request and is not modified by this specification.

## Open Questions

1. Which currencies and maximum expense amounts are supported?
2. Who may approve or reject an expense, can its submitter approve it, and what happens after rejection? Is one approval sufficient, or are multiple approval levels required?
3. Which members receive notifications, through what channels, and can users change notification preferences?
4. How should the system handle duplicate, over-balance, or misdirected payments, and should it suggest a simplified settlement plan?
5. Which custom report parameters and export options are required?
6. Which receipt image formats and size limits are allowed, and who may view receipts?
7. Which customer features are expected in the Java Swing MVP, and which remain outside the course scope?
