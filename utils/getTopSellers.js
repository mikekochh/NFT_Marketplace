export const getTopSellers = (properties) => {
  const sellers = properties.map((property) => property.seller);
  const uniqueSellers = [...new Set(sellers)];
  const topSellers = uniqueSellers.map((seller) => {
    const sellerProperties = properties.filter((property) => property.seller === seller);
    const totalValue = sellerProperties.reduce((a, b) => a + Number(b.price), 0);
    return {
      seller,
      totalValue,
      rank: 0,
    };
  });

  topSellers.sort((a, b) => b.totalValue - a.totalValue);

  topSellers.forEach((seller, index) => {
    seller.rank = index + 1;
  });

  return topSellers;
};
