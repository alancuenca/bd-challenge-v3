# Bryt Designs Tech Challenge

### The design is in the DESIGN.md file

### What I would have done with more time:
- Refine styles for horizontal view on mobile
- Add swipe to navigate through the gallery
- Reduce layout shift when loading from skeleton to product
- think more deeply about the UX/UI of the preview cards
- 
<img width="1156" height="877" alt="Screenshot 2026-01-24 at 12 40 05 AM" src="https://github.com/user-attachments/assets/ab515674-38d4-49d9-b6ae-6d40957d88ff" />
-
<img width="1073" height="839" alt="Screenshot 2026-01-24 at 12 38 23 AM" src="https://github.com/user-attachments/assets/3c034b3a-6c89-4593-a81c-982e94e59a41" />
-
<img width="1156" height="877" alt="Screenshot 2026-01-24 at 12 38 36 AM" src="https://github.com/user-attachments/assets/5c453e8b-cdeb-459b-9edd-7c8ee58e1940" />
-

### Shopify Quick View Modal (Headless UI Feature)

### Hello fellow candidate! 👋

Thanks for taking the time to work through this Bryt Designs challenge — we’re excited to see what you build! 😄

Today’s challenge is to build a **single, high-fidelity storefront feature** using **Next.js (React)**, **TypeScript**, **TailwindCSS**, **Motion**, and Shopify’s **Storefront GraphQL API**.

This is intentionally **design- and animation-forward**. We care a lot about visual polish, interaction details, and thoughtful UI states—while still seeing how you model React state and integrate real Shopify data.

---

## Why a Quick View Modal?

A Quick View modal is one of the best “small but deep” features in modern commerce UI:

- It requires real product/variant data modeling (Storefront API + GraphQL)
- It forces careful component design (layout, hierarchy, accessibility)
- It reveals attention to detail via states (loading, disabled, success)
- It’s an ideal place to demonstrate tasteful animation via Motion

---

## What’s the goal of this challenge? ⚽

We want to understand your abilities by measuring:

- **Design quality** (layout, spacing, typography, responsiveness)
- **Animation quality** (Motion transitions, microinteractions, cohesion)
- **React problem-solving** (state modeling, derived state, UI correctness)
- **Shopify knowledge** (Storefront API queries, product/variant logic)
- **Code clarity** (TypeScript usage, structure, readability)

---

## What’s the process like?

- You will have **6 hours** from when you receive this challenge to complete and submit your project.
- Please complete it to the best of your ability within the time you choose.
- Submit your repo via email when finished.
- Include notes in your README about tradeoffs and what you’d do next with more time.

We’re not expecting a full storefront—**just one polished feature**.

---

# Project Requirements

### Required tools

1. **Node (LTS)**
2. **PNPM** (we use this as our only Node package manager)
3. A Shopify store we provide access to (Storefront token + collection handle)
   - We will provide:
     - `SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN`
     - `NEXT_PUBLIC_SHOPIFY_STORE_NAME`
     - `NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION`

### Required technologies (must be used)

- Next.js (React)
- TypeScript
- TailwindCSS
- Motion
- Shopify Storefront GraphQL API

**Please feel free to use other libraries if needed, but try to keep usage minimal. You may use a Headless component library, however, you will be disqualified if you use any ui component library (Material UI, Shadcn, ...etc).**

## Challenge Goals

### Required (Must Have)

- [X] Fetch and render a minimal product listing from the provided Shopify **collection handle** (Storefront API).
- [X] Each product card includes at least: image, title, price, and a **Quick View** trigger.
- [X] Clicking **Quick View** opens a **modal** (not a drawer).
- [X] Modal can be closed via:
  - [X] Close button
  - [X] Backdrop click
  - [X] `Escape` key
- [X] Background scroll is locked while the modal is open.
- [X] Basic focus management:
  - [X] Focus moves into the modal on open
  - [X] Focus returns to the triggering element on close
- [X] Product details shown inside the modal are fetched from Shopify’s **Storefront API** (GraphQL).
- [X] Modal includes a designed **loading skeleton state** while product details are loading.
- [X] Modal layout:
  - [X] Desktop: two-column layout (media left, content right)
  - [X] Mobile: stacked layout (media top, content bottom)
- [X] Variant selection UI:
  - [X] Render product options (e.g., Size/Color) as designed controls (pills/segmented preferred)
  - [X] Maintain `selectedOptions` state (option-name → value)
  - [X] Resolve the selected variant from `selectedOptions`
  - [X] Disable unavailable/invalid option values based on current partial selection
  - [X] Update displayed **price** when the resolved variant changes
  - [X] Update displayed **image** when the resolved variant changes (variant image preferred; fallback allowed)
- [X] Primary CTA: **Add to bag (simulation only)**:
  - [X] CTA disabled until a valid, available variant is selected
  - [X] On click, simulate async add with a deterministic delay (~800–1200ms)
  - [X] CTA transitions to a success state (e.g., “Added” + check)
  - [X] After ~1–2 seconds, reset to idle **or** close the modal (choose one and be consistent)
- [X] **Motion** requirements:
  - [X] Backdrop fade in/out
  - [X] Modal entrance/exit animation
  - [X] At least one microinteraction animation (examples below are acceptable):
    - [X] Animated selected option indicator
    - [X] Button loading → success transition
    - [X] Image crossfade when variant changes
    - [X] Subtle press feedback on CTA
- [X] TypeScript requirements:
  - [X] No `any` for the core Shopify response shapes used in the modal (product, variants, options, prices)

---

### Optional (Nice to Have / Extra Credit)

- [ ] Shared element transition: product card image → modal hero image.
- [ ] Prefetch product detail data on product hover/focus to reduce perceived modal load time.
- [ ] Route-based modal:
  - [ ] Opening Quick View updates the URL (e.g., `/products/[handle]`)
  - [ ] Closing returns to the previous route without a full page reload
- [X] Focus trap + full accessible modal semantics (`role="dialog"`, `aria-modal="true"`, labelled title).
- [X] Sticky mobile CTA bar (improves usability on small screens).
- [ ] Keyboard enhancements:
  - [ ] Arrow-key navigation through option values
  - [ ] Enter/Space activation on option controls
- [X] Refined state handling:
  - [X] Abort/cancel in-flight product fetch on rapid modal switching
  - [ ] Avoid UI flicker when switching products (keep previous content until new content is ready)
- [X] UI polish extras:
  - [X] Thumbnail gallery with animated selection states
  - [ ] Price/compare-at layout transitions using Motion layout animations
  - [X] Reduced motion support (`prefers-reduced-motion`)

---

## Getting Started

### .git

Make sure to delete the ".git" folder after cloning and create a new git repo! That way you can host the github repo on your git account. Thanks!

### Environment Variables

Create a `.env.local` file with:

```bash
# Private
SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN="shpat_********************************"

# Public
NEXT_PUBLIC_SHOPIFY_STORE_NAME="shop-name"
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION="2025-10"
```

### Commands

1. `pnpm dev` -> Start development server
2. `pnpm codegen` -> Generate storefront api types (`/lib/shopify/graphql`)
