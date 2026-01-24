# Quick View Modal - Design System & Implementation Plan

## Overview

This document outlines the design system, component architecture, and implementation plan for the Shopify Quick View Modal challenge. The design takes inspiration from modern e-commerce patterns and references sites like [neon.com](https://neon.com/) for effective grid usage.

---

## Table of Contents

1. [Technology Decisions](#technology-decisions)
2. [Design System](#design-system)
3. [Grid System](#grid-system)
4. [Spacing System](#spacing-system)
5. [Typography Scale](#typography-scale)
6. [Color System](#color-system)
7. [Component Architecture](#component-architecture)
8. [Animation Specifications](#animation-specifications)
9. [Implementation Checklist](#implementation-checklist)

---

## Technology Decisions

### Why NOT Hydrogen React?

| Factor          | Decision                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| Scope           | Single feature (Quick View modal), not a full storefront                        |
| API Client      | Already have `@shopify/storefront-api-client` - sufficient for Storefront API |
| Complexity      | Hydrogen adds cart/checkout/session management - overkill for this challenge    |
| Bundle Size     | Minimal dependencies = faster load times                                        |
| Time Constraint | 6 hours - Hydrogen learning curve is unnecessary                                |

### Current Stack (Keep As-Is)

- **Next.js 16** - App Router with React Server Components
- **React 19** - Latest features including `use cache`
- **Tailwind v4** - New `@theme` syntax for design tokens
- **Motion** - Animation library (formerly Framer Motion)
- **@shopify/storefront-api-client** - Official Storefront API client
- **TypeScript** - Strict typing for Shopify data models
- **Zod** - Runtime validation for API responses

---

## Design System

### Design Principles

1. **Hierarchy First** - Clear visual hierarchy guides the user through product information
2. **Breathing Room** - Generous whitespace makes content digestible
3. **Motion with Purpose** - Animations enhance UX, not distract
4. **Accessibility by Default** - WCAG 2.1 AA compliance
5. **Mobile-First** - Design for mobile, enhance for desktop

---

## Grid System

### 12-Column Grid (Desktop)

Reference: neon.com uses a clean 12-column grid with max-width containers.

```
Desktop (≥1024px):
┌──────────────────────────────────────────────────────────────────────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │
└──────────────────────────────────────────────────────────────────────┘
     └─────────────────┘     └─────────────────────────────┘
          6 columns                    6 columns
       (Product Image)              (Product Details)
```

### Tailwind v4 Grid Configuration

```css
/* globals.css - Grid utilities */
@theme inline {
  /* Grid columns */
  --grid-cols-12: repeat(12, minmax(0, 1fr));
  --grid-cols-8: repeat(8, minmax(0, 1fr));
  --grid-cols-4: repeat(4, minmax(0, 1fr));

  /* Container max-widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;

  /* Grid gap aligned with 8-point system */
  --grid-gap-sm: 16px;   /* 2 units */
  --grid-gap-md: 24px;   /* 3 units */
  --grid-gap-lg: 32px;   /* 4 units */
}
```

### Responsive Breakpoints

| Breakpoint  | Width          | Grid Columns | Modal Layout |
| ----------- | -------------- | ------------ | ------------ |
| `mobile`  | < 640px        | 4 columns    | Stacked      |
| `tablet`  | 640px - 1023px | 8 columns    | Stacked      |
| `desktop` | ≥ 1024px      | 12 columns   | Two-column   |

### Modal Grid Layout

```
DESKTOP (≥1024px) - Two Column:
┌────────────────────────────────────────────────────────────┐
│  [×]                                                        │
├─────────────────────────┬──────────────────────────────────┤
│                         │  Product Title                    │
│                         │  $XX.XX                          │
│    [Product Image]      │                                  │
│                         │  [Size: S] [M] [L] [XL]          │
│    ○ ○ ○ ● ○            │  [Color: Black] [White]          │
│    (thumbnails)         │                                  │
│                         │  [══════ Add to Bag ══════]      │
└─────────────────────────┴──────────────────────────────────┘
      span-6 (50%)              span-6 (50%)

MOBILE (<640px) - Stacked:
┌──────────────────────────┐
│  [×]                     │
├──────────────────────────┤
│                          │
│    [Product Image]       │
│    ○ ○ ○ ● ○             │
│                          │
├──────────────────────────┤
│  Product Title           │
│  $XX.XX                  │
│                          │
│  [Size: S] [M] [L] [XL]  │
│  [Color: Black] [White]  │
│                          │
├──────────────────────────┤
│  [══════ Add to Bag ═══] │  ← Sticky on mobile
└──────────────────────────┘
```

---

## Spacing System

### 8-Point Grid

All spacing values are multiples of 8px for visual consistency.

| Token       | Value | Usage                                   |
| ----------- | ----- | --------------------------------------- |
| `space-1` | 8px   | Tight spacing (icon gaps, pill padding) |
| `space-2` | 16px  | Component internal padding              |
| `space-3` | 24px  | Section spacing                         |
| `space-4` | 32px  | Major section breaks                    |
| `space-5` | 40px  | Page-level spacing                      |
| `space-6` | 48px  | Large gaps                              |
| `space-8` | 64px  | Hero/modal padding                      |

### Tailwind v4 Spacing Configuration

```css
@theme inline {
  /* 8-point spacing scale */
  --spacing-1: 8px;
  --spacing-2: 16px;
  --spacing-3: 24px;
  --spacing-4: 32px;
  --spacing-5: 40px;
  --spacing-6: 48px;
  --spacing-8: 64px;
  --spacing-10: 80px;
  --spacing-12: 96px;
}
```

### Component Spacing Guidelines

| Component          | Padding                        | Gap  |
| ------------------ | ------------------------------ | ---- |
| Modal container    | 32px (mobile: 24px)            | -    |
| Product card       | 16px                           | -    |
| Option pills group | -                              | 8px  |
| Button internal    | 16px horizontal, 12px vertical | -    |
| Form sections      | -                              | 24px |

---

## Typography Scale

### Type Scale (Based on Major Third - 1.25 ratio)

| Token         | Size | Line Height | Weight | Usage            |
| ------------- | ---- | ----------- | ------ | ---------------- |
| `text-xs`   | 12px | 16px        | 400    | Captions, labels |
| `text-sm`   | 14px | 20px        | 400    | Body small, meta |
| `text-base` | 16px | 24px        | 400    | Body text        |
| `text-lg`   | 18px | 28px        | 500    | Subheadings      |
| `text-xl`   | 20px | 28px        | 600    | Card titles      |
| `text-2xl`  | 24px | 32px        | 600    | Section titles   |
| `text-3xl`  | 30px | 36px        | 700    | Modal title      |
| `text-4xl`  | 36px | 40px        | 700    | Hero titles      |

### Tailwind v4 Typography Configuration

```css
@theme inline {
  /* Font families */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### Typography Usage

```
Modal Title:       text-2xl lg:text-3xl font-semibold tracking-tight
Product Title:     text-xl font-semibold
Price:             text-2xl font-bold
Compare Price:     text-lg text-muted line-through
Option Label:      text-sm font-medium uppercase tracking-wide
Option Value:      text-sm font-medium
Button:            text-base font-semibold
```

---

## Color System

### Color Palette

```css
@theme inline {
  /* Neutral scale */
  --color-white: #ffffff;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-300: #d4d4d8;
  --color-gray-400: #a1a1aa;
  --color-gray-500: #71717a;
  --color-gray-600: #52525b;
  --color-gray-700: #3f3f46;
  --color-gray-800: #27272a;
  --color-gray-900: #18181b;
  --color-gray-950: #09090b;
  --color-black: #000000;

  /* Semantic colors */
  --color-primary: #18181b;           /* CTA buttons */
  --color-primary-hover: #27272a;
  --color-secondary: #f4f4f5;         /* Secondary buttons */
  --color-secondary-hover: #e4e4e7;
  --color-success: #22c55e;           /* Added to bag state */
  --color-error: #ef4444;             /* Error states */
  --color-muted: #71717a;             /* Muted text */

  /* Backdrop */
  --color-backdrop: rgba(0, 0, 0, 0.6);
  --color-backdrop-blur: rgba(0, 0, 0, 0.4);
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #09090b;
    --color-foreground: #fafafa;
    --color-primary: #fafafa;
    --color-primary-hover: #e4e4e7;
    --color-secondary: #27272a;
    --color-secondary-hover: #3f3f46;
    --color-muted: #a1a1aa;
  }
}
```

---

## Component Architecture

### Component Hierarchy

```
app/
├── page.tsx                      # Product listing page
├── components/
│   ├── ProductGrid.tsx           # Grid container for product cards
│   ├── ProductCard.tsx           # Individual product card
│   ├── QuickViewModal/
│   │   ├── index.tsx             # Modal container + portal
│   │   ├── ModalBackdrop.tsx     # Animated backdrop
│   │   ├── ModalContent.tsx      # Main modal layout
│   │   ├── ProductMedia.tsx      # Image gallery + thumbnails
│   │   ├── ProductInfo.tsx       # Title, price, description
│   │   ├── VariantSelector.tsx   # Option pills/controls
│   │   ├── AddToBagButton.tsx    # CTA with states
│   │   └── LoadingSkeleton.tsx   # Skeleton state
│   └── ui/
│       ├── Button.tsx            # Reusable button component
│       ├── Pill.tsx              # Option pill component
│       └── Skeleton.tsx          # Skeleton primitive
├── hooks/
│   ├── useProduct.ts             # Product data fetching
│   ├── useVariantSelection.ts    # Variant state management
│   ├── useFocusTrap.ts           # Focus management
│   └── useScrollLock.ts          # Body scroll lock
├── lib/
│   └── shopify/
│       ├── queries/
│       │   ├── getCollection.ts  # Collection products query
│       │   └── getProduct.ts     # Single product query
│       └── types/
│           ├── product.ts        # Product TypeScript types
│           └── variant.ts        # Variant TypeScript types
└── utils/
    ├── formatPrice.ts            # Price formatting
    └── resolveVariant.ts         # Variant resolution logic
```

### State Management

```typescript
// Variant Selection State
interface VariantSelectionState {
  selectedOptions: Record<string, string>;  // { "Size": "M", "Color": "Black" }
  resolvedVariant: ProductVariant | null;
  availableOptions: AvailableOptions;       // Which options are valid given current selection
}

// Modal State
interface QuickViewState {
  isOpen: boolean;
  productHandle: string | null;
  isLoading: boolean;
  product: Product | null;
}

// Add to Bag State
type AddToBagStatus = 'idle' | 'loading' | 'success' | 'error';
```

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Product Card   │────▶│  Quick View     │────▶│  Modal Content  │
│  (SSR)          │     │  Trigger        │     │  (CSR fetch)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                        │
                              ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  Modal State    │     │  Variant State  │
                        │  (open/close)   │     │  (selection)    │
                        └─────────────────┘     └─────────────────┘
```

---

## Animation Specifications

### Motion Library Usage

Using `motion` (formerly Framer Motion) for all animations.

### Backdrop Animation

```typescript
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};
```

### Modal Entrance/Exit

```typescript
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] // Custom spring-like easing
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};
```

### Microinteractions

#### 1. Option Pill Selection

```typescript
// Layout animation for selected indicator
<motion.div
  layoutId="selected-option-indicator"
  className="absolute inset-0 bg-primary rounded-full"
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
/>
```

#### 2. Add to Bag Button States

```typescript
const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  loading: { scale: 1 },
  success: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.3 }
  }
};

// Icon transition (loading → check)
<AnimatePresence mode="wait">
  {status === 'loading' && (
    <motion.div
      key="spinner"
      initial={{ opacity: 0, rotate: 0 }}
      animate={{ opacity: 1, rotate: 360 }}
      exit={{ opacity: 0 }}
      transition={{ rotate: { repeat: Infinity, duration: 1 } }}
    >
      <Spinner />
    </motion.div>
  )}
  {status === 'success' && (
    <motion.div
      key="check"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500 }}
    >
      <Check />
    </motion.div>
  )}
</AnimatePresence>
```

#### 3. Image Crossfade

```typescript
<AnimatePresence mode="wait">
  <motion.img
    key={currentImage.id}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    src={currentImage.url}
  />
</AnimatePresence>
```

### Animation Timing Reference

| Animation        | Duration | Easing                        |
| ---------------- | -------- | ----------------------------- |
| Backdrop fade    | 200ms    | ease-out                      |
| Modal entrance   | 300ms    | cubic-bezier(0.16, 1, 0.3, 1) |
| Modal exit       | 200ms    | ease-in                       |
| Option indicator | spring   | stiffness: 500, damping: 30   |
| Button hover     | 150ms    | ease-out                      |
| Button tap       | 100ms    | ease-out                      |
| Image crossfade  | 200ms    | ease-in-out                   |
| Loading spinner  | 1000ms   | linear (infinite)             |
| Success pulse    | 300ms    | ease-out                      |

### Reduced Motion Support

```typescript
const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// Usage
<motion.div
  variants={prefersReducedMotion ? reducedMotionVariants : modalVariants}
/>
```

---

## Implementation Checklist

### Phase 1: Foundation (Setup & Data Layer)

- [X] Set up Tailwind v4 design tokens in `globals.css`
- [X] Create GraphQL query for collection products
- [X] Create GraphQL query for single product details
- [X] Generate TypeScript types with `pnpm codegen`
- [X] Create Zod schemas for runtime validation
- [X] Set up product type interfaces (no `any`)

### Phase 2: Product Listing

- [X] Create `ProductGrid` component with 12-column grid
- [X] Create `ProductCard` component
  - [X] Product image with aspect ratio
  - [X] Title truncation
  - [X] Price display (with compare-at)
  - [X] Quick View trigger button
- [X] Implement responsive grid (4-col mobile, 8-col tablet, 12-col desktop)
- [X] Server-side render product listing from collection

### Phase 3: Modal Infrastructure

- [X] Create modal portal component
- [X] Implement `useScrollLock` hook
- [X] Implement `useFocusTrap` hook
- [X] Create `ModalBackdrop` with fade animation
- [X] Create `ModalContent` container
- [X] Implement close handlers:
  - [X] Close button
  - [X] Backdrop click
  - [X] Escape key
- [X] Focus management (trap focus, return on close)

### Phase 4: Modal Content

- [X] Create `LoadingSkeleton` component
- [X] Create `ProductMedia` component
  - [X] Main image display
- [X] Thumbnail gallery (optional)
  - [X] Image crossfade animation
- [X] Create `ProductInfo` component
  - [X] Title with typography
  - [X] Price display (updates with variant)
- [X] Implement responsive layout:
  - [X] Desktop: two-column (image left, content right)
  - [X] Mobile: stacked (image top, content bottom)

### Phase 5: Variant Selection

- [X] Create `VariantSelector` component
- [X] Create `Pill` component for option values
- [X] Implement `useVariantSelection` hook
  - [X] `selectedOptions` state
  - [X] Variant resolution logic
  - [X] Available options calculation
- [X] Disable unavailable options
- [X] Update price on variant change
- [X] Update image on variant change
- [ ] Animated selection indicator

### Phase 6: Add to Bag CTA

- [X] Create `AddToBagButton` component
- [X] Implement state machine: idle → loading → success
- [X] Disable until valid variant selected
- [X] Loading state (spinner + "Adding...")
- [X] Success state (check + "Added!")
- [X] Auto-reset after 1.5s
- [X] Button press animation

### Phase 7: Polish & Accessibility

- [X] Add `role="dialog"` and `aria-modal="true"`
- [X] Add `aria-labelledby` for modal title
- [ ] Test keyboard navigation
- [X] Add reduced motion support
- [ ] Test responsive breakpoints
- [ ] Cross-browser testing
- [ ] Performance audit (bundle size, FCP, LCP)

### Phase 8: Optional Enhancements (Time Permitting)

- [ ] Prefetch product data on hover
- [ ] Route-based modal (`/products/[handle]`)
- [ ] Shared element transition (card → modal image)
- [ ] Sticky mobile CTA bar
- [ ] Arrow key navigation for options

---

## CSS Utility Classes

### Recommended `@apply` Classes

```css
/* globals.css */

/* Grid utilities */
.grid-container {
  @apply mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8;
}

.grid-12 {
  @apply grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-6;
}

/* Card utilities */
.product-card {
  @apply group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden;
  @apply border border-gray-200 dark:border-gray-800;
  @apply hover:border-gray-300 dark:hover:border-gray-700;
  @apply transition-colors duration-200;
}

/* Button utilities */
.btn-primary {
  @apply inline-flex items-center justify-center gap-2;
  @apply px-6 py-3 rounded-full;
  @apply bg-gray-900 text-white dark:bg-white dark:text-gray-900;
  @apply font-semibold text-base;
  @apply hover:bg-gray-800 dark:hover:bg-gray-100;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors duration-150;
}

.btn-secondary {
  @apply inline-flex items-center justify-center gap-2;
  @apply px-6 py-3 rounded-full;
  @apply bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white;
  @apply font-semibold text-base;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
  @apply transition-colors duration-150;
}

/* Option pill */
.option-pill {
  @apply relative px-4 py-2 rounded-full;
  @apply text-sm font-medium;
  @apply border border-gray-300 dark:border-gray-600;
  @apply hover:border-gray-400 dark:hover:border-gray-500;
  @apply transition-colors duration-150;
  @apply cursor-pointer select-none;
}

.option-pill-selected {
  @apply border-gray-900 dark:border-white;
  @apply bg-gray-900 text-white dark:bg-white dark:text-gray-900;
}

.option-pill-disabled {
  @apply opacity-40 cursor-not-allowed;
  @apply line-through;
}

/* Modal utilities */
.modal-backdrop {
  @apply fixed inset-0 z-50;
  @apply bg-black/60 backdrop-blur-sm;
}

.modal-container {
  @apply fixed inset-0 z-50;
  @apply flex items-center justify-center;
  @apply p-4;
}

.modal-content {
  @apply relative w-full max-w-4xl max-h-[90vh];
  @apply bg-white dark:bg-gray-900;
  @apply rounded-2xl shadow-2xl;
  @apply overflow-hidden;
}

/* Skeleton */
.skeleton {
  @apply animate-pulse bg-gray-200 dark:bg-gray-800 rounded;
}
```

---

## File Structure Summary

```
app/
├── globals.css              # Tailwind v4 + design tokens + utility classes
├── layout.tsx               # Root layout with Inter font
├── page.tsx                 # Product listing (SSR)
├── loading.tsx              # Loading state
├── components/
│   ├── ProductGrid.tsx
│   ├── ProductCard.tsx
│   ├── QuickViewModal/
│   │   ├── index.tsx
│   │   ├── ModalBackdrop.tsx
│   │   ├── ModalContent.tsx
│   │   ├── ProductMedia.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── AddToBagButton.tsx
│   │   └── LoadingSkeleton.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Pill.tsx
│       └── Skeleton.tsx
├── hooks/
│   ├── useProduct.ts
│   ├── useVariantSelection.ts
│   ├── useFocusTrap.ts
│   └── useScrollLock.ts
lib/
├── shopify/
│   ├── graphql/
│   │   ├── query.ts          # Existing
│   │   ├── getCollection.ts  # New
│   │   └── getProduct.ts     # New
│   ├── serverClient.tsx      # Existing
│   └── types.ts              # TypeScript types
└── utils/
    ├── formatPrice.ts
    └── resolveVariant.ts
```

---

## References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Motion Documentation](https://motion.dev/)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [neon.com](https://neon.com/) - Grid system reference
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Last updated: January 23, 2026*
