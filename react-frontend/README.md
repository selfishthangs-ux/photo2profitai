# Photo2Profit React Frontend

This is the React frontend for Photo2Profit AI, implementing real-time Firestore sync and UI autofill functionality.

## Features

- **Anonymous User Support**: No sign-in required for MVP
- **Real-time Sync**: Firestore listeners auto-populate UI when AI generates content
- **Status Indicators**: Visual feedback for upload, processing, and AI generation stages
- **Image Upload**: Direct upload to Firebase Storage with automatic processing
- **Save Draft**: Save listing edits to Firestore in real-time
- **AI-Generated Content**: Auto-populates title, description, and pricing when ready

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env.local` file in this directory (based on `.env.example`):

```bash
cp .env.example .env.local
```

Then fill in your Firebase credentials from the Firebase Console:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Architecture

### Data Model

Listings are stored in Firestore at: `users/{userId}/listings/{listingId}`

Each listing document contains:
- `id`: Unique listing identifier
- `userId`: Anonymous user ID
- `status`: Current processing status (uploading, processing_bg, ai_complete, etc.)
- `originalUrl`: URL to original uploaded image
- `processedUrl`: URL to background-removed image
- `ai`: AI-generated content (title, description, pricing)
- User-editable fields: `title`, `description`, `price`, `category`

### Status Flow

1. **Uploading** - Image is being uploaded to Firebase Storage
2. **Processing Background** - Remove.bg API is processing the image
3. **BG Removed** - Background removed, waiting for AI
4. **Generating AI** - Gemini AI is generating listing content
5. **AI Complete / Ready** - Listing is ready to post!

### Components

- `App.tsx`: Main app container with header
- `ListingForm.tsx`: Main form component with image upload and listing details
- `StatusIndicator.tsx`: Visual status indicator with animations
- `useListing.ts`: React hook for managing listing state
- `listingService.ts`: Firestore service layer
- `firebase.ts`: Firebase configuration and anonymous auth

## Firebase Functions Integration

The frontend automatically triggers Cloud Functions when:
1. User uploads an image → Storage trigger processes background removal
2. Background removed → Function calls Gemini AI for content generation
3. AI completes → Real-time listener updates UI automatically

No manual API calls needed - everything is event-driven!

## Development Notes

- Uses Vite for fast development and building
- TypeScript for type safety
- Firebase SDK v9+ (modular imports)
- No external UI library - custom inline styles for minimal bundle size

## Testing Locally with Firebase Emulators

To test the full flow locally:

```bash
# In root directory
firebase emulators:start
```

Then update `.env.local` to point to emulators:

```env
VITE_FIREBASE_AUTH_DOMAIN=localhost
```

## Deployment

Deploy to Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

Or deploy to Vercel/Netlify - just point to the `dist` directory after building.

---

## Original Vite + React + TypeScript Template Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

