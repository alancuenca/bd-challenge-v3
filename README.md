# Bryt Designs Tech Challenge

A Quick View Modal implementation using Next.js, TypeScript, TailwindCSS, Motion, and Shopify's Storefront GraphQL API.

## Features

### Required Features ✅
- Product listing from Shopify Storefront API
- Quick View modal with close via button, backdrop, and Escape key
- Scroll lock while modal is open
- Focus management (trap focus, return on close)
- Loading skeleton state
- Responsive layout (desktop: two-column, mobile: stacked)
- Variant selection with disabled unavailable options
- Dynamic price and image updates on variant change
- Add to Bag with loading and success states
- Motion animations (backdrop fade, modal entrance/exit, image crossfade)
- Strict TypeScript with no `any` types
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

### Optional Features ✅
- **Route-based modal**: URL updates to `/?product=handle` for shareable links
- **Prefetch on hover**: Product data prefetched when hovering cards
- **Inline thumbnail gallery**: Switch images directly in the modal
- **Reduced motion support**: Respects `prefers-reduced-motion`

## Tradeoffs & Future Improvements

Given more time, I would:
- Add keyboard navigation (arrow keys) for variant options
- Implement shared element transitions (card → modal image)
- Add swipe gestures for mobile gallery navigation
- Improve loading state transitions to reduce layout shift

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with Server Components
- **TypeScript** (strict mode)
- **TailwindCSS v4** for styling
- **Motion** (Framer Motion) for animations
- **Shopify Storefront API** via GraphQL

## Getting Started

```bash
# Install dependencies
pnpm install

# Generate Shopify types
pnpm codegen

# Start development server
pnpm dev
```

## Environment Variables

Create `.env.local`:

```bash
SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN="shpat_..."
NEXT_PUBLIC_SHOPIFY_STORE_NAME="your-store"
NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION="2025-10"
```
