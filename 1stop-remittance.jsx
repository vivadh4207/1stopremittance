import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ArrowRight, ArrowLeft, Globe, Shield, Zap, Clock, Star, ChevronDown, ChevronUp, DollarSign, Users, TrendingUp, MapPin, Send, CreditCard, Building2, Smartphone, CheckCircle, AlertCircle, X, Menu, BarChart3, Bell, Settings, LogOut, Eye, EyeOff, Filter, Download, RefreshCw, Info, Heart, Award, Lock, Wallet, ArrowUpRight, ArrowDownRight, ChevronRight, User, Mail, Phone, MessageSquare, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// ─── Constants & Mock Data ───────────────────────────────────────────────────

const PROVIDERS = [
  { id: 1, name: "Wise", logo: "🦉", rating: 4.8, reviews: "142K", speed: "1-2 hrs", color: "#9FE870" },
  { id: 2, name: "Remitly", logo: "💸", rating: 4.6, reviews: "89K", speed: "Minutes", color: "#1B75BC" },
  { id: 3, name: "Western Union", logo: "🟡", rating: 4.1, reviews: "67K", speed: "Minutes", color: "#FFDD00" },
  { id: 4, name: "Xoom (PayPal)", logo: "🅿️", rating: 4.3, reviews: "34K", speed: "1-3 days", color: "#0070BA" },
  { id: 5, name: "WorldRemit", logo: "🌍", rating: 4.5, reviews: "52K", speed: "Minutes", color: "#7B2D8E" },
  { id: 6, name: "OFX", logo: "💱", rating: 4.4, reviews: "28K", speed: "1-2 days", color: "#00264D" },
  { id: 7, name: "MoneyGram", logo: "🔵", rating: 4.0, reviews: "45K", speed: "Minutes", color: "#FF6600" },
  { id: 8, name: "Instarem", logo: "⚡", rating: 4.5, reviews: "19K", speed: "1 day", color: "#6C5CE7" },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳", symbol: "₹" },
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭", symbol: "₱" },
  { code: "MXN", name: "Mexican Peso", flag: "🇲🇽", symbol: "$" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
  { code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩", symbol: "৳" },
  { code: "BRL", name: "Brazilian Real", flag: "🇧🇷", symbol: "R$" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", symbol: "₵" },
  { code: "NPR", name: "Nepalese Rupee", flag: "🇳🇵", symbol: "₨" },
];

const BASE_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, PHP: 56.2, MXN: 17.1,
  NGN: 1550, PKR: 278, BDT: 110, BRL: 4.97, CAD: 1.36, AUD: 1.53,
  JPY: 151.5, KES: 153, GHS: 14.8, NPR: 133.5,
};

const COUNTRIES = [
  { name: "United States", code: "US", lat: 39, lng: -98, flag: "🇺🇸", corridors: 45 },
  { name: "United Kingdom", code: "GB", lat: 54, lng: -2, flag: "🇬🇧", corridors: 38 },
  { name: "India", code: "IN", lat: 22, lng: 78, flag: "🇮🇳", corridors: 12 },
  { name: "Philippines", code: "PH", lat: 13, lng: 122, flag: "🇵🇭", corridors: 8 },
  { name: "Mexico", code: "MX", lat: 24, lng: -102, flag: "🇲🇽", corridors: 10 },
  { name: "Nigeria", code: "NG", lat: 10, lng: 8, flag: "🇳🇬", corridors: 15 },
  { name: "Pakistan", code: "PK", lat: 30, lng: 69, flag: "🇵🇰", corridors: 9 },
  { name: "Bangladesh", code: "BD", lat: 24, lng: 90, flag: "🇧🇩", corridors: 7 },
  { name: "Brazil", code: "BR", lat: -10, lng: -55, flag: "🇧🇷", corridors: 11 },
  { name: "Canada", code: "CA", lat: 56, lng: -96, flag: "🇨🇦", corridors: 35 },
  { name: "Australia", code: "AU", lat: -26, lng: 134, flag: "🇦🇺", corridors: 30 },
  { name: "Germany", code: "DE", lat: 51, lng: 10, flag: "🇩🇪", corridors: 32 },
  { name: "France", code: "FR", lat: 47, lng: 2, flag: "🇫🇷", corridors: 28 },
  { name: "Kenya", code: "KE", lat: 0, lng: 38, flag: "🇰🇪", corridors: 13 },
  { name: "Ghana", code: "GH", lat: 8, lng: -2, flag: "🇬🇭", corridors: 11 },
  { name: "Nepal", code: "NP", lat: 28, lng: 84, flag: "🇳🇵", corridors: 5 },
  { name: "Japan", code: "JP", lat: 36, lng: 138, flag: "🇯🇵", corridors: 25 },
  { name: "UAE", code: "AE", lat: 24, lng: 54, flag: "🇦🇪", corridors: 20 },
  { name: "Singapore", code: "SG", lat: 1, lng: 104, flag: "🇸🇬", corridors: 22 },
  { name: "South Africa", code: "ZA", lat: -29, lng: 25, flag: "🇿🇦", corridors: 14 },
];

const RATE_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  rate: 83.2 + Math.sin(i / 3) * 1.2 + Math.random() * 0.5,
  avg: 83.5,
}));

