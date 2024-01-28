const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const routes = require('./routes')

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => await authMiddleware({ req }),
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function startServer() {
  await server.start(); 
  server.applyMiddleware({ app, path: '/graphql' }); 
}

startServer();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`GraphQL API available at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
