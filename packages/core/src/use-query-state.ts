import { z } from "zod/v4";
import { objectEntries } from "./lib/object";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { compareValue, encodeValue } from "./lib/utils";

/**
 * 쿼리 파라미터 상태를 관리하는 커스텀 훅입니다.
 *
 * @param schema - `createQueryState`로 생성한 Zod 스키마
 * @param defaultValue - 쿼리 파라미터의 기본값
 */
export const useQueryState = <TSchema extends z.ZodType>(
  schema: TSchema,
  defaultValue: z.infer<TSchema>
) => {
  type TSearchParams = z.infer<TSchema>;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = schema.parse(Object.fromEntries(searchParams.entries()));

  /**
   * 하나의 쿼리 파라미터를 업데이트합니다.
   *
   * value로 전달한 값이 기본값과 동일하다면 해당 파라미터를 제거합니다.
   *
   * 동시에 여러 값을 업데이트해야 할 경우에는 `updateMany`를 사용하세요.
   *
   * @example
   * update("page", 2);
   * update("sort", "asc");
   */
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

  /**
   * 여러 개의 쿼리 파라미터를 동시에 업데이트합니다.
   *
   * value로 전달한 값이 기본값과 동일하다면 해당 파라미터를 제거합니다.
   *
   * @example
   * updateMany({ page: 2, sort: "asc" });
   */
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

  /**
   * 쿼리 파라미터를 문자열 형태로 반환합니다.
   *
   * @example
   *
   * getQueryString({ page: 2, sort: "asc" }) // "?page=2&sort=asc"
   *
   * router.push('/products' + getQueryString({ page: 2, sort: "asc" }))
   */
  const getQueryString = (
    entries: Partial<
      Record<keyof TSearchParams, TSearchParams[keyof TSearchParams]>
    >
  ) => {
    const params = new URLSearchParams();

    objectEntries(entries).forEach(([key, value]) => {
      params.set(key, encodeValue(value));
    });

    return "?" + params.toString();
  };

  /**
   * 특정 쿼리 파라미터를 제거합니다.
   *
   * @example
   * remove("page");
   */
  const remove = (key: keyof TSearchParams) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key.toString());

    router.push(pathname + "?" + params.toString());
  };

  /**
   * 모든 쿼리 파라미터를 제거하고 기본값으로 초기화합니다.
   *
   * @example
   * clear();
   */
  const clear = () => {
    router.push(pathname);
  };

  return {
    value,
    defaultValue,
    getQueryString,
    update,
    updateMany,
    remove,
    clear,
  };
};
