import { scrypt, randomBytes, timingSafeEqual, type ScryptOptions } from "crypto";
import { promisify } from "util";

// Type assertion to handle the promisified scrypt with options parameter
const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
  options: ScryptOptions
) => Promise<Buffer>;

const SCRYPT_OPTIONS: ScryptOptions = {
  N: 16384,
  r: 8,
  p: 1,
};

/**
 * Hash a password using scrypt algorithm
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password in format "salt.hash"
 */
export async function hash(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 32, SCRYPT_OPTIONS)) as Buffer;
  return `${salt}.${derived.toString("hex")}`;
}

/**
 * Verify a password against a hash
 * @param password - The plain text password to verify
 * @param hash - The hashed password in format "salt.hash"
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verify(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(".");
  if (!salt || !key) return false;

  try {
    const derived = (await scryptAsync(password, salt, 32, SCRYPT_OPTIONS)) as Buffer;
    return timingSafeEqual(derived, Buffer.from(key, "hex"));
  } catch {
    return false;
  }
}
