import Nav from "../components/Nav";
import { Wallet, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import authenticatedApi from "../api/authenticatedAxiosInstance";

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: string;
  createdAt: string;
  icon?: string;
}

// Category icon mapping
const categoryIcons: Record<string, string> = {
  food: "🍽️",
  transport: "🚗",
  housing: "🏠",
  utilities: "⚡",
  entertainment: "🎬",
  shopping: "🛍️",
  health: "💊",
  education: "📚",
  salary: "💵",
  investment: "📈",
  freelance: "💻",
  rent: "🏢",
  other_expense: "📌",
  other_income: "💎",
  other: "📦",
};

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await authenticatedApi.get("/transaction");
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);

  const balance = income - expenses;

  // Generate monthly data for bar chart (last 6 months)
  const getMonthlyData = () => {
    const months: { name: string; income: number; expense: number }[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString("default", { month: "short" });
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.createdAt);
        return `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, "0")}` === monthYear;
      });

      const monthIncome = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);

      const monthExpense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + (parseFloat(String(t.amount)) || 0), 0);

      months.push({ name: monthName, income: monthIncome, expense: monthExpense });
    }

    return months;
  };

  const monthlyData = getMonthlyData();

  // Generate category data for pie chart
  const getCategoryData = () => {
    const categoryMap = new Map<string, number>();

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + (parseFloat(String(t.amount)) || 0));
      });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      icon: categoryIcons[name.toLowerCase()] || "📦",
    }));
  };

  const categoryData = getCategoryData();

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-500 dark:text-blue-400">
          Overview
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
          Your financial snapshot
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {/* Balance Card */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                Balance
              </span>
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            </div>
            <p
              className={`text-xl sm:text-2xl font-bold mt-2 sm:mt-3 ${
                balance >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {balance < 0 ? "-" : ""}
              {formatCurrency(balance)}
            </p>
          </div>

          {/* Income Card */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                Income
              </span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3 text-emerald-500">
              +{formatCurrency(income)}
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                Expenses
              </span>
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3 text-red-500">
              -{formatCurrency(expenses)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* Monthly Overview - Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
              Monthly Overview
            </h3>
            <div className="h-52 sm:h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`,
                      name === "income" ? "Income" : "Expense",
                    ]}
                  />
                  <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending by Category - Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
              Spending by Category
            </h3>
            <div className="h-52 sm:h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="35%"
                    cy="50%"
                    innerRadius="40%"
                    outerRadius="70%"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                    ]}
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value, entry) => {
                      const category = categoryData.find(
                        (c) => c.name === value,
                      );
                      return (
                        <span className="text-sm text-gray-700">
                          {category?.icon} {value}{" "}
                          <span className="font-semibold ml-2">
                            $
                            {(
                              entry.payload as { value: number }
                            )?.value?.toLocaleString()}
                          </span>
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100 dark:border-gray-700 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No transactions yet.
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm sm:text-lg">
                      {categoryIcons[transaction.category?.toLowerCase()] || "📦"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                        {transaction.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold text-sm sm:text-base ${
                      transaction.type === "income" ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
