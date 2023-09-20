export const sortByAddress = (properties) => {
  const sortedProperties = properties.sort((a, b) => {
    const addressA = a.name.toLowerCase();
    const addressB = b.name.toLowerCase();

    if (addressA < addressB) {
      return -1;
    }
    if (addressA > addressB) {
      return 1;
    }

    return 0;
  });
  return sortedProperties;
};

export const sortByRecentlyListed = (properties) => {
  const sortedProperties = properties.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return dateB - dateA;
  });

  return sortedProperties;
};

export const sortByPriceLowToHigh = (properties) => {
  const sortedProperties = properties.sort((a, b) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);

    return priceA - priceB;
  });
  return sortedProperties;
};

export const sortByPriceHighToLow = (properties) => {
  const sortedProperties = properties.sort((a, b) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);

    return priceB - priceA;
  });
  return sortedProperties;
};
