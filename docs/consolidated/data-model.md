# SplitSmart Consolidated Domain Model

## 1. Modeling conventions

Identifiers may be UUID values. Monetary values and percentages use `BigDecimal`; dates use `LocalDate`, timestamps use `Instant`. Exact currency/currency scale remains unresolved. This is a domain model, not a persistence schema; local-file serialization belongs to the persistence adapters.

## 2. Entities

### User

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `id` | UUID | Unique account identifier. |
| `email` | String | Required, unique, sign-in identity; verified address used for recovery. |
| `passwordHash` | String | Hashed credential; never plaintext. |
| `displayName` | String | Required display name. |
| `createdAt` | Instant | Account creation time. |

One user may hold many group memberships, submit expenses, review expenses if authorized, and record payments.

### Group

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `id` | UUID | Unique group identifier. |
| `name` | String | Required group name. |
| `managerUserId` | UUID | Group creator/designated manager. |
| `createdAt` | Instant | Group creation time. |

A group has membership history, expenses, and payments. Only a manager adds/removes members; member departure/removal does not erase history.

### GroupMember

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `groupId` | UUID | Owning group. |
| `userId` | UUID | Member account. |
| `role` | `MANAGER` or `MEMBER` | Membership authority. |
| `joinedAt` | Instant | Membership start. |
| `membershipState` | `ACTIVE` or `LEFT` | Lifecycle state; retained for historical references. |

Each user occurs at most once per group membership. `LEFT` represents a member leaving; removal may be represented as inactive membership, but the source does not specify a distinct removal state or timestamp. That representation detail is unresolved.

### Expense

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `id` | UUID | Unique expense identifier. |
| `groupId` | UUID | Owning group. |
| `description` | String | Required description. |
| `amount` | BigDecimal | Required and greater than zero. |
| `expenseDate` | LocalDate | Business date. |
| `submitterUserId` | UUID | Authenticated group member submitting the expense. |
| `payerUserId` | UUID | Must equal `submitterUserId`, and be a group member/participant. |
| `splitType` | `EQUAL` or `PERCENTAGE` | Share allocation rule. |
| `receiptReference` | String, optional | Local reference to receipt image. |
| `status` | ExpenseStatus | `DRAFT`, `PENDING_REVIEW`, `APPROVED`, `REJECTED`, or `CANCELLED`. |
| `createdAt` | Instant | Submission/creation timestamp. |
| `reviewedAt` | Instant, optional | Review completion timestamp; precise meaning across multi-review is unresolved. |

An expense has one group, one or more participants in stable sequence order, and zero or more approval events. Only approved expenses affect balances. `REQUEST_CHANGES` is an approval-event decision, not a settled expense status transition.

### ExpenseParticipant

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `expenseId` | UUID | Owning expense. |
| `userId` | UUID | Participant. |
| `percent` | BigDecimal, optional | Required for percentage split; must be positive per data model. |
| `shareAmount` | BigDecimal | Computed amount at currency precision. |
| `sequenceOrder` | Integer | Stable participant selection order; determines remainder allocation. |

The payer/submitter must be among participants. For equal split, shares are divided evenly and residual minor units distributed in sequence order. For percentage split, percentages total exactly 100%; rounded shares and remainder distribution must sum to the expense total.

### ApprovalEvent

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `id` | UUID (proposed) | Event identifier; the source model does not explicitly list an ID. |
| `expenseId` | UUID | Reviewed expense. |
| `reviewerUserId` | UUID | Actor making decision. |
| `decision` | `APPROVE`, `REJECT`, `REQUEST_CHANGES` | Recorded review action. |
| `comment` | String, optional | Reviewer note. |
| `createdAt` | Instant | Decision time. |

Decision is allowed only while an expense is pending review, subject to the eventual configured workflow. Reviewer authority, self-approval, approval count/order, duplicate reviewer decisions, and transition behavior for rejection/request-changes are unresolved.

### Payment

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `id` | UUID | Unique payment identifier. |
| `groupId` | UUID | Related group. |
| `fromUserId` | UUID | Payer/recorder. |
| `toUserId` | UUID | Payment recipient. |
| `amount` | BigDecimal | Required, positive amount. |
| `paymentDate` | LocalDate | Required date. |
| `note` | String, optional | User-provided note. |
| `createdAt` | Instant | Record creation timestamp. |

A payment is recorded against a balance and immediately affects the derived balance. Duplicate, over-balance, misdirected, and identity-verification policies are unresolved. Payment history never changes expense history.

### BalanceSummary

| Attribute | Type | Responsibility/rule |
|---|---|---|
| `groupId` | UUID | Balance scope. |
| `fromUserId` | UUID | User who owes (signed pairwise direction). |
| `toUserId` | UUID | User owed. |
| `amount` | BigDecimal | Signed net amount owed for the pair. |

This is derived from approved expense shares and recorded payments. It may be computed on demand or cached only if it can be rebuilt from source records. Canonical sign convention and handling of a payment that reverses a direction must be confirmed with the payment policy.

## 3. Relationships and multiplicities

- `Group 1 — 1..* GroupMember`; each `GroupMember` belongs to exactly one `Group` and one `User`.
- `User 1 — 0..* GroupMember`; a user may belong to multiple groups.
- `Group 1 — 0..* Expense`; each expense belongs to one group.
- `Expense 1 — 1..* ExpenseParticipant`; each participant row belongs to one expense and one user.
- `Expense 1 — 0..* ApprovalEvent`; each event concerns one expense and one reviewer user.
- `Group 1 — 0..* Payment`; each payment belongs to one group and references one payer and one recipient user.
- `BalanceSummary` is a derived pairwise result scoped to a group and references two users; it is not an independent source transaction.

## 4. Lifecycles and calculations

### Expense lifecycle

`DRAFT → PENDING_REVIEW → APPROVED` or `REJECTED`; `CANCELLED` exists in the source data model but its allowed transitions are unspecified. `REQUEST_CHANGES` is a review decision; resulting status/resubmission is unresolved. Balances include only expenses whose configured approval requirements are complete.

### Membership lifecycle

`ACTIVE → LEFT`. Manager removal also preserves history; the source does not prescribe whether it uses the same stored state as voluntary leave. Membership rows and all linked transaction history remain available under authorization.

### Approval rules

The event records each reviewer decision. A group-configured process can require one or multiple approvals, and all required approvals must exist before balance inclusion. Reviewer eligibility, self-approval, ordering, rejection effects, and request-changes behavior require clarification.

### Payment and balance rules

For each approved expense, the participants' share amounts represent their allocated responsibility; the payer's actual payment is credited against their share, producing pairwise obligations to the payer for other participants' shares under the clarified payer-equals-submitter rule. Recorded payments reduce the relevant obligation immediately. Formal pairwise aggregation/sign convention, overpayment behavior, and duplicate handling should be confirmed before implementation. Balances must be reconstructible from approved expenses, participant shares, and payment records.

### Monetary precision

Use `BigDecimal`, never binary floating point, for money and percentages. Round to the supported currency's smallest unit. Assign any residual units in participant selection order so share amounts add exactly to the expense amount. Supported currencies, precision, and rounding mode beyond this rule are unresolved.

## 5. Unresolved model details

Confirm currency/scale, receipt constraints and access, reviewer/approval policy, rejection/request-changes transitions, membership removal state representation, payment duplicate/overage rules, balance sign convention, and report/filter fields. Proposed IDs or storage attributes are explicitly marked above; they do not imply customer decisions.
