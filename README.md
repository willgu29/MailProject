# mail-project

> Send mail

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm start
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Backpack

We use [backpack](https://github.com/palmerhq/backpack) to watch and build the application, so you can use the latest ES6 features (module syntax, async/await, etc.).


## App Flow

1. Create a campaign via '/api/campaigns/test' and edit values in mlab
2. Edit campaign via '/trackview/dashboard' --HTML and emails
3. When ready, run '/api/campaigns/convert/:id' to create mail objects
4. Then, '/api/campaigns/send/:id' to queue mail object into RabbitMQ (isAdmin)
5. RabbitMQ will be listening as sendMailListener.js
6. RabbitMQ will be rate limited via token buckets, raise limit by time table
7. Emails sent, opened, and unsubscribed will be automatically tracked.
8. Emails bounced will be manually added by admin, ensuring ensures bounced and unsubscribed are not sent to again is yet to be implemented.
