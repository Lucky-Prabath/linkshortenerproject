import { and, desc, eq } from 'drizzle-orm';
import dbModule from '@/db';
import { link, type Link, type NewLink } from '@/db/schema';

const { db } = dbModule;

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(link)
    .where(eq(link.userId, userId))
    .orderBy(desc(link.updatedAt));
}

export async function createLink(
  data: Pick<NewLink, 'userId' | 'url' | 'shortCode'>,
): Promise<Link> {
  const [created] = await db.insert(link).values(data).returning();
  return created;
}

export async function updateLink(
  id: number,
  userId: string,
  data: Pick<NewLink, 'url'>,
): Promise<Link | null> {
  const [updated] = await db
    .update(link)
    .set({ url: data.url, updatedAt: new Date() })
    .where(and(eq(link.id, id), eq(link.userId, userId)))
    .returning();
  return updated ?? null;
}

export async function deleteLink(id: number, userId: string): Promise<boolean> {
  const result = await db
    .delete(link)
    .where(and(eq(link.id, id), eq(link.userId, userId)))
    .returning({ id: link.id });
  return result.length > 0;
}

export async function getLinkByShortCode(
  shortCode: string,
): Promise<Link | null> {
  const [found] = await db
    .select()
    .from(link)
    .where(eq(link.shortCode, shortCode))
    .limit(1)
    .catch(() => []);
  return found ?? null;
}
