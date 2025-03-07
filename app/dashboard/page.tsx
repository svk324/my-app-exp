// app/dashboard/page.tsx
import { DashboardLayout } from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { TrendingUp, TrendingDown, PiggyBank, Calculator } from "lucide-react";
import { formatCurrency, calculateYearProgress } from "@/lib/utils";
import { IncomeChart } from "@/components/charts/income-chart";
import { ExpenseChart } from "@/components/charts/expense-chart";

async function getUser() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Create user if it doesn't exist
    const clerkUserData = await currentUser();
    return await prisma.user.create({
      data: {
        clerkId: userId,
        email:
          clerkUserData?.emailAddresses[0]?.emailAddress || "user@example.com",
        name:
          `${clerkUserData?.firstName || ""} ${
            clerkUserData?.lastName || ""
          }`.trim() || "User",
      },
    });
  }

  return user;
}

async function getDashboardData(userId: string) {
  const currentYear = new Date().getFullYear();

  // Get annual budget for current year
  const budget = await prisma.budget.findUnique({
    where: {
      userId_year: {
        userId: userId,
        year: currentYear,
      },
    },
  });

  // Get all incomes for the current year
  const incomes = await prisma.income.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
  });

  // Get all expenses for the current year
  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
      date: {
        gte: new Date(currentYear, 0, 1),
        lt: new Date(currentYear + 1, 0, 1),
      },
    },
  });

  // Calculate totals
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const balance = totalIncome - totalExpense;

  // Calculate budget progress
  const budgetAmount = budget?.amount || 0;
  const budgetUsed = (totalExpense / budgetAmount) * 100;

  // Group by category
  const incomeByCategory = incomes.reduce((acc, income) => {
    const category = income.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += income.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalIncome,
    totalExpense,
    balance,
    budgetAmount,
    budgetUsed: isNaN(budgetUsed) ? 0 : budgetUsed,
    incomeByCategory,
    expenseByCategory,
    incomes,
    expenses,
  };
}

export default async function DashboardPage() {
  const user = await getUser();
  const data = await getDashboardData(user.id);
  const yearProgress = calculateYearProgress();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your financial situation.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                For {new Date().getFullYear()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.totalExpense)}
              </div>
              <p className="text-xs text-muted-foreground">
                For {new Date().getFullYear()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Balance</CardTitle>
              <Calculator className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.balance)}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Annual Budget
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.budgetAmount)}
              </div>
              <div className="mt-2">
                <Progress value={data.budgetUsed} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.budgetUsed.toFixed(1)}% used of total budget
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Year Progress</CardTitle>
              <CardDescription>
                {yearProgress.toFixed(1)}% of {new Date().getFullYear()}{" "}
                completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={yearProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Budget Usage</CardTitle>
              <CardDescription>
                {data.budgetUsed.toFixed(1)}% of budget used vs{" "}
                {yearProgress.toFixed(1)}% of year elapsed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget</span>
                  <span className="text-sm text-muted-foreground">
                    {data.budgetUsed.toFixed(1)}%
                  </span>
                </div>
                <Progress value={data.budgetUsed} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Year</span>
                  <span className="text-sm text-muted-foreground">
                    {yearProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={yearProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="income" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income Analysis</TabsTrigger>
            <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your income sources for{" "}
                  {new Date().getFullYear()}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <IncomeChart data={data.incomeByCategory} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your expenses for {new Date().getFullYear()}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ExpenseChart data={data.expenseByCategory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
