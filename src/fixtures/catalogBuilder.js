const buildCatalogItem = (index, overrides = {}) => {
  return {
    id: `trk-${100 + index}`,
    title: `Test Track ${index}`,
    type: "track",
    ...overrides
  };
};

const buildCatalog = (count) => {
  return Array.from({ length: count }, (_, index) => buildCatalogItem(index + 1));
};

module.exports = { buildCatalogItem, buildCatalog };
