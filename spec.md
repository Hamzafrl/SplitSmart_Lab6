# SplitSmart Feature Specification

## 1. Purpose and source of truth
SplitSmart helps individuals and groups record shared expenses, track balances, record repayments, and review reports. `UserRequirement.md` is the authoritative original customer request and must not be edited by this specification.

## Clarifications

### Session 2026-10-29

- Q: Must the expense payer be one of its participants, and may the submitter record an expense paid by someone else? → A: The payer must be a participant, and the submitter records only expenses they paid.
- Q: Who may add or remove group members, and what happens to past records when someone leaves? → A: Group managers control adding and removing members; members may leave, and historical expenses and balances remain in the group's history.
- Q: What rules apply to expense amounts and split rounding? → A: Expense amounts must be positive; percentage shares must total exactly 100%; rounding remainders are distributed in participant order.
- Q: How do users sign in and recover account access? → A: Authentication uses email and password, with recovery through the verified email address.
- Q: What must a payment record contain, and when does it affect balances? → A: The payer records the payment amount, recipient, and date, and the balance updates immediately.

## 2. Actors
- **Registered user:** Signs in and views their own expense and balance information.
- **Group member:** Participates in a group and shared expenses.
- **Expense submitter/payer:** A group member who records only expenses they paid and participates in each expense they submit.
- **Expense reviewer/approver:** A person authorized to review an expense before it affects balances. The authorization model is an open question.
- **Group manager:** A user who controls adding and removing group members.

## 3. User scenarios
1. As a user, I want an account and login so that I can access my own expenses and balances.
2. As a user, I want to create and manage groups so that I can organize shared expenses.
3. As a group member, I want to create an expense with an amount, date, description, split method, involved users, and optional receipt image.
4. As a group member, I want to be notified when another group member creates an expense.
5. As an authorized reviewer, I want to review and approve or reject an expense before it affects balances.
6. As a user, I want to see balances owed between users based on accepted expenses.
7. As a user, I want to record a payment toward an amount owed so balances can be updated.
8. As a user, I want summaries and reports of expenses, balances, and payments, with optional date-range/custom parameters.

## 4. Functional requirements
- **FR-001 — User accounts:** The system shall provide each person with an individual account, sign-in using an email address and password, and account recovery through the account's verified email address.
- **FR-002 — Personal information view:** After login, a user shall be able to access their own expense and balance information.
- **FR-003 — Group creation:** A user shall be able to create a group for shared expenses.
- **FR-004 — Group management:** A group manager shall control adding and removing members. A member may leave a group; leaving or removal shall not delete historical expenses or balances from the group's history.
- **FR-005 — Expense fields:** A group member shall be able to enter an expense amount, date, and description only for an expense they paid. The amount must be positive, and the submitter/payer must be included among the expense participants.
- **FR-006 — Split method:** An expense shall support equal splitting and percentage-based splitting. Percentage shares must total exactly 100%. Shares shall be rounded to the currency's smallest unit, with rounding remainders distributed in participant order.
- **FR-007 — Expense participants:** The submitter shall be able to specify which users are involved in the expense and must include themselves as payer.
- **FR-008 — Receipt attachment:** The system shall allow an optional receipt image to be attached to an expense.
- **FR-009 — Notifications:** The system shall provide a notification mechanism to inform users when other group members create expenses.
- **FR-010 — Expense review:** The system shall support reviewing expenses before they are added to the system and used to adjust balances.
- **FR-011 — Expense decision:** The review process shall support an approval decision. Whether rejection, edits, multiple approval levels, or a single reviewer are required remains open.
- **FR-012 — Balance tracking:** The system shall track the amount each user owes every other user based on expenses that have been entered and accepted under the agreed workflow.
- **FR-013 — Payment recording:** A user who made a payment shall be able to record its amount, recipient, and date against a balance.
- **FR-014 — Balance update:** The relevant balance shall update immediately when a payment is recorded.
- **FR-015 — Reporting:** The system shall provide summaries of expenses, balances, and payments.
- **FR-016 — Custom reports:** The system should support reports with specified date ranges and other parameters; supported parameters require clarification.

