# Feature Specification: SplitSmart Expense Sharing Platform

**Feature Branch**: `Not established`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "Use the customer request in UserRequirement.md as the source of truth for the SplitSmart application. Create a complete feature specification based on that request. Include the user scenarios, functional requirements, key entities, acceptance scenarios, success criteria, assumptions, constraints, and unresolved questions. Do not invent answers to missing details. Preserve the customer's original intent and terminology. Do not modify UserRequirement.md."

## Clarifications

### Session 2026-11-12

- Q: How should SplitSmart handle an expense split when shares do not divide evenly into the currency’s smallest unit? → A: Round shares to the currency’s smallest unit and distribute any remaining units in a consistent order.
- Q: How should a group determine how many approvals an expense needs before it affects balances? → A: Each group chooses a single approval or multiple approval levels; all required approvals must be completed.
- Q: Which group members should be able to view an expense, its receipt, and related balances? → A: All group members can view group expenses and balances; only users involved in an expense can view its receipt.
- Q: Who should be allowed to approve expenses at each approval level? → A: Each group designates approvers for its configured approval levels.
- Q: What should SplitSmart do when percentage shares entered for an expense do not total 100%? → A: Reject the split unless the percentages total exactly 100%.
- Q: Can expenses in one group use different currencies, or should each group use a single currency? → A: Each group uses one currency; no currency conversion is needed.
- Q: When should a group’s single currency be selected, and when can it be changed? → A: Select the currency at group creation; it cannot change after the first expense is recorded.
- Q: What should SplitSmart do if a recorded payment is larger than the amount owed? → A: Reject payments greater than the outstanding amount.
- Q: What information must a user provide when recording a payment? → A: Record the payer, recipient, amount, and payment date.
- Q: What should happen to an expense that an approver rejects? → A: Keep it in the record, exclude it from balances, and allow the submitter to edit and resubmit it.
- Q: If rounding leaves extra currency units to distribute among participants, what order should SplitSmart use? → A: Distribute remaining units in participant selection order.
- Q: Which currencies must SplitSmart support? → A: The supported currency list is not specified in UserRequirement.md and remains an unresolved product decision.
- Q: Who should be allowed to add or remove members from a group? → A: The group creator or a designated manager can add or remove members.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access a personal account (Priority: P1)

As a person using SplitSmart, I want my own account and to log in so that I can access my expense and balance information.

**Why this priority**: A personal account is the stated way for each person to use SplitSmart and access their own information.

**Independent Test**: Using an account and related expense and balance records, verify that the account holder can log in and access their expense and balance information.

**Covers**: FR-001

**Acceptance Scenarios**:

1. **Given** a person has a SplitSmart user account, **When** they log in, **Then** they can access their expense and balance information.

### User Story 2 - Create and manage a group (Priority: P1)

As a user, I want to create and manage a group of people with one currency so that shared expenses and balances can be tracked for people such as roommates, trip participants, or party participants.

**Why this priority**: Groups provide the stated context for organizing people who share expenses.

**Independent Test**: Create a group, manage its people, and verify that it is available as a context for shared expenses and balances.

**Covers**: FR-002

**Acceptance Scenarios**:

1. **Given** a user creating a group, **When** they select the group's currency, **Then** that currency is used for the group's shared expenses and balances.
2. **Given** a group with no expenses, **When** a user records its first expense, **Then** the group currency is set and cannot be changed afterward.
3. **Given** a group, **When** its creator or a designated manager adds or removes a member, **Then** the group membership is updated.

### User Story 3 - Record a shared expense (Priority: P1)

As a user, I want to create an expense, identify the other users involved, and choose how it is shared so that the expense can be reviewed and used to adjust balances.

**Why this priority**: Creating shared expenses is the core activity from which review, balance tracking, payments, and reporting follow.

**Independent Test**: Create an expense with the requested details and participants, then verify the saved expense details and its review status.

**Covers**: FR-003, FR-004, FR-005

**Acceptance Scenarios**:

