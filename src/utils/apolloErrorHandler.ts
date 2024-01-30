import { GraphQLFormattedError } from 'graphql';

import { getError } from '../common/errors';
import { ErrorObject } from '../types/interfaces';

const errorHandler = (formattedError: GraphQLFormattedError): ErrorObject => {
  // Check if a GraphQL extension code is present for the error
  const extensionCode = (formattedError?.extensions?.code as string) || '';
  // Get the corresponding error response from error templates
  return getError(extensionCode);
};

export default errorHandler;
