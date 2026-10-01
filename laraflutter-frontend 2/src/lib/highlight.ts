import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import dart from "highlight.js/lib/languages/dart";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("php", php);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(code: string, lang: string): string {
  try {
    return hljs.highlight(code, { language: lang }).value;
  } catch {
    return escapeHtml(code);
  }
}

export function lineCount(code: string): number {
  return code.split("\n").length;
}
