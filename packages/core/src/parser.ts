import { z } from "zod/v4";

const Page = z.coerce.number().int().positive();

const StarRating = z.enum(["1", "2", "3", "4", "5"]).transform(Number);

const Boolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const ArrayOf = <T extends readonly string[]>(value: T) =>
  z
    .string()
    .transform((value) => value.split(","))
    .readonly()
    .pipe(z.array(z.enum(value)).readonly());

const OneOf = <T extends readonly string[]>(value: T) => z.enum(value);

// Date

export const Parser = {
  /**
   * 페이지 번호를 나타내는 쿼리 파라미터를 정의합니다.
   * 페이지 번호로는 1보다 큰 정수만 허용됩니다.
   *
   * "1" -> 1
   * "2" -> 2
   * "3" -> 3
   *
   * @example
   * SearchParam.Page.catch(1)
   *
   */
  Page,
  /**
   * boolean을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * "true" -> true
   * "false" -> false
   *
   * @example
   * SearchParam.Boolean.catch(false)
   *
   */
  Boolean,
  /**
   * 문자열로 이루어진 배열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * "book%2Cclothing" -> ["book", "clothing"]
   *
   * @example
   * SearchParam.ArrayOf(["book", "clothing"]).catch([])
   *
   */
  ArrayOf,
  /**
   * 특정 문자열을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.Enum(["asc", "desc"]).catch("asc")
   */
  OneOf,
  /**
   * 별점(1, 2, 3, 4, 5)을 나타내는 쿼리 파라미터를 정의합니다.
   *
   * @example
   * SearchParam.StarRating.catch(5)
   * SearchParam.StarRating.nullable().catch(null)
   */
  StarRating,
};
