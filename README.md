# Lockout 🔒

A social accountability app to help you lock in and stay focused. Start timed sessions, share proof, and build streaks with friends.

## What It Does

- **Start Focus Sessions**: Choose a duration (25/50/90 min), tag your activity (Study, Gym, Build, etc.)
- **Prove Your Work**: Capture before/after photos as proof
- **Witness System**: Pick a friend to hold you accountable - they verify your work
- **AI Challenge Verification**: If challenged, submit proof analyzed by Gemini AI for authenticity
- **Social Feed**: See what your friends are working on
- **React & Engage**: Support friends with emoji reactions
- **Social Credit System**: Friends vote on whether you truly "locked in" - earn +1 for yes, -1 for no
- **Leaderboard**: Compete with friends and climb the global rankings
- **Track Streaks**: Build consistency with daily streak tracking

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini 2.0 Flash (Vision API for photo verification)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env file
# - Firebase credentials
# - Gemini API key from https://aistudio.google.com/app/apikey

# Start the app
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup

Create a `.env` file in the project root (use `.env.example` as template):

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI Configuration
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Project Structure

```
app/                    # Expo Router screens
├── (auth)/            # Login & username setup
├── (tabs)/            # Main app tabs (Home, Friends, Camera)
└── session/           # Session flow screens

src/
├── components/        # Reusable UI components
│   ├── feed/         # Session cards, decision bar, reactions
│   ├── ui/           # Buttons, badges, timers
│   ├── witness/      # Witness notification system
│   └── ...
├── hooks/            # Custom React hooks
├── services/         # Firebase service layer
│   ├── socialCredit.ts    # Social credit scoring & leaderboards
│   ├── decisions.ts       # Tick/cross voting system
│   ├── aiVerification.ts  # Gemini AI photo verification
│   └── ...
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── utils/            # Helper functions & migrations
```

## Key Features

### Home Screen
- Quick-start "Lock In" button
- Today's completion status
- Current streak & stats

### Session Flow
1. Set duration, tag, and optional note
2. (Optional) Choose a friend as your witness/accountability partner
3. Upload "before" proof photo (required within 2 min)
4. Timer counts down
5. Upload "after" proof photo when done
6. If witness selected, they verify your work:
   - **Approved**: Session complete! ✅
   - **Rejected**: Take a challenge photo analyzed by Gemini AI
   - **Timeout (30s)**: Auto-approved
7. Session appears in feed for friends to react and vote

### Friends & Feed
- Add friends by username
- View friends' completed sessions
- React with emojis
- Vote on sessions: "Did they lock in?" (✓ or ✗)
- See engagement on your sessions

### Social Credit System
- Friends vote on your completed sessions
- **Tick (✓)**: "Yes, they locked in" = +1 point
- **Cross (✗)**: "No, they didn't lock in" = -1 point
- Score reflects community validation of your work
- View your score in profile settings

### Witness & AI Verification System
- **Choose an accountability partner** when starting a session
- Witness receives notification to verify your "after" photo
- If rejected, you have 30 seconds to submit a challenge photo
- **Gemini AI analyzes** the challenge photo for authenticity:
  - Evaluates workspace setup, focus indicators, work materials
  - Returns confidence score (0-100%) of how "locked in" you are
  - Example: "87% really locked in! Great focus! 🔥"
- All sessions remain in feed regardless of AI score (for demo purposes)

### Leaderboard
- **Integrated into Friends tab** with toggle view
- See rankings of you and your friends
- Top 3 users get medal indicators (🥇🥈🥉)
- Real-time score updates
- Pull-to-refresh for latest standings

## Social Credit Migration

If you're adding the social credit system to an existing installation with data, run the migration:

```typescript
import { runMigration } from './src/utils/migration';
await runMigration();
```

See `MIGRATION.md` for detailed instructions.

## Documentation

- **MIGRATION.md**: Guide for initializing social credit system on existing data
- **SOCIAL_CREDIT_SUMMARY.md**: Complete implementation details
- **SOCIAL_CREDIT_REFERENCE.md**: Quick reference for developers
- **AI_VERIFICATION_IMPLEMENTATION.md**: Gemini AI integration guide

## AI Verification Features

The app uses Google's Gemini 2.0 Flash model to verify challenge photos when a witness rejects a session:

- **Real-time Analysis**: Photos analyzed in seconds
- **Confidence Scoring**: AI rates "lock-in" level from 0-100%
- **Smart Evaluation**: Considers workspace, materials, body language, and focus
- **Graceful Fallback**: Mock scoring if API fails (demo resilience)
- **User Feedback**: Clear percentage display (e.g., "87% really locked in!")

Created for nwHacks 2026.
