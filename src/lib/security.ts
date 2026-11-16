import { prisma } from "./prisma";

/**
 * Sanitize strings to prevent Stored XSS before rendering/saving
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function containsSuspiciousXss(input: string): boolean {
  const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onload=|onerror=|onclick=/i;
  return xssPattern.test(input);
}

export async function logSecurityEvent({
  event,
  details,
  ipAddress,
  userAgent,
  userId,
}: {
  event: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}) {
  try {
    await prisma.securityLog.create({
      data: {
        event,
        details: details?.slice(0, 500),
        ipAddress: ipAddress?.slice(0, 100),
        userAgent: userAgent?.slice(0, 255),
        userId,
      },
    });
  } catch (error) {
    console.error("Failed to write security log:", error);
  }
}
