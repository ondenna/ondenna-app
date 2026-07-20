\# Ondenna Component Philosophy



Version: 1.0



This document defines \*\*why\*\* each UI component exists, when it should be used, and when it should NOT be used.



Every new component should solve a real problem.



Components are tools, not decorations.



If a screen can be simpler, simplify it.



\---



\# Core Philosophy



Every component must reduce cognitive load.



The UI should guide the user without demanding attention.



The interface exists to support reflection, not productivity.



Before creating a component, ask:



> Does this help the user think?



If not, don't build it.



\---



\# General Rules



A component should:



\- Have one responsibility.

\- Be reusable.

\- Be predictable.

\- Feel invisible.

\- Never compete with the content.



Avoid components that exist only because "most apps have them."



\---



\# Buttons



Buttons represent commitment.



Every screen should have exactly one obvious next action.



Primary buttons represent irreversible or important progress.



Secondary buttons support navigation.



Never place two primary buttons together.



Never ask the user to decide between equally important actions.



\---



\# Cards



Cards exist only to improve readability.



Never use cards as decoration.



A card should group information that naturally belongs together.



If removing the border improves the screen, remove the border.



Whitespace is often a better separator than a card.



\---



\# Inputs



Inputs should disappear into the experience.



Large.



Comfortable.



Easy to scan.



Never ask for information that is unnecessary.



One question at a time is preferred over large forms.



\---



\# Textareas



Reflection deserves space.



If a user is expected to think before answering, use a textarea.



Never constrain thoughtful writing with tiny input boxes.



\---



\# Lists



Lists should be calm.



Never create walls of text.



Prefer generous spacing.



Every list item should feel tappable.



\---



\# Icons



Icons support text.



Icons never replace text.



If removing the icon keeps the interface understandable, remove it.



Decorative icons should be avoided.



\---



\# Navigation



Navigation should almost disappear.



The user should rarely think:



"Where do I go now?"



Current navigation:



Today



Seasons



Settings



Avoid expanding navigation unless absolutely necessary.



\---



\# Empty States



Empty states are opportunities.



They should reassure, not disappoint.



Every empty state should answer:



What is this?



Why is it empty?



What can I do next?



Avoid jokes.



Avoid illustrations that distract.



\---



\# Error Messages



Errors should reduce anxiety.



Never blame the user.



Never expose technical details.



Good error messages:



\- explain what happened

\- explain what to do next



\---



\# Success Messages



Success should be quiet.



Avoid celebrations.



Avoid confetti.



Avoid fireworks.



A subtle confirmation is enough.



Users came here to reflect, not to be rewarded.



\---



\# Notifications



Notifications should respect attention.



Never create urgency where none exists.



Good notification:



"Today's reflection is ready."



Bad notification:



"Don't break your streak!"



Ondenna has no streaks.



\---



\# Dialogs



Dialogs interrupt attention.



Only use them when the decision is important.



Examples:



Delete Season



Abandon Season



Sign Out



Do not use dialogs for ordinary navigation.



\---



\# Bottom Sheets



Use bottom sheets for lightweight choices.



Examples:



Choose reminder time



Select language



Choose theme (future)



Avoid full-screen modals unless the task requires concentration.



\---



\# Toasts



Toasts confirm small actions.



Examples:



Season saved.



Reminder updated.



Avoid long messages.



Avoid actions that disappear too quickly.



\---



\# Progress



Progress should reduce pressure.



Avoid percentages when possible.



Prefer:



Day 6 of 28



instead of



21%



The journey matters more than completion.



\---



\# Check-ins



Checking in should feel effortless.



The user should never feel judged.



Missing one day should not create guilt.



There are:



\- no streaks

\- no penalties

\- no shame



\---



\# Reflection



Reflection screens should slow the pace.



More whitespace.



Fewer distractions.



Larger text areas.



No unnecessary UI.



The answer matters more than the interface.



\---



\# Dashboard



The dashboard is not a control panel.



It is a daily companion.



Show only what matters today.



Hide everything else.



The user should never feel overwhelmed.



\---



\# Settings



Settings should be minimal.



Only expose controls the user genuinely needs.



Avoid long preference pages.



\---



\# Loading States



Loading should feel calm.



Prefer skeletons.



Avoid endless spinners.



If loading takes time, explain why.



\---



\# Animation



Animation exists to communicate.



Never to entertain.



The user should almost forget animations exist.



\---



\# Sound



No sounds by default.



Reflection should happen in silence.



\---



\# Haptics (Future Mobile Apps)



Use subtle haptics only for:



\- confirming actions

\- completing a season

\- destructive confirmations



Never vibrate for ordinary navigation.



\---



\# AI Implementation Rules



Before introducing a new component, always ask:



1\. Can an existing component solve this?

2\. Can this screen work without adding a component?

3\. Is this component helping the user focus?

4\. Does it increase cognitive load?

5\. Would Apple, Linear or Notion simplify this instead?



If the answer is "yes" to simplification,



simplify.



\---



\# Component Lifecycle



Every component must earn its place.



Create.



Evaluate.



Simplify.



Remove.



Deleting a component is considered a successful improvement if usability increases.



\---



\# Final Principle



The best component is often the one that never needed to exist.



Users should remember their reflection,



not the interface.

