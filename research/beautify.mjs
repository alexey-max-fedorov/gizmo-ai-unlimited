import { readFileSync, writeFileSync } from "fs"
import pkg from "js-beautify"
const { js: beautify } = pkg

const input = readFileSync("entry.min.js", "utf8")

const output = beautify(input, {
  indent_size: 2,
  indent_char: " ",
  max_preserve_newlines: 2,
  preserve_newlines: true,
  keep_array_indentation: false,
  break_chained_methods: false,
  space_before_conditional: true,
  unescape_strings: false,
  jslint_happy: false,
  end_with_newline: true,
  wrap_line_length: 0,
  comma_first: false,
  e4x: false,
  indent_empty_lines: false,
  templating: ["auto"],
  // no timeout — file is ~18MB
})

writeFileSync("entry.js", output)
console.log(`Done. Input: ${(input.length / 1e6).toFixed(1)}MB → Output: ${(output.length / 1e6).toFixed(1)}MB`)
