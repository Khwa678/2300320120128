# Notification System - React/Next.js Application

A responsive, production-ready notification management application built with **React** and **Next.js**, styled with **Material UI**.

## Features

### ✨ Core Features
- **All Notifications Page**: Display complete list of notifications with filtering and pagination
- **Priority Page**: Shows top "n" priority notifications with adjustable limit (1-20)
- **Filter by Type**: Filter notifications by severity (info, warn, error, success)
- **View Status**: Distinguish between new and already viewed notifications
- **Mark as Read**: Button to mark notifications as read (client-side state)
- **Notification Counts**: Display count for each notification type

### 🎨 UI/UX
- **Material UI Only**: Uses Material UI exclusively for styling (no ShadCN, no custom CSS libraries)
- **Responsive Design**: Optimized for desktop and mobile views
- **Grid Layout**: Cards display in responsive grid (1 col on mobile, 2 on tablet, 3+ on desktop)
- **Clear Navigation**: Top AppBar with navigation between pages
- **Accessibility**: Proper semantic HTML and ARIA labels

### 🔧 Technical Stack
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Material UI (@mui/material)
- **Runtime**: Node.js 24+
- **Port**: http://localhost:3000

## Project Structure

```
notification-app/
├── app/
│   ├── layout.tsx              # Root layout with AppBar navigation
│   ├── page.tsx                # All Notifications page
│   ├── priority/
│   │   └── page.tsx            # Priority Notifications page
│   ├── components/
│   │   ├── NotificationList.tsx  # Reusable notification display component
│   │   └── NotificationFilter.tsx # Filter component
│   ├── lib/
│   │   └── api.ts              # API client functions
│   └── globals.css             # Global styles
├── public/                     # Static assets
├── package.json
└── tsconfig.json
```

## Installation & Setup

### Prerequisites
- Node.js v24+ 
- npm or yarn

### Steps

1. **Navigate to the project directory**
   ```bash
   cd "c:\Users\khawa\important placements\notification-app"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to: `http://localhost:3000`

## Pages & Components

### All Notifications (`/`)
- Displays all notifications from the API
- Filter by severity type
- Shows notification counts
- Mark notifications as read
- Responsive card grid layout

### Priority Notifications (`/priority`)
- Shows top N priority notifications
- Adjustable slider to change the limit (1-20)
- Same features as All Notifications page

### Components

#### NotificationList
Reusable component for displaying notification cards with:
- Severity badge (colored)
- View status indicator (New/Viewed)
- Formatted timestamp
- Mark as Read button (when not viewed)
- Responsive grid layout

#### NotificationFilter
Filter component with:
- Dropdown selector for notification types
- Count badges for each type
- Real-time filtering

## API Integration

The app communicates with the backend API at:
```
http://4.224.186.213/evaluation-service/notifications
```

### Supported Query Parameters
- `limit` - Number of notifications to return
- `page` - Page number for pagination
- `notification_type` - Filter by type (info, warn, error, success)
- `priority` - Filter by priority level

### Authorization
- Uses Bearer token authentication
- Token: `NEXT_PUBLIC_API_TOKEN` (environment variable)
- Default fallback: `default-eval-key`

## Development

### Build for production
```bash
npm run build
npm start
```

### Run tests (when implemented)
```bash
npm test
```

### Code Quality
- TypeScript for type safety
- Material UI components for consistency
- Responsive design patterns
- Clean component architecture

## Responsive Design Breakpoints

- **Mobile**: 0-600px (1-column grid)
- **Tablet**: 600-960px (2-column grid)
- **Desktop**: 960px+ (3+ column grid)

## Notification Data Structure

```typescript
interface Notification {
  id: number;
  message: string;
  severity: 'info' | 'warn' | 'error' | 'success';
  createdAt: string;  // ISO 8601 format
  viewed?: boolean;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- All state management is client-side (no external state library needed)
- View status is stored in React state (resets on page refresh)
- No additional CSS libraries used - Material UI provides all styling
- Clean separation of concerns with API, components, and pages

## Video Recording

A video recording of the application demonstrating both desktop and mobile views is included in the submission.

---

Built with ❤️ using React, Next.js, and Material UI
