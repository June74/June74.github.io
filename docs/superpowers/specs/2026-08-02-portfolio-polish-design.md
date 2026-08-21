# Portfolio hero and diagram polish design

- Status: approved by owner for implementation on 2026-08-02
- Owner: Injun Lee
- Date: 2026-08-02
- Supersedes: only the affected hero typography and June task-sequence details in `2026-08-01-personal-work-showcase-design.md`

## 1. Purpose and scope

This revision brings three details of the published portfolio back in line with the approved preview and owner feedback:

1. Give the owner's name a distinct, compact typographic voice without the phrase “I am.”
2. Make Synapse's router box visually consistent with the other outlined diagram nodes.
3. Make every June task enter unchecked and complete sequentially when the project animation starts.

The page structure, project copy, three-color palette, orbital visual, project disclosure interaction, hosting architecture, public-information boundary, and outbound destinations do not change.

## 2. Approved visual direction

### 2.1 Hero identity

The hero remains one semantic heading whose visual parts have separate roles:

- `Injun Lee.` is the personal signature. It uses the local humanist sans-serif stack at a compact size and confident weight, with tight but readable letter spacing.
- A short copper rule directly under the signature separates identity from thesis without adding another label.
- `I build AI systems` and `around people.` remain the two-line thesis in the existing editorial serif, but at a smaller responsive scale than the current release.
- The supporting paragraph, jump link, and orbital system remain unchanged.

The selected treatment is Option A from the 2026-08-02 visual comparison. It keeps the person visible while preventing the name and thesis from wrapping into an oversized five-line block at desktop widths.

### 2.2 Synapse router

The router rectangle uses the same light surface treatment as the prompt and model nodes, with a forest outline to preserve its importance. Its label uses dark forest/ink text and its subtitle uses the existing secondary text color. The router's dimensions, route paths, sequencing, and accessible description remain unchanged.

### 2.3 June tasks

All four task rows receive explicit sequence classes. When June enters the `is-animating` state:

- every task marker first appears as an empty outlined circle;
- task markers complete one at a time in document order;
- the third and fourth markers no longer appear completed before the animation begins;
- completion timing follows the calendar-event sequence and does not start two task completions simultaneously.

Outside the active animation state, the informative final frame shows all four markers completed. With `prefers-reduced-motion: reduce`, all four markers immediately show that same completed final state.

## 3. Implementation boundaries

The revision stays dependency-free and static.

- `site/index.html` receives only the hero name/thesis classes and the missing June task sequence classes.
- `site/styles.css` receives the approved hero type treatment, outlined router colors, four-step task sequence, responsive sizing, and four-task reduced-motion final state.
- `site/script.js` should not change because the existing open, close, hover, focus, tap, and animation-restart behavior already supplies the required replay boundary.
- `tests/site.test.mjs` gains focused contracts for the approved hero copy/classes, router surface treatment, all four task states/timings, and reduced-motion completion.

No remote fonts, images, scripts, dependencies, analytics, form handling, storage, or new network requests are introduced.

## 4. State and error behavior

The site has no runtime data or network-dependent UI. If JavaScript is unavailable, native `details` elements remain usable and the diagrams show their final informative states. If animation is disabled or reduced, the router remains legible and all June tasks appear completed rather than blank or partially sequenced.

## 5. Accessibility and responsive requirements

- The complete hero heading remains exposed as “Injun Lee. I build AI systems around people.”
- The name's smaller treatment must remain legible without relying on color alone; the typeface, weight, spacing, and rule establish the distinction.
- Router label contrast must remain readable against the light node surface.
- The hero must not overflow from 320 px through 1440 px, and the name and thesis must retain their hierarchy when the two-column hero stacks.
- Existing focus, keyboard, touch, no-JavaScript, and project disclosure behavior must remain unchanged.
- Reduced-motion mode must expose the same information as the animated final frame.

## 6. Verification plan

### Automated red-green checks

1. Add a failing hero contract that requires `Injun Lee.` without “I am,” separate name/thesis classes, and the smaller approved type treatment.
2. Add a failing router contract that rejects the filled forest box and requires the approved light fill, forest outline, and dark labels.
3. Add a failing June contract that requires four explicit task classes, four distinct completion delays, and all four tasks in the reduced-motion final-state rule.
4. Run each focused test and confirm it fails for the missing behavior before changing production files.
5. Apply the smallest HTML/CSS changes, then run the focused selection and full suite.

### Browser acceptance

- Inspect the hero at desktop, tablet, and narrow mobile widths for fit, hierarchy, and overflow.
- Open June from a collapsed state and confirm all four markers start empty, then complete one-by-one.
- Close and reopen June and confirm the sequence restarts once.
- Open Synapse and confirm the router is a light outlined node while all routes still draw in order.
- Verify keyboard disclosure behavior, reduced-motion final states, and zero console errors.

## 7. Acceptance criteria

1. The hero reads `Injun Lee. I build AI systems around people.` and contains no “I am” phrase.
2. `Injun Lee.` is visually distinct in a compact humanist sans-serif treatment with a short copper rule.
3. The serif thesis is smaller than the current release and fits the approved desktop hero composition without oversized wrapping.
4. Synapse's router uses a light fill, visible forest outline, and readable dark text.
5. All four June task markers begin empty during animation and complete sequentially with unique start times.
6. Reopening June restarts the sequence, while reduced-motion and no-animation states show the completed final frame.
7. The full automated suite, syntax checks, static security checks, and real browser acceptance pass without a new dependency or external request.

## 8. Rollback

Revert the revision commit to restore the current merged hero, router fill, and two-task sequence. No schema, stored data, external service, or irreversible migration is involved.
