# Data Model: Shared Expense Tracking

## Entities

### User

| Field | Type | Rules |
|---|---|---|
| id | UUID/String | Unique system identifier |
| email | String | Unique, required, validated as email |
| passwordHash | String | Hashed password, never stored in plaintext |
| displayName | String | Required |
| createdAt | Instant | Set on account creation |

Relationships:
- One user may belong to many groups through `GroupMember`.
- One user may submit many expenses and payments.

### Group

| Field | Type | Rules |
|---|---|---|
| id | UUID/String | Unique system identifier |
| name | String | Required |
| managerUserId | UUID/String | Group creator or designated manager |
| createdAt | Instant | Set on creation |

Relationships:
- One group has many members.
- One group has many expenses and payments.

### GroupMember

| Field | Type | Rules |
|---|---|---|
| groupId | UUID/String | Required |
| userId | UUID/String | Required |
| role | Enum | `MANAGER` or `MEMBER` |
| joinedAt | Instant | Set on membership creation |

Validation rules:
- A user may appear at most once in the same group.
- Only a manager may add or remove members.

### Expense

| Field | Type | Rules |
|---|---|---|
| id | UUID/String | Unique system identifier |
| groupId | UUID/String | Required |
| description | String | Required |
| amount | BigDecimal | Must be > 0 |
| expenseDate | LocalDate | Required |
| submitterUserId | UUID/String | Required |
| payerUserId | UUID/String | Must reference a group member |
| splitType | Enum | `EQUAL` or `PERCENTAGE` |
| receiptPath | String | Optional |
| status | Enum | `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, `CANCELLED` |
| createdAt | Instant | Set on creation |
| reviewedAt | Instant | Nullable |

Relationships:
- One expense belongs to one group.
- One expense has many `ExpenseParticipant` records.
- One expense may have many `ApprovalEvent` records.

Validation rules:
- Amount is positive and uses `BigDecimal`.
- Payer must be a group member; the submitter may be different.
- Receipt is optional; lack of image does not block submission.
- Expenses are not included in balances until approval.

### ExpenseParticipant

| Field | Type | Rules |
|---|---|---|
| expenseId | UUID/String | Required |
| userId | UUID/String | Required |
| percent | BigDecimal | Required only for PERCENTAGE split; zero or negative values invalid |
| shareAmount | BigDecimal | Computed result for each participant |
| sequenceOrder | Integer | Stable order used for leftover-cent distribution |

Validation rules:
- For equal split, all participants receive equal shares, rounded to the currency minimum.
- For percentage split, the sum of `percent` values must equal exactly 100%.
- For percentage split, rounding uses currency precision and leftover units are assigned in `sequenceOrder`.

### Payment

| Field | Type | Rules |
|---|---|---|
| id | UUID/String | Unique system identifier |
| groupId | UUID/String | Required |
| fromUserId | UUID/String | Required |
| toUserId | UUID/String | Required |
| amount | BigDecimal | Must be > 0 |
| paymentDate | LocalDate | Required |
| note | String | Optional |
| createdAt | Instant | Set on creation |

Validation rules:
- Payment is recorded against an outstanding balance.
- Amount must be positive.
- Payment immediately reduces the relevant recorded balance.

### ApprovalEvent

| Field | Type | Rules |
|---|---|---|
| id | UUID/String | Unique system identifier |
| expenseId | UUID/String | Required |
| reviewerUserId | UUID/String | Required |
| decision | Enum | `APPROVE`, `REJECT`, `REQUEST_CHANGES` |
| comment | String | Optional |
| createdAt | Instant | Set when review is recorded |

Validation rules:
- Expense must be in pending-review state to receive decisions.
- Approval decision changes expense status.

### BalanceSummary

| Field | Type | Rules |
|---|---|---|
| fromUserId | UUID/String | Required |
| toUserId | UUID/String | Required |
| amount | BigDecimal | Signed amount owed by sender to recipient |
| groupId | UUID/String | Required |

Validation rules:
- Derived from approved expenses and payments.
- Pairwise balances are computed after validation and settlement.

## State transitions

### Expense lifecycle

`DRAFT -> PENDING_REVIEW -> APPROVED` or `REJECTED`

- Draft: incomplete or not yet submitted.
- Pending review: created and awaiting approval.
- Approved: participates in balance calculations.
- Rejected: excluded from balances and recorded for audit.

### Membership lifecycle

`ACTIVE -> LEFT`

- A member may leave the group.
- Historical records remain intact; group history is not deleted.

## Derived rules

- Balances must be computed from approved expenses only.
- Payment records reduce outstanding balances but do not alter historical expense records.
- The system generates summaries and notifications from approved and recorded transactions.
