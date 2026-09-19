# Savee Admin — Project Rules

## 1. Project

`Savee-Admin` is the internal **Atelier & Brand Operations Portal** for Savee.

Savee is a premium, single-brand Indian women's ethnic & fusion fashion house.

**STRICT D2C RULE**:
- Savee is **NOT a marketplace**. Do NOT introduce seller, vendor, merchant onboarding, or commission concepts.
- Savee owns 100% of the catalog, designs, inventory, and fulfillment operations.
- The users of this application are internal brand team members: Atelier Managers, Merchandisers, Quality Inspectors, and Order Fulfillment Specialists.

---

## 2. Technology Stack

Approved stack:

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Design System**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Data Tables**: TanStack Table (or shadcn table primitives)

Do not replace or introduce alternative frameworks without explicit project owner approval.

---

## 3. Scope & Capabilities (V1)

`Savee-Admin` manages the operational lifecycle of the brand:

1. **Dashboard & Performance Overview**:
   - Net sales revenue in Indian Rupees (₹)
   - Active orders requiring atelier attention
   - Top selling silhouettes and category breakdown
   - Real-time stock alerts

2. **Order Management & Fulfillment**:
   - Order pipeline: `PLACED` → `CONFIRMED` → `HANDCRAFTING` → `DISPATCHED` → `DELIVERED`
   - Real-time milestone updates directly synchronizing with customer tracking
   - Delhivery Air Express tracking number assignment
   - Packing slip and customer invoice generation

3. **Catalog & Inventory Control**:
   - 126+ luxury products across Sarees, Kurta Sets, Lehengas, Anarkalis, Kurtis, Fusion, Dupattas
   - Real-time stock level adjustment per variant (`XS`, `S`, `M`, `L`, `XL`, `XXL`, `Free Size`)
   - Pricing management (MRP vs Selling Price in ₹)
   - Active / Inactive / Out-of-Stock toggles

4. **Promotions & Coupon Management**:
   - Create, edit, and deactivate promotional codes
   - Percentage discounts vs flat rupee deductions
   - Minimum order threshold and maximum discount caps

5. **Customer Review Moderation**:
   - Approve, feature, or moderate customer ratings and testimonials before public display

6. **Customer Directory**:
   - Customer profile history, lifetime spend, order records, and delivery addresses

---

## 4. Design & Brand Personality

The admin experience should feel like an **exclusive luxury fashion atelier back-office**, not a generic cookie-cutter SaaS template:

- **Color Palette**:
  - Deep Heritage Navy (`#0B2545`) as primary brand anchor
  - Champagne Gold (`#C9A96A` / `#D4AF37`) as refined accent
  - Crisp pearl/ivory card backgrounds (`#FAF9F6` / `#FFFFFF`)
  - Slate neutral borders and subtle high-contrast typography
- **Information Density**:
  - High utility, clear scannable data tables with sticky headers
  - Visual status pill badges (e.g. Amber for `Handcrafting`, Indigo for `Dispatched`, Emerald for `Delivered`)
  - Drawer-based detail view for deep order inspection without losing table context
- **Keyboard & Efficiency**:
  - Fast search, debounced filters, and pagination synced with URL query parameters

---

## 5. Architectural Standards

```
Savee-Admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Main authenticated shell layout
│   │   │   ├── page.tsx        # KPI Dashboard
│   │   │   ├── orders/         # Order list & detail drawer
│   │   │   ├── products/       # Catalog & stock management
│   │   │   ├── inventory/      # Variant-level quick stock editor
│   │   │   ├── coupons/        # Promotion management
│   │   │   ├── reviews/        # Review moderation
│   │   │   └── customers/      # Customer directory
│   │   └── login/              # Admin authentication
│   ├── components/             # Reusable UI components & shadcn
│   │   ├── ui/                 # Atomic UI primitives
│   │   ├── layout/             # Sidebar, Header, Breadcrumbs
│   │   └── shared/             # Stat cards, Status badges, Data table
│   ├── domain/                 # TypeScript models matching Backend contracts
│   ├── services/               # API clients communicating with Savee-Backend
│   └── lib/                    # Utilities, formatters (₹ formatting, dates)
```

---

## 6. Currency & Numbering Rules

- **India-First Formatting**:
  - Always format monetary figures in Indian currency (`₹`) using Indian numbering system (e.g., `₹1,29,900`, `₹12,999`).
  - Dates formatted in human-readable Indian context (e.g. `19 Sep 2026, 03:30 PM`).

---

## 7. AI Agent Guidelines

Every AI agent working on `Savee-Admin` MUST:

1. Read this file completely before making modifications.
2. Maintain strict separation of concerns (UI components vs API services vs domain types).
3. Ensure 100% strict TypeScript types with zero `any` usage.
4. Verify builds cleanly with `tsc --noEmit` and `next build`.
5. Keep changes focused and document decisions in `CHANGELOG.md`.
