# SplitSmart Requirements Traceability

This matrix covers every functional requirement (`FR-001`–`FR-016`) from the detailed specification and links it to the consolidated design, ports, diagram, and acceptance criterion. Requirement wording is in [requirements.md](requirements.md). Acronyms: **IP** = input port; **OP** = output port; **D** = domain policy/entity.

| ID | Requirement | Responsible domain/application component | Port(s) | Design / UML reference | Acceptance criterion |
|---|---|---|---|---|---|
| FR-001 | Accounts, email/password sign-in, verified-email recovery | `User`, `CreateAccountService`, `SignInService`, `RecoverAccountService` | `CreateAccountUseCase`, `SignInUseCase`, `RecoverAccountUseCase`; `UserRepository`, `PasswordRecoveryPort` | design §2–4; class diagram `User` and account use cases | AC-001 |
| FR-002 | View own authorized expense and balance records | `ViewPersonalRecordsService` (authorization check) | `ViewPersonalRecordsUseCase`; `UserRepository`, `GroupRepository`, `ExpenseRepository`, `PaymentRepository` | design §2–4; component diagram core/repositories | AC-002 |
| FR-003 | Create/manage groups; manager membership changes; leave; preserve history | `Group`, `GroupMember`, `CreateGroupService`, `ManageMembershipService` | `CreateGroupUseCase`, `ManageMembershipUseCase`; `GroupRepository` | data-model §2–4; design §2–4; class diagram membership | AC-003 |
| FR-004 | Enter positive expense fields only for own payment; submitter equals payer and is participant | `Expense`, `SubmitExpenseService`, expense domain invariants | `SubmitExpenseUseCase`; `GroupRepository`, `ExpenseRepository` | requirements §7; design §5; approval activity | AC-004, AC-017 |
| FR-005 | Equal split with remainders in participant order | `ExpenseParticipant`, `SplitCalculator` | `SubmitExpenseUseCase`; no external output port | data-model §2/4; design §5; class diagram `SplitCalculator` | AC-005 |
| FR-006 | Percent split totals exactly 100%, remainder order | `ExpenseParticipant`, `SplitCalculator` | `SubmitExpenseUseCase`; no external output port | data-model §2/4; design §5; class diagram `SplitCalculator` | AC-006 |
| FR-007 | Submitter selects participants and includes self as payer | `Expense`, `ExpenseParticipant`, submit validation | `SubmitExpenseUseCase`; `GroupRepository` | requirements §7; data-model §2; approval activity | AC-004, AC-005, AC-006 |
| FR-008 | Optional receipt image association | `Expense.receiptReference`, receipt adapter | `SubmitExpenseUseCase`; `ReceiptStoragePort` | architecture §5–7; design §3–4; component diagram | AC-007 |
| FR-009 | Notify other group members about new expense | `SubmitExpenseService`, notification adapter | `SubmitExpenseUseCase`; `NotificationPort` | architecture §5–6; design §2,4; component diagram | AC-008 |
| FR-010 | Submitted expense review before balance inclusion | `Expense` lifecycle, `ReviewExpenseService` | `ReviewExpenseUseCase`; `ExpenseRepository` | data-model §4; design §6; approval activity | AC-009 |
| FR-011 | Record configured single/multi approval; require all before balance effect | `ApprovalEvent`, `ReviewPolicy`, `ReviewExpenseService` | `ReviewExpenseUseCase`; `ExpenseRepository` | requirements §8; design §6; class and approval activity | AC-009 |
| FR-012 | Pairwise balances from approved expenses and payments | `BalanceSummary`, `BalanceCalculator`, `ViewBalancesService` | `ViewBalancesUseCase`; `ExpenseRepository`, `PaymentRepository` | data-model §4; design §7; class diagram | AC-010 |
| FR-013 | Record payment amount, recipient, date against balance | `Payment`, `RecordPaymentService` | `RecordPaymentUseCase`; `PaymentRepository` | data-model §2; design §7; payment activity | AC-011 |
| FR-014 | Update relevant balance immediately after recording | `BalanceCalculator`, `RecordPaymentService` | `RecordPaymentUseCase`; payment/expense repositories | data-model §4; design §7; payment activity | AC-011 |
| FR-015 | Summaries of accessible expenses, balances, payments | `GenerateReportService`, `ReportResult` | `GenerateReportUseCase`; repositories | architecture §6; design §2,4; class diagram/report controller | AC-012 |
| FR-016 | Date-range report and supported parameters | `GenerateReportService` | `GenerateReportUseCase`; repositories | requirements §9; design §2; class diagram | AC-012 |

## Non-functional traceability

| ID | Responsible component/design | Acceptance criterion |
|---|---|---|
| NFR-001 | Product platform scope; Swing is MVP adapter only | AC-016 |
| NFR-002 | Authorization policy and use cases | AC-002 |
| NFR-003 | Swing flow and usability validation | AC-013 |
| NFR-004 | Application/adapters and local data access | AC-014 |
| NFR-005 | Domain record model, persistence, and authorized views | AC-015 |

All referenced diagrams are in `diagrams/`. Business rules remain in domain/application components; UML is representative design documentation, not implemented Java source.
