// components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Income",
    icon: TrendingUp,
    href: "/income",
    color: "text-emerald-500",
  },
  {
    label: "Expenses",
    icon: TrendingDown,
    href: "/expenses",
    color: "text-rose-500",
  },
  {
    label: "Budget",
    icon: PiggyBank,
    href: "/budget",
    color: "text-violet-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent pathname={pathname} />
      </div>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;
  setOpen?: (open: boolean) => void;
}

function SidebarContent({ pathname, setOpen }: SidebarContentProps) {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-50 dark:bg-slate-900 border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <h1 className="text-2xl font-bold">
            <span className="text-primary">Expense</span>Tracker
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen?.(false)}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <p className="text-sm font-medium">Your Account</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="hidden md:block md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>
      <main className="md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b bg-background">
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-xl font-bold">ExpenseTracker</h1>
          </Link>
          <Sidebar />
        </div>
        <div className="p-6 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
