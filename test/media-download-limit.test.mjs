import assert from "node:assert/strict";
import test from "node:test";
import { assertDeclaredSizeWithinLimit } from "../dist/bounded-response.js";

test("rejects a declared oversized axios response", () => {
  assert.throws(
    () => assertDeclaredSizeWithinLimit({ "content-length": "11" }, 10),
    /exceeds 10 bytes/,
  );
});
