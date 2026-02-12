import Nav from "../components/Nav";
import { useState, useEffect } from "react";
import { Filter, Pencil, Trash2, X, GripVertical, Loader2 } from "lucide-react";
import authenticatedApi from "../api/authenticatedAxiosInstance";
import toast, { Toaster } from "react-hot-toast";

// Category options
const categories = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food & Dining", icon: "🍽️" },
  { value: "transportation", label: "Transportation", icon: "🚗" },
  { value: "shopping", label: "Shopping", icon: "🛒" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "bills", label: "Bills & Utilities", icon: "📄" },
  { value: "investment", label: "Investment", icon: "📈" },
  { value: "salary", label: "Salary", icon: "💰" },
  { value: "other", label: "Other", icon: "📦" },
];

// Type options
const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

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
  transportation: "🚗",
  bills: "📄",
  other: "📦",
};

const getCategoryIcon = (category: string): string => {
  return categoryIcons[category?.toLowerCase()] || "📦";
};

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: string;
  createdAt: string;
  icon: string;
}

function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
  });

  // Delete confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await authenticatedApi.get("/transaction");
        console.log("Fetched transactions:", response.data);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch =
      filterCategory === "all" ||
      t.category.toLowerCase() === filterCategory.toLowerCase();
    const typeMatch = filterType === "all" || t.type === filterType;
    return categoryMatch && typeMatch;
  });

  // Handle edit
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      title: transaction.title,
      category: transaction.category.toLowerCase(),
      amount: transaction.amount.toString(),
      type: transaction.type,
    });
    setIsEditModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingTransaction) return;

    setIsUpdating(true);
    const categoryInfo = categories.find((c) => c.value === editForm.category);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              title: editForm.title,
              category: categoryInfo?.label || editForm.category || t.category,
              amount: parseFloat(editForm.amount),
              type: editForm.type,
              icon: categoryInfo?.icon || t.icon,
            }
          : t,
      ),
    );
    // Here you would also send the updated transaction to the backend
    try {
      await authenticatedApi.patch(`/transaction/${editingTransaction.id}`, {
        title: editForm.title,
        category: editForm.category,
        type: editForm.type,
        amount: editForm.amount,
      });
      toast.success("Transaction updated.");
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction.");
    } finally {
      setIsUpdating(false);
    }
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setDeleteConfirmId(null);
    try {
      await authenticatedApi.delete(`/transaction/${id}`);
      toast.success("Transaction deleted.");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Nav />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
              Transactions
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
              showFilters
                ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon ? `${cat.icon} ` : ""}
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                >
                  {typeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setFilterCategory("all");
                setFilterType("all");
              }}
              className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Transactions List */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No transactions found.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-gray-400 dark:text-gray-500 cursor-grab hidden sm:block">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg sm:text-xl">
                      {getCategoryIcon(transaction.category)}
                    </div>

                    <div>
                      <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">
                        {transaction.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category} ·{" "}
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <p
                      className={`font-semibold text-sm sm:text-base ${
                        transaction.type === "income"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(transaction.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsEditModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Edit Transaction
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  placeholder="Transaction title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                >
                  {categories.slice(1).map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditForm({ ...editForm, type: "expense" })
                    }
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      editForm.type === "expense"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, type: "income" })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      editForm.type === "income"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-300 dark:border-emerald-700"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={isUpdating}
                className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirmId(null)}
          />

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Delete Transaction
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Transactions;
