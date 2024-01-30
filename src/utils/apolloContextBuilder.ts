import { StandaloneServerContextFunctionArgument } from '@apollo/server/dist/esm/standalone';
import { v4 as uuidv4 } from 'uuid';

const contextBuilder = async ({
  req,
}: StandaloneServerContextFunctionArgument) => {
  // Generate a UUID for log tracing through server
  const logTraceId = uuidv4();
  // Mock example of adding a user to request context if authorization header present
  // For production suggest to use GraphQL Shield in combination with JWT validation/decode utils
  const user = (req.headers.authorization && { id: '1000' }) || undefined;
  // Apply context to request
  return { user, logTraceId };
};

export default contextBuilder;
