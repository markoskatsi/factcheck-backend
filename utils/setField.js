export function buildSetField(fields) {
  return fields.reduce(
    (setSQL, field, index) =>
      setSQL + `${field}=:${field}` + (index === fields.length - 1 ? "" : ", "),
    " SET ",
  );
}
