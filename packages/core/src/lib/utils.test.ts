import { compareValue, encodeValue } from "./utils";

describe("compareValue", () => {
  test("원시 값 비교", () => {
    expect(compareValue(1, 1)).toBe(true);
    expect(compareValue(1, 2)).toBe(false);
    expect(compareValue("test", "test")).toBe(true);
    expect(compareValue("test", "TEST")).toBe(false);
    expect(compareValue(true, true)).toBe(true);
    expect(compareValue(true, false)).toBe(false);
  });

  test("배열 비교", () => {
    expect(compareValue([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(compareValue([1, 2], [1, 2, 3])).toBe(false);
    expect(compareValue([1, 2, 3], [3, 2, 1])).toBe(false);
    expect(compareValue(["a", "b"], ["a", "b"])).toBe(true);
    expect(compareValue(["a", "b"], ["b", "a"])).toBe(false);
  });
});

describe("encodeValue", () => {
  test("원시 값 인코딩", () => {
    expect(encodeValue(1)).toBe("1");
    expect(encodeValue("test")).toBe("test");
    expect(encodeValue(true)).toBe("true");
  });

  test("배열 인코딩", () => {
    expect(encodeValue([1, 2, 3])).toBe("1,2,3");
    expect(encodeValue(["a", "b", "c"])).toBe("a,b,c");
    expect(encodeValue([])).toBe("");
  });
});
