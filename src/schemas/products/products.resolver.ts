const mockProducts = [
  { productId: '0001', productName: 'Apple' },
  { productId: '0002', productName: 'Pear' },
  { productId: '0003', productName: 'Orange' },
];

const productsResolver = {
  Query: {
    products: () => mockProducts,
  },
};

exports.resolver = productsResolver;
