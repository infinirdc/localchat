# EphemeralMeet

EphemeralMeet is a location-based temporary messaging application built with Next.js.

Users automatically join chat groups based on their geographical location and a selected radius. Messages sent within these groups automatically expire after 10 minutes.

## Features

- *Location-Based Chat Groups:* Join chat rooms dynamically based on your current location and chosen radius (100m - 5km).
- *Ephemeral Messaging:* Messages disappear automatically after 10 minutes.
- *Real-time User Count:* See how many people are in your current chat area.
- *Privacy Focused:* Uses geohashing to approximate location, not precise coordinates.

## Getting Started

1.  *Install dependencies:*
    bash
    npm install
    
2.  *Run the development server:*
    bash
    npm run dev
    

## Key Technologies

- Next.js (React Framework)
- TypeScript
- Tailwind CSS (Styling)
- Shadcn/ui (UI Components)
- Lucide React (Icons)
- Browser Geolocation API
- Geohashing (basic implementation, consider a library like ngeohash)
(Note:This version uses client-side state and mock data. A full implementation would require a backend with WebSockets (e.g., SignalR as per the original proposal) for real-time communication and group management.
