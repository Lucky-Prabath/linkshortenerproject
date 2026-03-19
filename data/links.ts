import { desc, eq } from "drizzle-orm";
import dbModule from "@/db";
import { link, type Link, type NewLink } from "@/db/schema";

const { db } = dbModule;

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(link)
    .where(eq(link.userId, userId))
    .orderBy(desc(link.updatedAt));
}

export async function createLink(
  data: Pick<NewLink, "userId" | "url" | "shortCode">
): Promise<Link> {
  const [created] = await db.insert(link).values(data).returning();
  return created;
}
