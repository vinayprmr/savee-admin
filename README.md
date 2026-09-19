# Savee Atelier — Brand Operations & Fulfillment Portal

The administrative command center for **Savee**, a luxury Direct-to-Consumer (D2C) Indian fashion house specializing in handcrafted Banarasi silk sarees, bridal lehengas, designer kurta sets, anarkalis, gowns, co-ords, and luxury accessories.

> **Design Tenet**: Savee is a single-brand luxury fashion house, **not** a marketplace. Savee owns the product catalog, atelier inventory, and direct Delhivery fulfillment pipeline.

---

## 🏛️ Operations Architecture & Modules

The portal delivers 5 core brand management modules:

1. **Atelier Executive Dashboard (`/`)**
   - Live KPI cards: Gross Revenue ₹, Total Orders, Active In Fulfillment, Average Order Value (AOV ₹), Low Stock Alert.
   - 126 Garments distribution across categories (Sarees, Lehengas, Kurtas, Anarkalis, Gowns, Co-ord Sets, Dresses, Jewelry).
   - Recent orders feed with instant inspection drawer.

2. **Orders & Fulfillment Pipeline (`/orders`)**
   - Order tracking across all lifecycle milestones (`PLACED` → `CONFIRMED` → `HANDCRAFTING` → `DISPATCHED` → `DELIVERED` / `CANCELLED`).
   - Search by order number, patron name, phone, or Delhivery tracking AWB.
   - Status tabs filter and paginated listing.
   - **Slide-out Inspection Drawer**:
     - Customer contact coordinates & delivery address.
     - Garment snapshots with selected size, color swatch, and quantities.
     - 5% Luxury GST breakdown, promotional discounts, and insured white-glove shipping.
     - Milestone advancement with custom atelier handcrafting notes and Delhivery AWB synchronization.

3. **Catalog & Variant Inventory Control (`/inventory`)**
   - Comprehensive inventory control over all 126 catalog styles.
   - Filter by category and stock level (All, Low Stock &le; 3 units, Out of Stock).
   - Expandable variant rows displaying sizing (Free Size, S, M, L, XL) and SKU codes.
   - **Inline Quick Stock Editor**: Instant quantity increment/decrement with one-click Save syncing directly to PostgreSQL.

4. **Promotions & Privilege Codes (`/coupons`)**
   - Configure percentage (%) or flat rupee (₹) discounts.
   - Minimum order threshold and maximum discount caps.
   - Real-time active/inactive toggle switch.
   - "Create New Privilege Code" modal with instant validation.

5. **Customer Review Moderation & Directory (`/reviews`, `/customers`)**
   - `/reviews`: Curate customer experiences, verified purchase status, 5-star ratings, and one-click "Approve" (publish to storefront) / "Hide".
   - `/customers`: Registered patron directory with lifetime spend metrics, total order counts, and geographic distribution.

---

## 🔑 Administrative Access

- **Portal URL**: `http://localhost:3001`
- **Atelier Email**: `admin@savee.in`
- **Atelier Password**: `Savee@Atelier2026`
- **Role Claim**: `admin` (JWT Bearer Token)

*(The login screen includes a "Fill Credentials" button for instant one-click testing.)*

---

## 🛠️ Port Matrix

| Application | Technology | Port | URL |
| :--- | :--- | :--- | :--- |
| **Savee-Frontend** | Next.js 15, React 19 | `3000` | `http://localhost:3000` |
| **Savee-Admin** | Next.js 15, React 19 | `3001` | `http://localhost:3001` |
| **Savee-Backend** | FastAPI, Python 3.14 | `8000` | `http://localhost:8000` |
| **PostgreSQL 16** | Docker Container | `5432` | `savee-postgres` |

---

## 🚀 Running Locally

```bash
# In Savee-Admin directory:
npm run dev

# Or build for production:
node ./node_modules/.bin/next build
node ./node_modules/.bin/next start -p 3001
```
