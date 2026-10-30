# SplitSmart Feature Specification

## 1. Purpose and source of truth
SplitSmart helps individuals and groups record shared expenses, track balances, record repayments, and review reports. `UserRequirement.md` is the authoritative original customer request and must not be edited by this specification.

## 2. Actors
- **Registered user:** Signs in and views their own expense and balance information.
- **Group member:** Participates in a group and shared expenses.
- **Expense creator/payer:** A user who enters an expense. Whether the payer must be a participant is an open question.
- **Expense reviewer/approver:** A person authorized to review an expense before it affects balances. The authorization model is an open question.
- **Group manager:** A user who creates or manages group membership. Exact permissions are an open question.

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
- **FR-001 — User accounts:** The system shall provide each person with an individual account and a way to log in.
- **FR-002 — Personal information view:** After login, a user shall be able to access their own expense and balance information.
- **FR-003 — Group creation:** A user shall be able to create a group for shared expenses.
- **FR-004 — Group management:** The system shall support managing group members. Exact actions and permissions require clarification.
- **FR-005 — Expense fields:** A user shall be able to enter an expense amount, date, and description.
- **FR-006 — Split method:** An expense shall support equal splitting and percentage-based splitting.
- **FR-007 — Expense participants:** The expense creator shall be able to specify which users are involved in the expense.
- **FR-008 — Receipt attachment:** The system shall allow an optional receipt image to be attached to an expense.
- **FR-009 — Notifications:** The system shall provide a notification mechanism to inform users when other group members create expenses.
- **FR-010 — Expense review:** The system shall support reviewing expenses before they are added to the system and used to adjust balances.
- **FR-011 — Expense decision:** The review process shall support an approval decision. Whether rejection, edits, multiple approval levels, or a single reviewer are required remains open.
- **FR-012 — Balance tracking:** The system shall track the amount each user owes every other user based on expenses that have been entered and accepted under the agreed workflow.
- **FR-013 — Payment recording:** A user shall be able to record a payment made to settle a balance.
- **FR-014 — Balance update:** After a payment is recorded, the system shall reflect the payment in the relevant balances.
- **FR-015 — Reporting:** The system shall provide summaries of expenses, balances, and payments.
- **FR-016 — Custom reports:** The system should support reports with specified date ranges and other parameters; supported parameters require clarification.

## 5. Non-functional requirements
- **NFR-001 — Platform vision:** The customer’s stated product vision is primarily web-based, with applications that can run on Android and iOS.
- **NFR-002 — MVP implementation constraint:** For the course MVP, use Java 21 and Java Swing as directed by the lab. This is an implementation decision and does not satisfy the full platform vision by itself.
- **NFR-003 — Build:** The Java Swing MVP shall use Maven.
- **NFR-004 — Testability:** The Java MVP business rules shall be testable with JUnit 5 without requiring GUI interaction.
- **NFR-005 — Monetary precision:** Monetary values in the Java MVP shall use `BigDecimal`; rounding rules remain an open question.
- **NFR-006 — Maintainability:** The design shall separate GUI responsibilities from business logic.
- **NFR-007 — Traceability:** Requirements shall have stable IDs and acceptance criteria.
- **NFR-008 — Human review:** A human shall review AI-generated artifacts before submission or implementation.

## 6. Acceptance criteria
- **AC-001 (FR-001, FR-002):** Given a registered user with valid login credentials, when the user logs in, then the system provides access to that user's expense and balance information.
- **AC-002 (FR-003, FR-004):** Given a logged-in user, when they create a group and add members using the agreed membership rules, then the group and its membership are represented in the system.
- **AC-003 (FR-005, FR-006, FR-007):** Given an expense entry, when the user provides the required expense details, split method, and involved users, then the system records those details for review.
- **AC-004 (FR-008):** Given an expense, when a user attaches a receipt image, then the expense retains the optional image reference; when no image is attached, the expense can still be recorded.
- **AC-005 (FR-009):** Given a new expense created by a group member, when the system processes the creation event, then the configured notification mechanism informs the relevant users according to rules still to be clarified.
- **AC-006 (FR-010, FR-011):** Given an expense awaiting review, when an authorized reviewer makes a decision, then the decision is recorded and the expense affects balances only after approval.
- **AC-007 (FR-012):** Given approved expenses with agreed split and rounding rules, when balances are calculated, then the system shows the resulting amount owed between each relevant pair of users.
- **AC-008 (FR-013, FR-014):** Given an outstanding balance, when a user records a payment with the required details, then the payment is recorded and the relevant balance is updated.
- **AC-009 (FR-015, FR-016):** Given expense, balance, and payment records, when a user requests a report, then the system displays a summary; date filters and additional parameters follow confirmed requirements.
- **AC-010 (NFR-002 through NFR-006):** The Java Swing MVP uses Java 21 and Maven, has JUnit 5 tests for business rules, uses `BigDecimal` for money, and keeps business logic separate from GUI code.

## 7. Java Swing MVP subset
The course-directed MVP subset is the portion implemented as a Java 21/Maven/Java Swing application. Candidate MVP capabilities are account/login flow, group representation, expense entry, equal/percentage split representation, approval state, balance calculation, payment recording, and basic summaries. This is a proposed scope boundary for the assignment; confirm with the instructor whether all are expected in the MVP. Web, Android, and iOS support remain in the original customer requirements inventory but are outside a Java Swing-only MVP.

## 8. Requirements inventory coverage
The original customer request's features are represented by FR-001 through FR-016 and NFR-001. The original `UserRequirement.md` must remain unchanged. Any detailed behavior not stated in the original request is listed as an open question rather than assumed.

## 9. Open questions — do not silently assume answers
1. **Payer versus participants:** Must the person who paid be included among the expense participants? Can a user enter an expense paid by another person?
2. **Group membership:** Who can invite, add, remove, or leave a group? What happens to historical expenses if a member leaves?
3. **Rounding:** How should equal splits handle leftover cents? What currency precision and rounding mode should percentage splits use?
4. **Invalid amounts:** Are zero or negative amounts allowed? What are the maximum amount and required currency?
5. **Percentage totals:** Must percentages total exactly 100%? If not, should the system reject, warn, or normalize them?
6. **Authentication:** What account creation, password reset, and account recovery behavior is required?
7. **Notifications:** Which members receive notifications, through which channels, and can users mute them?
8. **Balance settlement:** Should balances be shown pairwise only, or can the system suggest a minimized set of payments? What payment details are required?
9. **Approval workflow:** Who can approve an expense? Is one approval enough? Can the creator approve their own expense? What happens on rejection?
10. **Reporting:** Which custom report filters and export formats are required?
11. **Receipt handling:** What image types and file-size limits are allowed, and who can view a receipt?
12. **Platform scope:** Is the web/Android/iOS product the long-term target while Java Swing is only the course MVP?
