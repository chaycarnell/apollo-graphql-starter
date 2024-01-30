import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFormattedError } from 'graphql';
import path from 'path';

import loggerPlugin from './plugins/loggerPlugin';
import contextBuilder from './utils/apolloContextBuilder';
import errorHandler from './utils/apolloErrorHandler';
import logger from './utils/logger';

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
    context: contextBuilder,
    listen: { port },
  });
  logger.info(`Server ready at ${url}`);
})();
