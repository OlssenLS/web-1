import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type AccountType = "Business" | "Content Creator";

export type StoredUser = {
  username: string;
  email: string;
  type: AccountType;
  passwordHash: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function normalizeIdentity(value: string) {
  return value.trim().toLowerCase();
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function getUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function saveUsers(users: StoredUser[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export async function addUser(input: {
  username: string;
  email: string;
  type: AccountType;
  password: string;
}) {
  const users = await getUsers();
  const normalizedUsername = normalizeIdentity(input.username);
  const normalizedEmail = normalizeIdentity(input.email);

  const duplicate = users.find(
    (user) =>
      normalizeIdentity(user.username) === normalizedUsername ||
      normalizeIdentity(user.email) === normalizedEmail
  );

  if (duplicate) {
    return { ok: false as const, error: "Username or email already exists." };
  }

  const newUser: StoredUser = {
    username: input.username.trim(),
    email: input.email.trim(),
    type: input.type,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  return { ok: true as const, user: newUser };
}

export async function findUserForLogin(input: {
  identity: string;
  type: AccountType;
  password: string;
}) {
  const users = await getUsers();
  const normalizedIdentity = normalizeIdentity(input.identity);
  const passwordHash = hashPassword(input.password);

  return (
    users.find((user) => {
      const isIdentityMatch =
        normalizeIdentity(user.username) === normalizedIdentity ||
        normalizeIdentity(user.email) === normalizedIdentity;
      return (
        isIdentityMatch && user.type === input.type && user.passwordHash === passwordHash
      );
    }) ?? null
  );
}
