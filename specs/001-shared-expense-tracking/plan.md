# Implementation Plan: Shared Expense Tracking

**Branch**: `001-shared-expense-tracking` | **Date**: `2026-10-29` | **Spec**: `./spec.md`

**Input**: Feature specification from `/specs/001-shared-expense-tracking/spec.md`

## Summary

Build a Java 21, Maven-based Swing MVP for shared-expense tracking that supports user accounts, group membership, expense entry with equal or percentage splits, approval review, balance calculations, payment recording, and summary reporting. The core architecture separates domain logic from UI concerns, uses `BigDecimal` for money, and keeps the design aligned with the original customer request in `UserRequirement.md`.

## Technical Context

**Language/Version**: Java 21

**Primary Dependencies**: Java Swing, Maven, JUnit 5, `BigDecimal` for monetary calculations

**Storage**: Local persistence layer for the course MVP (file-based or in-memory repository pattern) with a domain service layer separating storage from business logic

**Testing**: Maven + JUnit 5 for unit and service-level validation of business rules

**Target Platform**: Desktop Swing application as the course-delimited MVP; original product vision remains primarily web/mobile, but the Swing subset is explicitly bounded

**Project Type**: desktop-app

**Performance Goals**: Support small-to-medium group sizes; maintain fast local calculation and UI responsiveness in the Swing app

**Constraints**: All monetary computations must use `BigDecimal`; expense approvals must be enforced before balances change; GUI logic must remain separate from business rules; customer requirements must remain authoritative

**Scale/Scope**: Small shared-expense groups, moderate number of members and transactions; MVP includes account, group, expense, approval, balance, payment, and report flows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Customer-first requirements: PASS — requirements trace to `UserRequirement.md` and the clarified spec.
- Java 21 and Maven: PASS — explicit technology requirement for the course MVP.
- Object-oriented design and separation of concerns: PASS — GUI, domain logic, validation, and persistence will be isolated by module and service boundaries.
- Quality through testability and traceability: PASS — JUnit 5 and `BigDecimal` are mandated; acceptance criteria and domain rules are explicit.
- Modeling, review, and human accountability: PASS — design artifacts are recorded and must be human-reviewed before implementation.

No constitution violations are identified for this feature. No complexity exceptions are required.

## Project Structure

### Documentation (this feature)

```text
specs/001-shared-expense-tracking/
├── plan.md              # This file
├── research.md          # Phase 0: decisions and rationale
├── data-model.md        # Phase 1: domain model and validation rules
├── quickstart.md        # Phase 1: validation scenarios
├── contracts/           # Phase 1: internal application contracts
└── tasks.md             # Phase 2 output (not created in this step)
```

### Source Code (repository root)

```text
src/
├── main/
│   └── java/
│       └── com/
│           └── splitsmart/
│               ├── model/
│               │   ├── User.java
│               │   ├── Group.java
│               │   ├── GroupMember.java
│               │   ├── Expense.java
│               │   ├── ExpenseParticipant.java
│               │   ├── Payment.java
│               │   └── ApprovalEvent.java
│               ├── service/
│               │   ├── GroupService.java
│               │   ├── ExpenseService.java
│               │   ├── BalanceService.java
│               │   └── ReportingService.java
│               ├── persistence/
│               │   ├── Repository.java
│               │   └── FileRepository.java
│               ├── validation/
│               │   └── SplitValidator.java
│               └── ui/
│                   ├── SwingApp.java
│                   └── screens/
└── test/
    └── java/
        └── com/
            └── splitsmart/
                ├── service/
                ├── model/
                └── validation/
```

**Structure Decision**: Use a single Java project with a domain model package, service layer, repositories, validation utilities, and a UI package. This keeps the Swing MVP small and testable while preserving separation between GUI concerns and domain behavior.

## Complexity Tracking

No constitution violations require justification.
