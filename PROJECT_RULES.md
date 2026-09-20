# Savee Admin — Project Rules

## 1. Project & Brand Identity

`Savee-Admin` is the internal operations & brand management portal for **Savee**.

**Brand Scope**:
Savee is a contemporary, curated women's fashion brand offering ethnic, fusion, western, and everyday chic styles.

**STRICT NON-MARKETPLACE RULE**:
- Savee is **NOT a marketplace**. Do NOT introduce seller, vendor, merchant onboarding, or commission concepts.
- Savee owns 100% of the catalog, designs, inventory, and fulfillment operations.
- The users of this application are internal brand team members: Merchandisers, Quality Inspectors, Storefront Content Managers, and Order Fulfillment Specialists.

---

## 2. Technology Stack

Approved stack:
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Design System**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Port**: `3001` (`http://localhost:3001`)

---

## 3. Operational Modules

1. **Executive Dashboard (`/`)**:
   - Real-time gross sales revenue in ₹, active fulfillment counts, AOV, low stock alerts, and recent orders.
2. **Orders & Fulfillment (`/orders`)**:
   - Order pipeline: `PLACED` → `CONFIRMED` → `HANDCRAFTING` → `DISPATCHED` → `DELIVERED`
   - Delhivery AWB number entry and milestone notes synchronization.
   - Slide-out order inspection drawer.
3. **Catalog & Inventory Control (`/inventory`)**:
   - 126+ styles across ethnic and contemporary categories.
   - Inline quick stock editor for variant sizes (`Free Size`, `S`, `M`, `L`, `XL`).
4. **Promotions & Privilege Codes (`/coupons`)**:
   - Percentage and flat rupee discounts, active toggles, and creation modal.
5. **Review Moderation & Patron Directory (`/reviews`, `/customers`)**:
   - Moderate real customer ratings and reviews (Approve / Hide).
   - Lifetime customer spend and order frequency tracking.
6. **Storefront CMS & Marketing Hub (`/storefront`, `/subscribers`)**:
   - Feature flags (e.g. Concierge On/Off toggle).
   - Dynamic announcement bar editor.
   - Hero billboard headline, subtitle, CTAs, and trust badges.
   - Trending search tags manager.
   - Newsletter subscriber list.
