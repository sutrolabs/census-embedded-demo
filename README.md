# [Census Embedded](https://developers.getcensus.com/embedded/overview) (Demo)

This project showcases how to embed Census Reverse ETL in a [Next.js](https://nextjs.org/) web app. 

Main features:
- Developer authentication via Personal Access Token
- Use Census Connect to have users authorize access to destinations
- Create, edit, and monitor syncs via API

## Docs

For more details on how to use Census Embedded, please refer to the main documentation:

https://developers.getcensus.com/embedded/overview

## Local development

To run this project locally, you will need to [download and install Node.js](https://nodejs.org/en/download/current).

Initialize the project dependencies with...


```bash
npm install
```

...and then you can start up the web service with...

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Deploy to Netlify

This project also supports deploying to [Netlify](https://www.netlify.com/).

If you just want to deploy right away, you can click this button:

[![Deploy to Netlify Button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sutrolabs/census-embedded-demo)

Alternatively, you can install and set up the Netlify project via CLI:

```bash
npm install -g netlify-cli

netlify init
```

Then you can use `netlify deploy` to manually deploy and `netlify open` to open your project dashboard.