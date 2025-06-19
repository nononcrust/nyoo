import { z } from "zod/v4";

/**
 * 쿼리 파라미터 목록을 나타내는 Zod 스키마를 정의합니다.
 *
 * @example
 * const QueryState = defineQueryState({
 *   page: Parser.Page.catch(1),
 *   sort: Parser.OneOf(["asc", "desc"]).catch("asc"),
 * })
 */
export const defineQueryState = z.object;
