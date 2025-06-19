import { defineQueryState, Parser, useQueryState } from "nyoo";

export const CATEGORIES = ["book", "clothing", "electronics"] as const;
export const CATEGORY_LABEL: Record<(typeof CATEGORIES)[number], string> = {
  book: "도서",
  clothing: "의류",
  electronics: "전자제품",
};

export const SORT_OPTIONS = ["asc", "desc"] as const;
export const SORT_OPTION_LABEL: Record<(typeof SORT_OPTIONS)[number], string> =
  {
    asc: "오름차순",
    desc: "내림차순",
  };

const defaultValue = {
  page: 1,
  sort: "asc",
  categories: [],
  instock: false,
  rating: null,
} as const;

const ProductListPageQueryState = defineQueryState({
  page: Parser.Page.catch(defaultValue.page),
  sort: Parser.OneOf(SORT_OPTIONS).catch(defaultValue.sort),
  categories: Parser.ArrayOf(CATEGORIES).catch(defaultValue.categories),
  instock: Parser.Boolean.catch(defaultValue.instock),
  rating: Parser.Rating.nullable().catch(defaultValue.rating),
});

export const useProductListPageQueryState = () => {
  return useQueryState(ProductListPageQueryState, defaultValue);
};
