export function formatWKT(input, type) {
  input = input.trim();
  let hasType = /^(POLYGON|MULTIPOLYGON|LINESTRING|POINT)\s*\(/i.test(input);

  if (!hasType) {
    if (/^\(.*\)$/.test(input)) {
      input = `${type}(${input})`;
    } else {
      input = `${type}((${input}))`;
    }
  }

  input = input.replace(/"?\^\^geo:wktLiteral"?$/i, '');

  if (!/^"/.test(input)) {
    input = `"${input}"`;
  }

  if (!/\^\^geo:wktLiteral$/i.test(input)) {
    input += '^^geo:wktLiteral';
  }

  return input;
}
