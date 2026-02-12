# dTelecom Meet

Open-source video conferencing app built on [dTelecom](https://dtelecom.org) — a decentralized WebRTC platform with Solana-based node discovery.

Think Google Meet, but decentralized and self-hostable.

## Features

- **Video & audio conferencing** — camera, microphone, screen sharing
- **Pre-join preview** — test your camera/mic before entering the room
- **Host controls** — kick and mute participants
- **In-room chat** — real-time text messaging via data channels
- **Live participant count** — see how many people are in a room before joining
- **Webhook integration** — SFU nodes push `participant_joined` / `participant_left` / `room_finished` events
- **Decentralized** — no single point of failure, SFU nodes discovered via Solana registry

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [@dtelecom/components-react](https://www.npmjs.com/package/@dtelecom/components-react) — LiveKitRoom, VideoConference, PreJoin, Chat
- [@dtelecom/server-sdk-js](https://www.npmjs.com/package/@dtelecom/server-sdk-js) — tokens, room service, webhook verification
- [Tailwind CSS](https://tailwindcss.com) 4

## Quick Start

### 1. Get API keys

Sign up at [cloud.dtelecom.org](https://cloud.dtelecom.org) and grab your **API Key** and **API Secret**.

### 2. Clone and install

```bash
git clone https://github.com/dTelecom/dtelecom-meet.git
cd dtelecom-meet
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
API_KEY=<your-api-key>
API_SECRET=<your-api-secret>
WEBHOOK_URL=https://<your-public-url>/api/webhook
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Webhooks (development)

dTelecom SFU nodes send webhook events to the URL embedded in the access token. Since they can't reach `localhost`, use [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/) to create a tunnel:

```bash
brew install cloudflared          # macOS — no signup required
npm run tunnel                    # starts tunnel on port 3000
```

Copy the printed URL and set `WEBHOOK_URL` in `.env.local`:

```env
WEBHOOK_URL=https://random-words.trycloudflare.com/api/webhook
```

Restart the dev server. The pre-join screen will now show live participant counts.

## Project Structure

```
app/
  page.tsx                        # Home — enter room name and identity
  prejoin/page.tsx                # Camera/mic preview + participant count
  room/[roomName]/page.tsx        # The video conference
  api/
    join/route.ts                 # Create token + resolve nearest SFU node
    webhook/route.ts              # Receive events from SFU nodes
    room-count/route.ts           # GET participant count for a room
    create-room/route.ts          # Create room (host)
    kick/route.ts                 # Remove participant (host)
    mute/route.ts                 # Mute participant (host)
components/
  ConferenceRoom.tsx              # Grid layout + sidebar panels
  CustomControlBar.tsx            # Media controls + share/chat/participants toggles
  ParticipantListPanel.tsx        # Participant list with host actions
  ChatPanel.tsx                   # In-room chat
  ConnectionStateOverlay.tsx      # Reconnecting/disconnected overlay
lib/
  api.ts                          # Client-side fetch helpers
  types.ts                        # Shared types (Role, RoomMetadata)
  room-service.ts                 # Server-side RoomServiceClient
  participant-count.ts            # In-memory webhook counter
```

## Documentation

- [dTelecom Docs](https://docs.dtelecom.org) — full platform documentation
- [Conference App Guide](https://docs.dtelecom.org/guides/conference-app) — step-by-step tutorial
- [Conference App Plan](https://github.com/dTelecom/docs/blob/main/CONFERENCE_APP_PLAN.md) — architecture blueprint

## License

MIT
