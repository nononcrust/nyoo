export const compareValue = (a: unknown, b: unknown) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length && a.every((value, index) => value === b[index])
    );
  }

  return a === b;
};

export const encodeValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.join(",");
  }

  return String(value);
};
