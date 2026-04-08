# Proposifly Admin Panel - Implementation Plan

## Requirements Summary

1. Admin panel in same repo under `src/app/admin/` (like Pulse LMS)
2. `role` column in users table (`user` default, `admin` for admins)
3. Multiple admins supported, current user = first admin
4. Dashboard with stats (total users, proposals, etc.)
5. User management with proposal counts + view user proposals
6. Dynamic API key management (stored in DB, not .env)
7. Admin management (promote/demote users to admin)
8. Component-based, max 200 lines/file, fully responsive
9. Scalable for 1000+ users (pagination, search, filters)

## Database Changes

### 1. ALTER users table
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(10) DEFAULT 'user';
UPDATE users SET role = 'admin' WHERE email = '<current-user-email>';
```

### 2. CREATE api_keys table
```sql
CREATE TABLE api_keys (
  id SERIAL PRIMARY KEY,
  provider VARCHAR(20) NOT NULL UNIQUE,
  api_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- providers: openai, groq, gemini, claude
-- only ONE can be is_active = true at a time (default provider)
```

## File Structure (src/app/admin/)

```
src/app/admin/
├── layout.tsx                    # Admin layout with sidebar + auth guard
├── page.tsx                      # Dashboard (stats overview)
├── users/
│   ├── page.tsx                  # Users list with proposal counts
│   └── [id]/
│       └── page.tsx              # Single user's proposals
├── api-keys/
│   └── page.tsx                  # API key management
├── admins/
│   └── page.tsx                  # Admin management (promote/demote)
└── components/
    ├── AdminSidebar.tsx          # Sidebar navigation
    ├── AdminHeader.tsx           # Top bar with user info
    ├── StatsCard.tsx             # Dashboard stat card
    ├── UsersTable.tsx            # Users table with pagination
    ├── UserSearch.tsx            # Search + filter bar
    ├── ProposalsList.tsx         # User's proposals list
    ├── ProposalDetail.tsx        # Single proposal view (modal/drawer)
    ├── ApiKeyForm.tsx            # Add/edit API key form
    ├── ApiKeyCard.tsx            # API key display card
    ├── AdminsTable.tsx           # Admins list table
    ├── Pagination.tsx            # Reusable pagination
    ├── LoadingSpinner.tsx        # Loading state
    └── EmptyState.tsx            # Empty state placeholder
```

## API Routes (src/app/api/admin/)

```
src/app/api/admin/
├── stats/route.ts               # GET dashboard stats
├── users/
│   ├── route.ts                 # GET users list (paginated, searchable)
│   └── [id]/
│       ├── route.ts             # GET user detail + proposals
│       └── role/route.ts        # PUT update user role
├── api-keys/
│   ├── route.ts                 # GET all keys, POST add key
│   └── [id]/route.ts            # PUT update key, DELETE remove key
└── middleware.ts                 # Admin auth check helper
```

## Implementation Steps

### Step 1: Database Setup
- Add `role` column to users table
- Create `api_keys` table
- Set current user as admin

### Step 2: Admin Auth & Layout
- Create `src/lib/admin-auth.ts` - admin verification helper
- Create `src/app/admin/layout.tsx` - layout with sidebar, admin guard
- Create `AdminSidebar.tsx`, `AdminHeader.tsx`
- Update `AuthContext.tsx` to include `role` in user object
- Update `GET /api/auth/me` to return role

### Step 3: API Routes
- `GET /api/admin/stats` - total users, proposals, PRDs, proposals today
- `GET /api/admin/users` - paginated users with proposal_count
- `GET /api/admin/users/[id]` - user detail + their proposals
- `PUT /api/admin/users/[id]/role` - change role (admin/user)
- `GET /api/admin/api-keys` - list all API keys
- `POST /api/admin/api-keys` - add new key
- `PUT /api/admin/api-keys/[id]` - update key / set as default
- `DELETE /api/admin/api-keys/[id]` - remove key

### Step 4: Dashboard Page
- Stats cards: Total Users, Total Proposals, Total PRDs, Active Provider
- Recent activity summary

### Step 5: Users Management
- Users table with columns: Name, Email, Role, Proposals Count, Joined
- Search by name/email
- Pagination (20 per page)
- Click user -> view their proposals

### Step 6: User Proposals View
- Show user info at top
- List all their proposals with tone, date, preview
- Click proposal -> expand/view full text

### Step 7: API Key Management
- Cards for each provider (OpenAI, Groq, Gemini, Claude)
- Add/edit API key per provider
- Toggle default provider (only one active at a time)
- Keys masked in display (show last 4 chars only)

### Step 8: Admin Management
- List current admins
- Search users to promote to admin
- Demote admin back to user (except self)

### Step 9: Update AI Provider Logic
- Modify `src/lib/ai-providers.ts` to check DB first, fallback to .env
- Modify `src/app/api/generateProposal/route.ts` to use DB keys

## Acceptance Criteria

- [ ] Admin login works - only role='admin' users can access /admin/*
- [ ] Dashboard shows accurate stats from DB
- [ ] Users list loads with correct proposal counts, paginated
- [ ] Can view any user's proposals
- [ ] Can add/edit/delete API keys from admin UI
- [ ] Can switch default AI provider from admin
- [ ] AI generation uses DB keys (falls back to .env if no DB key)
- [ ] Can promote/demote users to/from admin
- [ ] Cannot demote yourself
- [ ] All pages responsive (mobile + desktop)
- [ ] All files under 200 lines
- [ ] VS Code dark theme consistent with main app

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| API keys stored in plain text in DB | Acceptable for now; can encrypt later |
| Admin accidentally demotes self | Prevent self-demotion in API |
| No DB keys set, .env also empty | Fallback chain: DB -> .env -> error message |
| 1000+ users slow query | Pagination + indexed queries |
