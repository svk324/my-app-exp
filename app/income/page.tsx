// app/income/page.tsx
import { DashboardLayout } from "@/components/sidebar";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IncomeForm } from "@/components/income-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";

async function getIncome() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    redirect("/dashboard");
  }

  const income = await prisma.income.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  const totalByCategory = await prisma.income.groupBy({
    by: ["category"],
    where: {
      userId: user.id,
    },
    _sum: {
      amount: true,
    },
  });

  const total = income.reduce((acc, curr) => acc + curr.amount, 0);

  return { income, totalByCategory, total, userId: user.id };
}

export default async function IncomePage() {
  const { income, totalByCategory, total, userId } = await getIncome();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Income</h1>
        <p className="text-muted-foreground">
          Track and manage your income sources
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add New Income</CardTitle>
              <CardDescription>Record a new income transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeForm userId={userId} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Income Summary
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(total)}</div>
              <p className="text-xs text-muted-foreground">Total Income</p>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">By Category</h3>
                <div className="space-y-2">
                  {totalByCategory.map((category) => (
                    <div
                      key={category.category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">
                        {category.category.replace("_", " ")}
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(category._sum.amount || 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Income History</CardTitle>
            <CardDescription>
              View all your recorded income transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of your income transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {income.length > 0 ? (
                  income.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{item.category.replace("_", " ")}</TableCell>
                      <TableCell>{item.description || "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No income transactions recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
