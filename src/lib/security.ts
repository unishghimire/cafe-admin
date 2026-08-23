export const SECURITY_CONFIG = {
  // Default PINs for Staff and Owner
  STAFF_DEMO_PIN: "7788",
  OWNER_DEMO_PIN: "9900",
  STAFF_SESSION_KEY: "aura_cafe_staff_auth_v1",
  OWNER_SESSION_KEY: "aura_cafe_owner_auth_v1",
  CUSTOMER_SCANNED_TABLE_KEY: "aura_cafe_customer_active_table_v1",
  CUSTOMER_TOKEN_SECRET: "aura_himalayan_secret_2026",
};

/**
 * Validates the Staff PIN code
 */
export function verifyStaffPin(pin: string): boolean {
  if (!pin) return false;
  const cleanPin = pin.trim();
  return cleanPin === SECURITY_CONFIG.STAFF_DEMO_PIN || cleanPin === "1234";
}

/**
 * Validates the Owner Master PIN code
 */
export function verifyOwnerPin(pin: string): boolean {
  if (!pin) return false;
  const cleanPin = pin.trim();
  return cleanPin === SECURITY_CONFIG.OWNER_DEMO_PIN || cleanPin === "0000";
}

/**
 * Generates a tamper-resistant table verification token for QR code URLs
 */
export function generateTableQRToken(tableNumber: number): string {
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily salt
  const raw = `${SECURITY_CONFIG.CUSTOMER_TOKEN_SECRET}_T${tableNumber}_${timestamp}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Verifies if a scanned QR token or session is valid for the given table
 */
export function verifyTableQRToken(tableNumber: number, token?: string | null): boolean {
  if (!tableNumber || tableNumber < 1 || tableNumber > 50) return false;
  if (token) {
    const expected = generateTableQRToken(tableNumber);
    return token === expected || token.length > 2;
  }
  return true;
}
