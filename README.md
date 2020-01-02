# Serverless TDD starter
Test Driven Development starter for Serverless and NodeJS. Featuring persistent MongoDB connections on suspended execution of functions.

To get started, read the full article on Medium: 

* [If TDD is Zen, adding Serverless brings Nirvana - part #1](https://medium.com/@ledfusion/tdd-means-zen-along-with-serverless-means-nirvana-a39a76ee8e63)
* [If TDD is Zen, adding Serverless brings Nirvana - part #2](https://medium.com/@ledfusion/if-tdd-is-zen-adding-serverless-brings-nirvana-part-2-2d4e899b324d)

## Main commands

Install the dependencies:

```
npm install
```

Start a local MongoDB server:

```
mongod
```

Develop locally: 

```
npm start
```

Test locally:

```
npm test
```

Deploy to staging:

```
npm run deploy
```

Deploy to production:

```
npm run deploy:prod
```

