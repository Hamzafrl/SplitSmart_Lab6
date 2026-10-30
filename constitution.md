# SplitSmart Project Constitution

## Purpose
Define engineering principles for SplitSmart while keeping customer requirements distinct from implementation decisions.

## Principles
1. **Java version:** Use Java 21 for the Java Swing MVP.
2. **Build management:** Use Maven to manage dependencies, builds, and test execution.
3. **User interface:** Use Java Swing for the MVP desktop interface. This is an implementation choice for the MVP, not a replacement for the customer's stated web, Android, and iOS product vision.
4. **Testing:** Use JUnit 5 for automated unit tests. Business rules should be testable independently of the GUI.
5. **UML:** Use PlantUML for maintainable UML diagrams where diagrams are required.
6. **Object-oriented design:** Use cohesive classes, encapsulation, clear responsibilities, and appropriate interfaces.
7. **Separation of concerns:** Keep GUI code separate from business logic and data-access responsibilities.
8. **Money and precision:** Use `BigDecimal` for monetary calculations. Define and test rounding behavior only after the customer-facing rules are clarified.
9. **Traceability:** Give requirements stable IDs and connect requirements to acceptance criteria and tests where practical.
10. **Customer requirements versus implementation decisions:** Preserve `UserRequirement.md` as the authoritative, original customer request. Clearly label implementation decisions and the Java Swing MVP subset separately.
11. **Ambiguity handling:** Do not silently invent product behavior. Record unresolved questions and obtain confirmation before treating an answer as an agreed requirement.
12. **Human review of AI output:** A human must review generated requirements, diagrams, code, and tests for correctness, completeness, and alignment with the original request.
13. **No premature implementation:** During this requirements lab, create and review requirements artifacts; do not write Java application code.

## Scope note
The original customer request describes a primarily web-based product with Android and iOS apps. The course instructions additionally ask for a Java Swing MVP subset. The Swing MVP is a course implementation scope, not a change to the original customer request.
