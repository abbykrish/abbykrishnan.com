# abbykrishnan.com

Personal site built with [Eleventy](https://www.11ty.dev/) and hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) as static assets.

## Development

```sh
npm run dev       # Eleventy dev server with live reload
npm run preview   # Build, then serve through the Workers runtime (wrangler dev)
npm run deploy    # Build fresh and deploy to Cloudflare
```

## Deploys

`.github/workflows/deploy.yml` builds and deploys on every push to `main`, and also once a day so the Goodreads, Substack, and Google Sheets data stays current. It needs two repo secrets:

- `CLOUDFLARE_API_TOKEN`: a token made from the "Edit Cloudflare Workers" template, scoped to the `abbykrishnan.com` zone
- `CLOUDFLARE_ACCOUNT_ID`

## Hosting projects on subdomains

Because the `abbykrishnan.com` zone lives on Cloudflare, any Worker in this account can claim a subdomain. Cloudflare creates the DNS record and TLS certificate automatically. In the project's own repo:

```sh
npm create cloudflare@latest
```

Then add the subdomain to its `wrangler.jsonc`:

```jsonc
{
  "name": "baywheels",
  "routes": [{ "pattern": "baywheels.abbykrishnan.com", "custom_domain": true }]
}
```

Running `wrangler deploy` makes it live. From there the project can add bindings for D1, KV, R2, Durable Objects, Workers AI, Queues, and the rest of the platform.
