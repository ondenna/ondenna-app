\# Ondenna Design Language



Version: 1.0



This document defines the official design language of Ondenna.



Every new screen, component and interaction must follow these principles.



If any future implementation conflicts with this document, this document takes precedence.



\---



\# Core Philosophy



Ondenna is not a productivity app.



Ondenna is not a habit tracker.



Ondenna is a place to pause.



Every design decision should reduce cognitive load.



The interface should disappear and allow the user's thoughts to become the focus.



Users should feel calmer after using Ondenna than before opening it.



\---



\# Emotional Goals



The interface should feel:



\- Calm

\- Intentional

\- Premium

\- Quiet

\- Warm

\- Spacious

\- Trustworthy

\- Human



It should NEVER feel:



\- Gamified

\- Corporate

\- Busy

\- Loud

\- Competitive

\- Addictive

\- Social-media-like

\- Dashboard-heavy



\---



\# Visual Identity



Our visual direction is internally called:



\## Calm Nature



Keywords:



\- Soft

\- Organic

\- Natural

\- Elegant

\- Premium

\- Timeless



Visual references:



\- Early Apple Human Interface

\- Linear

\- Notion

\- Calm

\- Read.cv

\- Muji

\- Aesop

\- Kinfolk Magazine



The interface should feel like holding a beautifully printed journal.



\---



\# Color System



This is the complete semantic palette. Every colour in the product comes

from this table; there are no others.



