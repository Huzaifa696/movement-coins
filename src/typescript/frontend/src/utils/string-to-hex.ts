/**
 * Converts a string to hex format for use in smart contracts
 * @param str The string to convert to hex
 * @returns A hex string prefixed with 0x
 */
export function stringToHex(str: string): string {
  if (!str) return '0x00';
  
  let hex = '0x';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hex += charCode.toString(16).padStart(2, '0');
  }
  return hex;
} 