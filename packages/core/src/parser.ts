import { z } from "zod/v4";

const Page = z.coerce.number().int().positive();

const OneOf = <T extends readonly string[]>(value: T) => z.enum(value);

const ArrayOf = <T extends readonly string[]>(value: T) =>
  z
    .string()
    .transform((value) => value.split(","))
    .readonly()
    .pipe(z.array(z.enum(value)).readonly());

const Boolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const Rating = z.enum(["1", "2", "3", "4", "5"]).transform(Number);

const Date = z.iso.date();

export const Parser = {
  /**
   * 페이지 번호를 나타내는 쿼리 파라미터입니다.
   *
   * "1" -> 1
   * "2" -> 2
   * "3" -> 3
   *
   * @example
   * Parser.Page.catch(1)
   *
   */
  Page,
  /**
   * boolean을 나타내는 쿼리 파라미터입니다.
   *
   * "true" -> true
   * "false" -> false
   *
   * @example
   * Parser.Boolean.catch(false)
   *
   */
  Boolean,
  /**
   * 특정 문자열들의 배열을 나타내는 쿼리 파라미터입니다.
   *
   * "book%2Cclothing" -> ["book", "clothing"]
   *
   * @example
   * Parser.ArrayOf(["book", "clothing"]).catch([])
   *
   */
  ArrayOf,
  /**
   * 특정 문자열을 나타내는 쿼리 파라미터입니다.
   *
   * @example
   * Parser.OneOf(["asc", "desc"]).catch("asc")
   */
  OneOf,
  /**
   * 평점(1, 2, 3, 4, 5)을 나타내는 쿼리 파라미터입니다.
   *
   * @example
   * Parser.Rating.catch(5)
   * Parser.Rating.nullable().catch(null)
   */
  Rating,
  Date,
};