1. **Given** users sharing expenses, **When** a user creates an expense with an amount, date, description, involved users, and an equal split, **Then** the expense is recorded with those details and split manner.
2. **Given** users sharing expenses, **When** a user creates an expense with an amount, date, description, involved users, and percentage shares, **Then** the expense is recorded with those details and split manner.
3. **Given** an expense is being created, **When** the user includes a receipt image, **Then** the image is associated with that expense.
4. **Given** an expense is being created, **When** the user does not include a receipt image, **Then** the expense can still be recorded.
5. **Given** an expense split produces fractional currency units, **When** its shares are calculated, **Then** shares are rounded to the currency’s smallest unit and any remaining units are distributed in participant selection order.
6. **Given** a user enters percentage shares that do not total exactly 100%, **When** they attempt to create the expense, **Then** the percentage split is rejected without changing the entered percentages.

### User Story 4 - Review expenses and track balances (Priority: P1)

As a user, I want expenses reviewed and approved before they affect balances, and I want to see amounts owed between users so that balances reflect reviewed expenses.

**Why this priority**: The customer requires review before an expense is added and used to adjust balances, and requires balances between every pair of users. Groups configure approval levels and designate who may approve at each level.

**Independent Test**: Submit an expense for review, verify that it does not yet affect balances, approve it through the applicable review process, and verify the resulting balances.

**Covers**: FR-007, FR-008

**Acceptance Scenarios**:

1. **Given** an expense has been submitted for review, **When** it has not yet been approved, **Then** it has not been added for balance adjustment.
2. **Given** an expense awaiting review in a group with one or more configured approval levels and designated approvers, **When** all required approvals are recorded by designated approvers, **Then** it is added and used to adjust the relevant balances.
3. **Given** reviewed and approved expenses, **When** a user views balances, **Then** the amounts owed between relevant users reflect those expenses.
4. **Given** a group member, **When** they view group expenses and balances, **Then** those group records are visible to them.
5. **Given** a group member who is not involved in an expense, **When** they attempt to view its receipt image, **Then** the receipt image is not visible to them.
6. **Given** a designated approver rejects an expense, **When** the submitter views the expense, **Then** it remains in the group record, does not affect balances, and can be edited and resubmitted by the submitter.

### User Story 5 - Record a payment (Priority: P2)

As a user, I want to record a payment made to settle an amount owed so that balances are accurately reflected.

**Why this priority**: Payment tracking completes the process of keeping the balances current after users settle amounts owed.

**Independent Test**: Record a payment made toward an amount owed and verify the payment record and the resulting balance.

**Covers**: FR-009

**Acceptance Scenarios**:

1. **Given** an amount is owed between users, **When** a user records a payment with the payer, recipient, amount, and payment date, **Then** the payment is recorded and the relevant balance accurately reflects it.
2. **Given** an amount is owed between users, **When** a user attempts to record a payment larger than the outstanding amount, **Then** the payment is rejected and the balance remains unchanged.

### User Story 6 - Receive notifications about new expenses (Priority: P2)

As a group member, I want to be notified when another group member creates a new expense so that I know about group activity.

**Why this priority**: Notifications provide the requested awareness of expenses created by other group members.

**Independent Test**: Create a new expense as one group member and verify that other group members receive a notification.

**Covers**: FR-006

**Acceptance Scenarios**:

1. **Given** a group has multiple members, **When** one member creates a new expense, **Then** other group members are notified.

### User Story 7 - View expense, balance, and payment reports (Priority: P2)

As a user, I want reports and summaries of expenses, balances, and payments so that I can review shared financial activity.

**Why this priority**: Reporting provides users with an overview of the records tracked by SplitSmart.

**Independent Test**: With expense, balance, and payment records available, request a report and verify that it summarizes the requested record categories.

**Covers**: FR-010

**Acceptance Scenarios**:

1. **Given** expense, balance, and payment information is available, **When** a user requests a report or summary, **Then** the result covers the requested information.
2. **Given** a user requests a custom report with a date range or other parameters, **When** the report is generated, **Then** it reflects the requested date range and parameters supported by the product.

### User Story 8 - Use SplitSmart on the requested platforms (Priority: P1)

