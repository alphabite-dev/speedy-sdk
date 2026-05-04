/**
 * Minimal RFC 4180 CSV parser.
 * Speedy nomenclature CSV is UTF-8, comma-separated, header on first row,
 * fields containing commas/quotes/newlines are wrapped in double quotes,
 * embedded quotes doubled (`""`).
 */
export function parseCsv(text: string): Record<string, string>[] {
  if (!text) return [];
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      cur.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    if (c === "\n") {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = "";
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    rows.push(cur);
  }
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v.length > 0))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = r[idx] ?? "";
      });
      return obj;
    });
}

export interface CoerceSchema {
  numeric?: readonly string[];
  boolean?: readonly string[];
}

/**
 * Coerce string fields per schema. Empty strings become undefined.
 * Unknown numeric values fall back to the original string.
 */
export function coerceRow<T>(row: Record<string, string>, schema: CoerceSchema = {}): T {
  const numeric = new Set(schema.numeric ?? []);
  const bool = new Set(schema.boolean ?? []);
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(row)) {
    const v = row[k];
    if (v === "") {
      out[k] = undefined;
      continue;
    }
    if (numeric.has(k)) {
      const n = Number(v);
      out[k] = Number.isFinite(n) ? n : v;
      continue;
    }
    if (bool.has(k)) {
      out[k] = v === "true" || v === "1";
      continue;
    }
    out[k] = v;
  }
  return out as T;
}

export function parseCsvRows<T>(text: string, schema?: CoerceSchema): T[] {
  return parseCsv(text).map((r) => coerceRow<T>(r, schema));
}
