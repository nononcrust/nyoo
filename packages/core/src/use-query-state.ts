import { z } from "zod/v4";
import { objectEntries } from "./lib/object";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { compareValue, encodeValue } from "./lib/utils";

const defaultOption: Required<UpdateOption> = {
  history: "replace",
} as const;

type UpdateOption = {
  /**
   * 쿼리 파라미터가 업데이트될 때 브라우저 히스토리에 어떻게 반영될지를 설정합니다.
   *
   * `replace`: 현재 히스토리를 유지한 채 쿼리 파라미터 상태만 업데이트합니다. (기본값)
   *
   * `push`: 새로운 히스토리를 추가합니다. 이 경우, 뒤로 가기 버튼을 눌러 이전 상태로 돌아갈 수 있습니다.
   */
  history?: "replace" | "push";
};

/**
 * 쿼리 파라미터 상태를 관리하는 커스텀 훅입니다.
 *
 * @param schema - `defineQueryState`로 생성한 Zod 스키마
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

  const update = <TKey extends keyof TSearchParams>(
    key: TKey,
    value: TSearchParams[TKey],
    options?: UpdateOption
  ) => {
    const optionsWithDefault = { ...defaultOption, ...options };

    const params = new URLSearchParams(searchParams.toString());

    if (compareValue(value, defaultValue[key])) {
      params.delete(key.toString());
    } else {
      params.set(key.toString(), encodeValue(value));
    }

    const url = pathname + "?" + params.toString();

    const updateAction: Record<Required<UpdateOption>["history"], () => void> =
      {
        push: () => router.push(url),
        replace: () => router.replace(url),
      };

    updateAction[optionsWithDefault.history]();
  };

  const updateMany = (
    entries: Partial<
      Record<keyof TSearchParams, TSearchParams[keyof TSearchParams]>
    >,
    options?: UpdateOption
  ) => {
    const optionsWithDefault = { ...defaultOption, ...options };

    const params = new URLSearchParams(searchParams.toString());

    objectEntries(entries).forEach(([key, value]) => {
      if (compareValue(value, defaultValue[key as keyof TSearchParams])) {
        params.delete(key);
      } else {
        params.set(key, encodeValue(value));
      }
    });

    const url = pathname + "?" + params.toString();

    const updateAction: Record<Required<UpdateOption>["history"], () => void> =
      {
        push: () => router.push(url),
        replace: () => router.replace(url),
      };

    updateAction[optionsWithDefault.history]();
  };

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

  const remove = (key: keyof TSearchParams) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(key.toString());

    router.replace(pathname + "?" + params.toString());
  };

  const clear = () => {
    router.replace(pathname);
  };

  return {
    /**
     * 현재 쿼리 파라미터 상태를 나타내는 값입니다.
     *
     * @example
     * value.page // 1
     * value.sort // "asc"
     */
    value,
    /**
     * 커스텀 훅을 정의할 때 전달한 기본값입니다.
     *
     * @example
     * defaultValue.page // 1
     * defaultValue.sort // "asc"
     */
    defaultValue,
    /**
     * 쿼리 파라미터를 문자열 형태로 반환합니다.
     *
     * @example
     *
     * getQueryString({ page: 2, sort: "asc" }) // "?page=2&sort=asc"
     *
     * router.replace('/products' + getQueryString({ page: 2, sort: "asc" }))
     */
    getQueryString,
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
    update,
    /**
     * 여러 개의 쿼리 파라미터를 동시에 업데이트합니다.
     *
     * value로 전달한 값이 기본값과 동일하다면 해당 파라미터를 제거합니다.
     *
     * @example
     * updateMany({ page: 2, sort: "asc" });
     */
    updateMany,
    /**
     * 특정 쿼리 파라미터를 제거합니다.
     *
     * @example
     * remove("page");
     */
    remove,
    /**
     * 모든 쿼리 파라미터를 제거하고 기본값으로 초기화합니다.
     *
     * @example
     * clear();
     */
    clear,
  };
};
