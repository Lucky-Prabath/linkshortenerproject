"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLink, deleteLink, updateLink } from "@/data/links";
import type { Link } from "@/db/schema";

const urlSchema = z.object({
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

  const result = urlSchema.safeParse(input);
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

export async function updateLinkAction(input: {
  id: number;
  url: string;
}): Promise<{ success: true; data: Link } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const result = urlSchema.safeParse(input);
  if (!result.success) return { error: result.error.issues[0].message };

  try {
    const data = await updateLink(input.id, userId, { url: result.data.url });
    if (!data) return { error: "Link not found." };
    revalidatePath("/dashboard");
    return { success: true, data };
  } catch {
    return { error: "Failed to update link. Please try again." };
  }
}

export async function deleteLinkAction(input: {
  id: number;
}): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const idResult = z.object({ id: z.number().int().positive() }).safeParse(input);
  if (!idResult.success) return { error: "Invalid link ID." };

  try {
    const deleted = await deleteLink(input.id, userId);
    if (!deleted) return { error: "Link not found." };
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to delete link. Please try again." };
  }
}

