import { z } from "zod/v4";
import { objectEntries } from "./lib/object";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { compareValue, encodeValue } from "./lib/utils";

export const useQueryState = <TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValue: z.infer<TSchema>
) => {
  type TSearchParams = z.infer<TSchema>;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = schema.parse(Object.fromEntries(searchParams.entries()));

  const update = <TKey extends keyof TSearchParams>(
    key: TKey,
    value: TSearchParams[TKey]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (compareValue(value, defaultValue[key])) {
      params.delete(key.toString());
    } else {
      params.set(key.toString(), encodeValue(value));
    }

    router.push(pathname + "?" + params.toString());
  };

  const updateMany = (
    entries: Partial<
      Record<keyof TSearchParams, TSearchParams[keyof TSearchParams]>
    >
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    objectEntries(entries).forEach(([key, value]) => {
      if (compareValue(value, defaultValue[key as keyof TSearchParams])) {
        params.delete(key);
      } else {
        params.set(key, encodeValue(value));
      }
    });

    router.push(pathname + "?" + params.toString());
  };

  const remove = (key: keyof TSearchParams) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key.toString());

    router.push(pathname + "?" + params.toString());
  };

  const clear = () => {
    router.push(pathname);
  };

  return {
    value,
    defaultValue,
    update,
    updateMany,
    remove,
    clear,
  };
};
