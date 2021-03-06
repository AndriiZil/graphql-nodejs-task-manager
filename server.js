const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');

const { tasks, users } = require('./constants');

dotEnv.config();

const app = express();

app.use(cors());

app.use(express.json());

const typeDefs = gql`
    type Query {
        greetings: [String]!
        tasks: [Task!]
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        tasks: [Task!]
    }
    
    type Task {
        id: ID!
        name: String!
        completed: Boolean!
        user: User!
    }
    
`
const resolvers = {
    Query: {
        greetings: () => null,
        tasks: () => tasks
    },
    Task: {
        user: ({ userId }) => users.find(user => user.id === userId)
    }
}

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
    res.send({ message: 'Good' });
});

app.listen(PORT, () => {
    console.log(`Server listening PORT: ${PORT}`);
    console.log(`Graphql Endpoint: ${apolloServer.graphqlPath}`);
});
