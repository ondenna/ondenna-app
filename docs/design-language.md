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



Primary



\#0F2528



Background



\#F7F3EC



Accent



\#2E8C77



Surface



\#FFFFFF



Border



\#DDD6C8



Muted Text



\#9AA09A



Primary Text



\#0F2528



Secondary Text



\#686F72



Colors must never feel saturated.



Avoid bright blues, reds and neon colors.



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

