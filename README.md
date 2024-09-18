# Next.js Fullstack DigitalOcean Droplet VM

Fullstack Next.js (App Router) deployed to DigitalOcean App Platform

## Local Development

### Prerequisites

- **Node.js** installed on your machine (download [here](https://nodejs.org/en/download))

### Installation

```sh
git clone https://github.com/spencerlepine/nextjs-digitalocean-poc
cd nextjs-digitalocean-poc
npm install
```

### Run Locally

```sh
cp .env.template .env.local
npm run dev
# visit http://locahost:3000
```

### Production Build

```sh
cp .env.template .env.production
NODE_ENV=production npm run build
```

## Resources

- Next.js docs: https://nextjs.org/docs/getting-started/installation
