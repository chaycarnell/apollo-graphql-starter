import { GraphQLResolveInfo } from 'graphql';

import { CustomContext } from '../../types/interfaces';
import { mockProducts } from './mock';

export const resolver = {
  Query: {
    products: (
      _parent: undefined,
      _args: undefined,
      _context: CustomContext,
      _resolveInfo: GraphQLResolveInfo,
    ) => mockProducts,
  },
};
