import { z } from "zod/v4";

export const getQueryState = async <TSchema extends z.ZodType>(
  schema: TSchema,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) => {
  return schema.parse(await searchParams);
};
