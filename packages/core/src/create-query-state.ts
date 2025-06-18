import { z } from "zod/v4";

/**
 * 쿼리 파라미터 목록을 나타내는 Zod 스키마를 생성합니다.
 *
 * @example
 * const QueryState = createQueryState({
 *   page: Parser.Page.catch(1),
 *   sort: Parser.OneOf(["asc", "desc"]).catch("asc"),
 * })
 */
export const createQueryState = z.object;
