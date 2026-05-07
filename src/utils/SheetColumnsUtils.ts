export function numberToColumName(num: number): string {
  let columnName = '';
  let n = num + 1;

  while (n > 0) {
    const remainder = (n - 1) % 26;
    columnName = String.fromCharCode(65 + remainder) + columnName; // 65 is 'A'
    n = Math.floor((n - 1) / 26);
  }

  return columnName;
}

export function columNameToNumber(name: string): number {
  let num = 0;
  let multiplier = 1;

  for (let i = name.length - 1; i >= 0; i--) {
    const charCode = name.charCodeAt(i) - 'A'.charCodeAt(0) + 1; // 'A' is 1, 'B' is 2, ...
    num += charCode * multiplier;
    multiplier *= 26;
  }

  return num - 1; // Convert to zero-based index
}