# portfolio

My personal site. A content driven portfolio for my experience, projects and
homelab, plus a little "sign the wall" guestbook people can draw a note on.
Built with react, typescript and vite, with a small spring boot + sqlite api
behind the wall.

## how to start

Install the web deps once from the repo root:

```bash
npm install
```

The site and the api run as two processes in dev. In separate terminals:

```bash
cd server && ./gradlew bootRun   # notes api on :8787, sqlite lands in server/data
npm run dev:web                  # vite dev server, proxies /api to the api above
```

Then open the vite url it prints. The api is optional if you are only touching
the site, the wall page just shows an empty state until it can reach it.

## build

```bash
npm run build     # type checks and builds the web app into web/dist
```

## deploy

Runs as docker compose on my homelab: caddy serves the static build and reverse
proxies /api to the notes api, cloudflared exposes it with no port forwarding.

```bash
cp .env.example .env   # set TUNNEL_TOKEN and IP_SALT
./deploy.sh
```

## structure

- `web/` is the vite app.
  - `web/src/lib` is the content i actually edit: experience, skills, projects,
    services and lab notes. typed data, no cms.
  - `web/src/components` are the section and layout pieces.
  - `web/src/pages` are the routed views (home, projects, project detail,
    homelab, notes, wall).
  - `web/src/index.css` holds the global styles and tokens.
- `server/` is the spring boot + sqlite notes api (get/post on `/api/notes`).
- `shared/` is the note types and limits the web side shares.

Routing is a small hand rolled client router in `web/src/hooks/useRoute.ts`, so
no framework router.
