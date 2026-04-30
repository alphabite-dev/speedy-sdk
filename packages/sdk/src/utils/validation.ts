import { SpeedyValidationError } from "./errors";

/**
 * Parses an ID (string or number) to a number and validates it
 * @param id - The ID to parse (string or number)
 * @returns The parsed number
 * @throws SpeedyValidationError if the ID cannot be converted to a valid number
 */
export function parseId(id: string | number | undefined): number {
  if (id === undefined || id === null) {
    throw new SpeedyValidationError("ID is required", "id", id);
  }

  if (typeof id === "string" && id.trim() === "") {
    throw new SpeedyValidationError("ID cannot be empty", "id", id);
  }

  const parsed = Number(id);

  if (isNaN(parsed) || !isFinite(parsed)) {
    throw new SpeedyValidationError(
      `ID must be a valid number, received: ${id}`,
      "id",
      id
    );
  }

  return parsed;
}

/**
 * Parses an optional ID (string or number) to a number and validates it
 * @param id - The ID to parse (string or number or undefined)
 * @returns The parsed number or undefined if id is undefined
 * @throws SpeedyValidationError if the ID cannot be converted to a valid number
 */
export function parseOptionalId(id: string | number | undefined): number | undefined {
  if (id === undefined || id === null) {
    return undefined;
  }

  return parseId(id);
}

/**
 * Parses input object by converting specified ID fields from string | number to number
 * @param input - The input object
 * @param fieldName - The name of the field to parse (optional or required)
 * @returns A new object with the specified field parsed to number
 */
export function parseInput<T extends Record<string, any>>(
  input: T,
  fieldName: keyof T
): T {
  const value = input[fieldName];
  return {
    ...input,
    [fieldName]: value !== undefined && value !== null ? parseId(value) : undefined,
  };
}
