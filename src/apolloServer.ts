import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFormattedError } from 'graphql';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import errorHandler from './utils/errorHandler';
import logger from './utils/logger';
import loggerPlugin from './utils/loggerPlugin';

const typeDefs = loadFilesSync(path.join(__dirname, '../schemas/**/*.graphql'));
const resolvers = loadFilesSync(
  path.join(__dirname, 'schemas/**/*.resolver.*'),
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const port = (process.env.PORT && Number(process.env.PORT)) || 4001;

const isProduction = process.env.NODE_ENV === 'production';

const landingPage = isProduction
  ? ApolloServerPluginLandingPageDisabled()
  : ApolloServerPluginLandingPageLocalDefault();

const server = new ApolloServer({
  schema,
  plugins: [landingPage, loggerPlugin()],
  logger,
  formatError: (formattedError: GraphQLFormattedError, __: unknown) =>
    errorHandler(formattedError),
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      // Generate a UUID for log tracing through server
      const logTraceId = uuidv4();
      // Mock example of adding a user to request context if authorization header present
      // For production suggest to use GraphQL Shield in combination with JWT validation/decode utils
      const user = (req.headers.authorization && { id: '1000' }) || undefined;
      // Apply context to request
      return { user, logTraceId };
    },
    listen: { port },
  });
  logger.info(`Server ready at ${url}`);
})();
