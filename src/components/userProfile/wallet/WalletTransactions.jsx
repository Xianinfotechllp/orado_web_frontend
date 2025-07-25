import React, { useEffect, useState } from "react";
import { getUserWalletTransactions } from "../../../apis/walletApi";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// Types and styles
const TYPE_LABELS = {
  credit: "Credit",
  debit: "Debit",
  refund: "Refund",
};
const TYPE_COLORS = {
  credit: "text-green-600",
  debit: "text-red-600",
  refund: "text-orange-600",
};

const PAGE_SIZE = 10;

const WalletTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async (pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserWalletTransactions({ page: pg, limit: PAGE_SIZE });
      setTransactions(res.transactions);
      setPages(res.pages);
      setTotal(res.total);
      setPage(res.page);
    } catch (e) {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
    // eslint-disable-next-line
  }, [page]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN") + " " +
      date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-light text-orange-600 mb-6">Wallet Transactions</h2>
      <div className="bg-white rounded-3xl shadow-xl border border-orange-100 px-0 sm:px-4">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
          </div>
        ) : error ? (
          <div className="text-center p-6 text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500 font-light p-12">
            No transactions found.
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-700 bg-orange-50">
                  <th className="py-2 px-2 font-light text-sm rounded-tl-2xl">Type</th>
                  <th className="py-2 px-2 font-light text-sm">Amount</th>
                  <th className="py-2 px-2 font-light text-sm">Date</th>
                  <th className="py-2 px-2 font-light text-sm rounded-tr-2xl">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tr) => (
                  <tr key={tr._id} className="border-t border-orange-100 hover:bg-orange-50/50 transition-all">
                    <td className={`py-3 pr-2 font-medium ${TYPE_COLORS[tr.type]}`}>{TYPE_LABELS[tr.type]}</td>
                    <td className="py-3 px-2">₹{Number(tr.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-2">{formatDate(tr.createdAt)}</td>
                    <td className="py-3 px-2 text-gray-700">{tr.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination bar */}
            <div className="flex items-center justify-between py-4 px-2 border-t border-orange-100">
              <span className="text-gray-500 font-light text-sm">
                Page <b>{page}</b> of <b>{pages}</b> ({total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-100 disabled:text-orange-300 transition"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft />
                </button>
                <button
                  className="p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-100 disabled:text-orange-300 transition"
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletTransactions;
