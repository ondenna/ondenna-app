\# Ondenna UI Rules



Version: 1.0



This document defines the implementation rules for every UI component in Ondenna.



Every screen must follow these rules unless there is a documented UX reason not to.



\---



\# Grid System



Use an 8-point spacing system.



Allowed spacing values:



4

8

16

24

32

40

48

64

80

96



Never invent arbitrary spacing.



Good:



padding: 24px



Bad:



padding: 21px



These ten values are the whole scale. Every other value, including 12px and

20px, is off the grid.



In Tailwind the number in a utility is multiplied by a 4px base, so the

utility number is not the pixel value: \`p-6\` is 24px, not 6px. The complete

mapping:



| Pixels | Utility | | Pixels | Utility |
| --- | --- | --- | --- | --- |
| 4px | \`\*-1\` | | 40px | \`\*-10\` |
| 8px | \`\*-2\` | | 48px | \`\*-12\` |
| 16px | \`\*-4\` | | 64px | \`\*-16\` |
| 24px | \`\*-6\` | | 80px | \`\*-20\` |
| 32px | \`\*-8\` | | 96px | \`\*-24\` |



where \`\*\` is a spacing prefix: p px py pt pr pb pl m mx my mt mr mb ml gap

gap-x gap-y space-x space-y.



There is no \`\*-3\`, \`\*-5\`, \`\*-7\`, \`\*-9\`, \`\*-11\` or \`\*-14\`. Those are the

values this document rejects, not values anyone forgot.



This is enforced, not merely written down: \`src/design/spacing-scale.test.ts\`

fails the build on any off-grid padding, margin or gap in application code.



\---



\# Screen Width



Mobile-first.



Maximum content width:



480px



Desktop layouts should never become excessively wide.



Reading should always feel comfortable.



\---



\# Safe Area



Top padding:



24px



Horizontal padding:



24px



Bottom padding:



32px



\---



\# Typography Scale



Display



40px



Heading 1



32px



Heading 2



24px



Heading 3



20px



Body



16px



Small



14px



Caption



12px



Use a maximum of 5 text sizes on any screen.



\---



\# Line Height



Display



110%



Headings



120%



Body



160%



Small



150%



\---



\# Font Weights



Regular



400



Medium



500



Semibold



600



Avoid Bold (700+) unless absolutely necessary.



\---



\# Text Width



Long paragraphs should never exceed:



60 characters per line.



Keep copy easy to read.



\---



\# Border Radius



Standard



16px



Small components



12px



Pills



999px



\---



\# Borders



Standard border:



1px



Color:



\#DDD6C8



Avoid thick borders.



\---



\# Shadows



Cards



Very subtle.



Buttons



None.



Dialogs



Small shadow only.



Never use large floating shadows.



\---



\# Buttons



Primary Height



52px



Border Radius



16px



Horizontal Padding



24px



Icon Gap



8px



Only one primary button per screen.



Secondary buttons should use ghost or text styles.



\---



\# Inputs



Height



56px



Radius



16px



Padding



16px



Font



16px



Always large enough for comfortable touch interaction.



\---



\# Textareas



Minimum Height



160px



Padding



16px



Radius



16px



No resize handle.



\---



\# Cards



Padding



24px



Radius



16px



Border



1px



Avoid nested cards.



Cards exist only to improve readability.



\---



\# Icons



Library



Lucide



Size



18px



Large icons



24px



Stroke



Default



Never mix icon styles.



\---



\# Lists



Vertical spacing



16px



Section spacing



32px



Never cram content.



\---



\# Navigation



Bottom Navigation Height



72px



Top Bar Height



64px



Icons centered.



Avoid more than 5 navigation items.



\---



\# Forms



Label spacing



8px



Field spacing



16px



Section spacing



32px



Buttons always aligned consistently.



\---



\# Motion



Duration



220–280ms



Curve



ease-out



Allowed animations



\- Fade

\- Small Slide

\- Scale 98% → 100% (dialogs only)



Forbidden



Bounce



Elastic



Spin



Large movement



Parallax



\---



\# Loading



Skeletons preferred over spinners.



If loading exceeds 800ms:



Show skeleton.



If loading exceeds 3 seconds:



Show helpful message.



\---



\# Empty States



Every empty state should contain:



\- Simple illustration or icon

\- One clear sentence

\- Optional explanation

\- One primary action



Never blame the user.



\---



\# Error States



Explain:



\- What happened

\- What the user can do next



Never use technical language.



Bad



Something went wrong.



Good



We couldn't save your season.

Please try again.



\---



\# Accessibility



Minimum touch target



44×44



Minimum text size



16px



Visible focus ring



Required



Keyboard navigation



Required



Reduced motion



Required



Color cannot be the only indicator.



\---



\# Component Rules



Every component must:



\- Have a single responsibility.

\- Be reusable.

\- Accept variants instead of duplication.

\- Use semantic HTML.

\- Support dark mode in the future.

\- Avoid inline styles.

\- Avoid hardcoded colors.

\- Use design tokens.



\---



\# Responsive Rules



Always design mobile first.



Then tablet.



Then desktop.



Desktop should not simply stretch mobile layouts.



Whitespace should increase with screen size.



\---



\# AI Implementation Rules



Before implementing any screen:



1\. Read design-language.md

2\. Read ui-rules.md

3\. Reuse existing components.

4\. Never duplicate an existing component.

5\. Prefer extending over rewriting.

6\. Maintain visual consistency.

7\. If a requested design breaks these rules, explain why before implementing.



\---



\# Definition of Done



A screen is complete only if:



✓ Matches the design language.

✓ Uses design tokens.

✓ Follows spacing rules.

✓ Is keyboard accessible.

✓ Supports reduced motion.

✓ Passes lint.

✓ Passes typecheck.

✓ Passes tests.

✓ Looks visually consistent with every existing screen.

✓ Introduces no duplicate components.



If any of these fail, the screen is not considered finished.

