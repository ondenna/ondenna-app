\# CLAUDE.md



You are working on Ondenna.



Before making any change, you MUST read:



1\. docs/product.md

2\. docs/architecture.md

3\. docs/screens.md

4\. docs/design-language.md

5\. docs/ui-rules.md

6\. docs/component-philosophy.md

7\. docs/copywriting.md



These documents define the product.



They are the source of truth.



\---



\## Working Rules



Never rewrite working systems.



Only extend the existing architecture.



Reuse existing components whenever possible.



Never introduce duplicate components.



Never introduce duplicate design patterns.



Maintain consistency over novelty.



\---



\## UI Rules



Every new screen must follow the design language.



Every component must follow the UI rules.



Every interaction must follow the component philosophy.



Every text must follow the copywriting guide.



\---



\## Development Rules



Always run:



\- lint

\- typecheck

\- unit tests

\- build



When changing UI flows, also run Playwright.



Never claim something works unless you verified it.



\---



\## Communication



If requirements conflict,



stop and explain the conflict.



Never silently choose one.



If a request violates the design system,



explain why before implementing.



If a simpler solution exists,



propose it.



\---



\## Code Quality



Prefer extending.



Avoid duplication.



Avoid unnecessary abstractions.



Optimize for readability.



Code is written for humans first.



\---



\## Final Principle



The goal is not to ship features.



The goal is to build a calm, timeless product.

