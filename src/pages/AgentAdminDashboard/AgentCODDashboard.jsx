import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search, Calendar, User, AlertTriangle,
  Pencil, FileText, XCircle, CheckCircle, MapPin, Check, X
} from "lucide-react";

// Sample dummy agent and log data (simulate server state) - 16+ records
const AGENT_SAMPLE = [
  { id: 1, name: "John", phone: "9876543210", codLimit: 1500, currentHolding: 1700, dailyCollected: 2400, lastSubmitted: "1 hr ago", status: "over",
    logs: [
      { id: 1, amount: 500, method: "Cash", dropTime: "10:00 AM", verified: false, notes: "Hub" },
      { id: 2, amount: 800, method: "Bank", dropTime: "09:00 AM", verified: true, notes: "" }
    ]
  },
  { id: 2, name: "Maya", phone: "9123456780", codLimit: 1000, currentHolding: 700, dailyCollected: 1800, lastSubmitted: "30 mins ago", status: "ok",
    logs: [
      { id: 11, amount: 400, method: "Cash", dropTime: "03:00 PM", verified: true, notes: "" }
    ]
  },
  { id: 3, name: "Rajat", phone: "9900123456", codLimit: 1200, currentHolding: 1500, dailyCollected: 1500, lastSubmitted: "10 mins ago", status: "over",
    logs: [
      { id: 21, amount: 700, method: "Cash", dropTime: "01:00 PM", verified: false, notes: "" }
    ]
  },
  { id: 4, name: "Neha", phone: "8877665544", codLimit: 900, currentHolding: 600, dailyCollected: 900, lastSubmitted: "20 mins ago", status: "ok",
    logs: [
      { id: 31, amount: 300, method: "Bank", dropTime: "03:10 PM", verified: false, notes: "Transfered" }
    ]
  },
  { id: 5, name: "Aman", phone: "9292929292", codLimit: 850, currentHolding: 900, dailyCollected: 940, lastSubmitted: "Just now", status: "over",
    logs: [
      { id: 41, amount: 900, method: "Bank", dropTime: "02:40 PM", verified: false, notes: "N/A" }
    ]
  },
  { id: 6, name: "Priya", phone: "9876501234", codLimit: 1100, currentHolding: 800, dailyCollected: 1200, lastSubmitted: "45 mins ago", status: "ok",
    logs: [
      { id: 51, amount: 600, method: "Cash", dropTime: "12:30 PM", verified: true, notes: "Hub" },
      { id: 52, amount: 400, method: "Bank", dropTime: "11:15 AM", verified: false, notes: "" }
    ]
  },
  { id: 7, name: "Rohit", phone: "9123450987", codLimit: 1300, currentHolding: 1450, dailyCollected: 1800, lastSubmitted: "15 mins ago", status: "over",
    logs: [
      { id: 61, amount: 750, method: "Cash", dropTime: "02:20 PM", verified: false, notes: "Branch" }
    ]
  },
  { id: 8, name: "Anita", phone: "9876509876", codLimit: 950, currentHolding: 650, dailyCollected: 1100, lastSubmitted: "2 hrs ago", status: "ok",
    logs: [
      { id: 71, amount: 450, method: "Bank", dropTime: "01:45 PM", verified: true, notes: "ATM" }
    ]
  },
  { id: 9, name: "Vikram", phone: "9988776655", codLimit: 1400, currentHolding: 1600, dailyCollected: 2100, lastSubmitted: "25 mins ago", status: "over",
    logs: [
      { id: 81, amount: 800, method: "Cash", dropTime: "11:30 AM", verified: false, notes: "Hub" },
      { id: 82, amount: 500, method: "Bank", dropTime: "10:15 AM", verified: true, notes: "" }
    ]
  },
  { id: 10, name: "Kavya", phone: "9765432100", codLimit: 800, currentHolding: 550, dailyCollected: 950, lastSubmitted: "1.5 hrs ago", status: "ok",
    logs: [
      { id: 91, amount: 350, method: "Cash", dropTime: "12:00 PM", verified: true, notes: "" }
    ]
  },
  { id: 11, name: "Suresh", phone: "9123456700", codLimit: 1000, currentHolding: 1200, dailyCollected: 1600, lastSubmitted: "40 mins ago", status: "over",
    logs: [
      { id: 101, amount: 600, method: "Bank", dropTime: "01:20 PM", verified: false, notes: "Branch" }
    ]
  },
  { id: 12, name: "Deepika", phone: "9876543200", codLimit: 1200, currentHolding: 900, dailyCollected: 1400, lastSubmitted: "55 mins ago", status: "ok",
    logs: [
      { id: 111, amount: 500, method: "Cash", dropTime: "11:45 AM", verified: true, notes: "Hub" }
    ]
  },
  { id: 13, name: "Arjun", phone: "9988770011", codLimit: 1100, currentHolding: 1300, dailyCollected: 1900, lastSubmitted: "10 mins ago", status: "over",
    logs: [
      { id: 121, amount: 700, method: "Cash", dropTime: "02:30 PM", verified: false, notes: "" },
      { id: 122, amount: 400, method: "Bank", dropTime: "01:10 PM", verified: true, notes: "ATM" }
    ]
  },
  { id: 14, name: "Meera", phone: "9765431122", codLimit: 900, currentHolding: 650, dailyCollected: 1050, lastSubmitted: "35 mins ago", status: "ok",
    logs: [
      { id: 131, amount: 400, method: "Bank", dropTime: "12:45 PM", verified: true, notes: "" }
    ]
  },
  { id: 15, name: "Ravi", phone: "9876501122", codLimit: 1300, currentHolding: 1500, dailyCollected: 2200, lastSubmitted: "20 mins ago", status: "over",
    logs: [
      { id: 141, amount: 800, method: "Cash", dropTime: "01:50 PM", verified: false, notes: "Hub" },
      { id: 142, amount: 600, method: "Bank", dropTime: "12:20 PM", verified: true, notes: "" }
    ]
  },
  { id: 16, name: "Sneha", phone: "9123459988", codLimit: 1000, currentHolding: 750, dailyCollected: 1300, lastSubmitted: "50 mins ago", status: "ok",
    logs: [
      { id: 151, amount: 550, method: "Cash", dropTime: "11:30 AM", verified: true, notes: "Branch" }
    ]
  },
  { id: 17, name: "Kiran", phone: "9988112233", codLimit: 1150, currentHolding: 1250, dailyCollected: 1700, lastSubmitted: "30 mins ago", status: "over",
    logs: [
      { id: 161, amount: 650, method: "Bank", dropTime: "02:00 PM", verified: false, notes: "ATM" }
    ]
  },
  { id: 18, name: "Pooja", phone: "9765439900", codLimit: 850, currentHolding: 600, dailyCollected: 1000, lastSubmitted: "1 hr ago", status: "ok",
    logs: [
      { id: 171, amount: 400, method: "Cash", dropTime: "01:15 PM", verified: true, notes: "" }
    ]
  },
   { id: 19, name: "Aditya", phone: "9001122334", codLimit: 1000, currentHolding: 1200, dailyCollected: 1650, lastSubmitted: "5 mins ago", status: "over",
    logs: [
      { id: 191, amount: 600, method: "Cash", dropTime: "09:15 AM", verified: false, notes: "" }
    ]
  },
  { id: 20, name: "Sana", phone: "9911223344", codLimit: 900, currentHolding: 800, dailyCollected: 1350, lastSubmitted: "30 mins ago", status: "ok",
    logs: [
      { id: 201, amount: 400, method: "Bank", dropTime: "11:30 AM", verified: true, notes: "ATM" }
    ]
  },
  { id: 21, name: "Gaurav", phone: "9888776655", codLimit: 1300, currentHolding: 1400, dailyCollected: 1850, lastSubmitted: "15 mins ago", status: "over",
    logs: [
      { id: 211, amount: 750, method: "Cash", dropTime: "10:00 AM", verified: false, notes: "Hub" }
    ]
  },
  { id: 22, name: "Divya", phone: "9777665544", codLimit: 950, currentHolding: 700, dailyCollected: 1100, lastSubmitted: "45 mins ago", status: "ok",
    logs: [
      { id: 221, amount: 350, method: "Bank", dropTime: "12:00 PM", verified: true, notes: "" }
    ]
  },
  { id: 23, name: "Manish", phone: "9999888877", codLimit: 1150, currentHolding: 1250, dailyCollected: 1750, lastSubmitted: "20 mins ago", status: "over",
    logs: [
      { id: 231, amount: 600, method: "Cash", dropTime: "09:45 AM", verified: false, notes: "Branch" }
    ]
  },
  { id: 24, name: "Ritu", phone: "9855443322", codLimit: 800, currentHolding: 600, dailyCollected: 1050, lastSubmitted: "1 hr ago", status: "ok",
    logs: [
      { id: 241, amount: 450, method: "Bank", dropTime: "11:15 AM", verified: true, notes: "" }
    ]
  },
  { id: 25, name: "Yash", phone: "9666554433", codLimit: 1400, currentHolding: 1500, dailyCollected: 2100, lastSubmitted: "10 mins ago", status: "over",
    logs: [
      { id: 251, amount: 800, method: "Cash", dropTime: "01:15 PM", verified: false, notes: "Hub" }
    ]
  },
  { id: 26, name: "Nisha", phone: "9988773344", codLimit: 950, currentHolding: 850, dailyCollected: 1300, lastSubmitted: "35 mins ago", status: "ok",
    logs: [
      { id: 261, amount: 400, method: "Bank", dropTime: "12:30 PM", verified: true, notes: "" }
    ]
  },
  { id: 27, name: "Siddharth", phone: "9111222333", codLimit: 1200, currentHolding: 1550, dailyCollected: 1950, lastSubmitted: "5 mins ago", status: "over",
    logs: [
      { id: 271, amount: 700, method: "Cash", dropTime: "09:00 AM", verified: false, notes: "" }
    ]
  },
  { id: 28, name: "Pallavi", phone: "9222333444", codLimit: 900, currentHolding: 650, dailyCollected: 1100, lastSubmitted: "50 mins ago", status: "ok",
    logs: [
      { id: 281, amount: 350, method: "Bank", dropTime: "10:45 AM", verified: true, notes: "" }
    ]
  },
  { id: 29, name: "Tarun", phone: "9333444555", codLimit: 1250, currentHolding: 1350, dailyCollected: 1800, lastSubmitted: "30 mins ago", status: "over",
    logs: [
      { id: 291, amount: 650, method: "Cash", dropTime: "11:30 AM", verified: false, notes: "Branch" }
    ]
  },
  { id: 30, name: "Neetu", phone: "9444555666", codLimit: 850, currentHolding: 700, dailyCollected: 1150, lastSubmitted: "1 hr ago", status: "ok",
    logs: [
      { id: 301, amount: 400, method: "Bank", dropTime: "09:45 AM", verified: true, notes: "" }
    ]
  },
  { id: 31, name: "Vivek", phone: "9555666777", codLimit: 1300, currentHolding: 1400, dailyCollected: 1900, lastSubmitted: "15 mins ago", status: "over",
    logs: [
      { id: 311, amount: 750, method: "Cash", dropTime: "12:00 PM", verified: false, notes: "Hub" }
    ]
  },
  { id: 32, name: "Kimaya", phone: "9666777888", codLimit: 950, currentHolding: 800, dailyCollected: 1300, lastSubmitted: "40 mins ago", status: "ok",
    logs: [
      { id: 321, amount: 400, method: "Bank", dropTime: "11:00 AM", verified: true, notes: "" }
    ]
  },
  { id: 33, name: "Arvind", phone: "9777888999", codLimit: 1200, currentHolding: 1450, dailyCollected: 1800, lastSubmitted: "10 mins ago", status: "over",
    logs: [
      { id: 331, amount: 700, method: "Cash", dropTime: "10:15 AM", verified: false, notes: "Branch" }
    ]
  },
  { id: 34, name: "Divya", phone: "9888999000", codLimit: 900, currentHolding: 650, dailyCollected: 1100, lastSubmitted: "50 mins ago", status: "ok",
    logs: [
      { id: 341, amount: 350, method: "Bank", dropTime: "09:30 AM", verified: true, notes: "" }
    ]
  },
  { id: 35, name: "Rohini", phone: "9999000111", codLimit: 1150, currentHolding: 1250, dailyCollected: 1750, lastSubmitted: "20 mins ago", status: "over",
    logs: [
      { id: 351, amount: 600, method: "Cash", dropTime: "11:45 AM", verified: false, notes: "" }
    ]
  },
  { id: 36, name: "Saurabh", phone: "9000111222", codLimit: 850, currentHolding: 700, dailyCollected: 1050, lastSubmitted: "1 hr ago", status: "ok",
    logs: [
      { id: 361, amount: 450, method: "Bank", dropTime: "10:00 AM", verified: true, notes: "" }
    ]
  },
  { id: 37, name: "Mina", phone: "9111222333", codLimit: 1300, currentHolding: 1500, dailyCollected: 2150, lastSubmitted: "5 mins ago", status: "over",
    logs: [
      { id: 371, amount: 800, method: "Cash", dropTime: "09:15 AM", verified: false, notes: "Hub" }
    ]
  },
  { id: 38, name: "Varun", phone: "9222333444", codLimit: 1000, currentHolding: 900, dailyCollected: 1400, lastSubmitted: "30 mins ago", status: "ok",
    logs: [
      { id: 381, amount: 500, method: "Bank", dropTime: "11:45 AM", verified: true, notes: "" }
    ]
  },
  { id: 39, name: "Anjali", phone: "9333444555", codLimit: 1200, currentHolding: 1300, dailyCollected: 1850, lastSubmitted: "15 mins ago", status: "over",
    logs: [
      { id: 391, amount: 700, method: "Cash", dropTime: "10:30 AM", verified: false, notes: "" }
    ]
  },
  { id: 40, name: "Kunal", phone: "9444555666", codLimit: 900, currentHolding: 750, dailyCollected: 1200, lastSubmitted: "45 mins ago", status: "ok",
    logs: [
      { id: 401, amount: 400, method: "Bank", dropTime: "12:15 PM", verified: true, notes: "" }
    ]
}
];

