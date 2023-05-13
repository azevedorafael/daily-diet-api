- mkdir daily-diet-api
- cd daily-diet-api
- npm init -y
- npm i -D typescript
- npm install -D @types/node
- npx tsc --init
- npx tsc src/server.ts
- node src/server.js
- time node src/server.js

- npm install tsx -D
- npx tsx src/server.ts

- npm i -D eslint @rocketseat/eslint-config

- npm install knex sqlite3
- npx knex migrate:make create-meals
- npm run knex -- migrate:make create-meals
- npm run knex -- migrate:latest
- npm run knex -- migrate:rolback
- npm run knex -- migrate:up/down --migration-name.ts

- npm i vitest -D
- npx vitest
- npm i supertest -D
