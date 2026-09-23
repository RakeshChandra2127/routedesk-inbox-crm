# OmniDesk Hub: Real-Time Omnichannel CRM & Router

> **A production-grade, multi-tenant unified inbox and CRM with omnichannel webhook ingestion, intelligent agent routing, live presence tracking, SLA enforcement, and real-time chat — built on the MEAN stack with TypeScript.**

Messages arrive from WhatsApp, Email, and Web Chat. The system normalizes them, buffers through BullMQ, creates tickets, auto-assigns to available agents using a least-loaded routing algorithm with live presence tracking, monitors SLA deadlines with delayed background jobs, and streams everything to a reactive Angular inbox in real-time.

![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8-green?logo=mongodb)
![BullMQ](https://img.shields.io/badge/BullMQ-5-red)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?logo=socket.io)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Routing Engine](#routing-engine)
- [SLA Management](#sla-management)
- [Presence System](#presence-system)
- [Webhook Ingestion & Deduplication](#webhook-ingestion--deduplication)
- [Real-Time Inbox Architecture](#real-time-inbox-architecture)
- [Analytics & Aggregation Pipelines](#analytics--aggregation-pipelines)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Design Decisions](#design-decisions)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Angular Frontend (Dark Theme)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                   UNIFIED INBOX (Two-Panel)                     │ │
│  │                                                                 │ │
│  │  ┌─ Left Panel ──────────┐  ┌─ Right Panel ──────────────────┐ │ │
│  │  │ Search + Filter chips  │  │ Contact name | SLA ⏱ 12:34    │ │ │
│  │  │                       │  │                                │ │ │
│  │  │ 🟢 John Doe     2m   │  │  ┌──────────┐                 │ │ │
│  │  │  💬 "I need help..."  │  │  │ Hi there │ ← inbound       │ │ │
│  │  │  ● SLA: ⏱ 12:34      │  │  └──────────┘                 │ │ │
│  │  │                       │  │         ┌──────────────────┐  │ │ │
│  │  │ 🟡 Jane Smith    5m  │  │         │ How can I help? │  │ │ │
│  │  │  📧 "RE: Invoice..."  │  │         │            ✓✓   │  │ │ │
│  │  │  ● SLA: ⚠ 02:15      │  │         └──────────────────┘  │ │ │
│  │  │                       │  │                                │ │ │
│  │  │ 🔴 Bob Wilson   12m  │  │  "Contact is typing..."       │ │ │
│  │  │  💬 "Where's my..."   │  │  ┌────────────────────┬──────┐│ │ │
│  │  │  ● SLA: 🔴 BREACHED  │  │  │ Type a message...  │ Send ││ │ │
│  │  └───────────────────────┘  │  └────────────────────┴──────┘│ │ │
│  │                             └────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌──────────┐ ┌────────────┐ ┌──────────┐ ┌───────────────────────┐ │
│  │ Tickets  │ │  Contacts  │ │  Team    │ │   Analytics           │ │
│  │  Table   │ │   + Lead   │ │ Presence │ │ Avg Response | Breach │ │
│  └──────────┘ └────────────┘ └──────────┘ └───────────────────────┘ │
│         ↕ HTTP                    ↕ WebSocket (Socket.io)            │
├──────────────────────────────────────────────────────────────────────┤
│                     Express.js API Gateway                           │
│  ┌──────┐ ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Auth │ │ RBAC │ │Rate Limit│ │ Validate │ │  CORS    │          │
│  └──────┘ └──────┘ └──────────┘ └──────────┘ └──────────┘          │
├──────────────────────────────────────────────────────────────────────┤
│                        Service Layer                                 │
│                                                                      │
│  ┌───────────────┐  ┌────────────────┐  ┌────────────────────────┐  │
│  │   Presence     │  │    Routing     │  │     SLA Service        │  │
│  │   Service      │  │    Engine      │  │                        │  │
│  │               │  │               │  │  Create delayed job    │  │
│  │  Redis HSET   │  │  least_loaded │  │  ↓ 15 min             │  │
│  │  O(1) lookup  │  │  round_robin  │  │  Check response?      │  │
│  │  online/busy  │  │  manual       │  │  ↓ no → BREACH!       │  │
│  │  /away/offline│  │               │  │  Pause/Resume on      │  │
│  └───────────────┘  └────────────────┘  │  "waiting_on_customer"│  │
│                                         └────────────────────────┘  │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────────────┐ │
│  │  Ticket   │ │ Message  │ │  Contact  │ │  Webhook             │ │
│  │  Service  │ │ Service  │ │  Service  │ │  Normalizer          │ │
│  │  CRUD +   │ │ CRUD +   │ │ findOr   │ │  WhatsApp → IMessage │ │
│  │  assign   │ │ receipts │ │ Create   │ │  SendGrid → IMessage │ │
│  └───────────┘ └──────────┘ └───────────┘ │  Deduplication       │ │
│                                           └──────────────────────┘ │
│  ┌───────────────┐  ┌───────────────────────────────────────────┐  │
│  │  Analytics    │  │  Notification Service                     │  │
│  │  MongoDB      │  │  Real-time alerts via Socket.io           │  │
│  │  Aggregation  │  │  SLA breach → notify managers             │  │
│  │  Pipelines    │  │  New assignment → notify agent            │  │
│  └───────────────┘  └───────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────┤
│                   Async Infrastructure                               │
│                                                                      │
│  ┌───────────────────────────┐  ┌──────────────────────────────────┐│
│  │     BullMQ Queues         │  │         Redis                    ││
│  │                           │  │                                  ││
│  │  webhook-ingestion        │  │  • Presence hash per tenant:     ││
│  │  ├─ Normalize payload     │  │    HSET presence:{tenantId}      ││
│  │  ├─ Deduplicate           │  │    {userId} → {status,socketId}  ││
│  │  ├─ Find/create contact   │  │                                  ││
│  │  ├─ Find/create ticket    │  │  • Round-robin routing counter   ││
│  │  ├─ Save message          │  │  • Queue backend                 ││
│  │  └─ Auto-assign + SLA     │  │                                  ││
│  │                           │  └──────────────────────────────────┘│
│  │  sla-watchdog             │                                      │
│  │  ├─ Delayed job per ticket│  ┌──────────────────────────────────┐│
│  │  ├─ Check first response  │  │        Socket.io                 ││
│  │  └─ Escalate if breached  │  │  • Presence updates (join/leave) ││
│  │                           │  │  • New message streaming          ││
│  │  notification             │  │  • Typing indicators              ││
│  │  └─ Alert via Socket.io   │  │  • Read receipts                  ││
│  └───────────────────────────┘  │  • SLA breach alerts              ││
│                                 │  • Ticket assignment alerts       ││
│                                 └──────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────┤
│                          MongoDB                                     │
│  Tenants │ TeamMembers │ Contacts │ Tickets │ Messages │ Counters   │
│                                                                      │
│  Key Indexes:                                                        │
│  • { ticketId: 1, createdAt: 1 } — fast message pagination          │
│  • { tenantId: 1, externalId: 1 } unique sparse — deduplication     │
│  • { tenantId: 1, status: 1, lastMessageAt: -1 } — inbox sort       │
│  • { tenantId: 1, 'sla.firstResponseDue': 1 } — SLA queries         │
│  • { tenantId: 1, displayName: 'text' } — full-text contact search  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 📥 Unified Inbox (Real-Time)
- Two-panel layout: ticket list on left, live chat on right
- Real-time message streaming via WebSocket — no polling
- **Typing indicators**: "Contact is typing..." with animated dots
- **Read receipts**: Single check (sent) → Double check (delivered) → Blue check (read)
- **SLA countdown timer**: Live mm:ss display, green → yellow → red → "BREACHED"
- Channel icons: WhatsApp (green), Email (blue), Web Chat (purple)
- Unread message count badges
- Auto-scroll to latest message

### 🔌 Omnichannel Webhook Ingestion
- WhatsApp Business API (Meta) webhook receiver
- SendGrid Inbound Parse email webhook receiver
- Web Chat API endpoint
- **Zero data loss**: Webhooks are immediately pushed to BullMQ queue, 200 returned instantly
- **Deduplication**: Unique sparse index on `externalId` prevents duplicate message processing
- **Normalization**: All channels → unified `IMessage` format
- 3 retries with exponential backoff on processing failures

### 🎯 Intelligent Routing Engine
- **Least Loaded**: Assigns to agent with fewest active tickets
- **Round Robin**: Fair distribution using Redis INCR counter
- **Manual**: No auto-assignment, tickets land in unassigned queue
- Filters agents by: online presence AND available capacity (activeTickets < maxTickets)
- MongoDB `$expr` comparison for cross-field queries
- Automatic rebalancing when agent goes offline

### ⏱ SLA Management (Background Jobs)
- BullMQ **delayed jobs** scheduled per ticket:
  - First Response SLA: fires after N minutes (configurable per tenant)
  - Resolution SLA: fires after N hours (configurable per tenant)
- **Pause/Resume**: SLA clock pauses when ticket is "Waiting on Customer", resumes when customer replies
- On breach: ticket escalated, managers notified via WebSocket, SLA indicators turn red
- Cancellation: SLA timers removed when ticket is resolved/closed

### 🟢 Live Presence System
- Redis Hash Map for O(1) presence lookups: `HSET presence:{tenantId} {userId} {status,socketId}`
- Socket.io connection → agent goes "online"
- Socket.io disconnect → agent goes "offline"
- Manual status: "busy", "away"
- Presence bulk sync on new connection (catch up with current state)
- Real-time broadcast to all team members in tenant room

### 📊 Analytics & Aggregation Pipelines
- MongoDB aggregation pipeline for:
  - Average and Median First Response Time
  - Ticket Resolution Volume (today/week/month)
  - SLA Breach Rate (first response + resolution)
  - Channel breakdown (tickets per WhatsApp/Email/Web)
  - Agent performance leaderboard
  - Hourly volume chart (inbound vs outbound)
- Optimized with compound indexes for fast aggregation

### 🔒 Multi-Tenant Architecture
- Compound indexes: `{ tenantId: 1, ... }` on every collection
- RBAC: Super Admin, Tenant Admin, Agent, Manager, Viewer
- JWT authentication on HTTP and WebSocket
- Auto-incrementing ticket numbers per tenant (via Counter collection)
- Configurable SLA policies per tenant

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Angular 18, Angular Material | Dark-themed unified inbox, real-time chat |
| **Backend** | Node.js, Express.js | REST API, webhook handlers |
| **Database** | MongoDB, Mongoose 8 | Multi-tenant data, text search, aggregations |
| **Cache** | Redis, IORedis | Presence hashes, routing counter, queue backend |
| **Queues** | BullMQ 5 | Webhook buffering, SLA delayed jobs, notifications |
| **Real-time** | Socket.io 4.8 | Presence, typing, receipts, message streaming |
| **Observability** | Winston, prom-client | Structured logging, Prometheus metrics |
| **Language** | TypeScript 5.6 (strict) | End-to-end type safety |

---

## Project Structure

```
omnidesk-hub/
├── backend/
│   ├── src/
│   │   ├── app.ts                          # Express entry point
│   │   ├── config/
│   │   │   ├── index.ts                    # Env config singleton
│   │   │   ├── database.ts                 # MongoDB with retry
│   │   │   ├── redis.ts                    # IORedis (cache + queue clients)
│   │   │   └── logger.ts                   # Winston structured logging
│   │   ├── models/
│   │   │   ├── tenant.model.ts             # Tenant (SLA config, channels)
│   │   │   ├── team-member.model.ts        # Agent (presence, workload, bcrypt)
│   │   │   ├── contact.model.ts            # Contact (omnichannel identity)
│   │   │   ├── ticket.model.ts             # Ticket (SLA state, assignment)
│   │   │   ├── message.model.ts            # Message (delivery receipts)
│   │   │   ├── counter.model.ts            # Auto-increment ticket numbers
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── presence.service.ts         # ★ Redis Hash presence tracking
│   │   │   ├── routing.service.ts          # ★ Least-loaded / round-robin
│   │   │   ├── sla.service.ts              # ★ Delayed BullMQ jobs + pause/resume
│   │   │   ├── auth.service.ts
│   │   │   ├── ticket.service.ts           # CRUD + assign + escalate
│   │   │   ├── message.service.ts          # CRUD + delivery status + first response
│   │   │   ├── contact.service.ts          # findOrCreate + text search
│   │   │   ├── webhook.service.ts          # WhatsApp/Email normalization
│   │   │   ├── whatsapp.service.ts         # Meta Graph API outbound
│   │   │   ├── email.service.ts            # SendGrid outbound
│   │   │   ├── analytics.service.ts        # MongoDB aggregation pipelines
│   │   │   └── notification.service.ts     # Real-time alerts
│   │   ├── queues/
│   │   │   ├── queue.config.ts
│   │   │   ├── webhook.worker.ts           # Normalize → dedupe → route → SLA
│   │   │   ├── sla.worker.ts               # Delayed SLA breach checks
│   │   │   ├── notification.worker.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── ticket.routes.ts            # CRUD + /my + /unassigned + /assign
│   │   │   ├── message.routes.ts           # Send + mark read
│   │   │   ├── contact.routes.ts           # Search + convert to lead
│   │   │   ├── team.routes.ts              # List + presence update
│   │   │   ├── webhook.routes.ts           # WhatsApp + SendGrid (no auth)
│   │   │   ├── analytics.routes.ts
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   ├── websocket/
│   │   │   ├── socket.service.ts           # Presence, typing, receipts, rooms
│   │   │   └── index.ts
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   │   ├── inbox/                  # ★ Two-panel unified inbox
│   │   │   │   ├── auth/
│   │   │   │   ├── tickets/
│   │   │   │   ├── contacts/
│   │   │   │   ├── team/                   # Live presence grid
│   │   │   │   └── analytics/
│   │   │   ├── shared/
│   │   │   │   ├── components/
│   │   │   │   │   ├── sla-timer/          # Live mm:ss countdown
│   │   │   │   │   ├── channel-icon/       # WhatsApp/Email/Web icons
│   │   │   │   │   └── presence-dot/       # Green/gray/yellow/red dot
│   │   │   │   └── pipes/
│   │   │   └── services/
│   │   │       ├── socket.service.ts       # Presence, typing, receipts
│   │   │       └── ...
│   │   └── styles.css                      # Dark theme
│   ├── angular.json
│   └── package.json
├── shared/types/                           # Shared TypeScript interfaces
│   ├── tenant.types.ts, team.types.ts
│   ├── contact.types.ts, ticket.types.ts
│   ├── message.types.ts (delivery receipts)
│   ├── events.types.ts (socket events, presence, typing, SLA alerts)
│   ├── analytics.types.ts
│   └── api.types.ts
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 LTS
- **MongoDB** ≥ 7
- **Redis** ≥ 7

### 1. Clone & Setup

```bash
git clone https://github.com/RakeshChandra2127/project-3.git
cd project-3
docker-compose up -d          # Start MongoDB + Redis
cp .env.example .env          # Configure secrets
```

### 2. Run Backend

```bash
cd backend
npm install
npm run dev                    # http://localhost:3000
```

### 3. Run Frontend

```bash
cd frontend
npm install
npm start                      # http://localhost:4200
```

---

## How It Works

### Message Ingestion Flow (Zero Data Loss)

```
WhatsApp/Email webhook arrives
  │
  ├─→ POST /api/webhooks/whatsapp (or /email/inbound)
  ├─→ Return 200 immediately (don't block the webhook provider)
  ├─→ Push raw payload to BullMQ 'webhook-ingestion' queue
  │
  └─→ Webhook Worker processes the job:
        │
        ├─→ Normalize: WhatsApp payload → unified IMessage format
        │   (Handle quirks: duplicate delivery events, missing fields)
        │
        ├─→ Deduplicate: Check externalId unique index
        │   (If duplicate → skip, don't create duplicate message)
        │
        ├─→ Find or Create Contact:
        │   contactService.findOrCreate(tenantId, 'whatsapp', '+1234567890')
        │
        ├─→ Find or Create Ticket:
        │   Find existing open ticket for this contact
        │   If none → create new ticket (auto-increment number)
        │
        ├─→ Save Message:
        │   messageService.create() with direction='inbound'
        │   $inc ticket.messageCount, update lastMessageAt
        │
        ├─→ If New Ticket:
        │   ├─→ routingService.assignTicket() → find least-loaded agent
        │   └─→ slaService.createSLATimers() → schedule delayed jobs
        │
        └─→ Emit via Socket.io:
              • MESSAGE_NEW → ticket room
              • TICKET_CREATED or TICKET_UPDATED → tenant room
              • NOTIFICATION → assigned agent
```

---

## Routing Engine

### Least Loaded Strategy (Default)

```typescript
// 1. Get all agents currently ONLINE from Redis Hash
const onlineAgentIds = await presenceService.getOnlineAgents(tenantId);

// 2. Filter agents with capacity (MongoDB $expr for cross-field comparison)
const agents = await TeamMember.find({
  _id: { $in: onlineAgentIds },
  role: { $in: ['agent', 'tenant_admin'] },
  $expr: { $lt: ['$workload.activeTickets', '$workload.maxTickets'] }
});

// 3. Sort by lowest active tickets → pick first
const selectedAgent = agents.sort(
  (a, b) => a.workload.activeTickets - b.workload.activeTickets
)[0];

// 4. Assign: update ticket + increment agent workload atomically
await Ticket.findByIdAndUpdate(ticketId, { assignedTo: selectedAgent._id });
await TeamMember.findByIdAndUpdate(selectedAgent._id, {
  $inc: { 'workload.activeTickets': 1 }
});
```

### Round Robin Strategy

```typescript
// Redis INCR counter ensures fair distribution even across server restarts
const counter = await cacheClient.incr(`routing_counter:${tenantId}`);
const index = counter % availableAgents.length;
const selectedAgent = availableAgents[index];
```

---

## SLA Management

### Lifecycle

```
Ticket Created
  │
  ├─→ Calculate firstResponseDue = now + 15 minutes (configurable)
  ├─→ Calculate resolutionDue = now + 24 hours (configurable)
  │
  ├─→ Schedule BullMQ delayed job: 'check-first-response'
  │   delay = firstResponseDue - now (e.g., 900000ms)
  │
  └─→ Schedule BullMQ delayed job: 'check-resolution'
      delay = resolutionDue - now

After 15 minutes, the delayed job fires:
  │
  ├─→ Check: Does ticket have firstResponseAt set?
  │
  ├─→ YES (agent replied in time):
  │   SLA met ✅ — do nothing
  │
  └─→ NO (agent didn't reply):
      ├─→ Set firstResponseBreached = true
      ├─→ Emit SLA_BREACHED via Socket.io
      ├─→ Escalate ticket
      └─→ Notify managers

Special: When ticket status = "Waiting on Customer":
  ├─→ SLA clock PAUSES (pausedAt = now)
  └─→ When customer replies: SLA clock RESUMES
      (due dates extended by pausedDuration)
```

---

## Presence System

### Redis Hash Architecture

```
Redis Key: presence:{tenantId}
┌─────────────────────────────────────────────────┐
│ Hash Field (userId) │ Value (JSON)              │
├─────────────────────┼───────────────────────────┤
│ user_abc123         │ {"status":"online",       │
│                     │  "socketId":"sid_xyz",    │
│                     │  "lastSeenAt":"2024-..."}  │
│                     │                           │
│ user_def456         │ {"status":"busy",         │
│                     │  "socketId":"sid_uvw",    │
│                     │  "lastSeenAt":"2024-..."}  │
└─────────────────────┴───────────────────────────┘

Operations:
  HSET  → O(1) set online/status
  HDEL  → O(1) set offline
  HGET  → O(1) check single user
  HGETALL → O(N) get all presence (N = online users)
```

---

## Webhook Ingestion & Deduplication

### Why BullMQ Buffering?

Without buffering: If MongoDB is temporarily down during a WhatsApp webhook, the message is **lost forever** (Meta won't retry indefinitely).

With buffering: Webhook → instant 200 → BullMQ (Redis) → worker retries 3x with exponential backoff → message is never lost.

### Deduplication Strategy

```typescript
// MongoDB unique sparse index prevents duplicate messages
{ tenantId: 1, externalId: 1 }  // sparse = ignores docs without externalId

// WhatsApp sends multiple status events for the same message
// The worker checks: does a message with this externalId already exist?
const existing = await Message.findOne({ tenantId, externalId });
if (existing) {
  // Update delivery status instead of creating duplicate
  existing.deliveryStatus = newStatus;
  await existing.save();
  return; // Skip creation
}
```

---

## Real-Time Inbox Architecture

### RxJS Data Flow

```
                    ┌──────────────────────┐
                    │  HTTP Initial Fetch   │
                    │  GET /api/tickets     │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  BehaviorSubject      │
                    │  tickets$ = [...]     │◄─── merge
                    └──────────┬───────────┘       │
                               │            ┌─────┴──────────────┐
                    ┌──────────▼──────┐     │ Socket.io Events   │
                    │  @for ticket of │     │                    │
                    │  tickets$ | async│    │ TICKET_CREATED →   │
                    │  (Angular 18)   │     │   prepend to list  │
                    └─────────────────┘     │                    │
                                            │ TICKET_UPDATED →   │
                    ┌─────────────────┐     │   update in list   │
                    │  Selected Ticket│     │                    │
                    │  messages$ = [] │◄──  │ MESSAGE_NEW →      │
                    └────────┬────────┘     │   append to chat   │
                             │              │                    │
                    ┌────────▼────────┐     │ TYPING_START →     │
                    │  Chat Messages  │     │   show indicator   │
                    │  with delivery  │     │                    │
                    │  status icons   │     │ DELIVERY_UPDATE →  │
                    └─────────────────┘     │   update ✓✓ icons  │
                                            └────────────────────┘
```

---

## Analytics & Aggregation Pipelines

### Average First Response Time

```javascript
db.tickets.aggregate([
  { $match: { tenantId, firstResponseAt: { $exists: true } } },
  { $project: {
      responseTimeMs: { $subtract: ['$firstResponseAt', '$createdAt'] }
  }},
  { $group: {
      _id: null,
      avgResponseMs: { $avg: '$responseTimeMs' },
      medianArray: { $push: '$responseTimeMs' }
  }},
  { $project: {
      avgResponseMs: 1,
      medianResponseMs: {
        $arrayElemAt: [
          { $sortArray: { input: '$medianArray', sortBy: 1 } },
          { $floor: { $divide: [{ $size: '$medianArray' }, 2] } }
        ]
      }
  }}
])
```

### SLA Breach Rate

```javascript
db.tickets.aggregate([
  { $match: { tenantId, createdAt: { $gte: startDate } } },
  { $group: {
      _id: null,
      total: { $sum: 1 },
      firstResponseBreaches: {
        $sum: { $cond: ['$sla.firstResponseBreached', 1, 0] }
      },
      resolutionBreaches: {
        $sum: { $cond: ['$sla.resolutionBreached', 1, 0] }
      }
  }},
  { $project: {
      firstResponseBreachRate: {
        $divide: ['$firstResponseBreaches', '$total']
      },
      resolutionBreachRate: {
        $divide: ['$resolutionBreaches', '$total']
      }
  }}
])
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register tenant + admin |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List tickets (filter: status, channel, assignedTo) |
| GET | `/api/tickets/my` | My assigned tickets |
| GET | `/api/tickets/unassigned` | Unassigned tickets |
| GET | `/api/tickets/:id` | Get ticket detail |
| POST | `/api/tickets` | Create ticket |
| PATCH | `/api/tickets/:id` | Update ticket |
| POST | `/api/tickets/:id/assign` | Assign to agent |
| POST | `/api/tickets/:id/escalate` | Escalate ticket |
| POST | `/api/tickets/:id/resolve` | Resolve ticket |
| POST | `/api/tickets/:id/close` | Close ticket |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:ticketId/messages` | Get messages for ticket |
| POST | `/api/messages/:ticketId/messages` | Send outbound message |
| POST | `/api/messages/:ticketId/messages/read` | Mark all as read |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | List/search contacts |
| GET | `/api/contacts/:id` | Get contact detail |
| PATCH | `/api/contacts/:id` | Update contact |
| POST | `/api/contacts/:id/convert-to-lead` | Convert to CRM lead |

### Webhooks (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/webhooks/whatsapp` | WhatsApp verification challenge |
| POST | `/api/webhooks/whatsapp` | WhatsApp incoming messages |
| POST | `/api/webhooks/whatsapp/status` | WhatsApp delivery status |
| POST | `/api/webhooks/email/inbound` | SendGrid inbound parse |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Full dashboard metrics |
| GET | `/api/analytics/sla-trend` | Daily SLA breach trend |
| GET | `/api/analytics/response-times` | Response time histogram |

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Server port |
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/omnidesk` | MongoDB |
| `REDIS_URL` | Yes | `redis://localhost:6379` | Redis |
| `JWT_SECRET` | Yes | — | JWT signing key |
| `WHATSAPP_VERIFY_TOKEN` | No | — | Webhook verification |
| `WHATSAPP_ACCESS_TOKEN` | No | — | Meta Graph API token |
| `SENDGRID_API_KEY` | No | — | SendGrid email sending |
| `SLA_FIRST_RESPONSE_MINUTES` | No | `15` | Default first response SLA |
| `SLA_RESOLUTION_HOURS` | No | `24` | Default resolution SLA |
| `MAX_TICKETS_PER_AGENT` | No | `10` | Agent workload cap |
| `ROUTING_STRATEGY` | No | `least_loaded` | least_loaded / round_robin / manual |

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **BullMQ webhook buffering** | If MongoDB goes down during a webhook, messages are safely queued in Redis and retried — zero data loss guarantee |
| **Redis Hash for presence** | O(1) per-user lookups, O(N) bulk reads. Cheaper and faster than polling MongoDB for "who's online" |
| **Delayed jobs for SLA** | BullMQ delayed jobs fire at exactly the right time — no polling, no cron. Cancel/reschedule is trivial |
| **SLA pause/resume** | When waiting on customer, subtracting paused time from deadlines ensures agents aren't penalized unfairly |
| **Unique sparse index for dedup** | WhatsApp sends 3+ status events per message. Sparse unique on externalId prevents duplicates without affecting messages that have no external ID |
| **Counter collection for ticket numbers** | `findOneAndUpdate` with `$inc` gives atomic, gap-free, per-tenant ticket numbering |
| **$expr in routing query** | Comparing `activeTickets < maxTickets` across two fields in the same document requires `$expr`, not a simple query |
| **Compound indexes with tenantId first** | Every query is tenant-scoped. Putting tenantId first in compound indexes ensures the index range scan is always narrow |

---

## License

MIT

---

**Built by [Rakesh Chandra](https://github.com/RakeshChandra2127)** — Full-Stack Platform Engineer
