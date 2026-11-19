import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormField } from "../src/components/admin/FormField";
import { RouteError } from "../src/components/shared/RouteError";

test("form field associates label, help and errors for assistive technology", () => {
  const html = renderToStaticMarkup(createElement(FormField, { name: "email", label: "Email", hint: "Alamat kerja", errors: ["Email tidak valid"] }));
  assert.match(html, /for="email"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="email-hint email-errors"/);
  assert.match(html, /id="email-errors" role="alert"/);
  assert.match(html, /Email tidak valid/);
});

test("error fallback offers recovery without exposing server details", () => {
  const html = renderToStaticMarkup(createElement(RouteError, { error: new Error("password=secret; internal database stack"), retry: () => {} }));
  assert.match(html, /Coba lagi/);
  assert.match(html, /role="alert"/);
  assert.doesNotMatch(html, /secret|database stack/);
});
