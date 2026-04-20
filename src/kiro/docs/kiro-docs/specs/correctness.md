# Correctness with Property-based tests

<!--$-->

"Spec correctness" helps answer a fundamental question: does your implementation actually do what you specified? When AI generates code, how do you know it matches your intent?

## Concepts[](#concepts)

Property-Based Testing is a step towards a fundamental shift in how we think about correctness with AI, moving from checking individual examples to validating universal properties across entire input spaces. Traditional unit tests only check specific examples, and whoever writes them—human or AI—is limited by their own biases. By automatically translating natural language specifications into executable properties and generating comprehensive test cases, Kiro creates a powerful feedback loop that helps both AI agents and human developers build more reliable software. This approach not only finds bugs that traditional testing misses, but also maintains a clear, traceable link between your requirements and the tests that validate them.

While PBT cannot guarantee the absence of all bugs, it provides significantly stronger evidence of correctness than example-based testing alone, making it an essential tool for specification-driven development.

### What is a property?[](#what-is-a-property)

A property is a universal statement about how your system should behave. Properties express the invariants and contracts that should always be true in your system, regardless of the specific data involved.

> For any set of inputs where certain preconditions hold, some expected behavior is true.

In the Kiro specification world, this maps really well to our EARS requirements:

> "For any authenticated user and any active listing, the user can view that listing." This captures a general rule about system behavior that must hold across all valid scenarios.

### How property-based testing works[](#how-property-based-testing-works)

Consider a car sales app:

* __Traditional test__: User adds Car #5 to favorites, Car #5 appears in their list
* __Property-based test__: For any user and any car, WHEN the user adds the car to favorites, THE System SHALL display it in their list

PBT automatically tests this with User A adding Car #1, User B adding Car #500, users with special characters in names, cars with various statuses, and hundreds more combinations—catching edge cases and verifying implementation matches intent.

Throughout this process, PBT probes to find counter-examples through "shrinking"—almost like a red team trying to break your code. When it finds violations, Kiro can automatically update your implementation or surface options to fix the spec, implementation, or test itself.

While not formal verification, PBT provides evidence for correctness across scenarios you'd never write manually—showing whether your implementation actually behaves according to what you defined.

## Property-based testing w. Specs[](#property-based-testing-w-specs)

Kiro integrates property-based testing throughout the spec workflow, from requirements to implementation validation.

### Workflow[](#workflow)

Kiro extracts properties from your EARS-formatted requirements (e.g. "THE System SHALL allow authenticated users to view active car listings"), determines which can be logically tested, then generates hundreds or thousands of random test cases when you choose to run them.

### Design phase[](#design-phase)

In the design phase, Kiro extracts properties from your requirements and generates test cases. This is the first step in the workflow, where Kiro analyzes your requirements and identifies the properties that can be tested.

![Extract properties](https://kiro.dev/images/correctness1.png?h=ed62af53)

Hovering over a property reveals its connection to the original requirement and linked task.

![Extract properties](https://kiro.dev/images/correctness2.png?h=30e6cf95)

### Executing tasks[](#executing-tasks)

In the execution phase, Kiro runs the generated PBT cases against your implementation. Note: PBTs are optional by default so you can focus on your core implementation first. Once a property test runs you can see the reference to the generated code.

![Run property tests](https://kiro.dev/images/correctness3.png?h=947e1f17)

When a property test fails, Kiro identifies the specific failure scenario and surfaces it for review.

![Property test failure notification](https://kiro.dev/images/correctness5.png?h=6f3237ea)

You can then chat with Kiro to understand the failure and determine the appropriate fix—whether that's updating the implementation, adjusting the test, or refining the requirement itself.

![Analyzing property test failures with Kiro](https://kiro.dev/images/correctness4.png?h=51bfcaf7)

Page updated: November 17, 2025