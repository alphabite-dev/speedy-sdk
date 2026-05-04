import { describe, it, expect } from "vitest";
import { parseCsv, coerceRow, parseCsvRows } from "../../src/utils/csv";

describe("parseCsv", () => {
  it("parses simple header + rows", () => {
    const csv = "id,name\n1,foo\n2,bar\n";
    expect(parseCsv(csv)).toEqual([
      { id: "1", name: "foo" },
      { id: "2", name: "bar" },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("strips UTF-8 BOM", () => {
    const csv = "﻿id,name\n1,foo\n";
    expect(parseCsv(csv)).toEqual([{ id: "1", name: "foo" }]);
  });

  it("handles CRLF line endings", () => {
    const csv = "id,name\r\n1,foo\r\n2,bar\r\n";
    expect(parseCsv(csv)).toEqual([
      { id: "1", name: "foo" },
      { id: "2", name: "bar" },
    ]);
  });

  it("handles missing trailing newline", () => {
    const csv = "id,name\n1,foo";
    expect(parseCsv(csv)).toEqual([{ id: "1", name: "foo" }]);
  });

  it("parses quoted fields containing commas", () => {
    const csv = 'id,name\n1,"foo,bar"\n';
    expect(parseCsv(csv)).toEqual([{ id: "1", name: "foo,bar" }]);
  });

  it("parses escaped double quotes inside quoted field", () => {
    const csv = 'id,name\n1,"she said ""hi"""\n';
    expect(parseCsv(csv)).toEqual([{ id: "1", name: 'she said "hi"' }]);
  });

  it("parses newlines inside quoted fields", () => {
    const csv = 'id,name\n1,"line1\nline2"\n';
    expect(parseCsv(csv)).toEqual([{ id: "1", name: "line1\nline2" }]);
  });

  it("treats missing trailing fields as empty string", () => {
    const csv = "a,b,c\n1,2\n";
    expect(parseCsv(csv)).toEqual([{ a: "1", b: "2", c: "" }]);
  });

  it("skips fully blank rows", () => {
    const csv = "id,name\n1,foo\n\n2,bar\n";
    expect(parseCsv(csv)).toEqual([
      { id: "1", name: "foo" },
      { id: "2", name: "bar" },
    ]);
  });
});

describe("coerceRow", () => {
  it("coerces numeric fields", () => {
    const out = coerceRow<{ id: number; name: string }>(
      { id: "42", name: "foo" },
      { numeric: ["id"] }
    );
    expect(out).toEqual({ id: 42, name: "foo" });
  });

  it("coerces boolean fields from 'true'/'false'", () => {
    const out = coerceRow<{ flag: boolean }>(
      { flag: "true" },
      { boolean: ["flag"] }
    );
    expect(out.flag).toBe(true);
  });

  it("coerces boolean fields from '1'/'0'", () => {
    const out = coerceRow<{ flag: boolean }>(
      { flag: "1" },
      { boolean: ["flag"] }
    );
    expect(out.flag).toBe(true);
    const out2 = coerceRow<{ flag: boolean }>(
      { flag: "0" },
      { boolean: ["flag"] }
    );
    expect(out2.flag).toBe(false);
  });

  it("converts empty strings to undefined", () => {
    const out = coerceRow<Record<string, unknown>>(
      { id: "1", note: "" },
      { numeric: ["id"] }
    );
    expect(out.id).toBe(1);
    expect(out.note).toBeUndefined();
  });

  it("falls back to original string when numeric parse fails", () => {
    const out = coerceRow<Record<string, unknown>>(
      { id: "not-a-number" },
      { numeric: ["id"] }
    );
    expect(out.id).toBe("not-a-number");
  });

  it("leaves unknown fields as raw strings", () => {
    const out = coerceRow<Record<string, unknown>>(
      { id: "1", name: "foo" },
      { numeric: ["id"] }
    );
    expect(out.name).toBe("foo");
  });
});

describe("parseCsvRows", () => {
  it("parses + coerces in one call", () => {
    const csv = "id,name,active\n1,foo,true\n2,bar,false\n";
    const rows = parseCsvRows<{ id: number; name: string; active: boolean }>(
      csv,
      { numeric: ["id"], boolean: ["active"] }
    );
    expect(rows).toEqual([
      { id: 1, name: "foo", active: true },
      { id: 2, name: "bar", active: false },
    ]);
  });

  it("handles real-world country-style row with quoted commas", () => {
    const csv =
      "id,name,nameEn,isoAlpha2,isoAlpha3,requireState\n" +
      '100,"BULGARIA, REPUBLIC","Bulgaria",BG,BGR,false\n';
    const rows = parseCsvRows<{
      id: number;
      name: string;
      nameEn: string;
      isoAlpha2: string;
      isoAlpha3: string;
      requireState: boolean;
    }>(csv, { numeric: ["id"], boolean: ["requireState"] });
    expect(rows).toEqual([
      {
        id: 100,
        name: "BULGARIA, REPUBLIC",
        nameEn: "Bulgaria",
        isoAlpha2: "BG",
        isoAlpha3: "BGR",
        requireState: false,
      },
    ]);
  });

  it("returns [] for empty CSV", () => {
    expect(parseCsvRows("")).toEqual([]);
  });
});
