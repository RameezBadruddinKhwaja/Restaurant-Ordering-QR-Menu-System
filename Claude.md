# Restaurant Ordering & QR Menu System

## Overview

Production-level restaurant ordering system with QR menus, table-based ordering, admin panel, kitchen dashboard, and AI-powered menu recommendations.

## Stack

* Next.js (App Router) + TypeScript
* Shadcn UI + Tailwind CSS
* Express.js (Vercel-compatible serverless structure)
* Supabase (DB, Auth, Realtime, Storage)
* Supabase OAuth (Google, GitHub, etc.)
* Python FastAPI microservice for AI recommendations and allergen detection

## Theme & UI

* Warm restaurant colors or dark-modern theme
* High-quality dish images
* Mobile‑first UI (QR scans mostly mobile users)
* Clean kitchen dashboard tables with realtime order updates

## Core Features

* QR‑based table ordering (scan → open table session)
* Realtime order status (kitchen ↔ customer)
* Add to cart, modifiers, notes, combos
* Kitchen dashboard (accept/reject/prepare/ready)
* Admin panel: menu, categories, tables, staff, reports
* Dine‑in, takeaway, and delivery modes
* AI: menu recommendation engine + allergen detection + upsell bot

## Pages / Routes

* `/menu` — Categories + dishes
* `/menu/[id]` — Dish detail
* `/table/[tableId]` — Table session ordering
* `/kitchen` — Kitchen dashboard
* `/orders` — Order history
* `/admin` — Admin menu management

## Database Schema (Supabase)

* `tables`
* `dishes`
* `dish_options`
* `orders`
* `order_items`
* `staff`
* `categories`
* `kitchen_events`
* `ai_sessions`

## Backend Structure (Vercel Compatible)

```
/api
  index.ts
  dishes.ts
  orders.ts
  kitchen.ts
  tables.ts
  ai.ts
```

### Express Base (serverless)

```
import express from 'express'
import serverless from 'serverless-http'

const app = express()
app.use(express.json())

app.post('/order', async (req, res) => {})

export const handler = serverless(app)
```

## Realtime Features

* Supabase Realtime for kitchen status and order pushes
* WebSockets optional but not required

## AI Integration

### Python FastAPI

* `/recommend` → suggest dishes
* `/allergen-check` → detect allergens in ingredients
* `/upsell` → suggest combos and sides

### AI Features

* "Best dish based on your taste"
* "Recommend spicy/non-spicy foods"
* Allergen warning popup
* AI-powered menu search

## Deployment

* Next.js → Vercel
* Express API → Vercel Serverless
* Python AI → Railway/Render
* Supabase → managed hosting

## Environment Variables

* SUPABASE_URL
* SUPABASE_SERVICE_ROLE
* SUPABASE_ANON_KEY
* AI_API_URL
* AI_API_KEY

## Claude Tasks

* Generate dish cards & category layout
* Kitchen dashboard UI with realtime updates
* Supabase SQL schema & seed (menus + pricing)
* Express routes for ordering flow
* AI recommendation prompt templates

## Production Checklist

* Table sessions expire properly
* Staff role-based access policies
* Realtime order updates throttled
* Logging for kitchen events
* RLS rules for menu, orders, and staff

---