// Status badge utility
function statusBadge(status) {
  if (status === "ok")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><CheckCircle size={13} className="mr-1" />OK</span>;
  if (status === "over")
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800"><AlertTriangle size={13} className="mr-1" />Over</span>;
  return null;
}

function holdingColor(holding, limit) {
  return holding > limit ? "text-rose-600 font-bold" : "text-green-600 font-bold";
}

export default function AgentCODDashboard() {
  // === Main STATE ===
  const [agents, setAgents] = useState(AGENT_SAMPLE.map(a => ({...a, logs: [...a.logs]})));
  
  // Filter state
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showOnlyExceeded, setShowOnlyExceeded] = useState(false);

  // Pagination state
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // Modal states
  const [editModal, setEditModal] = useState(null);        // { agent }
  const [editForm, setEditForm] = useState({ codLimit: "", amount: "", notes: "" });
  const [logsModal, setLogsModal] = useState(null);        // { agent }
  const [logVerify, setLogVerify] = useState({});          // { [logId]: checked }

  // --- Filtered agents ---
  const filteredAgents = useMemo(() => (
    agents.filter(a =>
      (!showOnlyExceeded || a.status === "over") &&
      (
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.phone.includes(search)
      )
      // skip date filter (for demo; could apply in real backend)
    )
  ), [search, showOnlyExceeded, agents]);

  // Pagination logic
  const pagedAgents = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAgents.slice(start, start + PAGE_SIZE);
  }, [filteredAgents, page]);

  const totalPages = Math.ceil(filteredAgents.length / PAGE_SIZE);

  // Reset to page 1 when filters change
  useMemo(() => {
    setPage(1);
  }, [search, showOnlyExceeded]);

  // Pagination Controls Component
  function PaginationControls() {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-3 py-4 bg-gradient-to-r from-orange-50 to-orange-100">
        <button
          className="px-4 py-2 rounded-lg bg-white border-2 border-orange-300 font-bold text-orange-700 shadow-md hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-white rounded-lg border border-orange-200 text-orange-800 font-semibold shadow-sm">
            {page}
          </span>
          <span className="text-orange-600 font-medium">of</span>
          <span className="px-3 py-1 bg-white rounded-lg border border-orange-200 text-orange-800 font-semibold shadow-sm">
            {totalPages}
          </span>
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-white border-2 border-orange-300 font-bold text-orange-700 shadow-md hover:bg-orange-50 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    );
  }

  // Metrics summary
  const metrics = useMemo(() => ({
    totalCod: filteredAgents.reduce((sum, a) => sum + a.currentHolding, 0),
    agentsExceeded: filteredAgents.filter(a => a.status === "over").length,
    unverified: filteredAgents.flatMap(a => a.logs.filter(log => !log.verified)).length
  }), [filteredAgents]);

  // === Modal submission logic ===
  function openEdit(agent) {
    setEditModal(agent);
    setEditForm({ codLimit: agent.codLimit, amount: "", notes: "" });
  }
  
  function submitEdit(ev) {
    ev.preventDefault();
    setAgents(prev => prev.map(a => {
      if (a.id === editModal.id) {
        let newHolding = a.currentHolding;
        let newLogs = [...a.logs];
        if (editForm.amount && Number(editForm.amount) > 0) {
          // push log
          newLogs = [
            { id: Date.now(), amount: Number(editForm.amount), method: "Cash", dropTime: "Now", verified: false, notes: editForm.notes },
            ...newLogs,
          ];
          newHolding -= Number(editForm.amount); // Submitting COD reduces holding (simulate)
          if (newHolding < 0) newHolding = 0;
        }
        const updatedLimit = Number(editForm.codLimit) || a.codLimit;
        return {
          ...a,
          codLimit: updatedLimit,
          currentHolding: newHolding,
          logs: newLogs,
          status: newHolding > updatedLimit ? "over" : "ok",
          lastSubmitted: editForm.amount ? "just now" : a.lastSubmitted
        }
      }
      return a;
    }));
    setEditModal(null);
    setEditForm({ codLimit: "", amount: "", notes: "" });
  }

  // Logs modal verify logic
  function openLogs(agent) {
    setLogsModal(agent);
    // Preload unchecked
    let verifyInit = {};
    agent.logs.forEach(l => verifyInit[l.id] = l.verified);
    setLogVerify(verifyInit);
  }
  
  function handleToggleVerify(id) {
    setLogVerify(verify => ({ ...verify, [id]: !verify[id] }));
  }
  
  function handleMarkSelectedVerified() {
    setAgents(prev => prev.map(a => {
      if (a.id !== logsModal.id) return a;
      return {
        ...a,
        logs: a.logs.map(log => logVerify[log.id]
          ? { ...log, verified: true }
          : log
        )
      }
    }));
    setLogsModal(null);
  }

  // === Render
  return (
    <>
      <style>{`
        @media (max-width: 640px){
          .react-datepicker{font-size:1rem !important;transform:scale(0.9)!important;}
        }
        .react-datepicker__header{background:#f97316!important;color:white!important;}
        .react-datepicker__day--selected{background:#f97316!important;color:white!important;font-weight:bold;}
        .react-datepicker__day--keyboard-selected{background:#fb923c!important;color:white!important;}
        .react-datepicker__day:hover{background:#fed7aa!important;color:#9a3412!important;}
        .react-datepicker__day--today{background:#ffedd5!important;color:#ea580c!important;font-weight:600!important;}
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pb-14">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <User size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Agent COD Monitoring
              </h1>
              <p className="text-base text-gray-600">Monitor, edit, and verify Cash On Delivery limits for all agents</p>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="max-w-7xl mx-auto px-6 py-5">
          <form
            className="bg-white p-5 rounded-xl border border-orange-100 shadow flex flex-wrap items-end gap-x-2 gap-y-5"
            style={{ justifyContent: 'center' }}
            onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col items-center w-full sm:w-[240px]">
              <label className="block text-xs font-semibold mb-1 text-gray-700 ml-1 md:mr-40">Search Agent</label>
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-2 py-2 text-center sm:text-left rounded-lg border border-orange-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Name or Phone"
                />
              </div>
            </div>
            <div className="flex-grow max-w-full flex gap-x-0 gap-y-3 flex-col sm:flex-row">
              <div className="flex flex-col items-center sm:items-start">
                <label className="block text-xs font-semibold mb-1 text-gray-700 ml-1">From</label>
                <DatePicker selected={dateFrom} onChange={setDateFrom}
                  maxDate={dateTo}
                  placeholderText="Start Date"
                  className="w-full px-3 py-2 rounded-lg border border-orange-300 text-center sm:text-left text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
              <div className="flex flex-col items-center sm:items-start ml-0 sm:ml-1">
                <label className="block text-xs font-semibold mb-1 text-gray-700 ml-1 sm:ml-2">To</label>
                <DatePicker selected={dateTo} onChange={setDateTo}
                  minDate={dateFrom}
                  placeholderText="End Date"
                  className="w-full px-3 py-2 rounded-lg border border-orange-300 text-center sm:text-left text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  dateFormat="dd/MM/yyyy"
                  isClearable
                />
              </div>
            </div>
            <div className="flex flex-col items-center w-full sm:w-auto sm:ml-4">
              <label className="block text-xs font-semibold mb-1 text-gray-700 ml-1"> </label>
              <div className="flex items-center">
                <input type="checkbox" id="exceedOnly" className="form-checkbox rounded border-orange-400 mr-2" checked={showOnlyExceeded} onChange={e => setShowOnlyExceeded(e.target.checked)} />
                <label htmlFor="exceedOnly" className="text-sm font-medium text-gray-700">Show only exceeded COD</label>
              </div>
            </div>
          </form>
        </div>

        {/* Metrics Summary */}
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-orange-100 shadow flex items-center px-4 py-4 gap-5">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-orange-100 rounded-lg"><span className="text-orange-500 text-xl font-bold">₹</span></span>
              <div>
                <div className="text-sm text-gray-600 font-semibold">Total COD Held</div>
                <div className="text-xl font-bold text-gray-900">₹{metrics.totalCod.toLocaleString()}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-orange-100 shadow flex items-center px-4 py-4 gap-5">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-rose-100 rounded-lg"><AlertTriangle size={22} className="text-rose-500" /></span>
              <div>
                <div className="text-sm text-gray-600 font-semibold">Agents Exceeded COD</div>
                <div className="text-xl font-bold text-gray-900">{metrics.agentsExceeded} Agents</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-orange-100 shadow flex items-center px-4 py-4 gap-5">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-blue-100 rounded-lg"><FileText size={22} className="text-blue-500" /></span>
              <div>
                <div className="text-sm text-gray-600 font-semibold">Unverified Submits</div>
                <div className="text-xl font-bold text-gray-900">{metrics.unverified} Submissions</div>
              </div>
            </div>
          </div>
        </div>

        {/* COD Agent Table */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-xl border border-orange-100 shadow-lg overflow-x-auto">
            <table className="w-full min-w-[900px] text-base">
              <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                <tr className="text-left font-semibold text-gray-700 uppercase text-xs">
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">COD Limit</th>
                  <th className="px-4 py-3">Current Holding</th>
                  <th className="px-4 py-3">Daily Collected</th>
                  <th className="px-4 py-3">Last Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAgents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <User size={40} className="text-gray-300 mb-3" />
                        <h3 className="text-lg font-semibold">No Agents Found</h3>
                        <div className="text-sm">Try changing your filter/search criteria</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pagedAgents.map(agent => (
                    <tr key={agent.id} className="hover:bg-orange-50 transition-colors font-medium">
                      <td className="px-4 py-3 flex items-center gap-2 text-gray-900">
                        <User size={15} className="text-orange-500" /> {agent.name}
                      </td>
                      <td className="px-4 py-3">{agent.phone}</td>
                      <td className="px-4 py-3">₹{agent.codLimit}</td>
                      <td className={`px-4 py-3 flex items-center ${holdingColor(agent.currentHolding, agent.codLimit)}`}>
                        ₹{agent.currentHolding}
                        <span className="ml-1">
                          {agent.currentHolding > agent.codLimit
                            ? <span role="img" aria-label="Exceeded">🔴</span>
                            : <span role="img" aria-label="OK">🟢</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3">₹{agent.dailyCollected}</td>
                      <td className="px-4 py-3">{agent.lastSubmitted}</td>
                      <td className="px-4 py-3">{statusBadge(agent.status)}</td>
                      <td className="px-4 py-3 flex gap-1">
                        <button className="px-2 py-1 rounded bg-orange-50 hover:bg-orange-200 border border-orange-200 text-orange-700 font-semibold flex items-center gap-1"
                          onClick={() => openEdit(agent)}>
                          <Pencil size={15} /> Edit
                        </button>
                        <button className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold flex items-center gap-1"
                          onClick={() => openLogs(agent)}>
                          <FileText size={15} /> Logs
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <PaginationControls />
          </div>
        </div>
      </div>

      {/* --- Edit Modal --- */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
          <form
            onSubmit={submitEdit}
            className="bg-white max-w-lg w-full rounded-xl shadow-2xl border border-orange-100 px-8 py-8 relative"
            style={{ minWidth: 340 }}>
            <button type="button" onClick={() => setEditModal(null)} className="absolute right-4 top-4 text-gray-400 hover:text-orange-500"><XCircle size={22} /></button>
            <div className="mb-5 flex items-center gap-2">
              <Pencil size={21} className="text-orange-500" />
              <h2 className="font-bold text-xl">Edit COD Limit & Submit Collection</h2>
            </div>
            <div className="text-base mb-2 flex flex-wrap gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1 text-gray-800"><User size={15} className="text-orange-500" /> <span className="font-semibold">{editModal.name}</span> ({editModal.phone})</span>
              <span className="inline-block ml-2 text-orange-700">Current COD Limit: ₹{editModal.codLimit}</span>
              <span className={holdingColor(editModal.currentHolding, editModal.codLimit)}>Holding: ₹{editModal.currentHolding}</span>
            </div>
            <div className="grid gap-5 mt-6">
              <div>
                <label className="block text-xs font-semibold mb-1">New COD Limit</label>
                <input type="number" name="codLimit" min="0" value={editForm.codLimit}
                  onChange={e => setEditForm(f => ({ ...f, codLimit: e.target.value }))}
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="₹ Amount"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Submit COD Amount</label>
                <input type="number" name="amount" min="0" value={editForm.amount}
                  onChange={e => setEditForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="₹ Amount"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Notes (optional)</label>
                <textarea rows="2"
                  name="notes"
                  value={editForm.notes}
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500 resize-none"
                  placeholder="e.g. Submitted at Hub"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setEditModal(null)}
                  className="px-5 py-2 text-gray-500 bg-gray-100 border rounded-lg text-sm font-semibold hover:bg-gray-200 flex items-center gap-2">
                  <X size={16} /> Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-700 flex items-center gap-2">
                  <Check size={16} /> Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- LOGS Modal --- */}
      {logsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
          <div className="relative bg-white max-w-2xl w-full rounded-xl border border-orange-100 shadow-2xl px-4 py-7">
            <button type="button" onClick={() => setLogsModal(null)} className="absolute right-5 top-5 text-gray-400 hover:text-orange-500"><XCircle size={22} /></button>
            <div className="mb-5 flex items-center gap-2">
              <FileText size={22} className="text-blue-500" />
              <h2 className="font-bold text-xl">COD Submission Logs — {logsModal.name}</h2>
            </div>
            {/* Responsive scrollable table wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] my-4 text-base border border-orange-100 rounded">
                <thead className="bg-gradient-to-r from-orange-50 to-orange-100 text-xs uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-2 text-left">Amount</th>
                    <th className="py-2 px-2 text-left">Method</th>
                    <th className="py-2 px-2 text-left">Dropped At</th>
                    <th className="py-2 px-2 text-left">Verified</th>
                    <th className="py-2 px-2 text-left">Notes</th>
                    <th className="py-2 px-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logsModal.logs.map(log => (
                    <tr key={log.id} className="border-t border-orange-50">
                      <td className="px-2 py-2 text-green-700 font-semibold">₹{log.amount}</td>
                      <td className="px-2 py-2">{log.method}</td>
                      <td className="px-2 py-2">{log.dropTime}</td>
                      <td className="px-2 py-2">
                        {log.verified
                          ? <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold"><CheckCircle size={12} /> Yes</span>
                          : <span className="inline-flex items-center px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold"><XCircle size={12} /> No</span>
                        }
                      </td>
                      <td className="px-2 py-2">{log.notes || "—"}</td>
                      <td className="px-2 py-2">
                        {!log.verified &&
                          <span className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="form-checkbox rounded border-emerald-400"
                              checked={!!logVerify[log.id]}
                              onChange={() => handleToggleVerify(log.id)}
                            />
                            <Check className="text-emerald-500" size={16} />
                            <button className="ml-2 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-1" title="View Drop Location">
                              <MapPin size={13} /> Map
                            </button>
                          </span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button type="button" onClick={() => setLogsModal(null)}
                className="px-5 py-2 text-gray-500 bg-gray-100 border rounded-lg text-sm font-semibold hover:bg-gray-200 flex items-center gap-2">
                <X size={16} /> Close
              </button>
              <button type="button" onClick={handleMarkSelectedVerified}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 flex items-center gap-2">
                <Check size={16} /> Mark Selected as Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
