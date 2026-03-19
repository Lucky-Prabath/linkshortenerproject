"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLinkAction } from "./actions";

interface CreateLinkFormProps {
  onSuccess: () => void;
}

export function CreateLinkForm({ onSuccess }: CreateLinkFormProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const result = await createLinkAction({ url });

    setIsPending(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setUrl("");
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="url" className="text-sm font-medium">
          Destination URL
        </label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Link"}
        </Button>
      </div>
    </form>
  );
}
