import type { ZodType } from "zod";

export const validateForm = <T>(
  schema: ZodType<T, any, any>,
  values: unknown
): Record<string, string> | undefined => {
  const result = schema.safeParse(values);

  if (result.success) return undefined;

  alert(result.error.issues[0]?.message);

  const errors: Record<string, string> = {};

  result.error.issues.forEach((err) => {
    const field = err.path[0];
    if (typeof field === "string") {
      errors[field] = err.message;
    }
  });

  return errors;
};
