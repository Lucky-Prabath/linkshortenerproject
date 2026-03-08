import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-xl space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Shorten Your Links
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Paste a long URL below to generate a short, shareable link instantly.
        </p>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://your-long-url.com"
            className="flex-1"
          />
          <Button>Shorten</Button>
        </div>
      </div>
    </main>
  );
}
