
# Next E-commerce

Fullstack e-commerce application using technologies such as:

- Next.js

- Tailwind CSS

- PostgreSQL

- Prisma

- Daisy UI

- Stripe 

- Zustand 

- Next-auth 

- Vercel


## Features

- Full stack application

- User authentication (including Google Signin)

- Secure payments methods, including Apple Pay, Google Pay, and credit/debit cards

- Email invoicing (WIP)

- User profiles and history

- Stylish design




## Demo

https://next-ecommerce-dariomnalerio.vercel.app/

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

`DATABASE_URL`

And these to your .env.local file:

`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
`STRIPE_SECRET_KEY`
`NEXTAUTH_SECRET`
`NEXTAUTH_URL`
`STRIPE_WEBHOOK_SECRET`


## Run Locally

Clone the project

```bash
  git clone https://github.com/dariomnalerio/next-ecommerce
```

Go to the project directory

```bash
  cd next-ecommerce
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Use the --forward-to flag to send all Stripe events in test mode to your local webhook endpoint

```bash
stripe listen --forward-to localhost:4242/stripe_webhooks
```

## Authors

- [@dariomnalerio](https://github.com/dariomnalerio)

