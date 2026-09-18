import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ADMIN_ROLES = new Set(["admin", "owner", "super_admin", "super-admin"]);

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

function configuredAdminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => normalizeAdminEmail(email))
    .filter(Boolean);
}

function strictAdminRoleRequired() {
  return process.env.NEXT_PUBLIC_REQUIRE_ADMIN_ROLE === "true";
}

function hasRole(value: unknown) {
  if (typeof value === "string") {
    return ADMIN_ROLES.has(value.trim().toLowerCase());
  }

  if (Array.isArray(value)) {
    return value.some(hasRole);
  }

  return false;
}

async function hasAdminClaim(user: User) {
  try {
    const token = await user.getIdTokenResult();
    return token.claims.admin === true || hasRole(token.claims.role) || hasRole(token.claims.roles);
  } catch {
    return false;
  }
}

async function hasAdminUserDoc(user: User) {
  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return false;

    const data = userSnap.data();
    return data.admin === true || hasRole(data.role) || hasRole(data.roles);
  } catch {
    return false;
  }
}

async function hasAdminRecord(user: User) {
  try {
    const adminSnap = await getDoc(doc(db, "admins", user.uid));
    if (!adminSnap.exists()) return false;

    const data = adminSnap.data();
    return data.active !== false;
  } catch {
    return false;
  }
}

export async function hasAdminAccess(user: User) {
  const email = user.email ? normalizeAdminEmail(user.email) : "";
  const emailAllowlist = configuredAdminEmails();

  if (await hasAdminClaim(user)) return true;
  if (email && emailAllowlist.includes(email)) return true;
  if (await hasAdminUserDoc(user)) return true;
  if (await hasAdminRecord(user)) return true;

  return !strictAdminRoleRequired();
}
