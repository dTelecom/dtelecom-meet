# dTelecom Meet

Open-source video conferencing app **created 100% by AI agent** on [dTelecom Cloud](https://cloud.dtelecom.org)
with [`@dtelecom/server-sdk-js`](https://www.npmjs.com/package/@dtelecom/server-sdk-js) 4.x.

Think Google Meet, on dTelecom's network.

**[Live Demo](https://dtelecom-meet.vercel.app/)** | **[Documentation](https://docs.dtelecom.org)** | **[LLM Resources](https://docs.dtelecom.org/reference/llm-resources/)**

## Join on iOS or Android

In the web app, open **Invite**. Scan its QR code with the [React Native example app](https://github.com/dTelecom/client-sdk-react-native/tree/dtelecom-m150/example) or paste the copied invite link, enter your name and tap **Join room**. Join the same meeting as browser participants, publish your camera and microphone, and view a shared desktop screen. [React Native SDK](https://www.npmjs.com/package/@dtelecom/react-native)

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FdTelecom%2Fdtelecom-meet&env=DTELECOM_API_KEY,DTELECOM_API_SECRET,DTELECOM_CLOUD_URL&envDescription=Get%20your%20API%20keys%20from%20cloud.dtelecom.org&envLink=https%3A%2F%2Fcloud.dtelecom.org&project-name=dtelecom-meet&repository-name=dtelecom-meet)

You only need three environment variables:

| Variable | Description |
|---|---|
| `DTELECOM_API_KEY` | Your dTelecom API key from [cloud.dtelecom.org](https://cloud.dtelecom.org) |
| `DTELECOM_API_SECRET` | Your dTelecom API secret |
| `DTELECOM_CLOUD_URL` | `https://cloud.dtelecom.org` |

Node selection is handled by the cloud, and the host link is a signed value, so there is no
database or extra service to provision.

## Features

- **Video & audio conferencing** — camera, microphone, screen sharing
- **Pre-join preview** — test your camera/mic before entering the room
- **Host link** — the server decides who is host; see [Host link](#host-link)
- **Host controls** — remove and mute participants
- **In-room chat** — real-time text messaging via data channels
- **Live participant count** — see how many people are in a room before joining, read from the nodes
- **Webhook receiver** — an example route that verifies node events and logs them
- **Nearest node** — the cloud routes each participant to the closest node

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [@dtelecom/components-react](https://www.npmjs.com/package/@dtelecom/components-react) — LiveKitRoom, VideoConference, PreJoin, Chat
- [@dtelecom/server-sdk-js](https://www.npmjs.com/package/@dtelecom/server-sdk-js) — tokens, room service, webhook verification
- [Tailwind CSS](https://tailwindcss.com) 4

## Local Development

### 1. Get API keys

Sign up at [cloud.dtelecom.org](https://cloud.dtelecom.org), create a project and copy its **API key** and **API secret**.

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
DTELECOM_API_KEY=<your-api-key>
DTELECOM_API_SECRET=<your-api-secret>
DTELECOM_CLOUD_URL=https://cloud.dtelecom.org
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Webhooks (optional)

`app/api/webhook/route.ts` is an example receiver: it verifies each node event and logs it.
Nothing depends on it; the participant count asks the nodes directly. On Vercel the URL is set
automatically. Locally, nodes can't reach `localhost`, so if you want to see events use
[cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/):

```bash
brew install cloudflared
npm run tunnel
```

Set the printed URL as `WEBHOOK_URL` in `.env.local` and restart the dev server. A webhook URL
must be public `https`.

## Host link

The browser never says "I am the host"; the server decides, without a database:

1. **Create Room** calls `/api/create-room`. The server picks an unguessable room name (a prefix
   from your meeting name plus 12 random characters) and returns a **host key**:
   `HMAC-SHA256(secret, "host:" + room + ":" + expiry)` with a 24-hour expiry, where the secret
   is derived from `DTELECOM_API_SECRET` (`lib/host-key.ts`).
2. The tab keeps the key in `sessionStorage`. `/api/join` checks it (constant-time) and only then
   issues a host token (`roomAdmin`); everyone else joins as a guest.
3. Removing and muting participants need the same key, checked on the server.
4. **Copy host link** (in the participants panel) gives `/prejoin?room=<room>#host=<key>`: open
   it on another device to host from there. The key is after `#`, which browsers never send to a
   server; the page moves it into `sessionStorage` and clears it from the address bar. **Invite**
   shows the guest QR code and **Copy link**. In the host’s participants panel, **Show host QR**
   displays the signed host link as a QR code. Share that code only with the intended host.

Server-generated room names matter: rooms exist from the first join, so if the browser could pick
the name, anyone could get a host key for a room someone else is using.

Limits: anyone with the host link is a host until it expires; a single link can't be revoked
(rotating `DTELECOM_API_SECRET` invalidates all of them). Tokens last 6 hours, a hard limit;
extend them with `extendToken` for longer meetings. A removed participant can join again with a
new token, as with any invite link.

## Project Structure

```
app/
  page.tsx                        # Home — create a meeting or join one by name or link
  prejoin/page.tsx                # Camera/mic preview + participant count
  room/[roomName]/page.tsx        # The video conference
  api/
    create-room/route.ts          # New room name + host key
    join/route.ts                 # Token: host (valid host key) or guest
    kick/route.ts                 # Remove a participant (host key required)
    mute/route.ts                 # Mute a participant (host key required)
    room-count/route.ts           # Participants in a room, from the nodes
    webhook/route.ts              # Example receiver for node events (logs them)
components/
  ConferenceRoom.tsx              # Grid layout + sidebar panels
  CustomControlBar.tsx            # Media controls + share/chat/participants toggles
  ParticipantListPanel.tsx        # Participants, host actions and the host link
  ChatPanel.tsx                   # In-room chat
  ConnectionStateOverlay.tsx      # Reconnecting/disconnected overlay
lib/
  host-key.ts                     # Room names and signed host keys (server)
  host-session.ts                 # Host key in this tab, host and invite links (browser)
  api.ts                          # Client-side fetch helpers
  types.ts                        # Shared types (Role, metadata)
  cloud.ts                        # Server-side dTelecom Cloud client
```

## Documentation

- [dTelecom Docs](https://docs.dtelecom.org) — full platform documentation
- [Video conference with React](https://docs.dtelecom.org/guides/video-conference-react/) — the components this app uses
- [Participant tokens](https://docs.dtelecom.org/rooms/tokens/) and [Managing rooms](https://docs.dtelecom.org/rooms/manage-rooms/)
- [LLM Resources](https://docs.dtelecom.org/reference/llm-resources/) — files for AI coding assistants

## License

MIT
