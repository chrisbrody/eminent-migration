## Running Locally

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Slice Machine

To start the slice machine locally
```
npx slice-machine-ui
```
you should see the success message: Slice Machine v2.17.1  → Running at http://localhost:9999

## Deploying
Pushing to the main branch with deploy that version to vercel, if the deployment passes that will become the current version.