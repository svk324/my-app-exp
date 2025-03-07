// app/page.tsx
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ExpenseTracker</span>
        </div>
        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="default">Dashboard</Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Take Control of Your Finances
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Track your income and expenses, plan your budget, and make
                    informed financial decisions with our easy-to-use expense
                    tracker.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <SignedOut>
                    <SignUpButton>
                      <Button size="lg" className="gap-1.5">
                        Get Started <ArrowRight className="h-4 w-4" />
                      </Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button size="lg" className="gap-1.5">
                        Go to Dashboard <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">Financial Insights</h2>
                      <p className="text-muted-foreground">
                        Visualize your spending habits and income sources
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
