# Internal Contracts for the Swing MVP

This project is a desktop application rather than a remote service, so the contracts below describe the core domain interfaces consumed by the Swing UI and the service layer. They are intentionally lightweight and intentionally domain-focused instead of web-API-focused.

## ExpenseCreateRequest

```json
{
  "groupId": "grp-123",
  "description": "Groceries",
  "amount": "123.45",
  "expenseDate": "2026-10-29",
  "submitterUserId": "user-1",
  "payerUserId": "user-2",
  "splitType": "EQUAL",
  "participants": [
    { "userId": "user-1", "sequenceOrder": 1 },
    { "userId": "user-2", "sequenceOrder": 2 },
    { "userId": "user-3", "sequenceOrder": 3 }
  ],
  "receiptPath": null
}
```

Validation:
- `amount` must be positive.
- `splitType` must be `EQUAL` or `PERCENTAGE`.
- `participants` must contain at least one user.
- For `PERCENTAGE`, the sum of percentages must be exactly `100`.

## ExpenseReviewDecisionRequest

```json
{
  "expenseId": "exp-987",
  "reviewerUserId": "user-4",
  "decision": "APPROVE",
  "comment": "Reviewed and approved."
}
```

Validation:
- Only an authorized reviewer may approve or reject an expense.
- Decision updates the expense status and determines whether it affects balances.

## PaymentRecordRequest

```json
{
  "groupId": "grp-123",
  "fromUserId": "user-1",
  "toUserId": "user-2",
  "amount": "50.00",
  "paymentDate": "2026-10-30",
  "note": "Paid for rent contribution"
}
```

Validation:
- `amount` must be positive.
- The payment is recorded against the relevant balance immediately.

## BalanceSummaryResponse

```json
{
  "groupId": "grp-123",
  "balances": [
    {
      "fromUserId": "user-1",
      "toUserId": "user-2",
      "amount": "34.56"
    }
  ]
}
```

Validation:
- Response reflects approved expenses and settlement payments only.
- Amounts use `BigDecimal` and the project rounding policy.
