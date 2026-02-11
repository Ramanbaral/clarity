import Nav from "../components/Nav";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
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

// Sample data for bar chart - Monthly Overview
const monthlyData = [
  { name: "Sep", amount: 0 },
  { name: "Oct", amount: 0 },
  { name: "Nov", amount: 0 },
  { name: "Dec", amount: 0 },
  { name: "Jan", amount: 0 },
  { name: "Feb", amount: 1000 },
];

// Sample data for pie chart - Spending by Category
const categoryData = [{ name: "Food & Dining", value: 1000, icon: "🍽️" }];

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function Dashboard() {
  const balance = -1000.0;
  const income = 0.0;
  const expenses = 1000.0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-500">
          Overview
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Your financial snapshot
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          {/* Balance Card */}
          <div className="bg-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">
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
          <div className="bg-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">
                Income
              </span>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2 sm:mt-3 text-emerald-500">
              +{formatCurrency(income)}
            </p>
          </div>

          {/* Expenses Card */}
          <div className="bg-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-xs sm:text-sm font-medium">
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
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
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
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending by Category - Pie Chart */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
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
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-lg border border-gray-100 mt-4 sm:mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {/* Transaction Items */}
            <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm sm:text-lg">
                  🍽️
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
                    test
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Feb 11, 2026
                  </p>
                </div>
              </div>
              <p className="font-semibold text-red-500 text-sm sm:text-base">
                -$1,000.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
