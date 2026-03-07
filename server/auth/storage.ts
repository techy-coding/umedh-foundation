import { users, type User, type UpsertUser } from "@shared/models/auth";
import { db } from "../db";
import { eq } from "drizzle-orm";

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  createAdminUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User>;
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createAdminUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        email,
        firstName: firstName || "Admin",
        lastName: lastName || "User",
        role: "admin",
        passwordHash,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          passwordHash,
          role: "admin",
          updatedAt: new Date(),
        },
      })
      .returning();
    
    return user;
  }

  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const authStorage = new AuthStorage();
