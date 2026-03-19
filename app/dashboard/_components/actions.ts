"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLink } from "@/data/links";
import type { Link } from "@/db/schema";

const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

function generateShortCode(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

export async function createLinkAction(input: {
  url: string;
}): Promise<{ success: true; data: Link } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const result = createLinkSchema.safeParse(input);
  if (!result.success) return { error: result.error.issues[0].message };

  try {
    const shortCode = generateShortCode();
    const data = await createLink({ userId, url: result.data.url, shortCode });
    revalidatePath("/dashboard");
    return { success: true, data };
  } catch {
    return { error: "Failed to create link. Please try again." };
  }
}
