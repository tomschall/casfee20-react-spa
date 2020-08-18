# Realtime Chat using GraphQL Subscriptions

This project is a realtime chat app that uses subscriptions in Hasura GraphQL Engine. It is built using React, Apollo and Hasura with Postgres DB.

Use Node Version 14.5

Run docker containers

```
docker-compose up -d
```

Run yarn

```
yarn
```

Then start frontend

```
yarn start
```

Install Hasura cli if not installed

```
npm install --global hasura-cli
```

Then run migration

```
hasura migrate apply
```

- [Fully working app](http://localhost:3000)
- [Backend](http://localhost:8080/console)

For a complete tutorial about data modelling, [check out this blog](https://hasura.io/blog/building-a-realtime-chat-app-with-graphql-subscriptions-d68cd33e73f).
