import { GraphQLFormattedError } from 'graphql';

interface ErrorObject {
  code: number;
  message: string;
}

interface ErrorMap {
  [error: string]: ErrorObject;
}

// Map of known error types to be returned to client
const errorTypes: ErrorMap = {
  UNAUTHENTICATED: { code: 401, message: 'UNAUTHENTICATED' },
  FORBIDDEN: { code: 403, message: 'FORBIDDEN' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'INTERNAL_SERVER_ERROR' },
  GRAPHQL_VALIDATION_FAILED: {
    code: 500,
    message: 'GRAPHQL_VALIDATION_FAILED',
  },
  UNKNOWN: { code: 500, message: 'UNKNOWN_ERROR' },
};

const errorHandler = (formattedError: GraphQLFormattedError): ErrorObject => {
  const getError = (errorCode: string) => {
    if (!errorTypes[errorCode]) {
      return errorTypes.UNKNOWN;
    }
    return errorTypes[errorCode];
  };
  // Check if a GraphQL extension code is present for the error
  const extensionCode = (formattedError?.extensions?.code as string) || '';
  // Get the corresponding error response from error templates
  const responseObject = getError(extensionCode);
  return {
    code: responseObject.code,
    message: responseObject.message,
  };
};

export default errorHandler;
