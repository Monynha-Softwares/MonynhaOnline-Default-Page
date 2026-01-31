import type { IconName } from "./IconFactory";

export type CategoryInput = {
  id: string;
  name: string;
  color: string;
  icon: IconName;
};

export type CategoryFlyweight = Readonly<CategoryInput>;

const categoryCache = new Map<string, CategoryFlyweight>();

export const primeCategories = (categories: CategoryInput[]): CategoryFlyweight[] => {
  categories.forEach((category) => {
    if (!categoryCache.has(category.id)) {
      categoryCache.set(category.id, Object.freeze({ ...category }));
    }
  });
  return getCategories();
};

export const getCategory = (id: string): CategoryFlyweight | null => {
  return categoryCache.get(id) ?? null;
};

export const getCategories = (): CategoryFlyweight[] => {
  return Object.freeze([...categoryCache.values()]);
};

export const resetCategories = () => {
  categoryCache.clear();
};
