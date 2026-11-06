# SplitSmart Consolidated Detailed Design

## 1. Design boundaries

The Java 21 Maven application has a domain/application core, driving Swing adapters, and driven local-file/notification adapters. Core packages may be organized by feature (`account`, `group`, `expense`, `payment`, `report`) while retaining inward dependencies. Use plain Java interfaces and constructor injection; no enterprise framework is required for this student MVP.

## 2. Application use cases and service responsibilities

| Use case/service | Responsibility |
|---|---|
| `CreateAccountService` / `SignInService` / `RecoverAccountService` | Coordinate account registration/sign-in using `UserRepository`; initiate recovery through `PasswordRecoveryPort` using the verified email address; never return password hashes to UI. |
| `ViewPersonalRecordsService` | Check user/group authorization and query accessible expense, balance, and payment records. |
| `CreateGroupService` | Create group and initial manager membership. |
| `ManageMembershipService` | Enforce manager-only add/remove and member leave; retain membership/history records. |
| `SubmitExpenseService` | Validate request and group relationships, calculate shares, save pending expense, request notification. |
| `ReviewExpenseService` | Validate pending state, record approval event, apply configured review policy, and expose approved expense to balance calculation only when requirements are met. |
| `ViewBalancesService` | Derive pairwise balances from approved expenses and payment source records. |
| `RecordPaymentService` | Validate and persist positive amount/recipient/date and return immediately recalculated balances. Duplicate/overpayment outcomes await policy. |
| `GenerateReportService` | Query authorized records, apply confirmed filters, and return a presentation-neutral report. |

## 3. Port definitions

### Input ports (interfaces implemented by application services)

Each accepts a request object and returns a result object or typed application error:

- `CreateAccountUseCase`, `SignInUseCase`, `RecoverAccountUseCase`, `ViewPersonalRecordsUseCase`
- `CreateGroupUseCase`, `ManageMembershipUseCase`
- `SubmitExpenseUseCase`, `ReviewExpenseUseCase`
- `ViewBalancesUseCase`, `RecordPaymentUseCase`, `GenerateReportUseCase`

Request objects carry IDs and business data, never `JTextField`, `JFrame`, or Swing events. Return objects contain display-ready values but no Swing types.

### Output ports (interfaces consumed by application services)

- `UserRepository`: find/save user and sign-in identity.
- `GroupRepository`: find/save group and membership history.
- `ExpenseRepository`: find/save expense aggregate including ordered participants and approval events.
- `PaymentRepository`: find/save payment records by group/user/date range.
- `NotificationPort`: request expense-created notification to applicable recipients.
- `ReceiptStoragePort`: store and resolve optional receipt references.
- `PasswordRecoveryPort`: initiate verified-email account recovery.
- `ClockPort`: supply timestamps; alternatively inject `java.time.Clock`.

Repository writes that change a single aggregate should be atomic from the application's perspective. Multi-file transactional guarantees are implemented/documented by adapters, not by the domain.

## 4. Adapter responsibilities

- **Swing input adapters:** `SwingAccountController`, `SwingPersonalRecordsController`, `SwingGroupController`, `SwingExpenseController`, `SwingReviewController`, `SwingBalanceController`, `SwingPaymentController`, and `SwingReportController` call input ports, map results/errors, and refresh views.
- **Swing screens:** collect and display data. Validation here is usability feedback only; authoritative business validation remains in core.
- **Local-file repository adapters:** `FileUserRepository`, `FileGroupRepository`, `FileExpenseRepository`, and `FilePaymentRepository` implement output ports and own serialization, schema/version handling, and safe file replacement.
- **Receipt adapter:** stores image content/references locally. File types, limits, and visibility await clarification.
- **Notification adapter:** `DesktopNotificationAdapter` (or another configured adapter) implements `NotificationPort`; precise channel/delivery semantics await clarification.
- **Test adapters:** in-memory repositories, fake notification, and fixed clock supply deterministic tests.

## 5. Domain validation and expense splitting

The submit use case checks authentication/authorization, group membership, required fields, `amount > 0`, `submitterUserId == payerUserId`, and payer inclusion in participants. Participants must be valid members under applicable membership rules; historical member semantics for new expenses require policy if a member has left. The domain calculator uses `BigDecimal`.

For equal splitting, divide amount across participants at currency precision and assign remainder minor units by stable participant order. For percentage splitting, require exact total of 100%; reject any other total without normalization. Calculate/round shares and distribute remainder in participant order so the resulting shares total the expense exactly. Currency and precision must be configured after requirements clarify them.

## 6. Approval processing

`ReviewExpenseService` accepts an expense ID, reviewer ID, decision, and optional comment. It confirms the expense is pending and delegates reviewer eligibility/required-approval count to a `ReviewPolicy` once clarified. It appends an `ApprovalEvent`; only the policy's completed approval makes the expense eligible for balances. A rejection is recorded and excluded from balances. `REQUEST_CHANGES` must be recordable as a decision, but whether it leaves the expense pending, returns it to draft, or triggers resubmission is explicitly unresolved. Do not implement guessed behavior as an agreed rule.

## 7. Balance and payment processing

`BalanceCalculator` derives pairwise results using approved expenses only, participant shares, the payer's paid amount, and recorded payments. It does not modify historical expenses. `RecordPaymentService` rejects missing fields and non-positive amount, stores payment, and recalculates the affected balance before returning success. Whether over-balance payments are rejected, accepted as credit, or handled another way; duplicate detection; and misdirected payment behavior remain open. Calculations use `BigDecimal` and balances are rebuildable from source records.

## 8. Error handling

Use typed application errors for validation failure, unauthorized access, missing records, invalid lifecycle state, persistence failure, and notification failure. Do not expose stack traces, file paths, or password data in Swing. A persistence failure must not be reported as a successful save. Expense persistence and notification are distinct effects; delivery failure/retry behavior must be decided. UI messages should identify corrective action where possible while retaining detailed logs in the adapter boundary.

## 9. Composition root

`ApplicationBootstrap` constructs file/notification/receipt adapters, domain policies (`SplitCalculator`, `BalanceCalculator`), application services, and Swing controllers. It injects interfaces through constructors and starts the Swing UI on the Event Dispatch Thread. Tests construct services directly with fakes. This small manual composition root avoids framework complexity.

## 10. Testing design

JUnit 5 tests cover domain invariants and calculations independently; use-case tests verify repository/notification interactions and authorization outcomes with in-memory adapters; repository tests verify serialization round-trips, schema handling, and safe failed writes; thin controller tests verify UI-to-port mapping. Test approved/pending/rejected balances, both split methods, remainder ordering, payer identity, payment immediacy, and reconstruction after reload. Tests must not require a visible GUI for business rules.