As a user, I want SplitSmart to be primarily web-based and also available as applications that run on Android and iOS so that I can use it on the requested platforms.

**Why this priority**: These platforms are explicitly part of the customer's product vision.

**Independent Test**: Verify that SplitSmart has a primary web-based experience and is available as an application that runs on Android and as an application that runs on iOS.

**Covers**: FR-011

**Acceptance Scenarios**:

1. **Given** a user wants to use SplitSmart, **When** they access the product, **Then** a primary web-based experience is available.
2. **Given** a user wants to use SplitSmart on a mobile operating system, **When** they use Android or iOS, **Then** an application that runs on that operating system is available.

### Edge Cases

- An expense can be created without the optional receipt image.
- A percentage split whose shares do not total exactly 100% is rejected; percentages are not silently normalized.
- An expense must not be added for balance adjustment before all approvals required by its group's configured process are complete.
- A rejected expense remains in the group record, does not affect balances, and can be edited and resubmitted by its submitter.
- A payment larger than the outstanding amount is rejected and does not change the balance.
- Group members can view group expenses and balances, but a member who is not involved in an expense cannot view its receipt image.
- The customer names equal and percentage-based sharing but does not state share validation.
- The customer requires balances between users but does not specify how multiple debts or payments are combined or displayed.
- The customer requests notifications but does not identify a delivery channel or preferences.
- Custom reports are described as a possible capability; required parameters and date-range boundary behavior are unspecified.
- The customer identifies web, Android, and iOS platforms but does not specify whether every capability must be available on each platform.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each person using SplitSmart MUST have an individual user account that they can use to log in and access their expense and balance information.
- **FR-002**: Users MUST be able to create and manage groups of people for tracking shared expenses and balances. The group creator or a designated manager MUST be able to add or remove group members. A group MUST have one currency selected at creation; all its expenses and balances MUST use that currency without conversion. Once the first expense is recorded, the group currency MUST NOT be changeable.
- **FR-003**: Users MUST be able to create an expense with an amount, date, description, sharing manner, involved users, and an optional receipt image.
- **FR-004**: The sharing manner for an expense MUST include equal splitting and splitting by percentage. Percentage shares MUST total exactly 100%; any other total MUST be rejected without silently changing the entered percentages. Shares MUST be rounded to the currency’s smallest unit, and any remaining units MUST be distributed in participant selection order.
- **FR-005**: An expense MUST identify the other users involved so that the expense can be used to adjust the appropriate balances after approval.
- **FR-006**: When a group member creates a new expense, other group members MUST be notified.
- **FR-007**: Each group MUST be able to configure either a single approval or multiple approval levels for expense review and designate the approvers for those levels. An expense MUST be approved by the designated approvers at every level required by its group before it is added and used to adjust balances. A rejected expense MUST remain in the group record, MUST NOT affect balances, and MUST be editable and resubmittable by its submitter.
- **FR-008**: SplitSmart MUST track the balance owed by each user to every other user, taking into account expenses that have been reviewed and added.
- **FR-009**: Users MUST be able to record a payment with its payer, recipient, amount, and payment date. Balances MUST accurately reflect recorded payments. A payment greater than the outstanding amount MUST be rejected without changing the balance.
- **FR-010**: SplitSmart MUST provide users with reports and summaries of expenses, balances, and payments. Whether custom reports with user-specified date ranges and other parameters are required remains unresolved (see Question 6).
- **FR-011**: SplitSmart MUST provide a primary web-based experience and applications that run on Android and iOS.
- **FR-012**: All members of a group MUST be able to view that group's expenses and balances. Only users involved in an expense MUST be able to view its receipt image.

### Key Entities *(include if feature involves data)*

