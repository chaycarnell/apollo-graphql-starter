import { ApolloServerPlugin } from '@apollo/server';

import { CustomContext } from '../types/interfaces';
import logger from '../utils/logger';

export const LoggingPlugin = (): ApolloServerPlugin<CustomContext> => ({
  async requestDidStart({ contextValue, request }) {
    // Do not log introspection requests
    const isIntrospectionQuery = request.operationName === 'IntrospectionQuery';
    if (!isIntrospectionQuery)
      logger.info(
        `New request: LogTraceId ${contextValue.logTraceId} | Operation ${request.operationName}`,
      );
    return {
      // Handle logging response status
      async willSendResponse() {
        if (!isIntrospectionQuery) {
          logger.info(
            `Returning response: LogTraceId ${contextValue.logTraceId} | Operation ${request.operationName}`,
          );
        }
      },
      // Handle logging errors encountered
      async didEncounterErrors({ errors }) {
        logger.error(
          `Error encountered: LogTraceId ${contextValue.logTraceId} | Operation ${request.operationName} - Details:\n`,
          errors,
        );
      },
    };
  },
});

export default LoggingPlugin;