const TRANSACTIONS = [
  { id: "TXN-8847", date: "Apr 12, 2026", to: "Rajesh K.", country: "🇮🇳 India", amount: "$500.00", received: "₹41,625", status: "completed", provider: "Wise" },
  { id: "TXN-8832", date: "Apr 10, 2026", to: "Maria G.", country: "🇵🇭 Philippines", amount: "$300.00", received: "₱16,830", status: "completed", provider: "Remitly" },
  { id: "TXN-8819", date: "Apr 8, 2026", to: "Abdul R.", country: "🇵🇰 Pakistan", amount: "$200.00", received: "₨55,400", status: "completed", provider: "Wise" },
  { id: "TXN-8805", date: "Apr 5, 2026", to: "Carlos M.", country: "🇲🇽 Mexico", amount: "$400.00", received: "$6,800", status: "pending", provider: "Western Union" },
  { id: "TXN-8791", date: "Apr 2, 2026", to: "Amina O.", country: "🇳🇬 Nigeria", amount: "$250.00", received: "₦387,500", status: "completed", provider: "WorldRemit" },
];

// ─── Utility Functions ───────────────────────────────────────────────────────

function getRate(from, to) {
  return BASE_RATES[to] / BASE_RATES[from];
}

function generateProviderRates(amount, from, to) {
  const baseRate = getRate(from, to);
  return PROVIDERS.map((p) => {
    const margin = 0.97 + Math.random() * 0.04;
    const rate = baseRate * margin;
    const fee = +(1.5 + Math.random() * 6).toFixed(2);
    const received = +((amount - fee) * rate).toFixed(2);
    return { ...p, rate: +rate.toFixed(4), fee, received, total: +(amount).toFixed(2) };
  }).sort((a, b) => b.received - a.received);
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedNumber({ value, decimals = 2, prefix = "", suffix = "", duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

// ─── CurrencySelect ─────────────────────────────────────────────────────────

function CurrencySelect({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const selected = CURRENCIES.find((c) => c.code === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = CURRENCIES.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      {label && <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all min-w-[140px]"
      >
        <span className="text-xl">{selected?.flag}</span>
        <span className="font-semibold">{selected?.code}</span>
        <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="bg-transparent text-white text-sm outline-none flex-1"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.code}
                onClick={() => { onChange(c.code); setOpen(false); setSearch(""); }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-2.5 hover:bg-white/10 transition-colors text-left",
                  c.code === value && "bg-white/10"
                )}
              >
                <span className="text-xl">{c.flag}</span>
                <div>
                  <div className="text-white font-medium text-sm">{c.code}</div>
                  <div className="text-gray-400 text-xs">{c.name}</div>
                </div>
                {c.code === value && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function Nav({ currentPage, setCurrentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { id: "home", label: "Home" },
    { id: "compare", label: "Compare Rates" },
    { id: "send", label: "Send Money" },
    { id: "map", label: "Coverage" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-gray-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => setCurrentPage("home")} className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Send className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold text-white">1Stop</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">Remittance</span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => setCurrentPage(l.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  currentPage === l.id ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Log In</button>
            <button className="px-5 py-2.5 text-sm font-bold text-gray-900 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl hover:shadow-lg hover:shadow-emerald-400/25 transition-all">
              Get Started Free
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-gray-950/95 backdrop-blur-xl border-t border-white/10 px-4 pb-6">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => { setCurrentPage(l.id); setMenuOpen(false); }}
              className={cn(
                "block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all",
                currentPage === l.id ? "text-emerald-400 bg-emerald-400/10" : "text-gray-300"
              )}
            >
              {l.label}
            </button>
          ))}
          <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2.5 text-sm font-medium text-gray-300 border border-white/20 rounded-xl">Log In</button>
            <button className="flex-1 py-2.5 text-sm font-bold text-gray-900 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────

function Hero({ setCurrentPage }) {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const converted = amount * getRate(from, to);

  const stats = [
    { value: "200+", label: "Countries", icon: Globe },
    { value: "50+", label: "Currencies", icon: DollarSign },
    { value: "8M+", label: "Users Trust Us", icon: Users },
    { value: "$2B+", label: "Transferred", icon: TrendingUp },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-400/10 border border-emerald-400/20 rounded-full mb-6 sm:mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Live rates from 8+ providers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] mb-6">
              Compare.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Save.</span>
              <br />Send Money{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Smarter.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed">
              Find the best exchange rates and lowest fees across all major remittance providers. Save up to 8x on your international transfers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => setCurrentPage("compare")}
                className="group px-8 py-4 text-base font-bold text-gray-900 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl hover:shadow-2xl hover:shadow-emerald-400/25 transition-all flex items-center justify-center gap-2"
              >
                Compare Rates Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setCurrentPage("send")}
                className="px-8 py-4 text-base font-bold text-white border border-white/20 rounded-2xl hover:bg-white/5 transition-all"
              >
                Send Money
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <s.icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-xl sm:text-2xl font-bold text-white">{s.value}</span>
                  </div>
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Calculator Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-3xl blur-xl" />
            <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Quick Rate Check</h3>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <label className="text-xs text-gray-400 font-medium">You send</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(+e.target.value || 0)}
                      className="flex-1 bg-transparent text-3xl font-bold text-white outline-none"
                    />
                    <CurrencySelect value={from} onChange={setFrom} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => { const t = from; setFrom(to); setTo(t); }}
                    className="w-10 h-10 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center hover:bg-emerald-400/20 transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-400 rotate-90" />
                  </button>
                </div>

                <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-4">
                  <label className="text-xs text-emerald-400 font-medium">They receive</label>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1 text-3xl font-bold text-emerald-400">
                      <AnimatedNumber value={converted} decimals={2} />
                    </div>
                    <CurrencySelect value={to} onChange={setTo} />
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 text-sm">
                  <span className="text-gray-400">Mid-market rate</span>
                  <span className="text-white font-semibold">1 {from} = {getRate(from, to).toFixed(4)} {to}</span>
                </div>

                <button
                  onClick={() => setCurrentPage("compare")}
                  className="w-full py-4 text-base font-bold text-gray-900 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl hover:shadow-lg hover:shadow-emerald-400/25 transition-all"
                >
                  Compare All Providers →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Provider Comparison ─────────────────────────────────────────────────────

function CompareRates() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [sortBy, setSortBy] = useState("received");
  const [showChart, setShowChart] = useState(false);

  const providers = generateProviderRates(amount, from, to);
  const best = providers[0];
  const worst = providers[providers.length - 1];
  const savings = (best.received - worst.received).toFixed(2);

  const sorted = [...providers].sort((a, b) => {
    if (sortBy === "received") return b.received - a.received;
    if (sortBy === "fee") return a.fee - b.fee;
    if (sortBy === "rate") return b.rate - a.rate;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <section className="min-h-screen bg-gray-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Live Rates</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Real-time comparison across 8+ major providers. Updated every 60 seconds.</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-400 font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(+e.target.value || 0)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-lg font-bold outline-none focus:border-emerald-400/50"
              />
            </div>
            <CurrencySelect value={from} onChange={setFrom} label="From" />
            <button
              onClick={() => { const t = from; setFrom(to); setTo(t); }}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all self-end mb-0.5"
            >
              ⇄
            </button>
            <CurrencySelect value={to} onChange={setTo} label="To" />
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-400/25 transition-all self-end">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        {/* Savings Banner */}
        <div className="bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 border border-emerald-400/20 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">You could save up to {CURRENCIES.find(c => c.code === to)?.symbol}<AnimatedNumber value={+savings} decimals={0} /></p>
              <p className="text-gray-400 text-sm">by choosing {best.name} over {worst.name} for this transfer</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChart(!showChart)}
              className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/15 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" /> {showChart ? "Hide" : "Show"} Chart
            </button>
          </div>
        </div>

        {/* Rate History Chart */}
        {showChart && (
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-bold mb-4">{from}/{to} Rate History (30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={RATE_HISTORY}>
                <defs>
                  <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" fontSize={12} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                />
                <Area type="monotone" dataKey="rate" stroke="#34d399" strokeWidth={2} fill="url(#rateGrad)" />
                <Line type="monotone" dataKey="avg" stroke="#6b7280" strokeDasharray="5 5" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sort controls */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <span className="text-gray-400 text-sm whitespace-nowrap">Sort by:</span>
          {[
            { id: "received", label: "Best Value" },
            { id: "fee", label: "Lowest Fee" },
            { id: "rate", label: "Best Rate" },
            { id: "rating", label: "Rating" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                sortBy === s.id ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/30" : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Provider Cards */}
        <div className="space-y-3">
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className={cn(
                "group bg-gray-900/50 border rounded-2xl p-4 sm:p-6 hover:bg-gray-900/80 transition-all",
                i === 0 ? "border-emerald-400/30 shadow-lg shadow-emerald-400/5" : "border-white/10"
              )}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Rank & Provider */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    i === 0 ? "bg-emerald-400/20 text-emerald-400" : "bg-white/5 text-gray-400"
                  )}>
                    {i === 0 ? "👑" : `#${i + 1}`}
                  </div>
                  <div className="text-3xl">{p.logo}</div>
                  <div>
                    <div className="text-white font-bold">{p.name}</div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs font-medium">{p.rating}</span>
                      <span className="text-gray-500 text-xs">({p.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Rate & Details */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                  <div>
                    <div className="text-xs text-gray-400">Exchange Rate</div>
                    <div className="text-white font-semibold">{p.rate.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Fee</div>
                    <div className="text-white font-semibold">${p.fee}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Speed</div>
                    <div className="text-white font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {p.speed}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Recipient gets</div>
                    <div className={cn("text-lg font-bold", i === 0 ? "text-emerald-400" : "text-white")}>
                      {CURRENCIES.find(c => c.code === to)?.symbol}{p.received.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button className={cn(
                  "px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap",
                  i === 0
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 hover:shadow-lg hover:shadow-emerald-400/25"
                    : "bg-white/10 text-white hover:bg-white/15"
                )}>
                  {i === 0 ? "Best Deal →" : "Send →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Send Money Flow ─────────────────────────────────────────────────────────

function SendMoney() {
  const [step, setStep] = useState(1);
  const [sendAmount, setSendAmount] = useState(500);
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [recipient, setRecipient] = useState({ name: "", email: "", bank: "", account: "" });
  const [payMethod, setPayMethod] = useState("bank");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = generateProviderRates(sendAmount, fromCur, toCur).slice(0, 4);
  const rate = getRate(fromCur, toCur);

  const steps = [
    { num: 1, label: "Amount", icon: DollarSign },
    { num: 2, label: "Provider", icon: TrendingUp },
    { num: 3, label: "Recipient", icon: Users },
    { num: 4, label: "Payment", icon: CreditCard },
    { num: 5, label: "Review", icon: CheckCircle },
  ];

  return (
    <section className="min-h-screen bg-gray-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Send <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Money</span> Worldwide
          </h2>
          <p className="text-gray-400">Fast, secure, and at the best available rate.</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className="flex flex-col items-center gap-2 min-w-[60px]"
              >
                <div className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all",
                  step === s.num ? "bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-400/25" :
                  step > s.num ? "bg-emerald-400/20" : "bg-white/5"
                )}>
                  {step > s.num
                    ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                    : <s.icon className={cn("w-5 h-5", step === s.num ? "text-gray-900" : "text-gray-500")} />}
                </div>
                <span className={cn("text-xs font-medium hidden sm:block", step >= s.num ? "text-white" : "text-gray-500")}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn("w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 rounded-full", step > s.num ? "bg-emerald-400" : "bg-white/10")} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 sm:p-8">
          {/* Step 1: Amount */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">How much do you want to send?</h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <label className="text-sm text-gray-400">You send</label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(+e.target.value || 0)}
                    className="flex-1 bg-transparent text-4xl font-bold text-white outline-none"
                  />
                  <CurrencySelect value={fromCur} onChange={setFromCur} />
                </div>
              </div>
              <div className="text-center text-gray-400 text-sm">1 {fromCur} = {rate.toFixed(4)} {toCur}</div>
              <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-6">
                <label className="text-sm text-emerald-400">They receive (estimated)</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1 text-4xl font-bold text-emerald-400">
                    <AnimatedNumber value={sendAmount * rate} decimals={2} />
                  </div>
                  <CurrencySelect value={toCur} onChange={setToCur} />
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-2xl text-lg hover:shadow-lg hover:shadow-emerald-400/25 transition-all"
              >
                Continue to Providers →
              </button>
            </div>
          )}

          {/* Step 2: Provider */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Choose your provider</h3>
              <div className="space-y-3">
                {providers.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={cn(
                      "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4",
                      selectedProvider?.id === p.id
                        ? "border-emerald-400/50 bg-emerald-400/5"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    {i === 0 && <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-400 text-gray-900 text-xs font-bold rounded-full">Best</div>}
                    <div className="text-3xl">{p.logo}</div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{p.name}</div>
                      <div className="text-gray-400 text-sm">Rate: {p.rate.toFixed(4)} · Fee: ${p.fee} · {p.speed}</div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-lg font-bold", i === 0 ? "text-emerald-400" : "text-white")}>
                        {CURRENCIES.find(c => c.code === toCur)?.symbol}{p.received.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">recipient gets</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">
                  ← Back
                </button>
                <button
                  onClick={() => selectedProvider && setStep(3)}
                  disabled={!selectedProvider}
                  className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-2xl disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Recipient */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Recipient details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", key: "name", placeholder: "Rajesh Kumar", icon: User },
                  { label: "Email", key: "email", placeholder: "rajesh@email.com", icon: Mail },
                  { label: "Bank Name", key: "bank", placeholder: "State Bank of India", icon: Building2 },
                  { label: "Account Number", key: "account", placeholder: "XXXX XXXX XXXX", icon: CreditCard },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm text-gray-400 font-medium mb-1">{f.label}</label>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-emerald-400/50 transition-all">
                      <f.icon className="w-4 h-4 text-gray-500" />
                      <input
                        value={recipient[f.key]}
                        onChange={(e) => setRecipient({ ...recipient, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="flex-1 bg-transparent text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">← Back</button>
                <button onClick={() => setStep(4)} className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-2xl hover:shadow-lg transition-all">Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">How would you like to pay?</h3>
              <div className="space-y-3">
                {[
                  { id: "bank", label: "Bank Transfer", desc: "Direct from your bank account", icon: Building2, badge: "No fee" },
                  { id: "card", label: "Debit/Credit Card", desc: "Pay with Visa, Mastercard", icon: CreditCard, badge: "+$2.99" },
                  { id: "wallet", label: "Digital Wallet", desc: "Apple Pay, Google Pay", icon: Smartphone, badge: "No fee" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border flex items-center gap-4 transition-all",
                      payMethod === m.id ? "border-emerald-400/50 bg-emerald-400/5" : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", payMethod === m.id ? "bg-emerald-400/20" : "bg-white/5")}>
                      <m.icon className={cn("w-5 h-5", payMethod === m.id ? "text-emerald-400" : "text-gray-400")} />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{m.label}</div>
                      <div className="text-gray-400 text-sm">{m.desc}</div>
                    </div>
                    <span className={cn("px-3 py-1 rounded-lg text-xs font-medium", m.badge === "No fee" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400")}>
                      {m.badge}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">← Back</button>
                <button onClick={() => setStep(5)} className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-2xl hover:shadow-lg transition-all">Review Transfer →</button>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Review your transfer</h3>
              <div className="bg-white/5 border border-white/10 rounded-2xl divide-y divide-white/10">
                {[
                  { label: "You send", value: `$${sendAmount.toLocaleString()} ${fromCur}` },
                  { label: "Provider", value: selectedProvider?.name || "Wise" },
                  { label: "Exchange rate", value: `1 ${fromCur} = ${(selectedProvider?.rate || rate).toFixed(4)} ${toCur}` },
                  { label: "Fee", value: `$${selectedProvider?.fee || "2.50"}` },
                  { label: "Payment method", value: payMethod === "bank" ? "Bank Transfer" : payMethod === "card" ? "Debit/Credit Card" : "Digital Wallet" },
                  { label: "Recipient", value: recipient.name || "Rajesh Kumar" },
                  { label: "Delivery speed", value: selectedProvider?.speed || "1-2 hrs" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-5 py-4">
                    <span className="text-gray-400 text-sm">{row.label}</span>
                    <span className="text-white font-semibold text-sm">{row.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-5 bg-emerald-400/5">
                  <span className="text-emerald-400 font-bold">Recipient gets</span>
                  <span className="text-emerald-400 font-bold text-xl">
                    {CURRENCIES.find(c => c.code === toCur)?.symbol}{(selectedProvider?.received || sendAmount * rate).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200/80 text-sm">This is a comparison demo. You'll be redirected to {selectedProvider?.name || "the provider"}'s website to complete the actual transfer.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="flex-1 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">← Back</button>
                <button className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Confirm & Redirect →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Coverage Map ────────────────────────────────────────────────────────────

function CoverageMap() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const regions = {
    "North America": COUNTRIES.filter((c) => ["US", "CA", "MX"].includes(c.code)),
    "Europe": COUNTRIES.filter((c) => ["GB", "DE", "FR"].includes(c.code)),
    "Asia": COUNTRIES.filter((c) => ["IN", "PH", "PK", "BD", "NP", "JP", "AE", "SG"].includes(c.code)),
    "Africa": COUNTRIES.filter((c) => ["NG", "KE", "GH", "ZA"].includes(c.code)),
    "South America": COUNTRIES.filter((c) => ["BR"].includes(c.code)),
    "Oceania": COUNTRIES.filter((c) => ["AU"].includes(c.code)),
  };

  return (
    <section className="min-h-screen bg-gray-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Coverage</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Send and receive money across 200+ countries through our network of trusted providers.</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Countries", value: "200+", icon: Globe, color: "emerald" },
            { label: "Corridors", value: "1,500+", icon: ArrowRight, color: "cyan" },
            { label: "Providers", value: "8+", icon: Building2, color: "purple" },
            { label: "Currencies", value: "50+", icon: DollarSign, color: "yellow" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 sm:p-5 text-center">
              <s.icon className={`w-6 h-6 mx-auto mb-2 text-${s.color}-400`} />
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search countries..."
              className="flex-1 bg-transparent text-white outline-none"
            />
          </div>
        </div>

        {/* Visual World Map */}
        <div className="bg-gray-900/50 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: "50%" }}>
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full">
              {/* World map simplified */}
              <rect x="0" y="0" width="1000" height="500" fill="transparent" />
              {/* Grid lines */}
              {Array.from({ length: 10 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="rgba(255,255,255,0.03)" />
              ))}
              {Array.from({ length: 20 }, (_, i) => (
                <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(255,255,255,0.03)" />
              ))}

              {/* Continents as stylized shapes */}
              {/* North America */}
              <path d="M 150 80 Q 200 60 250 80 L 280 120 Q 300 160 260 200 L 220 220 Q 180 240 160 200 L 140 160 Q 120 120 150 80 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
              {/* South America */}
              <path d="M 220 260 Q 260 250 280 280 L 290 340 Q 280 400 260 420 L 240 400 Q 220 360 230 320 L 220 260 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
              {/* Europe */}
              <path d="M 440 70 Q 480 50 530 70 L 540 100 Q 530 130 500 140 L 460 130 Q 430 110 440 70 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
              {/* Africa */}
              <path d="M 460 170 Q 500 150 540 170 L 560 250 Q 550 340 520 370 L 490 360 Q 460 320 450 250 L 460 170 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
              {/* Asia */}
              <path d="M 560 60 Q 650 40 750 60 L 800 120 Q 810 180 770 220 L 700 240 Q 640 230 600 200 L 570 150 Q 550 100 560 60 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />
              {/* Australia */}
              <path d="M 780 320 Q 830 300 870 320 L 880 360 Q 870 390 840 400 L 800 390 Q 770 370 780 320 Z" fill="rgba(52, 211, 153, 0.1)" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" />

              {/* Country dots */}
              {COUNTRIES.map((c) => {
                const x = ((c.lng + 180) / 360) * 1000;
                const y = ((90 - c.lat) / 180) * 500;
                const isSelected = selectedCountry?.code === c.code;
                return (
                  <g key={c.code} onClick={() => setSelectedCountry(c)} style={{ cursor: "pointer" }}>
                    {/* Pulse ring */}
                    <circle cx={x} cy={y} r={isSelected ? 20 : 12} fill="none" stroke={isSelected ? "#34d399" : "rgba(52, 211, 153, 0.3)"} strokeWidth="1" opacity={isSelected ? 0.5 : 0.3}>
                      <animate attributeName="r" from={isSelected ? 12 : 8} to={isSelected ? 25 : 16} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Main dot */}
                    <circle cx={x} cy={y} r={isSelected ? 6 : 4} fill={isSelected ? "#34d399" : "#06b6d4"} />
                    {/* Label */}
                    {isSelected && (
                      <g>
                        <rect x={x - 50} y={y - 35} width="100" height="24" rx="6" fill="#111827" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
                        <text x={x} y={y - 19} textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">{c.flag} {c.name}</text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Connection lines (animated) */}
              {selectedCountry && COUNTRIES.filter((c) => c.code !== selectedCountry.code).slice(0, 5).map((c) => {
                const x1 = ((selectedCountry.lng + 180) / 360) * 1000;
                const y1 = ((90 - selectedCountry.lat) / 180) * 500;
                const x2 = ((c.lng + 180) / 360) * 1000;
                const y2 = ((90 - c.lat) / 180) * 500;
                return (
                  <line key={c.code} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(52,211,153,0.15)" strokeWidth="1" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                  </line>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Country Detail */}
        {selectedCountry && (
          <div className="bg-gray-900/50 border border-emerald-400/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{selectedCountry.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCountry.name}</h3>
                <p className="text-gray-400 text-sm">{selectedCountry.corridors} active corridors</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Available providers</div>
                <div className="text-white font-bold">{Math.min(selectedCountry.corridors, 8)} providers</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Fastest delivery</div>
                <div className="text-white font-bold">Within minutes</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-xs text-gray-400 mb-1">Lowest fee from</div>
                <div className="text-emerald-400 font-bold">$0.00</div>
              </div>
            </div>
          </div>
        )}

        {/* Region Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(regions).map(([region, countries]) => (
            <div key={region} className="bg-gray-900/50 border border-white/10 rounded-2xl p-5">
              <h4 className="text-white font-bold mb-3">{region}</h4>
              <div className="space-y-2">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c)}
                    className={cn(
                      "flex items-center gap-3 w-full p-2 rounded-lg transition-all text-left",
                      selectedCountry?.code === c.code ? "bg-emerald-400/10" : "hover:bg-white/5"
                    )}
                  >
                    <span className="text-lg">{c.flag}</span>
                    <span className="text-sm text-white">{c.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{c.corridors} corridors</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard() {
  const [tab, setTab] = useState("overview");

  const chartData = [
    { month: "Nov", sent: 450, saved: 22 },
    { month: "Dec", sent: 800, saved: 38 },
    { month: "Jan", sent: 1200, saved: 55 },
    { month: "Feb", sent: 650, saved: 31 },
    { month: "Mar", sent: 950, saved: 45 },
    { month: "Apr", sent: 1650, saved: 72 },
  ];

  return (
    <section className="min-h-screen bg-gray-950 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Welcome back! 👋</h2>
            <p className="text-gray-400">Here's your remittance activity summary.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-gray-900 font-bold">
              V
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sent", value: "$5,700", change: "+12%", up: true, icon: Send, color: "emerald" },
            { label: "Total Saved", value: "$263", change: "+8%", up: true, icon: TrendingUp, color: "cyan" },
            { label: "Transfers", value: "14", change: "+3", up: true, icon: ArrowRight, color: "purple" },
            { label: "Recipients", value: "5", change: "+1", up: true, icon: Users, color: "yellow" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-${s.color}-400/10 flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 text-${s.color}-400`} />
                </div>
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", s.up ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400")}>
                  {s.up ? "↑" : "↓"} {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-gray-900/50 border border-white/10 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Transfer Activity</h3>
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {["6M", "1Y", "All"].map((p) => (
                  <button key={p} className={cn("px-3 py-1 rounded-md text-xs font-medium transition-all", p === "6M" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white")}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={12} tickLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                  formatter={(value) => [`$${value}`, ""]}
                />
                <Bar dataKey="sent" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Widget */}
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Savings</h3>
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-emerald-400/20 mb-4">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">$263</div>
                  <div className="text-xs text-gray-400">saved total</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">vs. Western Union</span>
                <span className="text-emerald-400 font-bold">$142 saved</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">vs. Banks</span>
                <span className="text-emerald-400 font-bold">$89 saved</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">vs. MoneyGram</span>
                <span className="text-emerald-400 font-bold">$32 saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-6 bg-gray-900/50 border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Recent Transfers</h3>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  {["Transaction", "Recipient", "Amount", "Received", "Provider", "Status"].map((h) => (
                    <th key={h} className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="text-white text-sm font-medium">{tx.id}</div>
                      <div className="text-xs text-gray-500">{tx.date}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="text-white text-sm">{tx.to}</div>
                      <div className="text-xs text-gray-500">{tx.country}</div>
                    </td>
                    <td className="py-4 pr-4 text-white text-sm font-medium">{tx.amount}</td>
                    <td className="py-4 pr-4 text-emerald-400 text-sm font-medium">{tx.received}</td>
                    <td className="py-4 pr-4 text-gray-300 text-sm">{tx.provider}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        tx.status === "completed" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trust & Features ────────────────────────────────────────────────────────

function TrustSection({ setCurrentPage }) {
  return (
    <section className="bg-gray-950 py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">1Stop</span> Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Three simple steps to find the best deal and send money globally.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {[
            { step: "01", title: "Compare Rates", desc: "Enter the amount and corridor. We instantly compare rates across 8+ providers.", icon: Search, color: "from-emerald-400 to-emerald-500" },
            { step: "02", title: "Choose Best Deal", desc: "See fees, rates, and delivery speed side by side. Pick your winner.", icon: Award, color: "from-cyan-400 to-cyan-500" },
            { step: "03", title: "Send & Save", desc: "We redirect you to the provider. Complete your transfer and save money.", icon: Send, color: "from-purple-400 to-purple-500" },
          ].map((s) => (
            <div key={s.step} className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/10 to-cyan-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gray-900/50 border border-white/10 rounded-3xl p-6 sm:p-8 h-full hover:border-emerald-400/30 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-emerald-400/30 text-5xl font-black mb-2">{s.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {[
            { icon: Shield, label: "Bank-Level Security", desc: "256-bit SSL encryption" },
            { icon: Lock, label: "Data Protected", desc: "GDPR & SOC2 compliant" },
            { icon: Zap, label: "Real-Time Rates", desc: "Updated every 60 seconds" },
            { icon: Heart, label: "Trusted by 8M+", desc: "Users worldwide" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-4 bg-gray-900/50 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{b.label}</div>
                <div className="text-gray-400 text-xs">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Millions</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 mb-20">
          {[
            { name: "Priya S.", country: "🇮🇳 India", text: "Saved over $200 in the last 3 months by comparing rates here. The interface is beautiful and so easy to use!", rating: 5 },
            { name: "Carlos M.", country: "🇲🇽 Mexico", text: "I used to just use Western Union. Now I always compare first and the savings are real. Highly recommend!", rating: 5 },
            { name: "Fatima A.", country: "🇳🇬 Nigeria", text: "Finally a comparison site that actually shows real rates and fees. No hidden surprises. Love it!", rating: 5 },
          ].map((t) => (
            <div key={t.name} className="bg-gray-900/50 border border-white/10 rounded-2xl p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-gray-900 font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">Sends to {t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <div className="relative px-6 sm:px-12 py-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Stop Overpaying on Remittances</h2>
            <p className="text-gray-800/80 text-lg mb-8 max-w-xl mx-auto">Join 8M+ users who save money on every international transfer.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage("compare")}
                className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all text-lg"
              >
                Compare Rates Free →
              </button>
              <button className="px-8 py-4 bg-white/20 text-gray-900 font-bold rounded-2xl hover:bg-white/30 transition-all text-lg backdrop-blur-sm">
                Download App
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ setCurrentPage }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-gray-950 border-t border-white/5 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <Send className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">1Stop</span>
                <span className="text-xl font-bold text-emerald-400">Remittance</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              Compare rates across 8+ providers and save on every international money transfer. Trusted by millions worldwide.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-emerald-400/50"
              />
              <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-bold rounded-xl text-sm hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Product", links: [{ label: "Compare Rates", id: "compare" }, { label: "Send Money", id: "send" }, { label: "Coverage Map", id: "map" }, { label: "Mobile App", id: null }] },
            { title: "Company", links: [{ label: "About Us", id: null }, { label: "Careers", id: null }, { label: "Press", id: null }, { label: "Contact", id: null }] },
            { title: "Legal", links: [{ label: "Privacy Policy", id: null }, { label: "Terms of Service", id: null }, { label: "Cookie Policy", id: null }, { label: "Disclaimers", id: null }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => l.id && setCurrentPage(l.id)}
                      className="text-gray-400 text-sm hover:text-emerald-400 transition-colors"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">&copy; 2026 1StopRemittance. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <button key={i} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:bg-white/10 transition-all">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Nav currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && (
        <>
          <Hero setCurrentPage={setCurrentPage} />
          <TrustSection setCurrentPage={setCurrentPage} />
        </>
      )}
      {currentPage === "compare" && <CompareRates />}
      {currentPage === "send" && <SendMoney />}
      {currentPage === "map" && <CoverageMap />}
      {currentPage === "dashboard" && <Dashboard />}

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
