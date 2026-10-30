# Quickstart Validation Guide

## Prerequisites

- Java 21 installed
- Maven installed
- Project checked out at the feature branch `001-shared-expense-tracking`

## Validate the business rules

From the repository root, run:

```bash
mvn test
```

Expected outcome:
- All JUnit 5 tests pass.
- Domain rules for positive amounts, percentage totals, and balance calculations are validated without GUI interaction.

## Package the Java Swing MVP

```bash
mvn package
```

Expected outcome:
- A runnable application artifact is produced under the Maven `target` directory.
- The build succeeds without requiring a browser or mobile runtime.

## End-to-end validation scenarios

### 1. Create a group and account

1. Create a user account with email and password.
2. Log in as that user.
3. Create a group and add at least two members.
4. Confirm the group appears in the user’s accessible records.

Expected: user sees a valid group with members and no historical entries are lost when a member leaves later.

### 2. Record and review an expense

1. Create an expense in a group.
2. Set amount, date, description, and participants.
3. Choose equal split or percentage split.
4. Attach an optional receipt, or leave it empty.
5. Submit the expense for review.

Expected:
- Expense is saved with payer and participant details.
- It remains excluded from balances until approved.
- The approval state is visible to authorized review users.

### 3. Approve and calculate balances

1. Approve the submitted expense.
2. Recalculate balances.

Expected:
- Pairwise balances reflect approved expenses.
- The calculation matches the consistent rounding and distribution rules.

### 4. Record a payment

1. Select an outstanding balance.
2. Record a payment with date, amount, and recipient.

Expected:
- Payment is stored in the payment history.
- The relevant balance is immediately reduced.

### 5. Generate a summary report

1. Request a summary for a group or date range.
2. Review the displayed expenses, balances, and payments.

Expected:
- The report includes only the records relevant to the selected user and time range.
- The report reflects the current approved balances and payment history.

## Related design references

- Domain model: [data-model.md](./data-model.md)
- Contracts: [contracts](./contracts)
- Research decisions: [research.md](./research.md)
