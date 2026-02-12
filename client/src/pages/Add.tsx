import Nav from "../components/Nav";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import authenticatedApi from "../api/authenticatedAxiosInstance";
import toast, { Toaster } from "react-hot-toast";

// Expense category options
const expenseCategories = [
  { value: "food", label: "Food & Dining", icon: "🍽️" },
  { value: "transport", label: "Transport", icon: "🚗" },
  { value: "housing", label: "Housing", icon: "🏠" },
  { value: "utilities", label: "Utilities", icon: "⚡" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "shopping", label: "Shopping", icon: "🛍️" },
  { value: "health", label: "Health", icon: "💊" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "other_expense", label: "Other", icon: "📌" },
];

// Income category options
const incomeCategories = [
  { value: "salary", label: "Salary", icon: "💵" },
  { value: "investment", label: "Investment", icon: "📈" },
  { value: "freelance", label: "Freelance", icon: "💻" },
  { value: "rent", label: "Rent", icon: "🏢" },
  { value: "other_income", label: "Other", icon: "💎" },
];

function Add() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    description: "",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Transaction added:", formData);
    setIsSubmitting(true);
    //get the formData and create a transaction using the API
    try {
      const response = await authenticatedApi.post("/transaction", {
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        desc: formData.description,
      });
      console.log("API response:", response.data);
      toast.success("Transaction added successfully!");
    } catch (error) {
      toast.error("Failed to add transaction. Please try again.");
      console.error("Error adding transaction:", error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    // Reset form
    setFormData({
      type: "expense",
      title: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      description: "",
    });
    setCurrentStep(1);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  const getCategoryInfo = (value: string) => {
    return (
      expenseCategories.find((c) => c.value === value) ||
      incomeCategories.find((c) => c.value === value)
    );
  };

  // Get categories based on selected type
  const currentCategories =
    formData.type === "expense" ? expenseCategories : incomeCategories;

  const canProceedStep1 =
    formData.title.trim() !== "" &&
    formData.amount &&
    parseFloat(formData.amount) > 0;
  const canProceedStep2 = formData.category !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-10 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">
            Add Transaction
          </h2>
          <p className="text-gray-500 text-sm mt-1">Step {currentStep} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              currentStep >= 1 ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              currentStep >= 2 ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              currentStep >= 3 ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
          {/* Step 1: Type, Amount, Date */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        type: "expense",
                        category: "",
                      })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      formData.type === "expense"
                        ? "bg-red-50 text-red-700 border-2 border-red-300"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>💸</span> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "income", category: "" })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      formData.type === "income"
                        ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-300"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span>💰</span> Income
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Grocery shopping, Monthly salary"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {currentCategories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, category: category.value })
                      }
                      className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        formData.category === category.value
                          ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-400"
                          : "bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl">
                        {category.icon}
                      </span>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-2">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceedStep2}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Description & Summary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add a note..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-800 capitalize">
                    {formData.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Title</span>
                  <span className="font-medium text-gray-800">
                    {formData.title}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(formData.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">
                    {getCategoryInfo(formData.category)?.icon}{" "}
                    {getCategoryInfo(formData.category)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-800">
                    {formData.date}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 font-medium hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Add Transaction
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Add;
