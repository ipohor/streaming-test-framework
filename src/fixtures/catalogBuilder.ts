type CatalogItem = {
  id: string;
  title: string;
  type: string;
};

export const buildCatalogItem = (index: number, overrides: Partial<CatalogItem> = {}): CatalogItem => {
  return {
    id: `trk-${100 + index}`,
    title: `Test Track ${index}`,
    type: "track",
    ...overrides
  };
};

export const buildCatalog = (count: number): CatalogItem[] => {
  return Array.from({ length: count }, (_, index) => buildCatalogItem(index + 1));
};