## 5. Non-functional requirements
- **NFR-001 — Platform vision:** The customer’s stated product vision is primarily web-based, with applications that can run on Android and iOS.
- **NFR-002 — MVP implementation constraint:** For the course MVP, use Java 21 and Java Swing as directed by the lab. This is an implementation decision and does not satisfy the full platform vision by itself.
- **NFR-003 — Build:** The Java Swing MVP shall use Maven.
- **NFR-004 — Testability:** The Java MVP business rules shall be testable with JUnit 5 without requiring GUI interaction.
- **NFR-005 — Monetary precision:** Monetary values in the Java MVP shall use `BigDecimal`; split rounding shall follow FR-006.
- **NFR-006 — Maintainability:** The design shall separate GUI responsibilities from business logic.
- **NFR-007 — Traceability:** Requirements shall have stable IDs and acceptance criteria.
- **NFR-008 — Human review:** A human shall review AI-generated artifacts before submission or implementation.

## 6. Acceptance criteria
- **AC-001 (FR-001, FR-002):** Given a registered user with a verified email address and valid email/password credentials, when the user logs in, then the system provides access to that user's expense and balance information; when the user requests account recovery, then recovery is through the verified email address.
- **AC-002 (FR-003, FR-004):** Given a logged-in user, when they create a group, then only its manager can add or remove members, a member can leave, and leaving or removal does not delete historical expenses or balances.
- **AC-003 (FR-005, FR-006, FR-007):** Given an expense entry, when the submitter enters a positive amount for an expense they paid and includes themselves among the participants, then the system records the details for review; zero or negative amounts and percentage shares not totaling exactly 100% are rejected, and rounding remainders are distributed in participant order.
- **AC-004 (FR-008):** Given an expense, when a user attaches a receipt image, then the expense retains the optional image reference; when no image is attached, the expense can still be recorded.
- **AC-005 (FR-009):** Given a new expense created by a group member, when the system processes the creation event, then the configured notification mechanism informs the relevant users according to rules still to be clarified.
- **AC-006 (FR-010, FR-011):** Given an expense awaiting review, when an authorized reviewer makes a decision, then the decision is recorded and the expense affects balances only after approval.
- **AC-007 (FR-012):** Given approved expenses, when balances are calculated, then the system shows the resulting amount owed between each relevant pair of users using the specified split and rounding rules.
- **AC-008 (FR-013, FR-014):** Given an outstanding balance, when the user who paid records the payment amount, recipient, and date, then the payment is recorded and the relevant balance is updated immediately.
- **AC-009 (FR-015, FR-016):** Given expense, balance, and payment records, when a user requests a report, then the system displays a summary; date filters and additional parameters follow confirmed requirements.
- **AC-010 (NFR-002 through NFR-006):** The Java Swing MVP uses Java 21 and Maven, has JUnit 5 tests for business rules, uses `BigDecimal` for money, and keeps business logic separate from GUI code.

## 7. Java Swing MVP subset
The course-directed MVP subset is the portion implemented as a Java 21/Maven/Java Swing application. Candidate MVP capabilities are account/login flow, group representation, expense entry, equal/percentage split representation, approval state, balance calculation, payment recording, and basic summaries. This is a proposed scope boundary for the assignment; confirm with the instructor whether all are expected in the MVP. Web, Android, and iOS support remain in the original customer requirements inventory but are outside a Java Swing-only MVP.

## 8. Requirements inventory coverage
The original customer request's features are represented by FR-001 through FR-016 and NFR-001. The original `UserRequirement.md` must remain unchanged. Any detailed behavior not stated in the original request is listed as an open question rather than assumed.

## 9. Open questions — do not silently assume answers
1. **Currency and limits:** Which currencies and maximum expense amounts are supported?
2. **Approval workflow:** Who can approve or reject an expense, can its submitter approve it, and what happens after rejection? Is one approval sufficient, or are multiple approval levels required?
3. **Notifications:** Through which channels are other group members notified, and can users mute or change notification preferences?
4. **Payment exceptions and settlement:** How should duplicate, over-balance, or misdirected payments be handled, and should the system suggest a simplified settlement plan?
5. **Reporting:** Which custom report filters and export formats are required?
6. **Receipt handling:** What image types and file-size limits are allowed, and who can view a receipt?
7. **Java Swing MVP scope:** Which customer features are required for the course MVP, and which remain outside its scope?