- **User account**: An individual account that a person uses to log in and access their expense and balance information.
- **Group**: A set of people organized to track shared expenses and balances using one currency selected at creation and locked after its first expense. The creator or a designated manager can add or remove group members.
- **Expense**: A shared expense with an amount, date, description, sharing manner, involved users, optional receipt image, and review state (pending, approved, or rejected). A rejected expense can be edited and resubmitted by its submitter.
- **Expense participants and shares**: The users involved in an expense and the way the expense is shared among them, equally or by percentage.
- **Receipt image**: An optional image associated with an expense.
- **Review and approval**: A decision by an approver designated by the group at a configured approval level; all required approvals determine whether an expense is added and used to adjust balances.
- **Balance**: An amount owed by one user to another, taking account of expenses and recorded payments.
- **Payment**: A record containing the payer, recipient, amount, and payment date for a payment made to settle an amount owed.
- **Report or summary**: A view of expenses, balances, and payments, potentially selected by date range and other parameters.
- **Notification**: An alert to other group members when a member creates a new expense.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In account-access acceptance tests, 100% of test users with accounts can log in and access their expense and balance information.
- **SC-002**: In expense-creation acceptance tests, 100% of recorded expenses retain the entered amount, date, description, sharing manner, and involved users; receipt images are associated when provided and remain optional. For splits with fractional currency units, shares are rounded to the currency’s smallest unit and remaining units are distributed in participant selection order. Percentage splits totaling anything other than 100% are rejected without changing the entered percentages.
- **SC-003**: In review acceptance tests, 100% of expenses awaiting any configured approval are excluded from balance adjustments, and expenses are included only after all required approvals are complete.
- **SC-012**: In expense-rejection tests, rejected expenses remain in the group record, do not affect balances, and can be edited and resubmitted by their submitters.
- **SC-004**: In balance acceptance tests, the tracked amounts owed between users reflect all approved expenses and recorded payments in the test records, with each payment retaining its payer, recipient, amount, and date.
- **SC-011**: In payment acceptance tests, every payment greater than the relevant outstanding amount is rejected and leaves the balance unchanged.
- **SC-005**: In notification acceptance tests, every new expense created by a group member results in notification to the other group members.
- **SC-006**: In reporting acceptance tests, reports and summaries include the requested expense, balance, and payment information.
- **SC-007**: The product is available through a primary web-based experience and through applications that run on both Android and iOS.
- **SC-008**: In access-control acceptance tests, all group members can view their group's expenses and balances, and users not involved in an expense cannot view its receipt image.
- **SC-009**: In currency acceptance tests, all expenses and balances within a group use that group's single currency, with no cross-currency conversion.
- **SC-010**: In group-currency acceptance tests, the currency is selected when the group is created and cannot be changed after its first expense is recorded.

## Assumptions

- No behavior beyond the customer request is assumed as an agreed product requirement.
- The terms “user,” “group,” “expense,” “approval,” “balance,” “payment,” and “report” retain the meaning stated or implied by the customer request; detailed roles, policies, and calculation rules remain open.
- Reports and summaries of expenses, balances, and payments are required. The request describes custom reports and their date ranges and other parameters as possible capabilities, so their exact scope is not assumed here.
- The customer request does not define implementation technology or prescribe feature parity among the web, Android, and iOS experiences.
- Expenses and balances within a group use the currency selected at group creation; it cannot be changed after the first expense is recorded.

## Constraints

- `UserRequirement.md` is the authoritative original customer request and MUST remain unchanged.
- The product vision MUST remain primarily web-based and include applications that run on Android and iOS; this specification does not replace that vision with a narrower platform scope.
- An expense MUST be reviewed and approved before it is added and used to adjust balances.
- This specification records customer-facing needs and does not prescribe an implementation stack or architecture.

## Unresolved Questions

1. What account creation, sign-in, and account-recovery behaviors are required beyond having an account and being able to log in?
2. What group-management actions and member permissions are required?
3. Which users are considered “other group members” for notifications, and what notification channels or preferences are required?
4. Which date ranges, other parameters, and output formats are required for custom reports?
5. Must the same capabilities be available on the web, Android, and iOS, or can capability coverage differ by platform?
6. What user-facing performance, scale, and usability targets define acceptable service quality?
7. Which currencies are supported, and what currency metadata or display conventions are required? The supported currency list is not specified in UserRequirement.md and remains an unresolved product decision.
