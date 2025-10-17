# Backend Integration Summary

## Overview
This document describes the backend integration for the Happy Dog mobile app, which mirrors the logic from the Chrome extension (`office-pets/popup`).

## Architecture

### 1. Services Layer

#### `services/storage.ts`
- Uses MMKV (fast key-value storage) for local data persistence
- Manages:
  - Session (user, space)
  - Pet data (name, breed)
  - Client ID (unique identifier)
  - Goodies (accessories)
  - Recent spaces
  - Cached actions (for batch updates)

**Key Methods:**
- `getSession()` / `setSession()` - User session management
- `getPet()` / `setPet()` - Pet information
- `getClientId()` / `setClientId()` - Client identification
- `getRecentSpaces()` / `storeRecentSpace()` - Recent space tracking

#### `services/api.ts`
- Handles all API calls to `https://us-central1-office-pets.cloudfunctions.net`
- Endpoints:
  - `registerNewInstall()` - Get a unique client_id
  - `createPet()` - Create a new pet and space
  - `getPets()` - Get pets in a space
  - `getState()` - Get pet state (stats, activities, etc.)
  - `getGoodies()` - Get pet accessories
  - `batchActionUpdate()` - Batch update actions (feed, pet, treat, toy)
  - `getFavoriteUsers()` - Get leaderboard
  - `getRecentActivity()` - Get activity log

### 2. Routing & Authentication Flow

#### `app/creation-1.tsx` - Create New Pet
Mirrors `office-pets/popup/login.js::createPet()`

**Flow:**
1. User selects breed and enters pet name + nickname
2. Ensures client_id exists (calls `registerNewInstall()` if needed)
3. Calls `createPet()` API to create pet and get space
4. Stores session and pet info locally
5. Initializes default goodies
6. Navigates to home screen

**API Calls:**
```typescript
const clientId = await ApiService.registerNewInstall();
const response = await ApiService.createPet(petName, breed, clientId);
StorageService.setSession(nickname, response.space);
StorageService.setPet(petName, breed);
```

#### `app/creation-2.tsx` - Join Existing Space
Mirrors `office-pets/popup/buildLoginPage.js::createForm()`

**Flow:**
1. User enters space name and nickname
2. Calls `getPets()` to verify space exists
3. If space exists, stores session and pet info
4. Loads goodies for the space
5. Navigates to home screen

**API Calls:**
```typescript
const pets = await ApiService.getPets(spaceName);
if (pets.length > 0) {
  StorageService.setSession(nickname, spaceName);
  StorageService.setPet(pets[0].name, pets[0].breed);
  // Navigate to home
}
```

#### `app/home.tsx` - Main Pet View
Mirrors `office-pets/popup/popup.js::updateCurrentPet()` and `getState()`

**Flow:**
1. On mount, loads session and pet from storage
2. Calls `getState()` to fetch pet stats from backend
3. Displays:
   - Pet name and space
   - Stats (mood, stomach, energy, health, coins)
   - Pet render with animations
   - Action buttons (for testing animations)

**API Calls:**
```typescript
const session = StorageService.getSession();
const pet = StorageService.getPet();
const state = await ApiService.getState(pet.name, session.space);
```

### 3. Custom Hook

#### `hooks/usePetSession.ts`
Centralized hook for managing pet state across the app.

**Features:**
- Loads pet state on mount
- Provides `performAction()` for user interactions (feed, pet, treat, toy)
- Optimistic updates for better UX
- Caches actions locally for batch updates
- `flushCachedActions()` syncs with backend

**Usage:**
```typescript
const { petState, isLoading, performAction } = usePetSession();

// Perform action
await performAction('feed');
```

## Data Flow Comparison

### Chrome Extension
```
popup.js
  ↓
chrome.storage.local (session, pet, goodies)
  ↓
API calls to Cloud Functions
  ↓
Updates UI and state
```

### Mobile App
```
creation-1/2.tsx
  ↓
MMKV storage (session, pet, goodies)
  ↓
API calls to Cloud Functions
  ↓
Updates React state and UI
```

## Key Differences

1. **Storage:**
   - Extension: `chrome.storage.local` (async)
   - Mobile: MMKV (synchronous, faster)

2. **Navigation:**
   - Extension: DOM manipulation (`display: flex/none`)
   - Mobile: React Navigation / Expo Router

3. **State Management:**
   - Extension: Global variables + DOM updates
   - Mobile: React hooks + state

4. **Background Sync:**
   - Extension: Background script for batch updates
   - Mobile: Will need periodic sync or on-demand flush

## API Endpoints Used

All endpoints are at `https://us-central1-office-pets.cloudfunctions.net/`

1. **registerNewInstall** - POST `{}` → `{ client_id: string }`
2. **createPet-3** - POST `{ pet, breed, client_id }` → `{ space, pet, breed }`
3. **getPetsAndBreed** - POST `{ space }` → `[{ name, breed }]`
4. **getState** - POST `{ pet, space }` → `PetState` (full state object)
5. **getGoodies** - POST `{ pet, space, user }` → `[{ id, type }]`
6. **batch_action_update** - POST `{ pet, space, user, actions }` → `Partial<PetState>`
7. **getFavoriteUsers** - POST `{ pet, space, user }` → `[{ by_user, count }]`
8. **getRecentActivity** - POST `{ pet, space, user }` → activity log

## Testing the Implementation

### Create New Pet
1. Open app → creation-1 screen
2. Select breed, enter pet name + nickname
3. Submit → should create pet and navigate to home
4. Verify pet state loads with correct breed and stats

### Join Existing Space
1. Open app → creation-2 screen
2. Enter existing space name + your nickname
3. Submit → should load that space's pet
4. Verify pet loads with correct data

### View Pet State
1. After creating/joining, home screen should show:
   - Pet name and space
   - Current stats (mood, stomach, energy, health, coins)
   - Pet render with correct breed
   - Working animations

## Next Steps

1. **Action Implementation**: Add UI for feed, pet, treat, toy actions
2. **Goodies System**: Fetch and display goodies from backend
3. **Background Sync**: Implement periodic sync for cached actions
4. **Error Handling**: Better error messages and retry logic
5. **Offline Support**: Handle offline state and queue actions
6. **Activity Feed**: Display recent activities
7. **Leaderboard**: Show favorite users

## Notes

- All backend logic mirrors the Chrome extension
- Session management works the same way
- Client ID is generated on first install
- Actions are cached locally and can be batch-synced
- State is optimistically updated for better UX