Contrast ratios are measured against Background (\#F7F3EC) unless the row

says otherwise. "Safe for text" means the token clears WCAG AA (4.5:1) at

body size. A token that is not safe for text may still be used for fills,

borders, rings and other non-text UI, where 3:1 is the bar.



| Token | Value | Use it for | Never use it for | Safe for text | Contrast |
| --- | --- | --- | --- | --- | --- |
| Background | \#F7F3EC | The page canvas. Warm paper. | Raised surfaces; use Surface. | n/a | — |
| Surface | \#FFFFFF | Cards, sheets, dialogs — content that must separate from the page. | Full-page backgrounds. | n/a | 1.1:1 vs Background |
| Primary | \#0F2528 | The primary action's fill; the deepest text. | Large decorative areas. One primary action per screen. | Yes | 14.4:1 |
| Primary Foreground | \#F7F3EC | Text and icons on a Primary fill. | Anything not on Primary. | Yes | 14.4:1 on Primary |
| Accent | \#2E8C77 | Fills, borders, controls, focus rings, selected states. | Text of any size. Use Accent Strong. | **No** | 3.7:1 — meets 3:1 for UI only |
| Accent Strong | \#1F5A4B | Accent-coloured text; anywhere accent needs stronger contrast. | Large fills — it reads heavier than Accent. | Yes | 7.2:1; 8.0:1 under white |
| Accent Foreground | \#FFFFFF | Text on an Accent Strong fill. | Text on plain Accent (4.1:1 — fails AA). | Yes, on Accent Strong | 8.0:1 on Accent Strong |
| Border | \#DDD6C8 | Decorative 1px outlines: cards, chips, brand geometry. | Text. Thick borders. The boundary of an interactive control. | n/a | 1.3:1 — decorative |
| Control Border | \#94876D | The resting boundary of an input or textarea, where the border is the only thing identifying the control. | Decorative outlines — it is heavier than Border on purpose. | n/a | 3.2:1 — meets WCAG 1.4.11 |
| Divider | \#EAE4D8 | In-content separators. Quieter than Border. | Component outlines; use Border. | n/a | 1.1:1 — decorative |
| Text Primary | \#0F2528 | Headings and body copy. | — | Yes | 14.4:1 (AAA) |
| Text Secondary | \#686F72 | **All readable secondary text**: descriptions, supporting copy, form labels and help text, hints, metadata, navigation labels. | — | Yes | 4.6:1 (AA) |
| Muted | \#9AA09A | **Decorative only.** Ornament carrying no information. | Body copy, descriptions, labels, help text, validation, navigation, metadata, placeholders — anything a user must read. | **No** | 2.4:1 — fails AA at any size |
| Muted Surface | \#EFEAE0 | Quiet warm fills: hover states, subdued backgrounds. | Text. | n/a | 1.1:1 — decorative |
| Success | \#2F6B54 | Quiet confirmation. Always paired with words. | Celebration. Colour as the only signal. | Yes | 5.7:1 |
| Warning | \#7A5A1E | Something needs attention, calmly. | Manufactured urgency. | Yes | 5.7:1 |
| Danger | \#8C4032 | Destructive actions and their confirmations. | Ordinary errors, which are not the user's fault. | Yes | 6.6:1 |
| Disabled | \#EFE9DE | The surface of a disabled control. | Communicating "disabled" on its own. | n/a | 1.1:1 — decorative |
| Disabled Foreground | \#9AA09A | Text on a disabled control. | Enabled text of any kind. | No — intentionally | 2.2:1 on Disabled |
| Focus Ring | \#2E8C77 | The visible focus ring. Required on every interactive element. | Decoration. | n/a | 3.7:1 — meets 3:1 for UI |



Notes



Muted (\#9AA09A) and Text Secondary (\#686F72) are two different roles, not

two shades of one. Text Secondary is the readable tone and carries every

piece of supporting copy in the product. Muted is decorative and fails AA;

if the user has to read it, it is not Muted.



Accent (\#2E8C77) is a UI colour, not a text colour. It is deliberately kept

at its documented value for fills, borders, controls and focus treatments,

where 3.7:1 clears the 3:1 bar. Accent Strong exists for accent-coloured

text and anything else needing stronger contrast.



Under \`prefers-contrast: more\`, Text Secondary strengthens to \#4A5153

(7.3:1), Muted to \#686F72 (4.6:1, now AA), Border to \#A89C85 and Control

Border to \#6F6450 (5.3:1).



Never rely on colour alone. Success, Warning and Danger always appear with

words or an icon.



Colors must never feel saturated. Avoid bright blues, reds and neon colors.



\---



\# Typography



Headings



Instrument Serif



Body



Geist



Rules



Headings communicate emotion.



Body text communicates clarity.



Never overuse bold text.



Typography should create hierarchy before color does.



\---



\# Layout



Use an 8-point spacing system.



Allowed spacing:



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



Avoid arbitrary spacing values.



Whitespace is a feature.



Never fill empty space just because it exists.



\---



\# Border Radius



16px



Every interactive component shares the same radius unless there is a strong reason not to.



\---



\# Shadows



Keep shadows extremely subtle.



The interface should feel flat, not floating.



Prefer contrast through spacing rather than elevation.



\---



\# Motion



Animations exist to communicate state.



Never animate for decoration.



Standard transition:



220–280ms



Preferred movement:



Fade



Small vertical slide (20–24px)



Respect prefers-reduced-motion.



Brand exception: the splash screen



The splash screen is the one place that sits outside the 220–280ms band. It

is a brand moment on first paint, not a state transition: the mark fades in

over 1100ms and the screen is held for 2000ms before routing on.



This exception is deliberately narrow.



It has no CSS token, so it cannot be reused as a general duration. It lives

in \`src/design/tokens.ts\` as \`SPLASH\_FADE\_MS\` and \`SPLASH\_HOLD\_MS\`, named

so that it can never be mistaken for one.



Under \`prefers-reduced-motion\`, both collapse to zero. The fade becomes an

instant state change and the hold disappears entirely, so those users are

routed on immediately rather than made to wait through a decorative pause.

A splash is decoration; nobody should be held by it.



No other exception to the motion rules exists, and a new one requires

amending this document first.



\---



\# Icons



Lucide Icons only.



Outlined style.



Do not mix icon libraries.



\---



\# Buttons



One clear primary action per screen.



Primary buttons use the primary color.



Secondary buttons should feel lightweight.



Never place two competing primary buttons.



\---



\# Forms



Large touch targets.



Generous padding.



Minimal borders.



No unnecessary labels if placeholders and context are sufficient.



Validation should feel helpful, never punitive.



\---



\# Cards



Cards should exist only when they improve readability.



Avoid stacking multiple cards inside cards.



Prefer whitespace over borders.



\---



\# Content Style



Write like a thoughtful human.



Short sentences.



No motivational clichés.



No productivity jargon.



Avoid:



❌ Crush your goals



❌ Level up



❌ Stay productive



Prefer:



✓ One season.



✓ One intentional change.



✓ Begin when you're ready.



\---



\# Design Principles



Design should disappear.



Whitespace is a feature.



Every screen has one purpose.



Never use decoration without meaning.



Typography before color.



Motion should communicate.



Calm over excitement.



Clarity over density.



The app should feel lighter after every interaction.



If something can be removed, remove it.



\---



\# Accessibility



Minimum touch target:



44×44



Keyboard accessible.



Visible focus states.



High contrast.



Readable typography.



Reduced motion support.



Never rely on color alone.



\---



\# AI Instructions



Whenever an AI generates UI for Ondenna, it must first evaluate the design against this document.



If a proposed design conflicts with these principles, the AI should explain the conflict before writing code.



The AI should optimize for simplicity rather than feature quantity.



Never redesign working screens without a strong UX reason.



Small improvements are preferred over large redesigns.



\---



\# Official Visual Reference



The current "Calm Nature" onboarding mockup is the official visual reference for Ondenna.



Future screens should inherit its:



\- typography

\- spacing

\- color palette

\- button style

\- card style

\- iconography

\- overall emotional tone



The goal is consistency across the entire product rather than novelty.

