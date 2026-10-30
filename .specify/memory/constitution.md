<!-- Sync Impact Report
Version change: n/a -> 1.0.0
Modified principles:
- Initial constitution derived from the original SplitSmart customer request and project constraints
Added sections:
- Core Principles
- Technology Constraints
- Quality & Review Workflow
Removed sections:
- none
Deferred TODOs:
- TODO(RATIFICATION_DATE): original ratification date is not recorded in the project artifacts; confirm before final governance sign-off.
-->

# SplitSmart Constitution

## Core Principles

### I. Customer-First Requirements
The original SplitSmart customer request in UserRequirement.md is the authoritative source of product intent. All planning, design, and acceptance criteria MUST trace back to that request. Implementation choices MUST NOT be presented as customer requirements. If a requirement is unclear or conflicts with the original request, the team MUST record the question and resolve it explicitly instead of guessing.

### II. Java 21 and Maven Standards
The project MUST use Java 21 as the required language level for the Java Swing MVP and Maven for dependency management, build lifecycle, and test execution. Tooling and framework choices MUST be explicit, versioned, and documented so that builds are reproducible.

### III. Object-Oriented Design and Separation of Concerns
The system MUST favor cohesive classes, encapsulation, clear responsibilities, and interfaces that model domain behavior without over-coupling. GUI code, business rules, persistence, and validation responsibilities MUST be separated so that business logic can be tested independently of Swing components.

### IV. Quality Through Testability and Traceability
JUnit 5 MUST be used for automated tests. Money calculations MUST use BigDecimal, and the project MUST define rounding and currency rules before implementation is treated as complete. Requirements MUST carry stable IDs, and each requirement MUST be traceable to acceptance criteria and the relevant tests when practical.

### V. Modeling, Review, and Human Accountability
PlantUML MUST be used for architecture and workflow diagrams when a diagram is needed to clarify structure or behavior. Human reviewers MUST validate AI-generated requirements, diagrams, code, and tests before they are treated as authoritative. This prevents silent drift from the original customer request and preserves correctness, completeness, and accountability.

## Technology Constraints

The Java Swing MVP is an implementation decision for this project context and is not a change to the original customer request. The original customer request remains primarily web-based with Android and iOS product support. When the team works on the Swing subset, it MUST clearly label that scope as a course-delimited implementation and MUST NOT claim it replaces the broader product vision.

Requirements involving money MUST use BigDecimal for all monetary calculations, with explicit rounding and currency rules recorded as part of the business rules. Expenses, settlement amounts, and balances MUST be computed without floating-point errors.

## Quality & Review Workflow

All requirements, diagrams, code, and tests MUST be reviewed by a human before acceptance. AI-generated output is a drafting aid, not a final authority. Tests MUST verify business behavior independently of GUI interactions where practical, and any unresolved ambiguity MUST be documented and clarified before implementation proceeds.

## Governance

This Constitution governs project decision-making for SplitSmart. It supersedes informal practice when the two conflict. Any amendment MUST document the reason, preserve the authoritative customer requirement source, and describe the impact on product scope, architecture, or review obligations. Changes requiring new principles or material scope decisions MUST be reviewed by the project lead or designated reviewer before adoption.

Versioning follows semantic versioning. A MAJOR change removes or redefines a governing principle in a backward-incompatible way. A MINOR change adds a principle or materially expands guidance. A PATCH change makes clarification or non-semantic wording improvements. This Constitution MUST be reviewed whenever the project scope, technology stack, or AI-assisted workflow changes materially.

Compliance review requires evidence that design and implementation decisions remain aligned with UserRequirement.md, the approved scope, and these principles. The project MUST record unresolved questions, decisions, and review outcomes so that requirements remain traceable and auditable.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original ratification date is not recorded in the project artifacts; confirm before final governance sign-off. | **Last Amended**: 2026-10-29