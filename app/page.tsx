import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  LinkIcon,
  BarChart2Icon,
  LayoutDashboardIcon,
  CopyIcon,
  ArrowRightIcon,
} from 'lucide-react';

const features = [
  {
    icon: LinkIcon,
    title: 'Instant URL Shortening',
    description:
      'Paste any long URL and get a short, clean link in seconds. No sign-up required to get started.',
  },
  {
    icon: BarChart2Icon,
    title: 'Click Analytics',
    description:
      'Every short link automatically tracks how many times it has been clicked so you can measure reach.',
  },
  {
    icon: LayoutDashboardIcon,
    title: 'Link Dashboard',
    description:
      'Manage all your shortened links in one place. View, copy, and delete them whenever you need.',
  },
  {
    icon: CopyIcon,
    title: 'One-Click Copy',
    description:
      'Copy your short link to the clipboard with a single click and share it anywhere instantly.',
  },
];

const steps = [
  {
    step: '1',
    title: 'Paste Your URL',
    description: 'Enter any long URL into the shortener and hit Shorten.',
  },
  {
    step: '2',
    title: 'Get a Short Link',
    description:
      'Receive a compact, shareable link generated just for your URL.',
  },
  {
    step: '3',
    title: 'Share & Track',
    description:
      'Share the link anywhere and watch the click count grow in your dashboard.',
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-zinc-950 px-6 text-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="space-y-4">
            <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-xs font-medium text-zinc-400">
              Free & Open Source
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-50 sm:text-6xl">
              Shorten Links. <span className="text-primary">Track Clicks.</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-zinc-400">
              A fast, simple URL shortener with built-in analytics. Create short
              links, share them anywhere, and measure their impact — all from
              one dashboard.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRightIcon aria-hidden="true" />
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-900 px-6 py-24">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
              Everything you need
            </h2>
            <p className="text-zinc-400">
              A focused set of tools that make link sharing and tracking
              effortless.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-zinc-800 bg-zinc-950 p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-zinc-800">
                    <Icon className="size-5 text-zinc-300" />
                  </div>
                  <CardTitle className="text-zinc-50">{title}</CardTitle>
                </CardHeader>
                <CardDescription className="text-zinc-400">
                  {description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-950 px-6 py-24">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
              How it works
            </h2>
            <p className="text-zinc-400">
              Go from a long URL to a shareable short link in three simple
              steps.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div
                key={step}
                className="flex flex-col items-center gap-4 text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-lg font-bold text-zinc-50">
                  {step}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-50">{title}</p>
                  <p className="text-sm text-zinc-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 px-6 py-24">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
            Ready to shorten your first link?
          </h2>
          <p className="text-zinc-400">
            Sign up for free and start creating short links with click tracking
            in under a minute.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg">
              Create Your Free Account
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-8 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} Link Shortener. All rights reserved.
      </footer>
    </main>
  );
}
