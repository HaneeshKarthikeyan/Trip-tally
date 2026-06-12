"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; 
import { 
  Truck, Users, Wallet, LayoutDashboard, History, List,
  Bell, Plus, FileText, Navigation, X, TrendingUp, TrendingDown,
  Leaf, ShieldCheck, ChevronRight, RefreshCw, ChevronDown, ChevronUp,
  Palette, Building2, CalendarDays, FileCheck, UserCircle, Receipt, 
  Calculator, Briefcase, Weight, LogOut, Lock, UserPlus, Printer, 
  Droplet, Filter, Calendar, Trash2, CheckSquare, CreditCard, Download,
  Package, Square, CheckCircle2, Menu, Gauge
} from 'lucide-react';

// --- 1. CONFIGURATION ---

const CONTRACTOR_LOADS: Record<string, string[]> = {
  "Null":["Null"],
  "KSP": ["Maize", "Rape Seed", "Soya", "Fertilizer"],
  "TKS": ["Fertilizer", "SVM", "UFC", "IPL", "Spric", "Thirumagal","Samundeshwari"],
  "SBT": ["Rice", "Wheat", "Fertilizer", "Maize", "Sugar", "SOYA"],
  "MP SAMY": ["Rape Seed", "Wheat"],
  "SS":["Maize"],
  "KGS":["Sugar"],
};

const DESTINATION_RATES = [
  { name: "Null", rate: 0 },{ name: "RGS", rate: 300 },
  { name: "Perundurai-41", rate: 300 },{ name: "Perundurai-42", rate: 300 },{ name: "Perundurai-43", rate: 300 },{ name: "Perundurai-KK8", rate: 300 }
  ,{ name: "KK Nagar", rate: 0 },{ name: "Spac", rate: 325 },{ name: "Thirumagal", rate: 0 },{ name: "SVM", rate: 0 },{ name: "SK Samy", rate: 0 },{ name: "Moolapalayam", rate: 90 },{ name: "Perundurai", rate: 295 },{ name: "Tiruvachi", rate: 200 },{ name: "Athani", rate: 430 }, { name: "Anthiyur", rate: 430 }, { name: "Ammapettai", rate: 445 },
  { name: "Arachalur", rate: 370 },{ name: "Kavindapadi", rate: 365 }, { name: "Kallipatti", rate: 465 },{ name: "Chithode", rate: 315 },{ name: "Chithar", rate: 430 },{ name: "Kundadam", rate: 550 }, { name: "Alangiyam", rate: 600 }, 
   { name: "Jedarpalayam", rate: 430 },
  { name: "T.N Palayam", rate: 500 },{ name: "Hanumanpalli", rate: 350 },{name: "Sivagiri", rate: 410 },{ name: "Gobi", rate: 430 }, { name: "D.G Pudur", rate: 510 }, { name: "Chennimalai", rate: 400 },{ name: "Appakudal", rate: 410 },
  { name: "Anaimalai", rate: 700 },{ name: "Avinashi", rate: 550 }, { name: "Irayamangalam", rate: 365 }, { name: "Udumalpet", rate: 650 },
  { name: "Uthukuli (Tiruppur)", rate: 445 },{ name: "Alukuli", rate: 460 }, { name: "Edappadi", rate: 490 }, { name: "Ettikuttai", rate: 440 },
  { name: "Erangattur", rate: 540 }, { name: "Erisanampatti", rate: 680 }, { name: "Elathur Chettipalayam", rate: 510 },
  { name: "Ellakadai", rate: 400 }, { name: "Elumathur", rate: 390 }, { name :"Ayyansalai", rate : 540 },
  { name: "Odapalli", rate: 350 }, { name: "Oddanchatram", rate: 600 }, { name: "Gangapuram", rate: 260 },
  { name: "Ganapathipalayam", rate: 360 }, { name: "Kaniyur", rate: 620 }, { name: "Kandasamypalayam", rate: 420 },
  { name: "Kapilarmalai", rate: 450 }, { name: "Karumandampalayam", rate: 390 }, { name: "Karur", rate: 510 },
  { name: "Kanakapuram", rate: 320 },
  { name: "Kangeyam", rate: 470 }, { name: "Kasipalayam (Gobi)", rate: 460 }, { name: "Kasiyur", rate: 460 },
  { name: "Kanjikoil", rate: 360 }, { name: "Karamadai", rate: 650 }, { name: "Kalingarayanpalayam", rate: 340 },
  { name: "Keelvani", rate: 430 }, { name: "Gudimangalam", rate: 600 }, { name: "Kuttamuniyappan Kovil", rate: 420 }, { name: "Gunduchettipalayam", rate: 380 }, { name: "Kumaralingam", rate: 670 },
  { name: "Kumarapalayam", rate: 370 }, { name: "Kurumandur", rate: 480 }, { name: "Guruvareddiyur", rate: 480 },
  { name: "Kunnathur", rate: 435 }, { name: "Getticheviyur", rate: 420 }, { name: "Kemmanaickenpalayam", rate: 540 },
  { name: "Kesarimangalam", rate: 390 }, { name: "Kokkarayanpettai", rate: 360 }, { name: "Konganapuram", rate: 500 },
  { name: "Kodumudi", rate: 445 }, { name: "Koduvai", rate: 550 }, { name: "Kolumam", rate: 680 },
  { name: "Kolathur", rate: 560 }, { name: "Kolappalur", rate: 430 }, { name: "Kottur", rate: 670 },
 { name: "Kovai (Coimbatore)", rate: 650 }, { name: "Koneripatti", rate: 450 },
  { name: "Koneripatti Pirivu", rate: 430 }, { name: "Sankagiri", rate: 390 }, { name: "Sathyamangalam", rate: 510 },
  { name: "Chathiram", rate: 590 }, { name: "Chandrapuram", rate: 590 }, { name: "Sanisanthai", rate: 510 },
  { name: "Salaipudur", rate: 445 }, { name: "Singampettai", rate: 440 }, 
  { name: "Chithalandur", rate: 450 }, { name: "SIPCOT", rate: 385 },
  { name: "Sirumugai", rate: 650 }, { name: "Chinnapuliyur", rate: 360 },
  { name: "Chinna Valavadi", rate: 660 }, { name: "Chinniyampalayam", rate: 340 }, { name: "Sulur", rate: 650 },
  { name: "Chengapalli", rate: 450 }, { name: "Senjerimalai", rate: 600 }, { name: "Selakkaraisal", rate: 600 },
  { name: "Chennampatti", rate: 510 }, { name: "Salem", rate: 470 },
  { name: "Salem TANFED Udayapatti", rate: 520 }, { name: "Solangapalayam", rate: 390 }, { name: "Solasiramani", rate: 380 },
  { name: "Town Local Party", rate: 300 }, { name: "Thalavaipattinam", rate: 590 }, { name: "Thalavaipettai", rate: 390 },
  { name: "Thamaraipalayam", rate: 420 }, { name: "Dharapuram", rate: 570 }, { name: "Thingalur", rate: 400 },
  { name: "Thindal", rate: 260 }, { name: "Dindigul", rate: 650 }, { name: "Tiruchengode", rate: 430 },
  { name: "Tiruppur", rate: 510 }, { name: "Thevur", rate: 450 }, { name: "Nasiyanur", rate: 310 },
  { name: "Nanjai Uthukuli", rate: 340 }, { name: "Nadupalayam", rate: 415 }, { name: "Nathakadaiyur", rate: 400 },
  { name: "Nambiyur", rate: 510 }, { name: "Nallachellipalayam", rate: 430 }, { name: "Nallampatti", rate: 380 },
  { name: "Namakkal", rate: 520 }, { name: "Nerinjipettai", rate: 450 }, { name: "Bangalapudur", rate: 465 },
  { name: "Paramathi Velur", rate: 520 }, { name: "Palladam", rate: 550 }, { name: "Bhavani", rate: 365 },
  { name: "Bhavani Kurichi", rate: 425 }, { name: "Bhavanisagar", rate: 570 }, { name: "Palani", rate: 630 },
  { name: "Pallipalayam", rate: 315 }, { name: "Palliyuthu", rate: 350 }, { name: "Pasur", rate: 365 },
  { name: "Pandamangalam", rate: 470 }, { name: "Pugalur", rate: 500 }, { name: "Pudu Kumarapalayam", rate: 425 },
  { name: "Pudukaraipudur", rate: 430 }, { name: "Puduppai", rate: 550 }, { name: "Puliyampatti", rate: 570 },
  { name: "Boothapadi", rate: 445 }, { name: "Poondurai", rate: 315 }, { name: "Poolampatti", rate: 490 },
  { name: "Poonachi", rate: 460 }, { name: "Pedappampatti", rate: 600 }, { name: "Pethampalayam", rate: 365 },
  { name: "Periya Goundanvalasu", rate: 385 }, { name: "Periyapuliyur", rate: 365 }, { name: "Perunthalaiyur", rate: 390 },
  { name: "Perundurai", rate: 360 }, { name: "Perumanallur", rate: 490 }, { name: "Pongalur", rate: 540 },
  { name: "Pollachi", rate: 650 }, { name: "Bodi Chinnampalayam", rate: 460 }, { name: "Madathukulam", rate: 650 },
  { name: "Mallasamudram", rate: 475 }, { name: "Muthur", rate: 430 }, { name: "Mullamparappu", rate: 260 },
  { name: "Moolakinaru", rate: 510 }, { name: "Moolavaikkal", rate: 430 }, { name: "Moolanur", rate: 560 },
  { name: "Moonroad", rate: 380 }, { name: "Mettupalayam", rate: 650 }, { name: "Mettur", rate: 540 },
  { name: "Mevani", rate: 430 }, { name: "Mylambadi", rate: 430 }, { name: "Modakurichi", rate: 360 },
  { name: "Morpalayam", rate: 450 }, { name: "Rasipuram", rate: 510 }, { name: "Rajan Nagar (Sathy)", rate: 540 },
  { name: "Vadavalli (Sathy)", rate: 540 }, { name: "Vavipalayam", rate: 570 }, { name: "Vilakkethi", rate: 395 },
  { name: "Vijayamangalam", rate: 405 }, { name: "Veppadai", rate: 340 }, { name: "Vellakoil", rate: 490 },
  { name: "Vellankovil", rate: 425 }, { name: "Vellitiruppur", rate: 460 }, { name: "Vellode", rate: 325 },
  { name: "Veppampalayam", rate: 300 }, { name: "Vairamangalam", rate: 400 }, { name: "Jambai", rate: 385 },
   { name: "5. Periyapalayam", rate: 490 },
  { name: "T.N Palayam", rate: 500 },{ name: "SKM", rate: 180 }
];

// --- INTERFACES ---

interface VehicleDetails {
  model: string; type: string;
  engineNo: string;    // Added
  chassisNo: string;
  fuelType: string; emissionNorm: string; color: string;
  seatCapacity: number; standingCapacity: number;
  insuranceCompany: string; insurancePolicyNo: string; insuranceValidUpto: string;
  fitnessValidUpto: string; puccNo: string; puccValidUpto: string;
  permitValidUpto: string; nationalPermitNo: string; nationalPermitValidUpto: string;
  registeringAuthority: string; greenTax: string;
  greenTaxValidUpto?: string; roadTaxValidUpto?: string;
}
interface TripRecord {
  id: number;
  regNumber: string;
  date: string;
  billNo: string;
  billReceived?: boolean;
  driverName: string;
  from: string;
  to: string;
  contractor: string;
  loadType: string;
  netWeight: string;  
  expense?: number;

  rate: number;
  tripTotal: number;
  loadingCharge: string;
  unloadingCharge: string;
  driverTripPay: number; 
  dieselPrice: string; 
  dieselLiters: string; 
  weighbridgeCharge: string;
  advance: string;
  commissionType: 'percentage' | 'fixed';
  commissionValue: string;
  fuelPaidDate: string; 
  contractorPaidDate?: string; 
  creditedAmount?: number;
}

interface Vehicle {
  id: number;
  regNumber: string;
  location: string;
  lastUpdate: string;
  diesel: string;
  vehicleDetails: VehicleDetails;
  rentInfo: {
    date?: string;
    time?: string;
    total: number;
    received: number;
    pending: number;
  };
  currentTrip: {
    date: string;
    billNo: string;
    driverName: string;
    to: string;
    contractor: string; 
    loadType: string;
    netWeight: string; 
    rate: number; 
    tripTotal: number;
    loadingCharge: string;
    unloadingCharge: string;
    driverTripPay: number; 
    dieselPrice: string; 
    dieselLiters: string; 
    weighbridgeCharge: string; 
    from: string;
    commissionType: 'percentage' | 'fixed'; 
    commissionValue: string;
    advance: string;
    expense?: string;
  };
}

interface DriverHistory {
  id: number;
  date: string;
  billNo: string;
  from: string; 
  to: string;
  loadType: string;
  netWeight: string;
  totalRent: number;
  commissionType: string; 
  commissionValue: string; 
  amount: number; 
  advance: string;
  loadingCharge: string;
  unloadingCharge: string;
  weighbridgeCharge: string;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  license: string;
  walletBalance: number;
  history: DriverHistory[]; 
}

interface Transaction {
  id: number;
  date: string;
  time: string;
  vehicle: string; 
  type: 'Income' | 'Expense';
  amount: number;
  category: string;
  description: string;
}

interface WeeklyHistory {
  id: number;
  settlementDate: string;
  driverName?: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactions: Transaction[];
  trips: TripRecord[]; 
}

interface Notification {
  id: number;
  vehicle: string;
  type: string;
  daysLeft: number;
  severity: 'critical' | 'warning';
}

// --- HELPERS ---

// Opens a blob URL in a new tab (treated as a user gesture on Android — never blocked).
// The embedded window.onload script auto-triggers the print dialog immediately on open.
const openPrintTab = (html: string) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

const buildPrintHTML = (title: string, bodyHTML: string): string => {
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=1100"/>
  <title>${title} — Anjaneya Transport</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { width: 1100px; }
    body { width: 1100px; font-family: Arial, sans-serif; font-size: 9px; color: #1e293b; background: #fff; }
    .print-header { display: flex; justify-content: space-between; align-items: flex-start;
      border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
    .print-header h1 { font-size: 15px; font-weight: 800; }
    .print-header .sub { font-size: 8px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .print-header .company { font-size: 13px; font-weight: 900; color: #2563eb; }
    table { width: 100%; border-collapse: collapse; table-layout: auto; }
    thead { display: table-header-group; }
    tbody tr { page-break-inside: avoid; }
    th, td { padding: 3px 5px; border: 1px solid #cbd5e1; font-size: 8px; white-space: nowrap; }
    th { background: #1e293b; color: #e2e8f0; font-weight: 700; text-transform: uppercase; }
    th[style] { background: unset; color: unset; }
    td[style*="background"] { background: unset; }
    td[style*="color"] { color: unset; }
    .print-footer { margin-top: 10px; border-top: 1px solid #f1f5f9; text-align: center;
      font-size: 7px; color: #94a3b8; font-style: italic; padding-top: 4px; }
    button, input, select, .no-print, svg { display: none !important; }
    .grid { display: grid; gap: 1rem; margin-bottom: 1.5rem; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .grid-cols-5 { grid-template-columns: repeat(5, minmax(0,1fr)); }
    .grid > div { border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; }
    tr:nth-child(even) td:not([style]) { background: #f8fafc; }
    /* ── Header column colours ── */
    .bg-blue-900   { background: #1e3a5f !important; }
    .bg-slate-800  { background: #1e293b !important; }
    .bg-slate-700  { background: #334155 !important; }
    .bg-red-900    { background: #7f1d1d !important; }
    .bg-emerald-900 { background: #064e3b !important; }
    /* ── Header text colours ── */
    .text-blue-200   { color: #bfdbfe !important; }
    .text-red-200    { color: #fecaca !important; }
    .text-emerald-200 { color: #a7f3d0 !important; }
    .text-slate-300  { color: #cbd5e1 !important; }
    .text-white      { color: #ffffff !important; }
    /* ── Cell text colours ── */
    .text-orange-400 { color: #fb923c !important; }
    .text-orange-600 { color: #ea580c !important; }
    .text-red-300    { color: #fca5a5 !important; }
    .text-red-400    { color: #f87171 !important; }
    .text-red-500    { color: #ef4444 !important; }
    .text-red-600    { color: #dc2626 !important; }
    .text-green-400  { color: #4ade80 !important; }
    .text-green-600  { color: #16a34a !important; }
    .text-blue-600   { color: #2563eb !important; }
    .text-blue-700   { color: #1d4ed8 !important; }
    .text-emerald-600 { color: #059669 !important; }
    .text-slate-400  { color: #94a3b8 !important; }
    .text-slate-600  { color: #475569 !important; }
    .text-slate-700  { color: #334155 !important; }
    .text-slate-800  { color: #1e293b !important; }
    /* ── Cell background colours ── */
    .bg-blue-50    { background: #eff6ff !important; }
    .bg-red-50     { background: #fef2f2 !important; }
    .bg-emerald-50 { background: #ecfdf5 !important; }
    .bg-indigo-50  { background: #eef2ff !important; }
    .bg-indigo-100 { background: #e0e7ff !important; }
    .bg-white      { background: #ffffff !important; }
    /* ── Border colours ── */
    .border-l-indigo-600 { border-left-color: #4f46e5 !important; }
    .border-slate-100 { border-color: #f1f5f9 !important; }
    .border-blue-100  { border-color: #dbeafe !important; }
    .border-l-4    { border-left-width: 4px !important; border-left-style: solid !important; }
    /* ── Typography ── */
    .font-bold     { font-weight: 700 !important; }
    .font-extrabold { font-weight: 800 !important; }
    .font-mono     { font-family: monospace !important; }
    .text-center   { text-align: center !important; }
    .text-right    { text-align: right !important; }
    .uppercase     { text-transform: uppercase !important; }
    .text-xs  { font-size: 0.75rem !important; }
    .text-xl  { font-size: 1.25rem !important; }
    .text-2xl { font-size: 1.5rem !important; }
    /* ── Spacing & layout ── */
    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
    .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
    .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
    .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
    .p-4  { padding: 1rem !important; }
    .mb-6 { margin-bottom: 1.5rem !important; }
    .gap-4 { gap: 1rem !important; }
    .rounded-xl  { border-radius: 0.75rem !important; }
    .rounded-md  { border-radius: 0.375rem !important; }
    .shadow-sm   { box-shadow: 0 1px 2px rgba(0,0,0,.05) !important; }
    .shadow-md   { box-shadow: 0 4px 6px rgba(0,0,0,.1) !important; }
    .overflow-hidden { overflow: hidden !important; }
    .w-full { width: 100% !important; }
    .border { border-width: 1px !important; border-style: solid !important; }
  </style>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 500); };</script>
</head>
<body>
  <div class="print-header">
    <div>
      <h1>${title}</h1>
      <div class="sub">Trip Tally &bull; ${dateStr}</div>
    </div>
    <div class="company">ANJANEYA TRANSPORT</div>
  </div>
  ${bodyHTML}
  <div class="print-footer">Computer generated statement. Contact depot for discrepancies.</div>
</body>
</html>`;
};

const printSection = (elementId: string, title: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  openPrintTab(buildPrintHTML(title, element.innerHTML));
};

const DateFilter = ({ startDate, endDate, onStartChange, onEndChange }: any) => (
  <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
    <div className="flex items-center gap-1 px-2 border-r border-slate-100">
      <Calendar size={14} className="text-slate-400"/>
      <span className="text-xs font-bold text-slate-600 uppercase">Filter:</span>
    </div>
    <input type="date" value={startDate} onChange={(e) => onStartChange(e.target.value)} className="text-xs border-none outline-none text-slate-700 font-medium" />
    <span className="text-slate-300">-</span>
    <input type="date" value={endDate} onChange={(e) => onEndChange(e.target.value)} className="text-xs border-none outline-none text-slate-700 font-medium" />
    {(startDate || endDate) && (
      <button onClick={() => {onStartChange(''); onEndChange('');}} className="ml-1 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={12}/></button>
    )}
  </div>
);

// --- AUTHENTICATION COMPONENT ---

const AuthScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      const { data, error } = await supabase.from('app_users').select('*').eq('username', formData.username).eq('password', formData.password).single();
      if (error || !data) setError('Invalid Username or Password'); else onLogin(data);
    } else {
      const { data, error } = await supabase.from('app_users').insert([{ username: formData.username, password: formData.password, phone: formData.phone }]).select().single();
      if (error) setError(error.message.includes('unique') ? 'Username already exists' : 'Error creating account'); else { alert('Account created! Please log in.'); setIsLogin(true); }
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"><Truck className="text-white w-8 h-8" /></div>
          <h1 className="text-2xl font-bold text-white">Trip Tally</h1>
          <p className="text-blue-100 text-sm mt-1">Lorry Management System</p>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">{error}</div>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Username</label><div className="relative"><UserCircle className="absolute left-3 top-3 text-slate-400" size={18} /><input type="text" className="w-full border pl-10 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter username" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div></div>
            {!isLogin && (<div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone Number</label><input type="tel" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required /></div>)}
            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Password</label><div className="relative"><Lock className="absolute left-3 top-3 text-slate-400" size={18} /><input type="password" className="w-full border pl-10 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div></div>
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">{loading ? <RefreshCw className="animate-spin" size={18}/> : (isLogin ? 'Login to Dashboard' : '')}</button>
          </form>
          <div className="mt-6 text-center text-sm"><span className="text-slate-500">{isLogin ? "" : "Already have an account?"}</span><button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold ml-1 hover:underline">{isLogin ? '' : 'Login'}</button></div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---

export default function LMSApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // APP STATES
  const [currentView, setCurrentView] = useState("dashboard");
  const [filterReg, setFilterReg] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [historyLogs, setHistoryLogs] = useState<WeeklyHistory[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  
  // NEW STATE FOR MOBILE MENU
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [notifEditVehicle, setNotifEditVehicle] = useState<Vehicle | null>(null);

  // --- 1. CHECK LOGIN STATUS ON LOAD ---
  useEffect(() => {
    const storedUser = localStorage.getItem('trip_tally_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // --- FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const fetchAllData = async () => {
      // 1. Fetch Vehicles (Filtered by user)
      const { data: vData } = await supabase.from('vehicles').select('*').eq('user_id', currentUser.id);
      if (vData) {
        setVehicles(vData.map((v: any) => ({
          id: v.id,
          regNumber: v.reg_number,
          location: v.location,
          lastUpdate: "Just now",
          diesel: "0 L",
          vehicleDetails: v.details || {},
          rentInfo: v.rent_info || { total: 0, received: 0, pending: 0 },
          currentTrip: { 
              date: '', billNo: '', driverName: '', to: '', contractor: '', loadType: '', 
              netWeight: '', rate: 0, tripTotal: 0, loadingCharge: '', unloadingCharge: '', 
              driverTripPay: 0, dieselPrice: '', dieselLiters: '', weighbridgeCharge: '', 
              from: '', commissionType: 'percentage', commissionValue: '15', advance: '' 
          }
        })));
      }

      // 2. Fetch Drivers (Filtered by user)
      const { data: dData } = await supabase.from('drivers').select('*').eq('user_id', currentUser.id);
      if (dData) {
        setDrivers(dData.map((d: any) => ({
          id: d.id,
          name: d.name,
          phone: d.phone,
          license: d.license,
          walletBalance: d.wallet_balance || 0,
          history: [] 
        })));
      }

      // 3. Fetch Trips (Active/Completed) (Filtered by user)
      const { data: tData } = await supabase
        .from('trips')
        .select(`*, drivers(name)`)
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false });

if (tData) {
        setTrips(tData.map((t: any) => ({
          id: t.id,
          date: t.date,
          billNo: t.bill_no,
          regNumber: t.vehicle_reg,
          driverName: t.drivers ? t.drivers.name : 'Unknown',
          from: t.from_loc,
          to: t.to_loc,
          contractor: t.contractor,
          loadType: t.load_type,
          netWeight: t.net_weight,
          expense: t.expense || 0,
          rate: t.rate,
          tripTotal: t.trip_total,
          driverTripPay: t.driver_trip_pay,
          advance: t.advance,
          dieselPrice: t.diesel_price,
          dieselLiters: t.diesel_liters,
          loadingCharge: t.loading_charge,
          unloadingCharge: t.unloading_charge,
          weighbridgeCharge: t.weighbridge_charge,
          commissionType: t.commission_type as 'percentage' | 'fixed',
          commissionValue: t.commission_value,
          fuelPaidDate: t.fuel_paid_date,
          contractorPaidDate: t.contractor_paid_date,
          creditedAmount: t.credited_amount,
          billReceived: t.bill_received ?? false
        })));
      }

      // 4. Fetch Settlements (History Page) (Filtered by user)
      const { data: sData } = await supabase
        .from('settlements')
        .select('*, drivers(name)')
        .eq('user_id', currentUser.id)
        .order('settlement_date', { ascending: false });
        
      if (sData) {
        setHistoryLogs(sData.map((s: any) => ({
          id: s.id,
          settlementDate: s.settlement_date,
          driverName: s.drivers?.name || 'Unknown',
          totalIncome: 0, 
          totalExpense: s.amount_paid,
          netProfit: 0,
          transactions: [],
          trips: s.trips_snapshot || [] 
        })));
      }
    };

    fetchAllData();
  }, [isAuthenticated, currentUser]);

  // --- NOTIFICATION LOGIC ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const newNotifs: Notification[] = [];
    const today = new Date();
    vehicles.forEach(v => {
      const checkDate = (dateStr: string, type: string) => {
        if(!dateStr || dateStr === 'NA') return;
        const date = new Date(dateStr);
        const diffTime = date.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (daysLeft < 0) newNotifs.push({ id: Math.random(), vehicle: v.regNumber, type, daysLeft, severity: 'critical' });
        else if (daysLeft <= 30) newNotifs.push({ id: Math.random(), vehicle: v.regNumber, type, daysLeft, severity: 'warning' });
      };
      if (v.vehicleDetails) {
        checkDate(v.vehicleDetails.fitnessValidUpto, 'Fitness Cert (FC)');
        checkDate(v.vehicleDetails.insuranceValidUpto, 'Insurance');
        // Use greenTaxValidUpto (the field saved by DetailsModal); fall back to greenTax for old records
        checkDate(v.vehicleDetails.greenTaxValidUpto || v.vehicleDetails.greenTax, 'Green Tax');
      }
    });
    setNotifications(newNotifs);
  }, [vehicles, isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthScreen onLogin={(user) => { 
      setIsAuthenticated(true); 
      setCurrentUser(user); 
      localStorage.setItem('trip_tally_user', JSON.stringify(user)); 
    }} />;
  }

  const handleDeleteTrip = async (tripId: number) => {
    const tripToDelete = trips.find(t => t.id === tripId);
    if (!tripToDelete) return;

    if (!confirm(`Are you sure you want to delete Trip Bill No: ${tripToDelete.billNo}? \n\n⚠️ This will REVERSE the Driver's Wallet balance calculation.`)) return;

    const deductions = (Number(tripToDelete.advance) || 0) + 
                       (Number(tripToDelete.loadingCharge) || 0) + 
                       (Number(tripToDelete.unloadingCharge) || 0) + 
                       (Number(tripToDelete.weighbridgeCharge) || 0) +
                       (Number(tripToDelete.expense) || 0);
    const netAddedToWallet = (Number(tripToDelete.driverTripPay) || 0) - deductions;

    const driver = drivers.find(d => d.name === tripToDelete.driverName);
    if (driver) {
         const { error: walletError } = await supabase.rpc('increment_wallet', { row_id: driver.id, amount: -netAddedToWallet });
         if (walletError) { alert("Error reversing wallet: " + walletError.message); return; }
         
         setDrivers(prev => prev.map(d => d.id === driver.id ? { ...d, walletBalance: d.walletBalance - netAddedToWallet } : d));
    }

    const { error: delError } = await supabase.from('trips').delete().eq('id', tripId);
    
    await supabase.from('transactions').delete().ilike('description', `%${tripToDelete.billNo}%`);

    if (delError) {
      alert("Error deleting trip: " + delError.message);
    } else {
      setTrips(prev => prev.filter(t => t.id !== tripId));
      alert("Trip Deleted & Wallet Reverted Successfully!");
    }
  };

  const getFilteredTrips = () => {
    if (filterReg) {
      return trips.filter(t => t.regNumber === filterReg);
    }
    return trips;
  };

  const handleFilterSelect = (reg: string, view: string) => {
    setFilterReg(reg);
    setCurrentView(view);
  };

  const renderView = () => {
    const props = { 
        vehicles, setVehicles, 
        drivers, setDrivers, 
        transactions, setTransactions, 
        historyLogs, setHistoryLogs, 
        trips: getFilteredTrips(), 
        setTrips, 
        setCurrentView, 
        handleFilterSelect, 
        filterReg, setFilterReg, 
        handleDeleteTrip,
        currentUser, // Pass user down for inserts
        notifications // Pass notifications for vehicle cards
    };

    switch(currentView) {
      case "dashboard": return <DashboardView {...props} />;
     case "trips": return <TripsView {...props} setTrips={props.setTrips} />;
      case "drivers": return <DriversView {...props} />;
      
      case "finance": return <FinanceView {...props} />;
      case "history": return <HistoryView {...props} />;
      case "fuel": return <FuelView {...props} />; 
      case "credited": return <AmountCreditedView {...props} />;
      case "driverHistory": return <DriverHistoryView {...props} />;
      case "kilometer": return <KilometerView {...props} />;
      default: return <DashboardView {...props} />;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('trip_tally_user');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white transition-all">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
    {/* Replace <Truck /> with an <img> tag */}
    <img src="/logo.png" alt="Anjaneya Logo" className="w-8 h-8 object-contain rounded" /> 
    <span className="tracking-tight">Anjaneya</span>
  </h1>
          <div className="mt-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-700">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active User
             </p>
             <div className="flex items-center gap-2">
                <span className="text-lg">🚚</span>
                <span className="text-sm font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent animate-pulse">{currentUser?.username || 'Admin'}</span>
             </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard/>} label="Dashboard" active={currentView === "dashboard"} onClick={() => { setFilterReg(null); setCurrentView("dashboard"); }} />
          <SidebarItem icon={<List/>} label="Trips Log" active={currentView === "trips"} onClick={() => { setFilterReg(null); setCurrentView("trips"); }} />
          
          <SidebarItem icon={<Users/>} label="Drivers" active={currentView === "drivers"} onClick={() => { setFilterReg(null); setCurrentView("drivers"); }} />
          <SidebarItem icon={<Wallet/>} label="Finance" active={currentView === "finance"} onClick={() => { setFilterReg(null); setCurrentView("finance"); }} />
          <SidebarItem icon={<CreditCard/>} label="Credited" active={currentView === "credited"} onClick={() => { setFilterReg(null); setCurrentView("credited"); }} /> 
          <SidebarItem icon={<Droplet/>} label="Fuel" active={currentView === "fuel"} onClick={() => { setFilterReg(null); setCurrentView("fuel"); }} />
          <SidebarItem icon={<History/>} label="Driver History" active={currentView === "driverHistory"} onClick={() => { setFilterReg(null); setCurrentView("driverHistory"); }} />
          <SidebarItem icon={<Gauge/>} label="Kilometer" active={currentView === "kilometer"} onClick={() => { setFilterReg(null); setCurrentView("kilometer"); }} />
          <SidebarItem icon={<History/>} label="History" active={currentView === "history"} onClick={() => { setFilterReg(null); setCurrentView("history"); }} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold w-full p-2 rounded hover:bg-slate-800 transition-colors"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 relative">
          <div className="md:hidden font-bold text-lg flex items-center gap-2">
            <img src="/logo.png" alt="Anjaneya Logo" className="w-7 h-7 object-contain rounded"/>
            Anjaneya
          </div>
          <div className="hidden md:flex items-center gap-2 font-bold text-lg text-slate-700 capitalize">
            {currentView} Overview 
            {filterReg && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1"><Filter size={10}/> {filterReg} <button onClick={() => setFilterReg(null)}><X size={12}/></button></span>}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifPanel(!showNotifPanel)} className={`p-2 rounded-full relative transition-colors ${showNotifPanel ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}>
              <Bell size={20}/>
              {notifications.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-pulse"></span>}
            </button>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">{currentUser?.username?.charAt(0).toUpperCase() || 'A'}</div>
          </div>
{/* Notifications Panel */}
{/* Notifications Panel */}
{showNotifPanel && (
  <div className="absolute top-16 right-4 w-80 bg-white shadow-2xl rounded-xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
      <h3 className="font-bold text-slate-800">Notifications ({notifications.length})</h3>
      <button onClick={() => setShowNotifPanel(false)}><X size={16}/></button>
    </div>
    <div className="max-h-80 overflow-y-auto p-2">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-slate-400 text-sm">No new notifications</div>
      ) : (
        notifications.map(n => {
          const veh = vehicles.find((v: Vehicle) => v.regNumber === n.vehicle);
          return (
            <div key={n.id} className={`mb-2 p-3 rounded-lg border-l-4 ${n.severity === 'critical' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'}`}>
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-slate-800">{n.type}</span>
                {veh && (
                  <button
                    onClick={() => { setNotifEditVehicle(veh); setShowNotifPanel(false); }}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    <Palette size={10}/> Edit
                  </button>
                )}
              </div>
              <div className="text-xs text-slate-600 mt-1">Lorry: <strong>{n.vehicle}</strong></div>
              <div className={`text-xs mt-1 font-medium ${n.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
                {n.daysLeft < 0 ? `Expired ${Math.abs(n.daysLeft)} days ago` : `Expires in ${n.daysLeft} days`}
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
)}
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          {renderView()}
        </main>
        {/* DetailsModal triggered from notification panel */}
        {notifEditVehicle && (
          <DetailsModal data={notifEditVehicle} onClose={() => setNotifEditVehicle(null)} setVehicles={setVehicles} />
        )}

{/* --- MOBILE "MORE" MENU POPUP --- */}
        {showMobileMenu && (
          <div className="md:hidden fixed bottom-20 right-4 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in slide-in-from-bottom-5 flex flex-col gap-1 w-48">
             <button onClick={() => { setCurrentView("drivers"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <Users size={18} className="text-blue-600"/> Drivers
             </button>
             <button onClick={() => { setCurrentView("driverHistory"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
        <History size={18} className="text-emerald-600"/> Driver History
      </button>
             <button onClick={() => { setCurrentView("kilometer"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <Gauge size={18} className="text-indigo-600"/> Kilometer
             </button>
             <button onClick={() => { setCurrentView("credited"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <CreditCard size={18} className="text-purple-600"/> Credited
             </button>
             <button onClick={() => { setCurrentView("fuel"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <Droplet size={18} className="text-orange-600"/> Fuel Log
             </button>
             <button onClick={() => { setCurrentView("history"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <History size={18} className="text-slate-600"/> History
             </button>
             
             {/* --- LOGOUT BUTTON ADDED HERE --- */}
             <div className="h-px bg-slate-200 my-1"></div>
             <button onClick={handleLogout} className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg text-sm font-bold text-red-600 w-full text-left">
                <LogOut size={18} className="text-red-500"/> Logout
             </button>
          </div>
        )}
        {/* --- MOBILE BOTTOM BAR --- */}
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <MobileNavItem icon={<LayoutDashboard size={20}/>} label="Home" active={currentView === "dashboard"} onClick={() => { setCurrentView("dashboard"); setShowMobileMenu(false); }} />
          <MobileNavItem icon={<List size={20}/>} label="Trips" active={currentView === "trips"} onClick={() => { setCurrentView("trips"); setShowMobileMenu(false); }} />
          <MobileNavItem icon={<Wallet size={20}/>} label="Finance" active={currentView === "finance"} onClick={() => { setCurrentView("finance"); setShowMobileMenu(false); }} />
          
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`flex flex-col items-center justify-center w-16 transition-colors ${showMobileMenu ? 'text-blue-600' : 'text-slate-400'}`}>
             <div className={`mb-1 ${showMobileMenu ? 'scale-110' : ''} transition-transform`}><Menu size={20}/></div>
             <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Views) ---

const DashboardView = ({ vehicles, setVehicles, drivers, setDrivers, transactions, setTransactions, trips, setTrips, setCurrentView, handleFilterSelect, setHistoryLogs, currentUser, notifications = [] }: any) => {
  const [vehicleOrder, setVehicleOrder] = useState<number[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<{ type: string; data: any; vehicleId?: number } | null>(null);

  // Load saved order from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vehicle_order');
    if (saved) {
      try { setVehicleOrder(JSON.parse(saved)); } catch {}
    }
  }, []);

  // When vehicles load, init order if not set
  useEffect(() => {
    if (vehicles.length > 0 && vehicleOrder.length === 0) {
      setVehicleOrder(vehicles.map((v: Vehicle) => v.id));
    }
  }, [vehicles]);

  const orderedVehicles = vehicleOrder.length > 0
    ? [...vehicles].sort((a: Vehicle, b: Vehicle) => {
        const ai = vehicleOrder.indexOf(a.id);
        const bi = vehicleOrder.indexOf(b.id);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : vehicles;

  const handleDragStart = (id: number) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, id: number) => { e.preventDefault(); setDragOverId(id); };
  const handleDrop = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) { setDraggedId(null); setDragOverId(null); return; }
    const newOrder = [...vehicleOrder];
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) { setDraggedId(null); setDragOverId(null); return; }
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);
    setVehicleOrder(newOrder);
    localStorage.setItem('vehicle_order', JSON.stringify(newOrder));
    setDraggedId(null);
    setDragOverId(null);
  };
  const handleDragEnd = () => { setDraggedId(null); setDragOverId(null); };
  const [selectedDriverForModal, setSelectedDriverForModal] = useState<Driver | null>(null);
  const [showDriverList, setShowDriverList] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showEditSearch, setShowEditSearch] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [editSearchForm, setEditSearchForm] = useState({ billNo: '', date: '' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCustomContractor, setIsCustomContractor] = useState(false);
  const [isCustomLoad, setIsCustomLoad] = useState(false);
  const [isCustomDestination, setIsCustomDestination] = useState(false);
    
  const [form, setForm] = useState<any>({ 
    reg: '', model: '', type: '', fuelType: 'DIESEL', emissionNorm: '', color: '',
    seatCapacity: '', standingCapacity: '', insuranceCompany: '', insurancePolicyNo: '', 
    insuranceValidUpto: '', fitnessValidUpto: '', puccNo: '', puccValidUpto: '',
    permitValidUpto: '', nationalPermitNo: '', nationalPermitValidUpto: '', registeringAuthority: '', greenTax: ''
  });
const [tripForm, setTripForm] = useState({ 
  date: '', billNo: '', driverName: '', to: '', contractor: '', 
  loadType: '', netWeight: '', rate: 0, tripTotal: 0,
  loadingCharge: '',
  unloadingCharge: '0',
  driverTripPay: 0, 
  dieselPrice: '0', 
  dieselLiters: '0', 
  weighbridgeCharge: '130', 
  from: '',
  expense: '0',
  commissionType: 'percentage' as 'percentage' | 'fixed', 
  commissionValue: '15',
  advance: '0',
  billReceived: false
});

    
  const [errors, setErrors] = useState<string[]>([]);
  const [rentForm, setRentForm] = useState({ date: '', time: '', total: '', received: '', pending: '', commissionRate: '0.15' });

  useEffect(() => {
    if (activeModal?.type === 'trip') {
      const total = (Number(tripForm.netWeight) || 0) * (Number(tripForm.rate) || 0);
      let driverPay = 0;
      if (tripForm.commissionType === 'percentage') {
        const rate = (Number(tripForm.commissionValue) || 0) / 100;
        driverPay = total * rate;
      } else {
        driverPay = Number(tripForm.commissionValue) || 0;
      }
      setTripForm(prev => ({ ...prev, tripTotal: total, driverTripPay: driverPay }));
    }
  }, [tripForm.netWeight, tripForm.rate, tripForm.commissionType, tripForm.commissionValue, activeModal]);

  const handleAddLorry = async (e: React.FormEvent) => {
    e.preventDefault();
    const vehiclePayload = {
      reg_number: form.reg.toUpperCase(), 
      location: 'Depot',
      user_id: currentUser.id, // ADDED USER ID
      details: { 
        ...form, 
        seatCapacity: Number(form.seatCapacity) || 0, 
        standingCapacity: Number(form.standingCapacity) || 0 
      }
    };
    
    const { data, error } = await supabase.from('vehicles').insert([vehiclePayload]).select().single();
    
    if (error) {
      alert("Error: " + error.message);
    } else {
      const newVehicle: Vehicle = {
          id: data.id,
          regNumber: data.reg_number,
          location: data.location,
          lastUpdate: "Just now",
          diesel: "0 L",
          vehicleDetails: data.details,
          rentInfo: { total: 0, received: 0, pending: 0 },
          currentTrip: { 
            date: '', billNo: '', driverName: '', to: '', contractor: '', loadType: '', 
            netWeight: '', rate: 0, tripTotal: 0, loadingCharge: '', unloadingCharge: '', 
            driverTripPay: 0, dieselPrice: '', dieselLiters: '', weighbridgeCharge: '', 
            from: '', commissionType: 'percentage', commissionValue: '15', advance: '' 
          }
      };
      
      setVehicles((prev: Vehicle[]) => [...prev, newVehicle]);
      alert("Vehicle Added Successfully!"); 
      setIsAdding(false); 
    }
  };

  const openActionModal = (type: string, vehicle: Vehicle) => {
  if (type === 'driver') { setShowDriverList(true); return; }
  setActiveModal({ type, data: vehicle, vehicleId: vehicle.id });
  setErrors([]); 
  setEditingTripId(null);
  setShowEditSearch(false);
  setEditSearchForm({ billNo: '', date: '' });
  setIsSubmitting(false); 

  setIsCustomContractor(false);
  setIsCustomLoad(false);
  setIsCustomDestination(false);

  if(type === 'trip') {
      const currentContractor = vehicle.currentTrip.contractor;
      const currentLoad = vehicle.currentTrip.loadType;
      const currentDest = vehicle.currentTrip.to;

      const isKnownContractor = Object.keys(CONTRACTOR_LOADS).includes(currentContractor);
      const isKnownLoad = isKnownContractor && CONTRACTOR_LOADS[currentContractor]?.includes(currentLoad);
      const isKnownDest = DESTINATION_RATES.some(d => d.name === currentDest);

      if (currentContractor && !isKnownContractor) setIsCustomContractor(true);
      if (currentLoad && !isKnownLoad) setIsCustomLoad(true);
      if (currentDest && !isKnownDest) setIsCustomDestination(true);

      setTripForm({ 
        
        ...vehicle.currentTrip, 
        loadingCharge: vehicle.currentTrip.loadingCharge || '', 
      weighbridgeCharge: vehicle.currentTrip.weighbridgeCharge || '130',
      commissionType: vehicle.currentTrip.commissionType || 'percentage',
      commissionValue: vehicle.currentTrip.commissionValue || '15',
      advance: vehicle.currentTrip.advance || '0',
      expense: vehicle.currentTrip.expense || '0'
    } as any); 
  } else if (type === 'rent') {
      setRentForm({
        date: vehicle.rentInfo.date || '', time: vehicle.rentInfo.time || '', total: vehicle.rentInfo.total.toString(), 
        received: vehicle.rentInfo.received.toString(), pending: vehicle.rentInfo.pending.toString(), commissionRate: '0.15'
      });
    }
  };

  const handleEditSearch = () => {
    const v = vehicles.find((v: Vehicle) => v.id === activeModal?.vehicleId);
    if (!v) return;
    const foundTrip = trips.find((t: TripRecord) => t.regNumber === v.regNumber && t.billNo === editSearchForm.billNo && t.date === editSearchForm.date);
    if (foundTrip) {
      setEditingTripId(foundTrip.id);
      
      const isKnownContractor = Object.keys(CONTRACTOR_LOADS).includes(foundTrip.contractor);
      const isKnownLoad = isKnownContractor && CONTRACTOR_LOADS[foundTrip.contractor]?.includes(foundTrip.loadType);
      const isKnownDest = DESTINATION_RATES.some(d => d.name === foundTrip.to);
      
      setIsCustomContractor(!isKnownContractor && !!foundTrip.contractor);
      setIsCustomLoad(!isKnownLoad && !!foundTrip.loadType);
      setIsCustomDestination(!isKnownDest && !!foundTrip.to);

      setTripForm({ ...foundTrip, commissionType: 'percentage', commissionValue: '15', kilometers: foundTrip.kilometers || '' } as any);
      setShowEditSearch(false); 
    } else {
      alert("No trip found with these details.");
    }
  };

  const handleDriverSelect = (driver: Driver) => { setShowDriverList(false); setSelectedDriverForModal(driver); };
    
const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  
  if (value === "REQ_CUSTOM") {
    setIsCustomDestination(true);
    setTripForm({ ...tripForm, to: '', rate: 0 });
  } else {
    const selectedObj = DESTINATION_RATES.find(d => d.name === value);
    
    let unloading = "0";
    let weighbridge = tripForm.weighbridgeCharge;

    // --- LOGIC FOR UNLOADING CHARGE (RGS & PERUNDURAI VARIANTS) ---
    const specialDestinations = ["RGS", "Perundurai-41", "Perundurai-42", "Perundurai-43", "Perundurai-KK8"];
    
    if (specialDestinations.includes(value)) {
      const weight = Number(tripForm.netWeight) || 0;
      // Formula: ((weight * 45) + 30)
      unloading = weight > 0 ? Math.round((weight * 50) + 30).toString() : "0";
      
      // Maize rule: if load is Maize, weighbridge is 0, else 130
      weighbridge = tripForm.loadType === "Maize" ? "0" : "130";
    } else {
      // Standard behavior for other destinations
      weighbridge = tripForm.loadType === "Maize" ? "0" : "130";
      unloading = "0"; 
    }

    setTripForm({ 
      ...tripForm, 
      to: value, 
      rate: selectedObj ? selectedObj.rate : 0,
      unloadingCharge: unloading,
      weighbridgeCharge: weighbridge
    });
  }
  setErrors(prev => prev.filter(err => err !== 'to'));
};

const handleInputChange = (field: string, value: string) => {
  let updatedForm = { ...tripForm, [field]: value };

// Inside handleInputChange, update the if condition (around line 785)
if (field === 'netWeight') {
  const specialDestinations = ["RGS", "Perundurai-41", "Perundurai-42", "Perundurai-43", "Perundurai-KK8"];
  if (specialDestinations.includes(updatedForm.to)) {
    const weight = Number(value) || 0;
    updatedForm.unloadingCharge = Math.round((weight * 50) + 30).toString();
  }
}


  // --- AUTO-CALCULATE RGS UNLOADING WHEN WEIGHT CHANGES ---
  if (field === 'netWeight' && updatedForm.to === 'RGS') {
    const weight = Number(value) || 0;
    updatedForm.unloadingCharge = Math.round((50 * weight) + 30).toString();
  }

  // --- REST OF YOUR EXISTING LOGIC ---
  if (field === 'billNo') {
    if (value === '0') {
      updatedForm = {
        ...updatedForm,
        contractor: '', loadType: '', to: '', netWeight: '', expense: '0',
        rate: 0, tripTotal: 0, 
        loadingCharge: '0',
        unloadingCharge: '0',
        weighbridgeCharge: '0', 
        dieselPrice: '0', dieselLiters: '0',
        driverTripPay: 0, advance: '0'
      };
    } else if (value !== '' && tripForm.billNo === '0') {
      updatedForm.loadingCharge = '';
      updatedForm.weighbridgeCharge = '130';
    }
  }

  setTripForm(updatedForm);
  setErrors(prev => prev.filter(err => err !== field));
};

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; 
    setIsSubmitting(true);
    
    const safeNetWeight = Number(tripForm.netWeight) || 0;
    const safeRate = Number(tripForm.rate) || 0;
    const safeCommissionVal = Number(tripForm.commissionValue) || 0;
    const safeAdvance = Number(tripForm.advance) || 0;
    const safeLoading = Number(tripForm.loadingCharge) || 0;
    const safeUnloading = Number(tripForm.unloadingCharge) || 0;
    const safeWeighbridge = Number(tripForm.weighbridgeCharge) || 0;
    const safeExtraExp = Number(tripForm.expense) || 0;

    const total = safeNetWeight * safeRate;
    
    // Calculate Gross Pay
    let grossPay = 0;
    if (tripForm.commissionType === 'percentage') {
      grossPay = total * (safeCommissionVal / 100);
    } else {
      grossPay = safeCommissionVal;
    }

    // Combined Expenses
    const totalExpenses = safeLoading + safeUnloading + safeWeighbridge + safeExtraExp;

    // NEW FORMULA: Gross Pay - Advance - Total Expenses
    const finalPay = grossPay - (safeAdvance - totalExpenses);

    const currentVehicle = vehicles.find((v: any) => v.id === activeModal?.vehicleId);
    const currentDriver = drivers.find((d: any) => d.name === tripForm.driverName);
    
    if (!currentVehicle || !currentDriver) { 
      alert("Driver or Vehicle not found!"); 
      setIsSubmitting(false);
      return; 
    }
const dbTrip = {
        date: tripForm.date, 
        bill_no: tripForm.billNo, 
        vehicle_reg: currentVehicle.regNumber, 
        driver_id: currentDriver.id,
        user_id: currentUser.id,
        contractor: tripForm.contractor || null, 
        load_type: tripForm.loadType || null, 
        from_loc: tripForm.from, 
        to_loc: tripForm.to || null,
        net_weight: safeNetWeight,
        expense: safeExtraExp,
        rate: safeRate,
        trip_total: total,
        advance: safeAdvance,
        loading_charge: safeLoading, 
        unloading_charge: safeUnloading, 
        weighbridge_charge: safeWeighbridge,
        diesel_liters: Number(tripForm.dieselLiters) || 0, 
        diesel_price: Number(tripForm.dieselPrice) || 0, 
        driver_trip_pay: grossPay, 
        final_pay: finalPay,
        commission_type: tripForm.commissionType, 
        commission_value: tripForm.commissionValue,
        bill_received: tripForm.billReceived,
        status: 'active'
    };
    if (editingTripId) {
      const { error: updateError } = await supabase.from('trips').update(dbTrip).eq('id', editingTripId);
      
      if (!updateError) {
          setTrips((prev: TripRecord[]) => prev.map(t => t.id === editingTripId ? { ...t, ...dbTrip, driverName: currentDriver.name, tripTotal: total, driverTripPay: grossPay } : t));
          alert("Trip Updated!");
          setActiveModal(null);
      } else {
          alert("Error: " + updateError.message);
      }
    } else {
      const { data: newTripData, error: insertError } = await supabase.from('trips').insert([dbTrip]).select().single();
      
      if (!insertError) {
        await supabase.from('transactions').insert([{
            date: tripForm.date, time: "12:00", vehicle_reg: currentVehicle.regNumber,
            type: 'Expense', amount: finalPay, category: 'Driver Payout', description: `Trip Bill: ${tripForm.billNo}`,
            user_id: currentUser.id // ADDED USER ID
        }]);

        const newTripRecord: TripRecord = {
            id: newTripData.id,
            ...dbTrip,
            driverName: currentDriver.name,
            regNumber: currentVehicle.regNumber,
            tripTotal: total,
            driverTripPay: grossPay,
            fuelPaidDate: '',
            creditedAmount: 0
        } as any;

        setTrips((prev: TripRecord[]) => [newTripRecord, ...prev]);
        alert("Trip Saved Successfully!");
        setActiveModal(null);
      } else {
        alert("Error: " + insertError.message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Fleet Status</h2><button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md hover:bg-blue-700"><Plus size={16}/> Add Lorry</button></div>
      <div className="space-y-4">
        {orderedVehicles.map((vehicle: Vehicle) => (
          <div
            key={vehicle.id}
            draggable
            onDragStart={() => handleDragStart(vehicle.id)}
            onDragOver={(e) => handleDragOver(e, vehicle.id)}
            onDrop={() => handleDrop(vehicle.id)}
            onDragEnd={handleDragEnd}
            className={`transition-all duration-200 rounded-2xl ${
              draggedId === vehicle.id ? 'opacity-40 scale-95' : 'opacity-100'
            } ${
              dragOverId === vehicle.id && draggedId !== vehicle.id
                ? 'ring-2 ring-blue-400 ring-offset-2' : ''
            }`}
          >
            <VehicleCard
              data={vehicle}
              onAction={(type) => openActionModal(type, vehicle)}
              onFilter={handleFilterSelect}
              vehicleNotifs={notifications.filter((n: Notification) => n.vehicle === vehicle.regNumber)}
            />
          </div>
        ))}
      </div>
      
      {activeModal?.type === 'details' && <DetailsModal data={activeModal.data} onClose={() => setActiveModal(null)} setVehicles={setVehicles} />}
      
      {showDriverList && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50"><h3 className="font-bold text-lg text-slate-800">Select Driver</h3><button onClick={() => setShowDriverList(false)}><X size={20} className="text-slate-400 hover:text-red-500"/></button></div>
            <div className="p-2 max-h-80 overflow-y-auto">{drivers.map((d: Driver) => (<div key={d.id} onClick={() => handleDriverSelect(d)} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg cursor-pointer border-b border-slate-50 last:border-0 group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{d.name.charAt(0)}</div><div><div className="font-bold text-slate-800 group-hover:text-blue-700">{d.name}</div><div className="text-xs text-slate-400">{d.phone}</div></div></div><ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500"/></div>))}</div>
          </div>
        </div>
      )}

      {selectedDriverForModal && <DriverDetailsModal driver={selectedDriverForModal} setDrivers={setDrivers} setHistoryLogs={setHistoryLogs} onClose={() => setSelectedDriverForModal(null)} currentUser={currentUser} />}
      
      {activeModal?.type === 'trip' && (
        <ModalWrapper 
          title={editingTripId ? "Edit Trip Details" : "Update Trip Details"} 
          onClose={() => setActiveModal(null)}
          headerContent={
            !editingTripId && (
              <button type="button" onClick={() => setShowEditSearch(!showEditSearch)} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1.5 rounded hover:bg-blue-100 transition-colors">
                <Palette size={14} className="text-blue-600"/> Edit Previous
              </button>
            )
          }
        >
          {/* Selected Vehicle Banner */}
          {activeModal?.data?.regNumber && (
            <div className="mb-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">
              <Truck size={16} className="shrink-0"/>
              <span className="text-xs font-bold uppercase tracking-wide">Vehicle:</span>
              <span className="text-base font-extrabold tracking-widest">{activeModal.data.regNumber}</span>
            </div>
          )}

          {showEditSearch && (
             <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-in slide-in-from-top-2">
                <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2">Search Trip to Edit</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                   <input type="text" placeholder="Bill No" className="p-2 border rounded text-xs" value={editSearchForm.billNo} onChange={(e) => setEditSearchForm({...editSearchForm, billNo: e.target.value})}/>
                   <input type="date" className="p-2 border rounded text-xs" value={editSearchForm.date} onChange={(e) => setEditSearchForm({...editSearchForm, date: e.target.value})}/>
                </div>
                <button onClick={handleEditSearch} className="w-full bg-yellow-600 text-white text-xs font-bold py-2 rounded hover:bg-yellow-700">Find & Edit Trip</button>
             </div>
          )}
          <form onSubmit={handleSaveTrip} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3">
               <Input label="Trip Date *" type="date" value={tripForm.date} onChange={(e) => handleInputChange('date', e.target.value)} required error={errors.includes('date')} />
               <Input label="Bill Number *" value={tripForm.billNo} onChange={(e) => handleInputChange('billNo', e.target.value)} required error={errors.includes('billNo')} />
              </div>
              
              {/* --- DRIVER SECTION --- */}
              <h4 className="font-bold text-xs text-blue-600 uppercase mt-2">Driver</h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2 rounded border border-slate-100">
               <div>
                  <label className={`text-xs font-bold uppercase mb-1 block ${errors.includes('driverName') ? 'text-red-500' : 'text-slate-500'}`}>Driver Name *</label>
                  <div className="relative">
                      <input list="driverOptions" className={`w-full border p-2.5 rounded-lg text-sm outline-none transition-all ${errors.includes('driverName') ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`} value={tripForm.driverName} onChange={(e) => handleInputChange('driverName', e.target.value)} placeholder="Type or Select..." required />
                      <datalist id="driverOptions">{drivers.map((d: Driver) => <option key={d.id} value={d.name} />)}</datalist>
                  </div>
               </div>
               <Input label="Advance (Driver) *" type="number" value={tripForm.advance} onChange={(e) => handleInputChange('advance', e.target.value)} error={errors.includes('advance')} />
              </div>
              
              {/* --- LOAD SECTION --- */}
              <h4 className="font-bold text-xs text-blue-600 uppercase mt-2">Load</h4>
              <div className="bg-slate-50 p-2 rounded border border-slate-100 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Contractor *</label>
                {isCustomContractor ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Custom Contractor" className="w-full border p-2.5 rounded-lg text-sm border-blue-500 bg-blue-50/20" value={tripForm.contractor} onChange={(e) => handleInputChange('contractor', e.target.value)} required />
                    <button type="button" onClick={() => { setIsCustomContractor(false); handleInputChange('contractor', ''); }} className="text-slate-400 hover:text-red-500 p-2"><X size={18}/></button>
                  </div>
                ) : (
                  <select className={`w-full border p-2.5 rounded-lg text-sm bg-white ${errors.includes('contractor') ? 'border-red-500' : 'border-slate-300'}`} value={tripForm.contractor} onChange={(e) => { if (e.target.value === "REQ_CUSTOM") { setIsCustomContractor(true); handleInputChange('contractor', ''); } else { handleInputChange('contractor', e.target.value); } }} required>
                    <option value="">Select Contractor</option>
                    {Object.keys(CONTRACTOR_LOADS).map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="REQ_CUSTOM" className="font-bold text-blue-600">+ Custom Contractor</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Load Type *</label>
                {isCustomLoad ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Custom Load Type" className="w-full border p-2.5 rounded-lg text-sm border-blue-500 bg-blue-50/20" value={tripForm.loadType} onChange={(e) => handleInputChange('loadType', e.target.value)} required />
                    <button type="button" onClick={() => { setIsCustomLoad(false); handleInputChange('loadType', ''); }} className="text-slate-400 hover:text-red-500 p-2"><X size={18}/></button>
                  </div>
                ) : (
                  <select className={`w-full border p-2.5 rounded-lg text-sm bg-white ${errors.includes('loadType') ? 'border-red-500' : 'border-slate-300'}`} value={tripForm.loadType} onChange={(e) => { if (e.target.value === "REQ_CUSTOM") { setIsCustomLoad(true); handleInputChange('loadType', ''); } else { handleInputChange('loadType', e.target.value); } }} required disabled={!tripForm.contractor && !isCustomContractor}>
                    <option value="">Select Load</option>
                    {!isCustomContractor && tripForm.contractor && CONTRACTOR_LOADS[tripForm.contractor]?.map((load) => (<option key={load} value={load}>{load}</option>))}
                    <option value="REQ_CUSTOM" className="font-bold text-blue-600">+ Custom Load Type</option>
                  </select>
                )}
              </div>
              </div>{/* end LOAD section */}

              {/* --- TO (DESTINATION) — full width like Contractor/Load Type --- */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">To (Destination) *</label>
                {isCustomDestination ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Custom Destination" className="w-full border p-2.5 rounded-lg text-sm border-blue-500 bg-blue-50/20" value={tripForm.to} onChange={(e) => handleInputChange('to', e.target.value)} required />
                    <button type="button" onClick={() => { setIsCustomDestination(false); handleInputChange('to', ''); setTripForm(prev => ({...prev, rate: 0})); }} className="text-slate-400 hover:text-red-500 p-1"><X size={16}/></button>
                  </div>
                ) : (
                  <select className={`w-full border p-2.5 rounded-lg text-sm bg-white ${errors.includes('to') ? 'border-red-500' : 'border-slate-300'}`} value={tripForm.to} onChange={handleDestinationChange} required>
                    <option value="">Select</option>
                    {DESTINATION_RATES.map((dest, index) => (<option key={index} value={dest.name}>{dest.name}</option>))}
                    <option value="REQ_CUSTOM" className="font-bold text-blue-600">+ Custom Destination</option>
                  </select>
                )}
              </div>

              {/* --- NET WEIGHT + COST PER TON — equal side by side --- */}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Net Weight *" type="number" value={tripForm.netWeight} onChange={(e) => handleInputChange('netWeight', e.target.value)} required error={errors.includes('netWeight')} />
                <Input label="Cost Per Ton (₹)" type="number" value={tripForm.rate} onChange={(e) => handleInputChange('rate', e.target.value)} required />
              </div>

              {/* --- LABOUR CHARGES --- */}
              <h4 className="font-bold text-xs text-blue-600 uppercase mt-2">Labour Charges</h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2 rounded border border-slate-100">
                <Input label="Loading Charge *" type="number" value={tripForm.loadingCharge} onChange={(e) => handleInputChange('loadingCharge', e.target.value)} />
                <Input label="Unloading Charge *" type="number" value={tripForm.unloadingCharge} onChange={(e) => handleInputChange('unloadingCharge', e.target.value)} />
              </div>

              {/* --- NET WEIGHT + EXTRA EXPENSE — equal side by side --- */}
              <div className="grid grid-cols-2 gap-3">
                <Input label="Weighbridge Charge *" type="number" value={tripForm.weighbridgeCharge} onChange={(e) => handleInputChange('weighbridgeCharge', e.target.value)} error={errors.includes('weighbridgeCharge')} />
                <Input label="Extra Expense (₹)" type="number" value={tripForm.expense} onChange={(e) => handleInputChange('expense', e.target.value)} placeholder="0" />
              </div>

{/* --- FUELS (Kept below Labour Charges) --- */}
<h4 className="font-bold text-xs text-blue-600 uppercase mt-4">Fuels</h4>
<div className="grid grid-cols-2 gap-3">
  <Input 
    label="Diesel Liters" 
    value={tripForm.dieselLiters} 
    onChange={(e) => handleInputChange('dieselLiters', e.target.value)} 
  />
  <Input 
    label="Fuel Price" 
    type="number" 
    value={tripForm.dieselPrice} 
    onChange={(e) => handleInputChange('dieselPrice', e.target.value)} 
  />
</div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase">Driver Pay *</span>
                      <select className="border text-xs p-1 rounded bg-white" value={tripForm.commissionType} onChange={(e) => setTripForm({...tripForm, commissionType: e.target.value as 'percentage' | 'fixed'})}>
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                      </select>
                    </div>
                    <input type="number" className="w-20 p-1 text-right text-sm border rounded bg-white" placeholder={tripForm.commissionType === 'percentage' ? "15" : "400"} value={tripForm.commissionValue} onChange={(e) => setTripForm({...tripForm, commissionValue: e.target.value})} />
                 </div>
                 <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-sm font-bold text-slate-600">Calculated Pay:</span>
                    <span className="text-lg font-bold text-green-600">₹ {tripForm.driverTripPay.toLocaleString('en-IN')}</span>
                 </div>
              </div>
           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center"><div className="flex items-center gap-2 text-blue-800"><Calculator size={16}/> <span className="text-xs font-bold uppercase">Total Rent (Auto)</span></div><span className="text-lg font-bold text-slate-900">₹ {tripForm.tripTotal.toLocaleString('en-IN')}</span></div>
              
              <div className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${tripForm.billReceived ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-300'}`} onClick={() => setTripForm(prev => ({...prev, billReceived: !prev.billReceived}))}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${tripForm.billReceived ? 'bg-green-500 border-green-500' : 'border-red-400 bg-white'}`}>
                  {tripForm.billReceived && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div>
                  <div className={`text-sm font-bold ${tripForm.billReceived ? 'text-green-700' : 'text-red-600'}`}>
                    {tripForm.billReceived ? '✓ Bill Received' : 'Bill Not Received'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {tripForm.billReceived ? 'Trip will appear normally in logs' : 'Trip will be highlighted red in logs'}
                  </div>
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className={`w-full text-white py-3 rounded-lg font-bold mt-2 ${isSubmitting ? 'bg-slate-400' : (editingTripId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700')}`}>{isSubmitting ? 'Saving...' : (editingTripId ? 'Update Edited Details' : 'Save Trip & Update Rent')}</button>     </form>
        </ModalWrapper>
      )}

      {activeModal?.type === 'rent' && (
        <ModalWrapper title="Update Rent & Finance" onClose={() => setActiveModal(null)}>
          <form className="space-y-4">
              <div className="p-3 bg-indigo-50 text-indigo-800 text-xs rounded border border-indigo-200 mb-2">ⓘ Expenses & Wallet updated on save.</div>
              <div className="grid grid-cols-2 gap-3"><Input label="Date *" type="date" value={rentForm.date} onChange={(e) => setRentForm({...rentForm, date: e.target.value})} required /><Input label="Time *" type="time" value={rentForm.time} onChange={(e) => setRentForm({...rentForm, time: e.target.value})} required /></div>
              <Input label="Driver Commission Rate (e.g. 0.15 for 15%) *" type="number" value={rentForm.commissionRate} onChange={(e) => setRentForm({...rentForm, commissionRate: e.target.value})} />
              <Input label="Total Trip Rent (₹) *" type="number" value={rentForm.total} onChange={(e) => setRentForm({...rentForm, total: e.target.value})} required />
              <div className="grid grid-cols-2 gap-3"><Input label="Received (₹) *" type="number" value={rentForm.received} onChange={(e) => setRentForm({...rentForm, received: e.target.value})} required /><Input label="Pending Balance (₹)" type="number" value={rentForm.pending} onChange={(e) => setRentForm({...rentForm, pending: e.target.value})} /></div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold mt-2">Update & Add to Finance</button>
          </form>
        </ModalWrapper>
      )}
      
      {/* ADD LORRY MODAL */}
      {isAdding && (
        <ModalWrapper title="Add New Lorry" onClose={() => setIsAdding(false)}>
           {/* Replace the Add Lorry form contents with this */}
<form onSubmit={handleAddLorry} className="space-y-4 pr-2">
  <h4 className="font-bold text-slate-700 text-sm border-b pb-1 mb-2">Identification</h4>
  <div className="grid grid-cols-2 gap-3">
    <Input label="Reg Number" value={form.reg} onChange={(e) => setForm({...form, reg: e.target.value})} required uppercase />
    <Input label="Model" value={form.model} onChange={(e) => setForm({...form, model: e.target.value})} />
  </div>
  <div className="grid grid-cols-2 gap-3">
    <Input label="Engine Number" value={form.engineNo} onChange={(e) => setForm({...form, engineNo: e.target.value})} />
    <Input label="Chassis Number" value={form.chassisNo} onChange={(e) => setForm({...form, chassisNo: e.target.value})} />
  </div>

  <h4 className="font-bold text-blue-700 text-sm border-b pb-1 mb-2 mt-4">Taxes & Permits</h4>
  <div className="grid grid-cols-2 gap-3">
    <Input label="Road Tax Upto" type="date" value={form.roadTaxValidUpto} onChange={(e) => setForm({...form, roadTaxValidUpto: e.target.value})} />
    <Input label="Green Tax Upto" type="date" value={form.greenTaxValidUpto} onChange={(e) => setForm({...form, greenTaxValidUpto: e.target.value})} />
  </div>
  <div className="grid grid-cols-2 gap-3">
    <Input label="Fitness Valid Upto" type="date" value={form.fitnessValidUpto} onChange={(e) => setForm({...form, fitnessValidUpto: e.target.value})} />
    <Input label="Permit Valid Upto" type="date" value={form.permitValidUpto} onChange={(e) => setForm({...form, permitValidUpto: e.target.value})} />
  </div>

  <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4 shadow-md hover:bg-blue-700">
    Save Vehicle to Database
  </button>
</form>
        </ModalWrapper>
      )}
    </div>
  );
};

const AmountCreditedView = ({ trips, setTrips, handleDeleteTrip }: any) => {
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);
  const [selectedLoadType, setSelectedLoadType] = useState<string | null>(null);
  const [routeSearch, setRouteSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedPrintIds, setSelectedPrintIds] = useState<Set<number>>(new Set());

  const togglePrintSelect = (id: number) => {
    setSelectedPrintIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handlePrintSelected = (title: string) => {
    // Filter which trips to include
    const tripsToPrint = selectedPrintIds.size > 0
      ? displayTrips.filter((t: TripRecord) => selectedPrintIds.has(t.id))
      : displayTrips;

    const unpaidTotal = tripsToPrint
      .filter((t: TripRecord) => !t.contractorPaidDate)
      .reduce((s: number, t: TripRecord) => s + (Number(t.tripTotal) || 0), 0);
    const paidTotal = tripsToPrint
      .filter((t: TripRecord) => !!t.contractorPaidDate)
      .reduce((s: number, t: TripRecord) => s + (Number(t.tripTotal) || 0), 0);

    const rows = tripsToPrint.map((trip: TripRecord) => `
      <tr>
        <td>${trip.date}</td>
        <td style="font-weight:700;">${trip.billNo}</td>
        <td style="color:#2563eb;font-weight:700;">${trip.regNumber}</td>
        <td>${trip.from} ➔ ${trip.to}</td>
        <td style="font-weight:700;">${trip.netWeight}</td>
        <td>₹${trip.rate}</td>
        <td style="font-weight:700;">₹ ${Number(trip.tripTotal).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=1100"/>
        <title>${title}</title>
        <style>
          @page { size: A4 landscape; margin: 8mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html { width: 1100px; }
          body { width: 1100px; font-family: Arial, sans-serif; font-size: 9px; color: #1e293b; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start;
            border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; }
          .header h1 { font-size: 14px; font-weight: 800; }
          .header .sub { font-size: 7px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-top: 2px; }
          .header .company { font-size: 12px; font-weight: 900; color: #2563eb; }
          .summary { display: flex; gap: 10px; margin-bottom: 8px; }
          .summary div { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 8px; }
          .summary .label { font-size: 7px; font-weight: 700; text-transform: uppercase; }
          .summary .val { font-size: 13px; font-weight: 800; }
          .unpaid .label { color: #dc2626; } .unpaid .val { color: #1e293b; }
          .paid .label { color: #16a34a; } .paid .val { color: #1e293b; }
          .grand .label { color: #2563eb; } .grand .val { color: #1e293b; }
          table { width: 100%; border-collapse: collapse; }
          thead { display: table-header-group; }
          th { background: #1e293b; color: #e2e8f0; padding: 8px 16px; font-size: 9px;
               font-weight: 700; text-transform: uppercase; border: 1px solid #334155; text-align: left; }
          th[style] { background: unset; color: unset; }
          td { padding: 6px 16px; font-size: 9px; border: 1px solid #e2e8f0; }
          td[style*="background"] { background: unset; }
          td[style*="color"] { color: unset; }
          tbody tr { page-break-inside: avoid; }
          tbody tr:nth-child(even) td:not([style]) { background: #f8fafc; }
          .footer { margin-top: 8px; text-align: center; font-size: 7px; color: #94a3b8; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 4px; }
        </style>
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 500); };</script>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>${title}</h1>
            <div class="sub">TRIP TALLY &bull; ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
          <div class="company">ANJANEYA TRANSPORT</div>
        </div>
        <div class="summary">
          <div class="unpaid"><div class="label">Unpaid Total</div><div class="val">₹${unpaidTotal.toLocaleString('en-IN')}</div><div class="label">${tripsToPrint.filter((t: TripRecord) => !t.contractorPaidDate).length} trips pending</div></div>
          <div class="paid"><div class="label">Paid Total</div><div class="val">₹${paidTotal.toLocaleString('en-IN')}</div></div>
          <div class="grand"><div class="label">Grand Total</div><div class="val">₹${(unpaidTotal + paidTotal).toLocaleString('en-IN')}</div></div>
        </div>
        <div style="margin-bottom:6px; font-size:9px; font-weight:700; color:#334155;">
          Trips: ${selectedContractor} - ${selectedLoadType} &nbsp;
          <span style="background:#dbeafe;color:#1d4ed8;padding:2px 6px;border-radius:10px;font-size:8px;">${tripsToPrint.length} Records</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Trip Date</th><th>Bill No</th><th>Vehicle</th><th>Route</th>
              <th>Net Wt</th><th>Rate</th><th>Total Rent</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="footer">Computer generated statement. Contact depot for discrepancies.</div>
      </body>
      </html>
    `;

    // Open blob URL in new tab — works on both desktop and Android without popup blocker
    openPrintTab(printContent);
  };
  // 1. DATA PREPARATION
  // A. Get all trips for the selected contractor (EXCLUDING Bill No 0 STRICTLY)
  const contractorTrips = trips.filter((t: TripRecord) => t.contractor === selectedContractor && String(t.billNo) !== "0");

  // B. EXTRACT LOAD TYPES
  let uniqueLoads: string[] = [];
  if (selectedContractor) {
      const configLoads = CONTRACTOR_LOADS[selectedContractor] || []; 
      const historyLoads = contractorTrips.map((t: any) => t.loadType); 
      uniqueLoads = Array.from(new Set([...configLoads, ...historyLoads])).filter(Boolean);
  }

  // C. Final Filter
  const finalTrips = contractorTrips
    .filter((t: TripRecord) => t.loadType === selectedLoadType)
    .sort((a: TripRecord, b: TripRecord) => {
      const isAPaid = !!a.contractorPaidDate;
      const isBPaid = !!b.contractorPaidDate;
      if (isAPaid && !isBPaid) return 1;
      if (!isAPaid && isBPaid) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  // --- ACTIONS ---
  const handleUpdatePaymentDate = async (tripId: number, date: string) => {
    const val = date || null;
    setTrips((prevTrips: TripRecord[]) => prevTrips.map((t) => 
        t.id === tripId ? { ...t, contractorPaidDate: val } : t
    ));
    await supabase.from('trips').update({ contractor_paid_date: val }).eq('id', tripId);
  };

  const togglePaymentStatus = (trip: TripRecord) => {
      if (trip.contractorPaidDate) {
          handleUpdatePaymentDate(trip.id, ''); 
      } else {
          const today = new Date().toISOString().split('T')[0];
          handleUpdatePaymentDate(trip.id, today);
      }
  };

  const handleUpdateCreditedAmount = async (tripId: number, amount: string) => {
    const val = amount ? parseFloat(amount) : null;
    await supabase.from('trips').update({ credited_amount: val }).eq('id', tripId);
    setTrips((prevTrips: TripRecord[]) => prevTrips.map((t) => 
        t.id === tripId ? { ...t, creditedAmount: val } : t
    ));
  };

  // --- RENDER LOGIC ---
  if (!selectedContractor) {
      return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-lg font-bold text-slate-700">Select Contractor</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
{Object.keys(CONTRACTOR_LOADS).map((contractor) => {
    const cTrips = trips.filter((t: TripRecord) => t.contractor === contractor && String(t.billNo) !== "0");
    const cUnpaidTrips = cTrips.filter((t: TripRecord) => !t.contractorPaidDate);
    const cUnpaid = cUnpaidTrips.length;
    const cUnpaidAmount = cUnpaidTrips.reduce((sum: number, t: TripRecord) => sum + (Number(t.tripTotal) || 0), 0);
    return (
        <div key={contractor} onClick={() => setSelectedContractor(contractor)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-md group">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Building2 size={20}/></div>
            <h3 className="font-bold text-lg text-slate-800">{contractor}</h3>
            <p className={`text-xs mt-1 font-bold ${cUnpaid > 0 ? 'text-red-500' : 'text-slate-400'}`}>{cUnpaid} Unpaid Trips</p>
            <p className={`text-xs mt-0.5 font-bold ${cUnpaid > 0 ? 'text-red-600' : 'text-emerald-700'}`}>₹ {cUnpaidAmount.toLocaleString('en-IN')}</p>
        </div>
    );
})}
</div>
        </div>
      );
  }

  if (selectedContractor && !selectedLoadType) {
      return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setSelectedContractor(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">Contractors</button>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-bold text-blue-600">{selectedContractor}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-700">Select Load Type</h2>
            {uniqueLoads.length === 0 ? (
                <div className="p-10 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">No load types configured or found.</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uniqueLoads.map((load: string) => {
                        const loadTrips = contractorTrips.filter((t:any) => t.loadType === load);
const unpaidCount = loadTrips.filter((t:any) => !t.contractorPaidDate).length;
const unpaidTotal = loadTrips.filter((t:any) => !t.contractorPaidDate).reduce((sum:number, t:any) => sum + (Number(t.tripTotal) || 0), 0);
const paidTotal = loadTrips.filter((t:any) => !!t.contractorPaidDate).reduce((sum:number, t:any) => sum + (Number(t.tripTotal) || 0), 0);
return (
    <div key={load} onClick={() => setSelectedLoadType(load)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md group">
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Package size={20}/></div>
        <h3 className="font-bold text-lg text-slate-800">{load}</h3>
        <p className={`text-xs mt-1 ${unpaidCount > 0 ? 'text-red-600 font-bold' : 'text-slate-400'}`}>{unpaidCount} Unpaid Trips</p>
        <p className="text-xs mt-0.5 text-red-600 font-bold">Unpaid: ₹ {unpaidTotal.toLocaleString('en-IN')}</p>
        <p className="text-xs mt-0.5 text-emerald-700 font-bold">Paid: ₹ {paidTotal.toLocaleString('en-IN')}</p>
    </div>
);
                    })}
                </div>
            )}
        </div>
      );
  }

  // --- ROUTE FILTER STATE ---
  
  // Get unique routes from finalTrips
  const uniqueRoutes = Array.from(new Set(finalTrips.map((t: TripRecord) => t.to).filter(Boolean))) as string[];
  const filteredRouteOptions = uniqueRoutes.filter(r => r.toLowerCase().includes(routeSearch.toLowerCase()));

  // Apply route filter to trips
  const displayTrips = selectedRoute ? finalTrips.filter((t: TripRecord) => t.to === selectedRoute) : finalTrips;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* BREADCRUMB + PRINT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setSelectedContractor(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">Contractors</button>
            <span className="text-slate-300">/</span>
            <button onClick={() => setSelectedLoadType(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">{selectedContractor}</button>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-blue-600">{selectedLoadType}</span>
            {selectedRoute && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-sm font-bold text-emerald-600">{selectedRoute}</span>
              </>
            )}
        </div>
        <div className="flex items-center gap-2">
          {selectedPrintIds.size > 0 && (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              {selectedPrintIds.size} selected
            </span>
          )}
          <button
            onClick={() => handlePrintSelected(`${selectedContractor} - ${selectedLoadType}${selectedRoute ? ` - ${selectedRoute}` : ''} | Payment Report`)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 w-full sm:w-auto justify-center"
          >
            <Printer size={16}/> {selectedPrintIds.size > 0 ? `Print ${selectedPrintIds.size} Selected` : 'Print All'}
          </button>
        </div>
      </div>

      {/* ROUTE SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={14} className="text-slate-400"/>
          <span className="text-xs font-bold text-slate-600 uppercase">Filter by Route</span>
          {selectedRoute && (
            <button
              onClick={() => { setSelectedRoute(null); setRouteSearch(''); }}
              className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-bold bg-red-50 px-2 py-1 rounded"
            >
              <X size={12}/> Clear
            </button>
          )}
        </div>
        <input
          type="text"
          placeholder="Search route (e.g. RGS, Perundurai...)"
          value={routeSearch}
          onChange={(e) => { setRouteSearch(e.target.value); setSelectedRoute(null); }}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 mb-2"
        />
        {routeSearch && filteredRouteOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {filteredRouteOptions.map((route) => {
              const rTrips = finalTrips.filter((t: TripRecord) => t.to === route);
              const rUnpaid = rTrips.filter((t: TripRecord) => !t.contractorPaidDate).length;
              const rTotal = rTrips.reduce((sum: number, t: TripRecord) => sum + (Number(t.tripTotal) || 0), 0);
              return (
                <button
                  key={route}
                  onClick={() => { setSelectedRoute(route); setRouteSearch(''); }}
                  className="flex flex-col items-start bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-lg px-3 py-2 transition-all text-left"
                >
                  <span className="text-sm font-bold text-slate-800">{route}</span>
                  <div className="flex gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold ${rUnpaid > 0 ? 'text-red-500' : 'text-slate-400'}`}>{rUnpaid} unpaid</span>
                    <span className="text-[10px] font-bold text-emerald-600">₹{rTotal.toLocaleString('en-IN')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {routeSearch && filteredRouteOptions.length === 0 && (
          <p className="text-xs text-slate-400 mt-1">No routes found matching "{routeSearch}"</p>
        )}
        {/* Show all route chips when no search */}
        {!routeSearch && (
          <div className="flex flex-wrap gap-2">
            {uniqueRoutes.map((route) => {
              const rTrips = finalTrips.filter((t: TripRecord) => t.to === route);
              const rUnpaid = rTrips.filter((t: TripRecord) => !t.contractorPaidDate).length;
              return (
                <button
                  key={route}
                  onClick={() => setSelectedRoute(route)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selectedRoute === route
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {route} {rUnpaid > 0 && <span className={selectedRoute === route ? 'text-blue-200' : 'text-red-500'}>({rUnpaid})</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Unpaid Summary Stats */}
      {(() => {
        const unpaidTrips = displayTrips.filter((t: TripRecord) => !t.contractorPaidDate);
        const unpaidTotal = unpaidTrips.reduce((sum: number, t: TripRecord) => sum + (Number(t.tripTotal) || 0), 0);
        const paidTotal = displayTrips.filter((t: TripRecord) => !!t.contractorPaidDate).reduce((sum: number, t: TripRecord) => sum + (Number(t.tripTotal) || 0), 0);
        return (
          <div id="credited-print-area">
            {/* Summary Cards - visible on screen and in print */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <div className="text-red-600 font-bold text-xs uppercase">Unpaid Total</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-red-400">₹</span>
                  <span className="text-xl font-bold text-slate-800">{unpaidTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-xs text-red-400 md:mt-1">{unpaidTrips.length} trips pending</div>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <div className="text-green-600 font-bold text-xs uppercase">Paid Total</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-green-400">₹</span>
                  <span className="text-xl font-bold text-slate-800">{paidTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
                <div className="text-blue-600 font-bold text-xs uppercase">Grand Total</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-blue-400">₹</span>
                  <span className="text-xl font-bold text-slate-800">{(unpaidTotal + paidTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between">
             <h3 className="font-bold text-slate-700">Trips: {selectedContractor} - {selectedLoadType}</h3>
             <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{displayTrips.length} Records{selectedRoute ? ` · ${selectedRoute}` : ''}</span>
          </div>
          <table className="w-full text-sm text-left whitespace-nowrap">
             <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                <tr>
                   <th className="px-4 py-3 text-center">
                     <input type="checkbox" className="rounded" 
                       checked={selectedPrintIds.size === displayTrips.length && displayTrips.length > 0}
                       onChange={() => {
                         if (selectedPrintIds.size === displayTrips.length) setSelectedPrintIds(new Set());
                         else setSelectedPrintIds(new Set(displayTrips.map((t: TripRecord) => t.id)));
                       }}
                     />
                   </th>
                   <th className="px-4 py-3">Trip Date</th>
                   <th className="px-4 py-3">Bill No</th>
                   <th className="px-4 py-3">Vehicle</th>
                   <th className="px-4 py-3">Route</th>
                   <th className="px-4 py-3">Net Wt</th>
                   <th className="px-4 py-3">Rate</th>
                   <th className="px-4 py-3">Total Rent</th>
                   <th className="px-4 py-3 bg-blue-50 text-blue-800">Credited Amount</th>
                   <th className="px-4 py-3 text-center">Paid?</th>
                   <th className="px-4 py-3">Received Date</th>
                   <th className="px-4 py-3 text-center no-print">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {displayTrips.length === 0 ? (
                   <tr><td colSpan={12} className="p-6 text-center text-slate-400">No trips recorded{selectedRoute ? ` for route: ${selectedRoute}` : ` for ${selectedLoadType}`}.</td></tr>
                ) : (
                   displayTrips.map((trip: TripRecord) => (
                      <tr key={trip.id} data-trip-row={trip.id} className={`transition-all duration-500 ${trip.contractorPaidDate ? "bg-green-50/50 text-slate-400" : "bg-white"}`}>
                          <td className="px-4 py-3 text-center no-print">
                            <input type="checkbox" className="rounded" checked={selectedPrintIds.has(trip.id)} onChange={() => togglePrintSelect(trip.id)} />
                          </td>
                          <td className="px-4 py-3 text-slate-600">{trip.date}</td>
                          <td className="px-4 py-3 font-mono font-bold">{trip.billNo}</td>
                          <td className="px-4 py-3 text-blue-600 font-bold">{trip.regNumber}</td>
                          <td className="px-4 py-3 text-xs">{trip.from} ➔ {trip.to}</td>
                          <td className="px-4 py-3 font-bold">{trip.netWeight}</td>
                          <td className="px-4 py-3">₹{trip.rate}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">₹ {trip.tripTotal.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 bg-blue-50/30">
                             <div className="flex items-center gap-1">
                                 <span className="text-slate-400">₹</span>
                                 <input type="number" className="w-24 border border-blue-200 rounded px-2 py-1 text-xs font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="0" defaultValue={trip.creditedAmount || ''} onBlur={(e) => handleUpdateCreditedAmount(trip.id, e.target.value)} />
                             </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                             <button onClick={() => togglePaymentStatus(trip)} className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer ${trip.contractorPaidDate ? 'bg-green-500 border-green-600 text-white shadow-sm scale-110' : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-sm'}`}>
                                {trip.contractorPaidDate && <CheckSquare size={14}/>}
                             </button>
                          </td>
                          <td className="px-4 py-3">
                             <input type="date" className="border rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50" value={trip.contractorPaidDate || ''} onChange={(e) => handleUpdatePaymentDate(trip.id, e.target.value)}/>
                          </td>
                          <td className="px-4 py-3 text-center">
                             <button onClick={() => handleDeleteTrip(trip.id)} className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                          </td>
                      </tr>
                   ))
                )}
             </tbody>
          </table>
        </div>
      </div>
        );
      })()}
    </div>
  );
};

const FuelView = ({ trips, filterReg, setFilterReg, setTrips }: any) => {
  const [editingTrip, setEditingTrip] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 1. FILTER: Exclude Bill No "0"
  const visibleTrips = trips.filter((t: any) => String(t.billNo) !== "0");

  // 2. SORTING
  const unpaidTrips = visibleTrips.filter((t: any) => !t.fuelPaidDate).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paidTrips = visibleTrips.filter((t: any) => t.fuelPaidDate).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedTrips = [...unpaidTrips, ...paidTrips];

  // 3. UPDATE HANDLERS
  const handleUpdateFuelDate = async (tripId: number, date: string) => {
    const val = date || null;
    const { error } = await supabase.from('trips').update({ fuel_paid_date: val }).eq('id', tripId);
    if(error) alert("Error: " + error.message);
    else setTrips((prev: any) => prev.map((t: any) => t.id === tripId ? { ...t, fuelPaidDate: val } : t));
  };

  const handleSaveFuelEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      diesel_liters: Number(editingTrip.dieselLiters),
      diesel_price: Number(editingTrip.dieselPrice),
    };

    const { error } = await supabase.from('trips').update(payload).eq('id', editingTrip.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      setTrips((prev: any) => prev.map((t: any) => 
        t.id === editingTrip.id 
          ? { ...t, dieselLiters: editingTrip.dieselLiters, dieselPrice: editingTrip.dieselPrice } 
          : t
      ));
      setEditingTrip(null);
      alert("Fuel record updated!");
    }
    setIsSaving(false);
  };

  // Calculations
  const totalFuelCost = visibleTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselPrice) || 0), 0);
  const totalLiters = visibleTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselLiters) || 0), 0);
  const remainingPayment = unpaidTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Fuel Logs & Payment Tracker</h2>
        {filterReg && <button onClick={() => setFilterReg(null)} className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-slate-700">Clear Filter: {filterReg}</button>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
         <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <div className="text-orange-600 font-bold text-xs uppercase mb-1">Total Fuel Cost</div>
            <div className="text-2xl font-bold text-slate-800">₹ {totalFuelCost.toLocaleString('en-IN')}</div>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-blue-600 font-bold text-xs uppercase mb-1">Total Liters</div>
            <div className="text-2xl font-bold text-slate-800">{totalLiters.toLocaleString('en-IN')} L</div>
         </div>
         <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <div className="text-red-600 font-bold text-xs uppercase mb-1">Pending Payment</div>
            <div className="text-2xl font-bold text-slate-800">₹ {remainingPayment.toLocaleString('en-IN')}</div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Route</th>
                {/* KM Column Header Removed */}
                <th className="px-6 py-4 text-right">Liters</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4">Paid On</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTrips.map((trip: any) => (
                <tr key={trip.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-700">{trip.date}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{trip.regNumber}</td>
                  <td className="px-6 py-4 text-slate-500">{trip.from} ➔ {trip.to}</td>
                  {/* KM Data Cell Removed */}
                  <td className="px-6 py-4 text-right font-mono">{trip.dieselLiters || '-'} L</td>
                  <td className="px-6 py-4 text-right font-bold text-orange-600">₹ {Number(trip.dieselPrice).toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <input 
                      type="date" 
                      className={`border p-1 rounded text-xs outline-none ${trip.fuelPaidDate ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-red-50 border-red-200 text-red-700 font-bold'}`}
                      defaultValue={trip.fuelPaidDate}
                      onBlur={(e) => handleUpdateFuelDate(trip.id, e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setEditingTrip(trip)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Palette size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL WITHOUT KM */}
      {editingTrip && (
        <ModalWrapper title={`Edit Fuel: ${editingTrip.regNumber}`} onClose={() => setEditingTrip(null)}>
          <form onSubmit={handleSaveFuelEdit} className="space-y-4">
            <div className="p-3 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
              Bill No: {editingTrip.billNo} | Date: {editingTrip.date}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input 
                label="Diesel Liters" 
                type="number" 
                value={editingTrip.dieselLiters} 
                onChange={(e) => setEditingTrip({...editingTrip, dieselLiters: e.target.value})} 
              />
              <Input 
                label="Fuel Total Price (₹)" 
                type="number" 
                value={editingTrip.dieselPrice} 
                onChange={(e) => setEditingTrip({...editingTrip, dieselPrice: e.target.value})} 
              />
            </div>
            <button 
              disabled={isSaving}
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
            >
              {isSaving ? "Saving..." : "Update Fuel Data"}
            </button>
          </form>
        </ModalWrapper>
      )}
    </div>
  );
};
const TripsView = ({ trips, setTrips, handleFilterSelect, handleDeleteTrip }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to the current calendar month
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Build list of available months from trip data (newest first)
  const availableMonths = Array.from(
    new Set(trips.filter((t: any) => String(t.billNo) !== "0" && t.date).map((t: any) => t.date.slice(0, 7)))
  ).sort((a: any, b: any) => b.localeCompare(a)) as string[];

  const handleToggleBillReceived = async (tripId: number, current: boolean) => {
    const newVal = !current;
    await supabase.from('trips').update({ bill_received: newVal }).eq('id', tripId);
    setTrips((prev: any[]) => prev.map(t => t.id === tripId ? { ...t, billReceived: newVal } : t));
  };

  const filteredTrips = trips.filter((t: any) => {
    // Month dropdown takes priority over date range
    if (selectedMonth) return t.date && t.date.startsWith(selectedMonth);
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-bold">Trip History & Earnings</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Dropdown — same pattern as Finance page */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
            <Calendar size={14} className="text-slate-400"/>
            <select
              className="text-xs border-none outline-none text-slate-700 font-medium bg-transparent"
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(e.target.value); setStartDate(''); setEndDate(''); }}
            >
              <option value="">All Months</option>
              {availableMonths.map((m: string) => {
                const [year, month] = m.split('-');
                const label = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                return <option key={m} value={m}>{label}</option>;
              })}
            </select>
            {selectedMonth && (
              <button onClick={() => setSelectedMonth('')} className="ml-1 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={12}/></button>
            )}
          </div>
          {/* Date range only shows when no month is selected */}
          {!selectedMonth && <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs whitespace-nowrap">
  <tr>
    <th className="px-4 py-3 text-center">Bill✓</th>
    <th className="px-4 py-3">Date</th>
    <th className="px-4 py-3">Bill No</th>
    <th className="px-4 py-3 border-l border-r border-slate-200 bg-slate-100">Vehicle</th>
    <th className="px-4 py-3">Driver</th>
    <th className="px-4 py-3">Route</th>
    <th className="px-4 py-3">Contractor</th>
    <th className="px-4 py-3">Load</th>
    <th className="px-4 py-3">Net Wt</th>
    <th className="px-4 py-3">Rate</th>
    <th className="px-4 py-3 font-extrabold text-blue-700 bg-blue-50">Total Rent</th>
    <th className="px-4 py-3 text-blue-600">Advance</th>
    <th className="px-4 py-3 bg-indigo-50/30 font-mono">Expense</th>
    <th className="px-4 py-3">Load/Unload</th>
    <th className="px-4 py-3 bg-orange-50 text-orange-700">Diesel Liter</th>
    <th className="px-4 py-3 bg-orange-50 text-orange-700">Fuel Price</th>
    <th className="px-4 py-3">Weighbridge</th>
    <th className="px-4 py-3">Dr. Pay</th>
    <th className="px-4 py-3 font-extrabold text-red-700 bg-red-50">Total Expense</th>
    <th className="px-4 py-3 font-extrabold text-slate-700 bg-slate-50 text-right">Profit</th>
    <th className="px-4 py-3 text-center">Action</th>
  </tr>
</thead>
          <tbody className="divide-y divide-slate-100 whitespace-nowrap">
  {filteredTrips.length === 0 ? (
   <tr><td colSpan={21} className="p-6 text-center text-slate-400">No trips recorded for this period.</td></tr>
  ) : (
    filteredTrips.map((trip: any, index: number) => {
      const totalExpense =
        Number(trip.loadingCharge || 0) +
        Number(trip.unloadingCharge || 0) +
        Number(trip.dieselPrice || 0) +
        Number(trip.weighbridgeCharge || 0) +
        Number(trip.driverTripPay || 0) +
        Number(trip.expense || 0);

      const profit = (Number(trip.tripTotal) || 0) - totalExpense;
 const isAdvance = String(trip.billNo) === '0';
      if (isAdvance) {
        return (
          <tr key={`${trip.id}-${index}`} className="bg-orange-50 hover:bg-orange-100 transition-colors border-l-4 border-orange-400">
            <td className="px-4 py-3 text-center text-orange-400">—</td>
            <td className="px-4 py-3 text-orange-700 font-bold">{trip.date}</td>
            <td className="px-4 py-3 font-mono text-orange-500">ADV</td>
            <td className="px-4 py-3 font-bold border-l border-r border-slate-100 text-blue-600">{trip.regNumber}</td>
            <td className="px-4 py-3 text-orange-700">{trip.driverName}</td>
            <td className="px-4 py-3 text-orange-600 font-bold" colSpan={5}>Driver Advance Payment</td>
            <td className="px-4 py-3 text-slate-400">—</td>
            <td className="px-4 py-3 font-bold text-orange-700">₹{Number(trip.advance).toLocaleString('en-IN')}</td>
            <td className="px-4 py-3 text-slate-400" colSpan={7}>—</td>
            <td className="px-4 py-3 font-bold text-orange-700 bg-orange-100">₹{Number(trip.advance).toLocaleString('en-IN')}</td>
            <td className="px-4 py-3 text-slate-400 text-right">—</td>
            <td className="px-4 py-3 text-center">
              <button onClick={() => handleDeleteTrip(trip.id)} className="p-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete Advance">
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        );
      }
      return (
        <tr key={`${trip.id}-${index}`} className={`transition-colors ${!trip.billReceived ? 'bg-red-50 hover:bg-red-100 text-red-800' : 'hover:bg-slate-50'}`}>
          <td className="px-4 py-3 text-center">
            <button
              onClick={() => handleToggleBillReceived(trip.id, trip.billReceived ?? false)}
              title={trip.billReceived ? 'Mark bill as not received' : 'Mark bill as received'}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center mx-auto transition-all ${trip.billReceived ? 'bg-green-500 border-green-500 text-white' : 'border-red-400 bg-white hover:border-green-400'}`}
            >
              {trip.billReceived && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          </td>
          <td className="px-4 py-3">{trip.date}</td>
          <td className="px-4 py-3 font-mono">{trip.billNo}</td>
          <td className="px-4 py-3 font-bold border-l border-r border-slate-100 bg-slate-50/30 cursor-pointer text-blue-600 hover:underline" onClick={() => handleFilterSelect && handleFilterSelect(trip.regNumber, 'trips')}>{trip.regNumber}</td>
          <td className="px-4 py-3">{trip.driverName}</td>
          <td className="px-4 py-3">{trip.from} ➔ {trip.to}</td>
          <td className="px-4 py-3">{trip.contractor}</td>
          <td className="px-4 py-3">{trip.loadType}</td>
          <td className="px-4 py-3">{trip.netWeight}</td>
          <td className="px-4 py-3">₹{trip.rate}</td>
          <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/50">₹{(trip.tripTotal || 0).toLocaleString('en-IN')}</td>
          <td className="px-4 py-3 text-blue-600 font-medium">₹{trip.advance}</td>
          <td className="px-4 py-3 bg-indigo-50/30 font-mono">₹{Number(trip.expense || 0).toLocaleString('en-IN')}</td>
          <td className="px-4 py-3 text-red-500">{trip.loadingCharge} / {trip.unloadingCharge}</td>
          <td className="px-4 py-3 bg-orange-50/30">{trip.dieselLiters} L</td>
          <td className="px-4 py-3 bg-orange-50/30">₹{trip.dieselPrice}</td>
          <td className="px-4 py-3">₹{trip.weighbridgeCharge}</td>
          <td className="px-4 py-3 text-green-600">₹{(trip.driverTripPay || 0).toLocaleString('en-IN')}</td>
          <td className="px-4 py-3 font-bold text-red-700 bg-red-50/50">₹{totalExpense.toLocaleString('en-IN')}</td>
          <td className={`px-4 py-3 font-bold bg-slate-50/50 text-right ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{profit.toLocaleString('en-IN')}</td>
          <td className="px-4 py-3 text-center">
            <button onClick={() => handleDeleteTrip(trip.id)} className="p-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete Trip">
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>
        </table>
      </div>
    </div>
  );
};
const DriversView = ({ drivers, setDrivers, trips, setTrips, currentUser, vehicles }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [editDriverForm, setEditDriverForm] = useState({ name: '', phone: '', license: '' });
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", license: "", walletBalance: 0 });
  const [advanceDriver, setAdvanceDriver] = useState<Driver | null>(null);
  const [advanceForm, setAdvanceForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '', vehicleReg: '' });
  const [advanceSubmitting, setAdvanceSubmitting] = useState(false);

  // Compute total net added per driver from active trips
  const computeNetAdded = (driver: Driver) => {
    const driverTrips = trips.filter((t: any) => t.driverName === driver.name);
    return Math.round(driverTrips.reduce((sum: number, t: any) => {
      const drPay = Number(t.driverTripPay) || 0;
      const advance = Number(t.advance) || 0;
      const luw = (Number(t.loadingCharge) || 0) + (Number(t.unloadingCharge) || 0) + (Number(t.weighbridgeCharge) || 0) + (Number(t.expense) || 0);
      return sum + drPay - (advance - luw);
    }, 0));
  };

  const handleAddAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceDriver) return;
    const amount = parseFloat(advanceForm.amount);
    if (!amount || isNaN(amount)) { alert("Enter a valid amount"); return; }
    if (!advanceForm.vehicleReg) { alert("Please select a vehicle number"); return; }
    setAdvanceSubmitting(true);
    try {
      // 1. Insert into transactions → shows in Financial Overview
      const { error: txError } = await supabase.from('transactions').insert([{
        date: advanceForm.date,
        time: new Date().toTimeString().slice(0,5),
        vehicle_reg: advanceForm.vehicleReg,
        type: 'Expense',
        amount: amount,
        category: 'Driver Advance',
        description: `Advance to ${advanceDriver.name}`,
        user_id: currentUser.id
      }]);
      if (txError) throw txError;

      // 2. Update driver wallet balance
      const { error: walletError } = await supabase.rpc('increment_wallet', { row_id: advanceDriver.id, amount: amount });
      if (walletError) throw walletError;

      // 3. Insert stub trip row (bill_no='0') → shows in Trip Logs & Driver Wallet page
      const { data: newTripData, error: tripError } = await supabase.from('trips').insert([{
        date: advanceForm.date,
        bill_no: '0',
        vehicle_reg: advanceForm.vehicleReg,
        driver_id: advanceDriver.id,
        from_loc: '',
        to_loc: 'Advance',
        contractor: '',
        load_type: 'Advance',
        net_weight: '0',
        rate: 0,
        trip_total: 0,
        driver_trip_pay: 0,
        advance: amount,
        diesel_price: '0',
        diesel_liters: '0',
        loading_charge: '0',
        unloading_charge: '0',
        weighbridge_charge: '0',
        commission_type: 'fixed',
        commission_value: '0',
        expense: 0,
        status: 'active',
        user_id: currentUser.id
      }]).select().single();
      if (tripError) throw tripError;

      // 4. Update local trips state so it appears immediately in Trip Logs
      if (newTripData) {
        setTrips((prev: TripRecord[]) => [{
          id: newTripData.id,
          date: advanceForm.date,
          billNo: '0',
          regNumber: advanceForm.vehicleReg,
          driverName: advanceDriver.name,
          from: '',
          to: 'Advance',
          contractor: '',
          loadType: 'Advance',
          netWeight: '0',
          expense: 0,
          rate: 0,
          tripTotal: 0,
          driverTripPay: 0,
          advance: String(amount),
          dieselPrice: '0',
          dieselLiters: '0',
          loadingCharge: '0',
          unloadingCharge: '0',
          weighbridgeCharge: '0',
          commissionType: 'fixed' as 'fixed',
          commissionValue: '0',
          fuelPaidDate: '',
          creditedAmount: 0,
          billReceived: false
        }, ...prev]);
      }

      // 5. Update local driver wallet balance
      setDrivers((prev: Driver[]) => prev.map(d => d.id === advanceDriver.id ? { ...d, walletBalance: d.walletBalance + amount } : d));
      alert(`Advance of \u20b9${amount} recorded for ${advanceDriver.name}`);
      setAdvanceDriver(null);
      setAdvanceForm({ date: new Date().toISOString().split('T')[0], amount: '', vehicleReg: '' });
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setAdvanceSubmitting(false);
    }
  };

  useEffect(() => {
    if (editingDriver) {
      setEditDriverForm({
        name: editingDriver.name,
        phone: editingDriver.phone,
        license: editingDriver.license,
      });
    }
  }, [editingDriver]);

  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;

    const { error } = await supabase
      .from('drivers')
      .update({
        name: editDriverForm.name,
        phone: editDriverForm.phone,
        license: editDriverForm.license.toUpperCase(),
      })
      .eq('id', editingDriver.id);

    if (error) {
      alert("Error updating driver: " + error.message);
    } else {
      setDrivers((prev: Driver[]) =>
        prev.map(d =>
          d.id === editingDriver.id
            ? { ...d, name: editDriverForm.name, phone: editDriverForm.phone, license: editDriverForm.license.toUpperCase() }
            : d
        )
      );
      setEditingDriver(null);
      alert("Driver updated successfully!");
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('drivers').insert([{ 
        name: newDriver.name, phone: newDriver.phone, license: newDriver.license, wallet_balance: 0,
        user_id: currentUser.id // ADDED USER ID
    }]).select().single();

    if (error) { 
        alert("Error: " + error.message); 
    } else { 
        setDrivers((prev: Driver[]) => [...prev, {
            id: data.id,
            name: data.name,
            phone: data.phone,
            license: data.license,
            walletBalance: 0,
            history: []
        }]);
        alert("Driver Saved Successfully!"); 
        setIsAdding(false); 
    }
  };

  const handleSettleDriver = async (driverId: number, driverName: string, balance: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Settle ₹${balance} for ${driverName}? This resets wallet to 0.`)) return;

    const today = new Date().toISOString().split('T')[0];
    const { data: driverTrips } = await supabase.from('trips').select('*').eq('driver_id', driverId).eq('status', 'active');
    const { error: settleError } = await supabase.from('settlements').insert([{ driver_id: driverId, settlement_date: today, amount_paid: balance, trips_snapshot: driverTrips, user_id: currentUser.id }]);

    if (settleError) { alert("Error creating settlement"); return; }
    
    await supabase.from('drivers').update({ wallet_balance: 0 }).eq('id', driverId);
    await supabase.from('trips').update({ status: 'settled' }).eq('driver_id', driverId).eq('status', 'active');

    setDrivers((prev: Driver[]) => prev.map(d => d.id === driverId ? { ...d, walletBalance: 0 } : d));

    alert("Settlement Complete!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Driver Wallet & Directory</h2><button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md"><Plus size={16}/> Add Driver</button></div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Driver Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">License ID</th>
                <th className="px-6 py-4 text-center text-orange-600">Advance</th>
                <th className="px-6 py-4 text-right">Net Added Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
   <tbody className="divide-y divide-slate-100">
              
              {drivers.map((driver: Driver) => {
                const netAdded = computeNetAdded(driver);
                return (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                    <td className="px-6 py-4"><div className="font-bold text-slate-800">{driver.name}</div></td>
                    <td className="px-6 py-4 text-slate-600">{driver.phone}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono uppercase">{driver.license}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setAdvanceDriver(driver); }}
                        className="flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-md text-xs font-bold transition-all border border-orange-200 mx-auto"
                      >
                        <Plus size={12}/> Advance
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`py-1 px-3 rounded-full font-bold text-xs ${netAdded >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        ₹ {netAdded.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center items-center gap-3">
                      {driver.walletBalance > 0 && (<button onClick={(e) => handleSettleDriver(driver.id, driver.name, driver.walletBalance, e)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm z-10"><RefreshCw size={12} /> Settle</button>)}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingDriver(driver); }}
                        className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md text-xs font-bold transition-all border border-blue-200 z-10"
                      >
                        <Palette size={12}/> Edit
                      </button>
                      <ChevronRight size={16} className="text-slate-400" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADVANCE MODAL */}
      {advanceDriver && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Add Advance</h3>
                <p className="text-orange-100 text-xs mt-0.5">{advanceDriver.name}</p>
              </div>
              <button onClick={() => setAdvanceDriver(null)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"><X size={18}/></button>
            </div>
            <form onSubmit={handleAddAdvance} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Date</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400"
                  value={advanceForm.date}
                  onChange={e => setAdvanceForm({ ...advanceForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Vehicle Number *</label>
                <select
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 bg-white font-bold"
                  value={advanceForm.vehicleReg}
                  onChange={e => setAdvanceForm({ ...advanceForm, vehicleReg: e.target.value })}
                >
                  <option value="">— Select Vehicle —</option>
                  {vehicles.map((v: any) => (
                    <option key={v.id} value={v.regNumber}>{v.regNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Advance Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter amount"
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-400 font-bold"
                  value={advanceForm.amount}
                  onChange={e => setAdvanceForm({ ...advanceForm, amount: e.target.value })}
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-medium">This advance will appear in Financial Overview, Trip Logs, and Driver Wallet. The amount will be deducted from the driver's Net Added calculation.</p>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setAdvanceDriver(null)} className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={advanceSubmitting} className="flex-grow bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                  {advanceSubmitting ? <RefreshCw size={14} className="animate-spin"/> : <Plus size={14}/>} Save Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 {selectedDriver && <DriverDetailsModal driver={selectedDriver} setDrivers={setDrivers} onClose={() => setSelectedDriver(null)} currentUser={currentUser} />}
      {isAdding && (<ModalWrapper title="Register Driver" onClose={() => setIsAdding(false)}><form onSubmit={handleAddDriver} className="space-y-4"><Input label="Name" value={newDriver.name} onChange={(e) => setNewDriver({...newDriver, name: e.target.value})} required /><Input label="Phone" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} required /><Input label="License" value={newDriver.license} onChange={(e) => setNewDriver({...newDriver, license: e.target.value})} uppercase required /><button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Save Driver to Database</button></form></ModalWrapper>)}

      {/* --- EDIT DRIVER MODAL --- */}
      {editingDriver && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                    {editingDriver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{editingDriver.name}</h3>
                    <p className="text-blue-100 text-xs mt-0.5">Edit Driver Profile</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingDriver(null)} 
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateDriver} className="p-6 space-y-5">
              
              {/* Name Field */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block flex items-center gap-1.5">
                  <UserCircle size={12}/> Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="Enter driver name"
                  value={editDriverForm.name}
                  onChange={(e) => setEditDriverForm({...editDriverForm, name: e.target.value})}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block flex items-center gap-1.5">
                  📞 Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                  placeholder="Enter phone number"
                  value={editDriverForm.phone}
                  onChange={(e) => setEditDriverForm({...editDriverForm, phone: e.target.value})}
                />
              </div>

              {/* License Field */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block flex items-center gap-1.5">
                  🪪 License Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium uppercase tracking-widest"
                  placeholder="Enter license number"
                  value={editDriverForm.license}
                  onChange={(e) => setEditDriverForm({...editDriverForm, license: e.target.value.toUpperCase()})}
                />
              </div>

              {/* Info Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                <p className="text-xs text-amber-700 font-medium">
                  Wallet balance and trip history will not be affected by this update.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingDriver(null)}
                  className="flex-1 border border-slate-300 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 flex-grow bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14}/> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const FinanceView = ({ transactions, drivers, trips, handleDeleteTrip }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    // Default to the current calendar month, e.g. "2026-05"
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Build list of months from trips data
  const availableMonths = Array.from(
    new Set(trips.filter((t: any) => String(t.billNo) !== "0" && t.date).map((t: any) => t.date.slice(0, 7)))
  ).sort((a: any, b: any) => b.localeCompare(a)) as string[];

  // 1. FILTERING — month dropdown takes priority over date range
  const filteredTrips = trips.filter((t: any) => {
    if (selectedMonth) return t.date && t.date.startsWith(selectedMonth);
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  }).sort((a: any, b: any) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    if (a.regNumber < b.regNumber) return -1;
    if (a.regNumber > b.regNumber) return 1;
    return 0;
  });

  // 2. CALCULATIONS (Rounded) — exclude advance-only rows (billNo=0) from revenue/expense totals
  const realTrips = filteredTrips.filter((t: any) => String(t.billNo) !== "0");
  const totalRentRevenue = Math.round(realTrips.reduce((acc: number, trip: TripRecord) => acc + (Number(trip.tripTotal) || 0), 0));
  const totalFuelLiters = Math.round(realTrips.reduce((acc: number, trip: TripRecord) => acc + (Number(trip.dieselLiters) || 0), 0));
  // Advance totals (for display in expense card)
  const totalAdvancePaid = Math.round(filteredTrips.filter((t: any) => String(t.billNo) === "0").reduce((acc: number, t: any) => acc + (Number(t.advance) || 0), 0));
    
const totalExpenses = Math.round(
  realTrips.reduce((acc: number, trip: TripRecord) => {
    return (
      acc +
      (Number(trip.expense) || 0) +
      (Number(trip.weighbridgeCharge) || 0) +
      (Number(trip.loadingCharge) || 0) +
      (Number(trip.unloadingCharge) || 0) +
      (Number(trip.dieselPrice) || 0) +
      (Number(trip.driverTripPay) || 0)
    );
  }, 0)
);







  const totalProfit = totalRentRevenue - totalExpenses;

  // 3. EXCEL DOWNLOAD LOGIC
  const handleDownloadExcel = () => {
    if (filteredTrips.length === 0) { alert("No data to download"); return; }

    const headers = ["Date", "Bill No", "Vehicle", "Driver", "Route", "Contractor", "Load", "Net Wt", "Km", "Rate", "Total Rent", "Advance", "Weighbridge", "Load/Unload", "Dr Pay", "Diesel Liter", "Fuel Price", "Total Expense", "Profit"];
    
    const csvRows = [
        headers.join(','), 
        ...filteredTrips.map((t: TripRecord) => {
            const tripTotal = Math.round(Number(t.tripTotal) || 0);
            const drPay = Math.round(Number(t.driverTripPay) || 0);
            const tripExpense = Math.round((Number(t.loadingCharge)||0) + (Number(t.unloadingCharge)||0) + (Number(t.dieselPrice)||0) + (Number(t.weighbridgeCharge)||0) + drPay);
            const profit = tripTotal - tripExpense;
            
            return [
                t.date, t.billNo, t.regNumber, t.driverName, `"${t.from} - ${t.to}"`, t.contractor, t.loadType, t.netWeight, t.expense || 0, t.rate,
                tripTotal, t.advance, t.weighbridgeCharge, 
                (Number(t.loadingCharge)||0) + (Number(t.unloadingCharge)||0),
                drPay, t.dieselLiters, t.dieselPrice, tripExpense, profit
            ].join(',');
        })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', ''); a.setAttribute('href', url); a.setAttribute('download', `Finance_Report.csv`);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // Build Finance print from DATA — avoids overflow-y-auto clipping that causes blank space in PDF
  const handlePrintFinance = () => {
    if (filteredTrips.length === 0) { alert("No data to print"); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const label = selectedMonth
      ? new Date(Number(selectedMonth.split('-')[0]), Number(selectedMonth.split('-')[1]) - 1)
          .toLocaleString('default', { month: 'long', year: 'numeric' })
      : 'All Months';

    const rows = filteredTrips.map((trip: TripRecord) => {
      const drPay = Math.round(Number(trip.driverTripPay) || 0);
      const tripTotal = Math.round(Number(trip.tripTotal) || 0);
      const tripExpense = Math.round(
        (Number(trip.loadingCharge) || 0) + (Number(trip.unloadingCharge) || 0) +
        (Number(trip.dieselPrice) || 0) + (Number(trip.weighbridgeCharge) || 0) +
        drPay + (Number(trip.expense) || 0)
      );
      const profit = tripTotal - tripExpense;
      return `
        <tr>
          <td>${trip.date}</td>
          <td style="font-family:monospace;">${trip.billNo}</td>
          <td style="font-weight:700;">${trip.regNumber}</td>
          <td>${trip.driverName}</td>
          <td>${trip.from} - ${trip.to}</td>
          <td>${trip.contractor}</td>
          <td>${trip.loadType}</td>
          <td style="text-align:right;font-weight:700;">${trip.netWeight}</td>
          <td style="text-align:right;">₹${trip.rate}</td>
          <td style="text-align:right;font-weight:700;background:#eff6ff;color:#1d4ed8;">₹${tripTotal.toLocaleString('en-IN')}</td>
          <td style="text-align:right;color:#ea580c;">₹${Number(trip.advance||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;">₹${Number(trip.weighbridgeCharge||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;">₹${Number(trip.loadingCharge||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;">₹${Number(trip.unloadingCharge||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;background:#fff1f2;color:#dc2626;">₹${Number(trip.expense||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;color:#16a34a;font-weight:700;">₹${drPay.toLocaleString('en-IN')}</td>
          <td style="text-align:right;">${trip.dieselLiters||0} L</td>
          <td style="text-align:right;">₹${Number(trip.dieselPrice||0).toLocaleString('en-IN')}</td>
          <td style="text-align:right;font-weight:700;background:#fff1f2;color:#b91c1c;">₹${tripExpense.toLocaleString('en-IN')}</td>
          <td style="text-align:right;font-weight:700;${profit >= 0 ? 'background:#f0fdf4;color:#15803d;' : 'background:#fff1f2;color:#dc2626;'}">₹${profit.toLocaleString('en-IN')}</td>
        </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=1200"/>
  <title>Financial Report — Anjaneya Transport</title>
  <style>
    @page { size: A4 landscape; margin: 8mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { width: 1200px; height: auto; }
    body { width: 1200px; height: auto; min-height: 0; font-family: Arial, sans-serif; font-size: 8px; color: #1e293b; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start;
      border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px; }
    .header h1 { font-size: 14px; font-weight: 800; }
    .header .sub { font-size: 7px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
    .header .company { font-size: 12px; font-weight: 900; color: #2563eb; }
    .summary { display: flex; gap: 8px; margin-bottom: 8px; }
    .summary div { flex: 1; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; }
    .summary .slabel { font-size: 6.5px; font-weight: 700; text-transform: uppercase; color: #64748b; }
    .summary .sval { font-size: 12px; font-weight: 800; color: #1e293b; }
    .section-title { font-size: 9px; font-weight: 700; color: #334155; margin-bottom: 4px; }
    .badge { background: #e2e8f0; color: #475569; padding: 1px 6px; border-radius: 8px; font-size: 7px; font-weight: 700; margin-left: 6px; }
    table { width: 100%; border-collapse: collapse; table-layout: auto; }
    thead { display: table-header-group; }
    tbody tr { page-break-inside: avoid; }
    th { background: #1e293b; color: #e2e8f0; padding: 3px 4px; font-size: 7px;
         font-weight: 700; text-transform: uppercase; border: 1px solid #334155; text-align: left; white-space: nowrap; }
    th[style] { background: unset; color: unset; }
    td { padding: 2px 4px; font-size: 7.5px; border: 1px solid #e2e8f0; white-space: nowrap; }
    td[style*="background"] { background: unset; }
    td[style*="color"] { color: unset; }
    tbody tr:nth-child(even) td:not([style]) { background: #f8fafc; }
    .footer { margin-top: 8px; text-align: center; font-size: 7px; color: #94a3b8; font-style: italic; border-top: 1px solid #f1f5f9; padding-top: 4px; }
  </style>
  <script>window.onload = function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ window.print(); }); }); };</script>
</head>
<body style="height:auto;min-height:0;">
  <div class="header">
    <div>
      <h1>Financial Report</h1>
      <div class="sub">Trip Tally &bull; ${dateStr} &bull; ${label}</div>
    </div>
    <div class="company">ANJANEYA TRANSPORT</div>
  </div>
  <div class="summary">
    <div><div class="slabel">Revenue</div><div class="sval">₹ ${totalRentRevenue.toLocaleString('en-IN')}</div></div>
    <div><div class="slabel">Total Fuel</div><div class="sval">${totalFuelLiters.toLocaleString('en-IN')} L</div></div>
    <div><div class="slabel">Total Expense</div><div class="sval">₹ ${totalExpenses.toLocaleString('en-IN')}</div></div>
    <div><div class="slabel">Net Profit</div><div class="sval">₹ ${totalProfit.toLocaleString('en-IN')}</div></div>
  </div>
  <div class="section-title">Detailed Transaction Log <span class="badge">${filteredTrips.length} Records</span></div>
  <table>
    <thead>
      <tr>
        <th>Date</th><th>Bill No</th><th>Vehicle</th><th>Driver</th><th>Route</th>
        <th>Contractor</th><th>Load</th><th>Net Wt</th><th>Rate</th>
        <th style="background:#1e3a5f;color:#bfdbfe;">Total Rent</th>
        <th style="color:#fb923c;">Advance</th>
        <th>Weighbridge</th><th>Loading</th><th>Unloading</th>
        <th style="background:#4c0519;color:#fecdd3;">Extra Exp</th>
        <th style="color:#86efac;">Dr Pay</th>
        <th>Diesel L</th><th>Fuel ₹</th>
        <th style="background:#7f1d1d;color:#fecaca;">Total Exp</th>
        <th style="background:#14532d;color:#bbf7d0;">Profit</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Computer generated statement. Contact depot for discrepancies.</div>
</body>
</html>`;

    openPrintTab(html);
  };
    
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div>
             <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2"><Wallet className="text-blue-600"/> Financial Overview</h2>
             <p className="text-xs text-slate-500 font-medium">Track Earnings, Expenses & Downloads</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Month Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
              <Calendar size={14} className="text-slate-400"/>
              <select
                className="text-xs border-none outline-none text-slate-700 font-medium bg-transparent"
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setStartDate(''); setEndDate(''); }}
              >
                <option value="">All Months</option>
                {availableMonths.map((m: string) => {
                  const [year, month] = m.split('-');
                  const label = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
              {selectedMonth && (
                <button onClick={() => setSelectedMonth('')} className="ml-1 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={12}/></button>
              )}
            </div>
            {/* Optional date range (secondary) */}
            {!selectedMonth && <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />}
            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <button onClick={handleDownloadExcel} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"><Download size={16}/> Excel</button>
            <button onClick={handlePrintFinance} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"><Printer size={16}/> Print</button>
          </div>
      </div>

      <div id="finance-print-area" className="flex-1 overflow-y-auto space-y-6 pr-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-xl shadow-lg text-white">
             <div className="flex items-center gap-2 opacity-80 font-bold text-[10px] uppercase tracking-wider mb-1"><Briefcase size={14}/> Revenue</div>
             <div className="text-xl font-extrabold tracking-tight">₹ {totalRentRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
             <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-wider mb-1"><Droplet size={14}/> Total Fuel</div>
             <div className="text-xl font-extrabold text-slate-800">{totalFuelLiters.toLocaleString('en-IN')} L</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-wider mb-1"><Receipt size={14}/> Total Expense</div>
            <div className="text-xl font-extrabold text-slate-800">₹ {totalExpenses.toLocaleString('en-IN')}</div>
            <div className="text-[9px] text-slate-400 mt-1 font-medium leading-tight">Load+Unload+Fuel+Weight+DrPay</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 opacity-80 font-bold text-[10px] uppercase tracking-wider mb-1"><TrendingUp size={14}/> Net Profit</div>
            <div className="text-xl font-extrabold tracking-tight">₹ {totalProfit.toLocaleString('en-IN')}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-700">Detailed Transaction Log</h3>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full font-bold">{filteredTrips.length} Records</span>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px] whitespace-nowrap">
  <tr>
    <th className="px-4 py-3 w-12 text-center no-print"></th>
    <th className="px-3 py-3 border-r border-slate-700">Date</th>
    <th className="px-3 py-3 border-r border-slate-700">Bill No</th>
    <th className="px-3 py-3 border-r border-slate-700">Vehicle</th>
    <th className="px-3 py-3 border-r border-slate-700">Driver</th>
    <th className="px-3 py-3 border-r border-slate-700">Route</th>
    <th className="px-3 py-3 border-r border-slate-700">Contractor</th>
    <th className="px-3 py-3 border-r border-slate-700">Load</th>
    <th className="px-3 py-3 border-r border-slate-700">Net Wt</th>
    <th className="px-3 py-3 border-r border-slate-700">Rate</th>
    <th className="px-3 py-3 border-r border-slate-700 bg-blue-900 text-blue-200">Total Rent</th>
    <th className="px-3 py-3 border-r border-slate-700 text-orange-400">Advance</th>
    <th className="px-3 py-3 border-r border-slate-700 text-red-300">Weighbridge</th>
    
    {/* Reordered columns start here */}
    <th className="px-3 py-3 border-r border-slate-700 text-red-300">Loading</th>
    <th className="px-3 py-3 border-r border-slate-700 text-red-300">Unloading</th>
    <th className="px-3 py-3 border-r border-slate-700 text-red-300 bg-red-900/30">Extra Exp</th> 
    {/* Reordered columns end here */}

    <th className="px-3 py-3 border-r border-slate-700 text-green-300">Dr Pay</th>
    <th className="px-3 py-3 border-r border-slate-700 text-orange-300">Diesel Liter</th>
    <th className="px-3 py-3 border-r border-slate-700 text-orange-300">Fuel Price</th>
    <th className="px-3 py-3 border-r border-slate-700 bg-red-900 text-red-200">Total Exp</th>
    <th className="px-3 py-3 border-r border-slate-700 bg-emerald-900 text-emerald-200">Profit</th>
    <th className="px-2 py-3 text-center no-print">Del</th>
  </tr>
</thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium whitespace-nowrap">
  {filteredTrips.length === 0 ? (
    <tr>
      <td colSpan={22} className="p-8 text-center text-slate-400">No records found for this period.</td>
    </tr>
  ) : (
    filteredTrips.map((trip: TripRecord, index: number) => {
      // --- Special rendering for advance rows (billNo=0) ---
      if (String(trip.billNo) === "0") {
        const advAmt = Number(trip.advance) || 0;
        return (
          <tr key={`${trip.id}-${index}`} className="bg-orange-50 hover:bg-orange-100 transition-colors border-l-4 border-orange-400">
            <td className="px-3 py-3 text-center no-print">—</td>
            <td className="px-3 py-3 text-orange-700 font-bold">{trip.date}</td>
            <td className="px-3 py-3 text-orange-500 font-mono">ADV</td>
            <td className="px-3 py-3 font-bold text-blue-600">{trip.regNumber}</td>
            <td className="px-3 py-3 text-orange-700">{trip.driverName}</td>
            <td className="px-3 py-3 text-orange-600 font-bold" colSpan={5}>Driver Advance Payment</td>
            <td className="px-3 py-3 text-slate-400">—</td>
            <td className="px-3 py-3 font-bold text-orange-700">₹{advAmt.toLocaleString('en-IN')}</td>
            <td className="px-3 py-3 text-slate-400" colSpan={7}>—</td>
            <td className="px-3 py-3 font-bold text-orange-700 bg-orange-100">₹{advAmt.toLocaleString('en-IN')}</td>
            <td className="px-3 py-3 text-slate-400">—</td>
            <td className="px-3 py-3 text-center no-print">
              <button onClick={() => handleDeleteTrip(trip.id)} className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors"><Trash2 size={14}/></button>
            </td>
          </tr>
        );
      }
      // --- 1. DEFINE VARIABLES BEFORE USE ---
      const drPay = Math.round(Number(trip.driverTripPay) || 0);
      const tripTotal = Math.round(Number(trip.tripTotal) || 0);
      
      const tripExpense = Math.round(
        (Number(trip.loadingCharge) || 0) +
        (Number(trip.unloadingCharge) || 0) +
        (Number(trip.dieselPrice) || 0) +
        (Number(trip.weighbridgeCharge) || 0) +
        drPay +
        (Number(trip.expense) || 0)
      );

      const tripProfit = tripTotal - tripExpense;

      // --- 2. RENDER THE ROW ---
      return (
        <tr key={`${trip.id}-${index}`} className="hover:bg-blue-50 transition-colors">
          <td className="px-4 py-2 no-print"></td>
          <td className="px-3 py-2 border-r border-slate-50">{trip.date}</td>
          <td className="px-3 py-2 border-r border-slate-50 font-mono text-slate-500">{trip.billNo}</td>
          <td className="px-3 py-2 border-r border-slate-50 font-bold text-slate-700">{trip.regNumber}</td>
          <td className="px-3 py-2 border-r border-slate-50">{trip.driverName}</td>
          <td className="px-3 py-2 border-r border-slate-50">{trip.from} - {trip.to}</td>
          <td className="px-3 py-2 border-r border-slate-50">{trip.contractor}</td>
          <td className="px-3 py-2 border-r border-slate-50">{trip.loadType}</td>
          <td className="px-3 py-2 border-r border-slate-50 font-bold">{trip.netWeight}</td>
          <td className="px-3 py-2 border-r border-slate-50">₹{trip.rate}</td>
          
          {/* Use defined tripTotal */}
          <td className="px-3 py-2 border-r border-slate-50 font-bold text-blue-700 bg-blue-50/50">
            ₹{tripTotal.toLocaleString('en-IN')}
          </td>
          
          <td className="px-3 py-2 border-r border-slate-50 text-right text-orange-600 font-semibold">₹{trip.advance}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-slate-600">₹{trip.weighbridgeCharge}</td>
          
          {/* Expense Section Reordered */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-500 font-bold">₹{Number(trip.loadingCharge || 0).toLocaleString('en-IN')}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-500 font-bold">₹{Number(trip.unloadingCharge || 0).toLocaleString('en-IN')}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-600 font-bold bg-red-50/50">₹{Number(trip.expense || 0).toLocaleString('en-IN')}</td>

          {/* Use defined drPay */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-green-600 font-bold bg-green-50/30">
            ₹{drPay.toLocaleString('en-IN')}
          </td>
          
          <td className="px-3 py-2 border-r border-slate-50 text-right text-slate-600">{trip.dieselLiters} L</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-orange-600">₹{trip.dieselPrice}</td>
          
          {/* Use defined tripExpense */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-600 font-bold bg-red-50/30">
            ₹{tripExpense.toLocaleString('en-IN')}
          </td>
          
          {/* Use defined tripProfit */}
          <td className={`px-3 py-2 text-right font-extrabold ${tripProfit >= 0 ? 'text-emerald-600 bg-emerald-50/50' : 'text-red-600 bg-red-50/50'}`}>
            ₹{tripProfit.toLocaleString('en-IN')}
          </td>
          
          <td className="px-2 py-3 text-center no-print">
            <button onClick={() => handleDeleteTrip(trip.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all">
              <Trash2 size={14}/>
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
};

const HistoryView = ({ historyLogs, setHistoryLogs, setTrips, setDrivers, drivers }: any) => {
  const driversGlobal = drivers;
  // Add this inside the HistoryView component (above the return statement)
const handleDeleteSettlement = async (logId: number) => {
  if (!confirm("⚠️ Are you sure you want to delete this settlement record?\n\nThis will NOT restore the trips or change driver balances. It only removes the history log.")) return;

  const { error } = await supabase.from('settlements').delete().eq('id', logId);

  if (error) {
    alert("Error deleting history: " + error.message);
  } else {
    setHistoryLogs((prev: any[]) => prev.filter(h => h.id !== logId));
    alert("Settlement record deleted.");
  }
};
// In HistoryView component, update the handleRetrieveSettlement function:
const handleRetrieveSettlement = async (log: WeeklyHistory) => {
  if (!confirm(`Retrieve trips for ${log.driverName}? \nThis will restore trips and update wallet.`)) return;

  try {
    const tripIds = log.trips.map((t: any) => t.id).filter(Boolean);

    if (tripIds.length === 0) {
      alert("No trips found in settlement snapshot.");
      return;
    }

    // CORRECT WALLET INCREMENT CALCULATION
    let walletIncrement = 0;

    log.trips.forEach((trip: any) => {
      const drPay = Number(trip.driver_trip_pay || trip.driverTripPay || 0);
      const advance = Number(trip.advance || 0);
      
      // CORRECT EXPENSE CALCULATION
      const load = Number(trip.loading_charge || trip.loadingCharge || 0);
      const unload = Number(trip.unloading_charge || trip.unloadingCharge || 0);
      const weigh = Number(trip.weighbridge_charge || trip.weighbridgeCharge || 0);
      const extra = Number(trip.expense || 0);
      
      const totalExpense = load + unload + weigh + extra; // ADDED EXTRA EXPENSE
      
      // CORRECT NET CALCULATION: Driver Pay - (Advance + Total Expenses)
      const net = drPay - (advance + totalExpense);
      walletIncrement += net;
    });

    // Update trips in Supabase
    const { error: tripRestoreError } = await supabase
      .from("trips")
      .update({ status: "active" })
      .in("id", tripIds);

    if (tripRestoreError) throw tripRestoreError;

    const driverName = log.driverName;
    if (!driverName) {
      alert("Driver name not available in this settlement.");
      return;
    }

    const driver = driversGlobal.find((d: any) => d.name === driverName);
    if (!driver) {
      alert("Driver not found in current driver list.");
      return;
    }

    // Increment wallet with CORRECT amount
    const { error: walletError } = await supabase.rpc("increment_wallet", {
      row_id: driver.id,
      amount: walletIncrement,
    });

    if (walletError) throw walletError;

    // Update state
    setTrips((prev: any[]) => [
      ...log.trips.map((t: any) => ({
        id: t.id,
        date: t.date,
        billNo: t.bill_no || t.billNo,
        regNumber: t.vehicle_reg || t.regNumber,
        driverName: driverName,
        from: t.from_loc || t.from,
        to: t.to_loc || t.to,
        contractor: t.contractor,
        loadType: t.load_type || t.loadType,
        netWeight: t.net_weight || t.netWeight,
        expense: t.expense || 0, // ADDED EXTRA EXPENSE
        rate: t.rate,
        tripTotal: t.trip_total || t.tripTotal,
        driverTripPay: t.driver_trip_pay || t.driverTripPay,
        advance: t.advance,
        dieselPrice: t.diesel_price || t.dieselPrice,
        dieselLiters: t.diesel_liters || t.dieselLiters,
        loadingCharge: t.loading_charge || t.loadingCharge,
        unloadingCharge: t.unloading_charge || t.unloadingCharge,
        weighbridgeCharge: t.weighbridge_charge || t.weighbridgeCharge,
        commissionType: t.commission_type || "percentage",
        commissionValue: t.commission_value || "15",
        fuelPaidDate: t.fuel_paid_date || "",
        contractorPaidDate: t.contractor_paid_date || "",
        creditedAmount: t.credited_amount || 0,
      })),
      ...prev,
    ]);

    setDrivers((prev: any[]) =>
      prev.map((d: any) =>
        d.id === driver.id ? { ...d, walletBalance: d.walletBalance + walletIncrement } : d
      )
    );

    setHistoryLogs((prev: any[]) => prev.filter((h: any) => h.id !== log.id));

    await supabase.from("settlements").delete().eq("id", log.id);

    alert("✅ Retrieved successfully and wallet updated!");
  } catch (err: any) {
    alert("❌ Retrieve failed: " + err.message);
  }
};

  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h2 className="text-lg font-bold">Past Weekly Settlements</h2>
      
      <div className="space-y-4">
        {historyLogs.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No history available yet.</div>
        ) : (
          historyLogs.map((log: WeeklyHistory) => (

            <div key={log.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {/* --- HEADER: DISPLAYS ONLY DRIVER NAME --- */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" 
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {log.driverName?.charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{log.driverName}</h3>
                    {/* Only show 'Click to view' if collapsed */}
                    {!expandedId && <p className="text-xs text-slate-400">Click to view full settlement details</p>}
                  </div>
                </div>
                <div>
                    {expandedId === log.id ? <ChevronUp size={20} className="text-blue-500"/> : <ChevronDown size={20} className="text-slate-400"/>}
                </div>
              </div>

              {/* --- EXPANDED SECTION --- */}
              {expandedId === log.id && (
                
                <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-2">
                  
                  {/* 1. Settlement Summary Box */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Settlement Date</span>
                         <div className="text-slate-800 font-bold flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400"/> {log.settlementDate}
                         </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</span>
                         <div className="text-green-600 font-bold text-lg">₹ {log.totalExpense.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Total Trips</span>
                         <div className="text-slate-800 font-bold">{log.trips.length} Records</div>
                      </div>
                   </div>


                   <div className="flex justify-end items-center gap-3 mb-4">
  {/* Retrieve Button */}
  <button
    onClick={() => handleRetrieveSettlement(log)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow flex items-center gap-2 transition-all active:scale-95"
  >
    <RefreshCw size={16}/> Retrieve
  </button>

  {/* NEW: Delete Button */}
  <button
    onClick={() => handleDeleteSettlement(log.id)}
    className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg border border-red-200 transition-all active:scale-95"
    title="Delete History Record"
  >
    <Trash2 size={18}/>
  </button>
</div>


                   <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Truck size={16}/> Trip Details
                   </h4>
                   
                   {/* 2. Table Data */}
                   <div className="overflow-x-auto mb-6 bg-white rounded-lg border border-slate-200 shadow-sm">
                     <table className="w-full text-sm text-left whitespace-nowrap">
                       <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b border-slate-100">
                         <tr>
                           <th className="px-5 py-4">DATE</th>
                           <th className="px-5 py-4">BILL NO</th>
                           <th className="px-5 py-4">ROUTE / LOAD</th>
                           <th className="px-5 py-4 text-indigo-600">ADVANCE</th>
                           <th className="px-5 py-4 text-red-600">EXPENSES</th>
                           <th className="px-5 py-4">RENT</th>
                           <th className="px-5 py-4 text-green-700">GROSS PAY</th>
                           <th className="px-5 py-4 bg-blue-50 text-blue-700 border-l border-blue-100">NET ADDED</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 text-sm">
                         {log.trips && log.trips.length > 0 ? (
                           log.trips.map((trip: any) => {
                             const drPay = Number(trip.driver_trip_pay || trip.driverTripPay) || 0;
                             const loadChg = Number(trip.loading_charge || trip.loadingCharge) || 0;
                             const unloadChg = Number(trip.unloading_charge || trip.unloadingCharge) || 0;
                             const weightChg = Number(trip.weighbridge_charge || trip.weighbridgeCharge) || 0;
                             const totalTripExpenses = loadChg + unloadChg + weightChg;
                             const advance = Number(trip.advance) || 0;
                             
                             // Re-calculate net for display consistency
                             const finalPay = drPay - (advance - totalTripExpenses);
                             const tripRent = Number(trip.trip_total || trip.tripTotal) || 0;

                             return (
                               <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-5 py-4 font-bold text-slate-700">{trip.date}</td>
                                 <td className="px-5 py-4 font-mono text-slate-500">{trip.bill_no || trip.billNo}</td>
                                 <td className="px-5 py-4">
                                   <div className="font-bold text-slate-800 flex items-center gap-1">
                                     ➔ {trip.to_loc || trip.to}
                                   </div>
                                   <div className="text-xs text-slate-500 mt-0.5">
                                     {trip.load_type || trip.loadType} ({trip.net_weight || trip.netWeight}T)
                                   </div>
                                 </td>
                                 <td className="px-5 py-4 text-indigo-600 font-bold">
                                   ₹ {advance.toLocaleString('en-IN')}
                                 </td>
                                 <td className="px-5 py-4 text-red-600">
                                   <div className="font-bold">₹ {totalTripExpenses.toLocaleString('en-IN')}</div>
                                   <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                     L:{loadChg} / U:{unloadChg} / W:{weightChg}
                                   </div>
                                 </td>
                                 <td className="px-5 py-4 text-slate-600 font-medium">
                                   ₹ {tripRent.toLocaleString('en-IN')}
                                 </td>
                                 <td className="px-5 py-4 text-green-700 font-bold">
                                   ₹ {drPay.toLocaleString('en-IN')}
                                 </td>
                                 <td className="px-5 py-4 bg-blue-50 border-l border-blue-100 text-blue-700 font-extrabold text-right">
                                   ₹ {finalPay.toLocaleString('en-IN')}
                                 </td>
                               </tr>
                             );
                           })
                         ) : (
                           <tr><td colSpan={12} className="p-6 text-center text-slate-400">No trips in this settlement.</td></tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const VehicleCard = ({ data, onAction, onFilter, vehicleNotifs = [] }: { data: Vehicle, onAction: (type: string) => void, onFilter: (reg: string, view: string) => void, vehicleNotifs?: Notification[] }) => {
  const hasCritical = vehicleNotifs.some(n => n.severity === 'critical');
  const hasWarning = vehicleNotifs.some(n => n.severity === 'warning');
  const borderColor = hasCritical ? 'border-red-400' : hasWarning ? 'border-orange-400' : 'border-slate-200';

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${borderColor}`}>
      {/* Notification alert strip */}
      {vehicleNotifs.length > 0 && (
        <div className={`px-4 py-2 flex flex-wrap gap-2 ${hasCritical ? 'bg-red-50' : 'bg-orange-50'}`}>
          {vehicleNotifs.map(n => (
            <span key={n.id} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${n.severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
              <Bell size={9}/>
              {n.type}: {n.daysLeft < 0 ? `Expired ${Math.abs(n.daysLeft)}d ago` : `${n.daysLeft}d left`}
            </span>
          ))}
        </div>
      )}
      <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onAction('trip')}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${hasCritical ? 'bg-red-50 border-red-200 text-red-500' : hasWarning ? 'bg-orange-50 border-orange-200 text-orange-500' : 'bg-slate-50 border-slate-100 text-slate-500'}`}><Truck size={24} /></div>
             <div><h3 className="text-lg font-extrabold text-slate-800 hover:text-blue-600">{data.regNumber}</h3><div className="text-xs text-slate-500 font-medium">{data.location}</div></div>
          </div>
          <div className="flex gap-1">
             <button onClick={(e) => { e.stopPropagation(); onFilter(data.regNumber, 'trips'); }} className="p-2 rounded-full hover:bg-blue-100 text-slate-400 hover:text-blue-600 transition-colors" title="View Trip Log"><List size={18}/></button>
             <button onClick={(e) => { e.stopPropagation(); onFilter(data.regNumber, 'finance'); }} className="p-2 rounded-full hover:bg-green-100 text-slate-400 hover:text-green-600 transition-colors" title="View Finance"><Wallet size={18}/></button>
             <button onClick={(e) => { e.stopPropagation(); onFilter(data.regNumber, 'fuel'); }} className="p-2 rounded-full hover:bg-orange-100 text-slate-400 hover:text-orange-600 transition-colors" title="View Fuel Log"><Droplet size={18}/></button>
          </div>
        </div>
        <div className="mt-2 flex gap-4 text-xs font-semibold text-slate-600">
           {data.currentTrip.loadType && (<span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><Leaf size={12}/> {data.currentTrip.loadType}</span>)}
           {data.currentTrip.netWeight && (<span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><Weight size={12}/> {data.currentTrip.netWeight} Ton</span>)}
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 bg-slate-50/50">
        <ActionButton icon={<FileText size={18}/>} label="Details" color="text-blue-600" onClick={() => onAction('details')} />
        <ActionButton icon={<Navigation size={18}/>} label="Trip" color="text-emerald-600" onClick={() => onAction('trip')} />
        <ActionButton icon={<UserCircle size={18}/>} label="Driver" color="text-orange-600" onClick={() => onAction('driver')} />
      </div>
    </div>
  );
};

const ModalWrapper = ({ title, children, onClose, headerContent }: any) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
    <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 shrink-0">
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
        <div className="flex items-center gap-3">
            {headerContent}
            <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-red-500"/></button>
        </div>
      </div>
      <div className="p-5 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

const DetailsModal = ({ data, onClose, setVehicles }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(data.vehicleDetails || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('vehicles')
      .update({ details: editForm })
      .eq('id', data.id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      setVehicles((prev: any) => prev.map((v: any) => v.id === data.id ? { ...v, vehicleDetails: editForm } : v));
      setIsEditing(false);
      alert("Vehicle updated successfully!");
    }
    setIsSaving(false);
  };

  const Field = ({ label, fieldKey, type = "text" }: { label: string; fieldKey: string; type?: string }) => (
    <div>
      <label className={`text-xs font-bold uppercase mb-1 block ${isEditing ? 'text-blue-600' : 'text-slate-500'}`}>{label}</label>
      {isEditing ? (
        <input
          type={type}
          className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={editForm[fieldKey] || ''}
          onChange={(e) => setEditForm({ ...editForm, [fieldKey]: e.target.value })}
        />
      ) : (
        <div className="text-sm font-semibold text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
          {editForm[fieldKey] || <span className="text-slate-300 italic">N/A</span>}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header — styled like Trip modal */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Truck size={18}/>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">{data.regNumber}</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Technical & Compliance Records</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => { setIsEditing(false); setEditForm(data.vehicleDetails || {}); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >Cancel</button>
                <button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                >
                  {isSaving ? 'Saving...' : 'SAVE CHANGES'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Palette size={12}/> EDIT DETAILS
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><X size={20}/></button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">

          {/* Vehicle banner — matches Trip modal vehicle banner */}
          <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">
            <ShieldCheck size={16} className="shrink-0"/>
            <span className="text-xs font-bold uppercase tracking-wide">Registration:</span>
            <span className="text-base font-extrabold tracking-widest">{data.regNumber}</span>
          </div>

          {/* IDENTIFICATION section */}
          <div>
            <h4 className="font-bold text-xs text-blue-600 uppercase mb-2">Identification</h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Field label="Model" fieldKey="model" />
              <Field label="Engine Number" fieldKey="engineNo" />
              <Field label="Chassis Number" fieldKey="chassisNo" />
              <Field label="Registering Authority" fieldKey="registeringAuthority" />
            </div>
          </div>

          {/* VALIDITY DATES section */}
          <div>
            <h4 className="font-bold text-xs text-blue-600 uppercase mb-2">Validity Dates</h4>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <Field label="Insurance Valid" fieldKey="insuranceValidUpto" type="date" />
              <Field label="Fitness (FC)" fieldKey="fitnessValidUpto" type="date" />
              <Field label="Road Tax" fieldKey="roadTaxValidUpto" type="date" />
              <Field label="Green Tax" fieldKey="greenTaxValidUpto" type="date" />
              <Field label="PUCC Valid" fieldKey="puccValidUpto" type="date" />
              <Field label="Permit Valid" fieldKey="permitValidUpto" type="date" />
            </div>
          </div>

          {/* INSURANCE & PERMIT section */}
          <div>
            <h4 className="font-bold text-xs text-blue-600 uppercase mb-2">Insurance & National Permit</h4>
            <div className="grid grid-cols-2 gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Field label="Insurance Co." fieldKey="insuranceCompany" />
              <Field label="Policy No." fieldKey="insurancePolicyNo" />
              <Field label="NP Number" fieldKey="nationalPermitNo" />
              <Field label="NP Valid Upto" fieldKey="nationalPermitValidUpto" type="date" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const DriverDetailsModal = ({ driver, setDrivers, setHistoryLogs, onClose, currentUser }: { driver: any, setDrivers: any, setHistoryLogs?: any, onClose: () => void, currentUser: any }) => {
  const [driverHistory, setDriverHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedTripIds, setSelectedTripIds] = useState<Set<number>>(new Set());
  const [payAmount, setPayAmount] = useState<string>(''); 
  const [localWalletBalance, setLocalWalletBalance] = useState<number>(Math.round(Number(driver.walletBalance)) || 0);

  // --- 1. FETCH DATA & CALCULATE NET ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!driver?.id) return;
      const { data } = await supabase.from('trips').select('*').eq('driver_id', driver.id).eq('status', 'active').order('date', { ascending: true });
        
      if(data) {
const mapped = data.map((t: any) => {
  const extraExpense = Math.round(Number(t.expense) || 0);
  const loadingCharge = Math.round(Number(t.loading_charge) || 0);
  const unloadingCharge = Math.round(Number(t.unloading_charge) || 0);
  const weighbridgeCharge = Math.round(Number(t.weighbridge_charge) || 0);
  
  const totalExpenses = Math.round(loadingCharge + unloadingCharge + weighbridgeCharge + extraExpense);
  const advance = Math.round(Number(t.advance) || 0);
  const driverPay = Math.round(Number(t.driver_trip_pay) || 0);
  
  // NEW FORMULA: Advance - Total Expenses - Gross Pay
  const calculatedNet = Math.round(driverPay - (advance - totalExpenses));

          return {
            ...t,
            date: t.date, 
            billNo: t.bill_no, 
            from: t.from_loc, 
            to: t.to_loc, 
            loadType: t.load_type, 
            tripTotal: t.trip_total,
            loadingCharge, 
            unloadingCharge, 
            driverTripPay: driverPay,
            weighbridgeCharge, 
            advance,
            extraExpense, 
            totalExpenses,
            netAmount: calculatedNet 
          };
        });
        setDriverHistory(mapped);
      }
      setLoading(false);
    };
    fetchHistory();
  }, [driver.id]);

  // --- 2. FILTER LOGIC ---
  const filteredHistory = driverHistory.filter((t: any) => {
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  });

  // --- 3. VISUAL TOTALS ---
  const totalGrossPay = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.driverTripPay) || 0), 0));
  const totalAdvance = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.advance) || 0), 0));
  const totalExtraExpense = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.extraExpense) || 0), 0));
  const totalLoadingCharge = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.loadingCharge) || 0), 0));
  const totalUnloadingCharge = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.unloadingCharge) || 0), 0));
  const totalWeighbridgeCharge = Math.round(filteredHistory.reduce((sum, t) => sum + (Number(t.weighbridgeCharge) || 0), 0));
  const totalExpenses = Math.round(totalExtraExpense + totalLoadingCharge + totalUnloadingCharge + totalWeighbridgeCharge);

  // --- 4. DYNAMIC BALANCE ---
  // --- 4. DYNAMIC BALANCE ---
// Change this line:
// Inside DriverDetailsModal component body
const selectedTripsSum = Math.round(filteredHistory
  .filter(t => selectedTripIds.size === 0 || selectedTripIds.has(t.id))
  .reduce((sum, t) => sum + t.netAmount, 0) 
);

// This is the value displayed at the very top
const calculatedNetAdded = Math.round(localWalletBalance + selectedTripsSum);

  // --- 5. HANDLERS ---
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPayAmount(val);
    if(!val) { setSelectedTripIds(new Set()); return; }

    const targetAmount = Math.round(parseFloat(val));
    const newSelection = new Set<number>();
    
    const exactMatch = filteredHistory.find(t => t.netAmount === targetAmount);
    if (exactMatch) { newSelection.add(exactMatch.id); } 
    else {
      const greaterMatch = filteredHistory.find(t => t.netAmount > targetAmount);
      if (greaterMatch) { newSelection.add(greaterMatch.id); }
    }
    setSelectedTripIds(newSelection);
  };

  const handleToggleRow = (tripId: number) => {
    const newSelection = new Set(selectedTripIds);
    if (newSelection.has(tripId)) newSelection.delete(tripId); else newSelection.add(tripId);
    setSelectedTripIds(newSelection);
    
    const currentSelectionSum = Math.round(filteredHistory.filter(t => newSelection.has(t.id)).reduce((sum, t) => sum + t.netAmount, 0));
    setPayAmount((localWalletBalance + currentSelectionSum).toFixed(0));
  };

  const toggleSelectAll = () => {
    if (selectedTripIds.size === filteredHistory.length) { 
      setSelectedTripIds(new Set()); 
      setPayAmount(localWalletBalance.toFixed(0)); 
    } else {
      const allIds = new Set(filteredHistory.map(t => t.id));
      setSelectedTripIds(allIds);
      const allNet = Math.round(filteredHistory.reduce((sum, t) => sum + t.netAmount, 0));
      setPayAmount((localWalletBalance + allNet).toFixed(0));
    }
  };

  const handleResetWallet = async () => {
    if(!confirm("⚠️ Reset Wallet to 0?\nUse only if balance is incorrect.")) return;
    const { error } = await supabase.from('drivers').update({ wallet_balance: 0 }).eq('id', driver.id);
    if(error) { alert("Error: " + error.message); } 
    else {
        setLocalWalletBalance(0);
        if(setDrivers) { setDrivers((prev: any[]) => prev.map(d => d.id === driver.id ? { ...d, walletBalance: 0 } : d)); }
    }
  };

  const handleSettle = async () => {
    if (submitting) return;
    const tripsToSettle = filteredHistory.filter(t => selectedTripIds.has(t.id));
    
    // UPDATE THIS LINE HERE:
    const tripNetSum = Math.round(tripsToSettle.reduce((sum, t) => 
        sum + (t.driverTripPay - (t.advance - t.totalExpenses)), 0)
    );
    
    const totalDue = Math.round(localWalletBalance + tripNetSum);
    // ... rest of the function remains the same
    const paid = Math.round(parseFloat(payAmount) || 0);
    const newBalance = Math.round(totalDue - paid);

    if (!confirm(`Settle ${tripsToSettle.length} trips?\n\nNet Remaining: ${totalDue}\nPayment: ${paid}\nNew Balance: ${newBalance}`)) return;

    setSubmitting(true);
    const today = new Date().toISOString().split('T')[0];
    try {
        const { data: newSettlement, error } = await supabase.from('settlements').insert([{ 
            driver_id: driver.id, 
            settlement_date: today, 
            amount_paid: paid, 
            trips_snapshot: tripsToSettle, 
            notes: `Total: ${totalDue}, Paid: ${paid}, Bal: ${newBalance}`,
            user_id: currentUser.id
        }]).select().single();

        if (error) throw error;
        
        await supabase.from('drivers').update({ wallet_balance: newBalance }).eq('id', driver.id);
        
        if (selectedTripIds.size > 0) { 
            await supabase.from('trips').update({ status: 'settled' }).in('id', Array.from(selectedTripIds)); 
        }
        
        if (setDrivers) { 
            setDrivers((prev: any[]) => prev.map(d => d.id === driver.id ? { ...d, walletBalance: newBalance } : d)); 
        }
        
        if (setHistoryLogs && newSettlement) {
            setHistoryLogs((prev: any[]) => [{ 
                id: newSettlement.id, 
                settlementDate: newSettlement.settlement_date, 
                driverName: driver.name, 
                totalIncome: 0, 
                totalExpense: newSettlement.amount_paid, 
                netProfit: 0, 
                transactions: [], 
                trips: newSettlement.trips_snapshot || [] 
            }, ...prev]);
        }
        
        setLocalWalletBalance(newBalance);
        setDriverHistory(prev => prev.filter(t => !selectedTripIds.has(t.id)));
        setSelectedTripIds(new Set());
        setPayAmount(''); 
        alert("Settled!");
    } catch (err: any) { 
        alert("Error: " + err.message); 
    } finally { 
        setSubmitting(false); 
    }
  };

  const handleDownloadExcel = () => {
    if (filteredHistory.length === 0) { alert("No data"); return; }
    const headers = ["Date", "Bill No", "Route", "Total Rent", "Advance", "Extra Exp", "Loading", "Unloading", "Weighbridge", "Total Exp", "Dr Pay", "Net Added"];
    const csvRows = [headers.join(','), ...filteredHistory.map(h => {
        return [h.date, h.billNo, `"${h.from}-${h.to}"`, h.tripTotal, h.advance, h.extraExpense, h.loadingCharge, h.unloadingCharge, h.weighbridgeCharge, h.totalExpenses, h.driverTripPay, h.netAmount].join(',');
    })];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', ''); 
    a.setAttribute('href', url); 
    a.setAttribute('download', `${driver.name}_Statement.csv`);
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex flex-col items-center justify-center backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow">
                  {driver.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{driver.name}</h2>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                        Total Balance: <span className={calculatedNetAdded >= 0 ? "text-green-600" : "text-red-600"}>
                          ₹{calculatedNetAdded.toLocaleString('en-IN')}
                        </span>
                        {localWalletBalance !== 0 && (
                          <button 
                            onClick={handleResetWallet} 
                            className="bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 p-1 rounded transition-colors" 
                            title="Reset Wallet"
                          >
                            <RefreshCw size={10}/>
                          </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-end">
                <div className="flex gap-1">
                    <input 
                      type="date" 
                      className="border rounded px-2 py-1 text-xs text-slate-600" 
                      value={startDate} 
                      onChange={e=>setStartDate(e.target.value)} 
                      disabled={submitting}
                    />
                    <input 
                      type="date" 
                      className="border rounded px-2 py-1 text-xs text-slate-600" 
                      value={endDate} 
                      onChange={e=>setEndDate(e.target.value)} 
                      disabled={submitting}
                    />
                </div>
                <div className={`flex items-end gap-2 ml-2 ${submitting ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase leading-none mb-1">
                          Pay / Settle Amt
                        </label>
                        <input 
                          type="number" 
                          placeholder="Type to auto-select..." 
                          className="w-48 bg-white border border-slate-300 rounded px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                          value={payAmount} 
                          onChange={handleAmountChange} 
                          disabled={submitting} 
                        />
                    </div>
                    <button 
                      onClick={handleSettle} 
                      disabled={submitting || (!payAmount && selectedTripIds.size === 0)} 
                      className="h-[38px] flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-4 rounded-md font-bold text-sm shadow-sm transition-all"
                    >
                      {submitting ? <TrendingUp size={16} className="animate-spin"/> : <CheckCircle2 size={18}/>} 
                      Settle Selected
                    </button>
                </div>
                <div className="flex gap-1 ml-4 border-l pl-4">
                    <button 
                      onClick={handleDownloadExcel} 
                      className="p-2 bg-slate-100 hover:bg-green-100 text-slate-600 rounded-lg border border-slate-200"
                    >
                      <Download size={18}/>
                    </button>
                    <button 
                      onClick={() => printSection('driver-print-area', `${driver.name} Statement`)} 
                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 rounded-lg border border-slate-200"
                    >
                      <Printer size={18}/>
                    </button>
                    <button 
                      onClick={onClose} 
                      disabled={submitting} 
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg ml-2"
                    >
                      <X size={18} />
                    </button>
                </div>
            </div>
        </div>

        <div id="driver-print-area" className="flex-1 overflow-auto bg-slate-50/50 p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              
    {/* 1. Total Advances */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">Total Advances</div>
        <div className="text-xl font-bold text-orange-600">₹ {totalAdvance.toLocaleString('en-IN')}</div>
    </div>

    {/* 2. L/U/W Sum */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">L/U/W Sum</div>
        <div className="text-xl font-bold text-red-600">₹ {(totalLoadingCharge + totalUnloadingCharge + totalWeighbridgeCharge).toLocaleString('en-IN')}</div>
    </div>

    {/* 3. Extra Exp */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">Extra Exp</div>
        <div className="text-xl font-bold text-red-600">₹ {totalExtraExpense.toLocaleString('en-IN')}</div>
    </div>

    {/* 4. Gross Pay */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">Gross Pay</div>
        <div className="text-xl font-bold text-slate-800">₹ {totalGrossPay.toLocaleString('en-IN')}</div>
    </div>

    {/* 5. Net Added (Result of New Formula) */}
    {/* 5. Net Added (Result of New Formula) */}
<div className="bg-white p-4 rounded-xl border-l-4 border-l-indigo-600 shadow-md">
    <div className="text-xs font-bold text-slate-400 uppercase">Total Net Added</div>
    <div className={`text-2xl font-bold ${selectedTripsSum >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
      ₹ {selectedTripsSum.toLocaleString('en-IN')}
    </div>
</div>
</div>

 {/* --- UPDATED TABLE IN DRIVER DETAILS MODAL --- */}
{/* --- UPDATED TABLE IN DRIVER DETAILS MODAL --- */}
{/* --- UPDATED TABLE IN DRIVER DETAILS MODAL --- */}
{/* --- UPDATED TABLE IN DRIVER DETAILS MODAL --- */}
{/* --- UPDATED TABLE IN DRIVER DETAILS MODAL --- */}
<div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${submitting ? 'opacity-60 pointer-events-none select-none' : ''}`}>
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px] whitespace-nowrap">
    <tr>
        <th className="px-4 py-3">Date</th>
        <th className="px-4 py-3 border-l border-slate-700">Vehicle</th>
        <th className="px-4 py-3 border-l border-slate-700">Route</th> 
        <th className="px-4 py-3 border-l border-slate-700">Load Type</th>
        <th className="px-4 py-3 text-center bg-slate-700 text-white">Net Weight</th>
        <th className="px-4 py-3 text-right text-orange-400">Advance</th>
        {/* TOP LEVEL LABELS ONLY */}
        <th className="px-4 py-3 text-center text-red-300">L / U</th>
        <th className="px-4 py-3 text-center text-red-400">Web / Exp</th>
        <th className="px-4 py-3 text-right text-green-400">Dr Pay</th>
        <th className="px-4 py-3 text-right text-red-400">Total Exp</th>
        <th className="px-4 py-3 text-right text-white bg-blue-900">Net Added</th>
    </tr>
</thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-medium">
    {loading ? (
        <tr><td colSpan={12} className="p-8 text-center text-slate-400">Loading History...</td></tr>
    ) : filteredHistory.length === 0 ? (
        <tr><td colSpan={12} className="p-8 text-center text-slate-400">No active trips found.</td></tr>
    ) : filteredHistory.map((h, index) => {
        const isSelected = selectedTripIds.has(h.id);
        const netAddedValue = h.netAmount; 

        return (
            <tr 
                key={`${h.id}-${index}`} 
                onClick={() => !submitting && handleToggleRow(h.id)} 
                className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'}`}
            >
                <td className="px-4 py-3 font-bold text-slate-700">{h.date}</td>
                <td className="px-4 py-3 font-bold text-blue-600">{h.vehicle_reg || h.regNumber || "N/A"}</td>
                <td className="px-4 py-3 text-slate-600">➔ {h.to || "N/A"}</td>
                <td className="px-4 py-3 font-bold text-slate-800">{h.loadType}</td>
                <td className="px-4 py-3 text-center">
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md font-extrabold">
                        {h.netWeight || h.net_weight || "0"} T
                    </span>
                </td>
                <td className="px-4 py-3 text-right text-orange-600 font-bold">₹{h.advance.toLocaleString('en-IN')}</td>

                {/* DISPLAY L / U WITHOUT SUB-LABELS */}
                <td className="px-4 py-3 text-center bg-slate-50/30">
                    <div className="font-mono text-slate-700">{h.loadingCharge} / {h.unloadingCharge}</div>
                </td>

                {/* DISPLAY WEB / EXP WITHOUT SUB-LABELS */}
                <td className="px-4 py-3 text-center bg-red-50/10">
                    <div className="font-mono text-slate-700">
                        {h.weighbridgeCharge} / <span className="text-red-500 font-bold">{h.extraExpense}</span>
                    </div>
                </td>

                <td className="px-4 py-3 text-right text-green-600 font-bold">₹{h.driverTripPay.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-right text-red-600 font-bold bg-red-50/30">₹{h.totalExpenses.toLocaleString('en-IN')}</td>
                <td className={`px-4 py-3 text-right font-bold border-l border-slate-100 ${
                    netAddedValue >= 0 ? 'text-emerald-600 bg-emerald-50/10' : 'text-red-600 bg-red-50/10'
                }`}>
                    ₹{netAddedValue.toLocaleString('en-IN')}
                </td>
            </tr>
        );
    })}
</tbody>
        </table>
    </div>
</div>
        </div>
      </div>
    </div>
  );
};

interface InputProps { label: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; uppercase?: boolean; required?: boolean; error?: boolean; }
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  uppercase,
  required,
  error,
}: InputProps) => (
  <div>
    <label
      className={`text-xs font-bold uppercase mb-1 block ${
        error ? "text-red-500" : "text-slate-500"
      }`}
    >
      {label}
    </label>

    <input
      type={type}
      required={required}
      placeholder={placeholder}
      value={value ?? ""}  
      onChange={onChange}
      className={`w-full border p-2.5 rounded-lg text-sm outline-none transition-all ${
        error
          ? "border-red-500 bg-red-50"
          : "border-slate-300 focus:ring-2 focus:ring-blue-500"
      } ${uppercase ? "uppercase" : ""}`}
    />
  </div>
);

const DriverHistoryView = ({ trips, drivers }: any) => {
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const availableMonths = Array.from(
    new Set(trips.filter((t: any) => String(t.billNo) !== "0" && t.date).map((t: any) => t.date.slice(0, 7)))
  ).sort((a: any, b: any) => b.localeCompare(a)) as string[];

  const filteredTrips = trips.filter((t: any) => {
    const matchesDriver = selectedDriver ? t.driverName === selectedDriver : true;
    const isNotPlaceholder = String(t.billNo) !== "0";
    if (!matchesDriver || !isNotPlaceholder) return false;
    if (selectedMonth) return t.date && t.date.startsWith(selectedMonth);
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  });

  // --- EXCEL DOWNLOAD LOGIC ---
  const handleDownloadExcel = () => {
    if (filteredTrips.length === 0) { alert("No data to download"); return; }
    const headers = ["Date", "Bill No", "Vehicle", "Route", "Load Type", "Net Wt", "Advance", "L/U", "Web/Exp", "Dr Pay", "Total Exp", "Net Added"];
    const csvRows = [
      headers.join(','),
      ...filteredTrips.map((t: any) => {
        const totalExp = (Number(t.loadingCharge) || 0) + (Number(t.unloadingCharge) || 0) + (Number(t.weighbridgeCharge) || 0) + (Number(t.expense) || 0) + (Number(t.driverTripPay) || 0);
        const netAdded = (Number(t.driverTripPay) || 0) - ((Number(t.advance) || 0) - ((Number(t.loadingCharge) || 0) + (Number(t.unloadingCharge) || 0) + (Number(t.weighbridgeCharge) || 0) + (Number(t.expense) || 0)));
        return [
          t.date, t.billNo, t.regNumber, `"${t.to}"`, t.loadType, t.netWeight, t.advance,
          `"${t.loadingCharge}/${t.unloadingCharge}"`, `"${t.weighbridgeCharge}/${t.expense}"`,
          t.driverTripPay, totalExp, netAdded
        ].join(',');
      })
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Driver_History_${selectedDriver || 'All'}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Driver History Log</h2>
          <p className="text-xs text-slate-500">Comprehensive trip records filtered by driver</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="text-xs border border-slate-200 p-2 rounded-lg font-bold text-slate-700 outline-none"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">All Drivers</option>
            {drivers.map((d: any) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          {/* Month Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
            <Calendar size={14} className="text-slate-400"/>
            <select
              className="text-xs border-none outline-none text-slate-700 font-medium bg-transparent"
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(e.target.value); setStartDate(''); setEndDate(''); }}
            >
              <option value="">All Months</option>
              {availableMonths.map((m: string) => {
                const [year, month] = m.split('-');
                const label = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                return <option key={m} value={m}>{label}</option>;
              })}
            </select>
            {selectedMonth && (
              <button onClick={() => setSelectedMonth('')} className="ml-1 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={12}/></button>
            )}
          </div>
          {!selectedMonth && <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />}
          
          {/* ACTION BUTTONS */}
          <div className="flex gap-2 border-l pl-3 ml-1">
            <button onClick={handleDownloadExcel} className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 hover:bg-green-100 transition-colors" title="Download Excel">
              <Download size={18}/>
            </button>
            <button onClick={() => printSection('driver-history-table', 'Driver History Report')} className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors" title="Print Screen">
              <Printer size={18}/>
            </button>
          </div>
        </div>
      </div>

      <div id="driver-history-table" className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px] whitespace-nowrap">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Bill No</th>
              <th className="px-4 py-3 border-l border-slate-700">Vehicle</th>
              <th className="px-4 py-3 border-l border-slate-700">Route</th>
              <th className="px-4 py-3 border-l border-slate-700">Load Type</th>
              <th className="px-4 py-3 text-center bg-slate-700 text-white">Net Weight</th>
              <th className="px-4 py-3 text-right text-orange-400">Advance</th>
              <th className="px-4 py-3 text-center text-red-300">L / U</th>
              <th className="px-4 py-3 text-center text-red-400">Web / Exp</th>
              <th className="px-4 py-3 text-right text-green-400">Dr Pay</th>
              <th className="px-4 py-3 text-right text-red-400">Total Exp</th>
              <th className="px-4 py-3 text-right text-white bg-blue-900">Net Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px] font-medium whitespace-nowrap">
            {filteredTrips.map((t: any) => {
              const totalExp = (Number(t.loadingCharge) || 0) + (Number(t.unloadingCharge) || 0) + (Number(t.weighbridgeCharge) || 0) + (Number(t.expense) || 0) + (Number(t.driverTripPay) || 0);
              const netAdded = (Number(t.driverTripPay) || 0) - ((Number(t.advance) || 0) - ((Number(t.loadingCharge) || 0) + (Number(t.unloadingCharge) || 0) + (Number(t.weighbridgeCharge) || 0) + (Number(t.expense) || 0)));
              return (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-700">{t.date}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{t.billNo}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{t.regNumber}</td>
                  <td className="px-4 py-3 text-slate-600">➔ {t.to}</td>
                  <td className="px-4 py-3 font-bold text-slate-800">{t.loadType}</td>
                  <td className="px-4 py-3 text-center"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-extrabold">{t.netWeight} T</span></td>
                  <td className="px-4 py-3 text-right text-orange-600 font-bold">₹{Number(t.advance).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-center bg-slate-50/30">{t.loadingCharge} / {t.unloadingCharge}</td>
                  <td className="px-4 py-3 text-center bg-red-50/10">{t.weighbridgeCharge} / <span className="text-red-500">{t.expense}</span></td>
                  <td className="px-4 py-3 text-right text-green-600 font-bold">₹{Number(t.driverTripPay).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right text-red-600 font-bold bg-red-50/30">₹{totalExp.toLocaleString('en-IN')}</td>
                  <td className={`px-4 py-3 text-right font-bold border-l border-slate-100 ${netAdded >= 0 ? 'text-emerald-600 bg-emerald-50/10' : 'text-red-600 bg-red-50/10'}`}>₹{netAdded.toLocaleString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );        
};

// --- KILOMETER VIEW ---

const KilometerView = ({ vehicles, currentUser }: any) => {
  const [kmRecords, setKmRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    vehicle_reg: '',
    km_entered: '',
  });
  const [formError, setFormError] = useState('');

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('km_records')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('date', { ascending: false });
    if (data) setKmRecords(data);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const getCumulativeTotal = (vehicleReg: string, upToRecordId: number): number => {
    const vehicleRecords = kmRecords
      .filter(r => r.vehicle_reg === vehicleReg)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let total = 0;
    for (const r of vehicleRecords) {
      total += Number(r.km_entered);
      if (r.id === upToRecordId) break;
    }
    return total;
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!form.vehicle_reg) { setFormError('Please select a vehicle.'); return; }
    if (!form.km_entered || isNaN(Number(form.km_entered)) || Number(form.km_entered) <= 0) {
      setFormError('Please enter a valid KM value greater than 0.'); return;
    }
    if (!form.date) { setFormError('Please select a date.'); return; }

    const entryMonth = form.date.slice(0, 7);
    const existing = kmRecords.find(r => r.vehicle_reg === form.vehicle_reg && r.date.startsWith(entryMonth));
    if (existing) {
      setFormError(`A KM entry for ${form.vehicle_reg} already exists for ${new Date(entryMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}. Delete it first to re-enter.`);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('km_records').insert([{
      user_id: currentUser.id,
      date: form.date,
      vehicle_reg: form.vehicle_reg,
      km_entered: Number(form.km_entered),
    }]);
    setSubmitting(false);
    if (error) { setFormError('Error saving: ' + error.message); return; }
    setForm({ date: new Date().toISOString().split('T')[0], vehicle_reg: '', km_entered: '' });
    setShowForm(false);
    fetchRecords();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('km_records').delete().eq('id', id);
    if (!error) { setDeleteId(null); fetchRecords(); }
    else alert('Error deleting: ' + error.message);
  };

  const handleDownloadCSV = (vehicleReg: string) => {
    const records = kmRecords
      .filter(r => r.vehicle_reg === vehicleReg)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (records.length === 0) { alert('No data to download'); return; }
    const headers = ['Date', 'Month', 'KM This Month', 'Total KM'];
    const rows = records.map(r => {
      const month = new Date(r.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      const total = getCumulativeTotal(r.vehicle_reg, r.id);
      return [r.date, month, r.km_entered, total].join(',');
    });
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KM_Records_${vehicleReg}.csv`;
    a.click();
  };

  // Records for the selected vehicle modal (ascending order for history table)
  const selectedVehicleRecords = selectedVehicle
    ? kmRecords
        .filter(r => r.vehicle_reg === selectedVehicle)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Gauge size={20} className="text-indigo-600"/> Kilometer Tracker</h2>
          <p className="text-xs text-slate-500">Click any vehicle card to view monthly KM history</p>
        </div>
        <button onClick={() => { setShowForm(true); setFormError(''); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all">
          <Plus size={16}/> Add KM Entry
        </button>
      </div>

      {/* VEHICLE SUMMARY CARDS */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <RefreshCw size={20} className="animate-spin mr-2"/> Loading...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {vehicles.map((v: any) => {
            const vehicleRecs = kmRecords.filter(r => r.vehicle_reg === v.regNumber);
            const totalKm = vehicleRecs.reduce((s: number, r: any) => s + Number(r.km_entered), 0);
            const lastRecord = vehicleRecs.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            const entryCount = vehicleRecs.length;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v.regNumber)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/30 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Truck size={13} className="text-indigo-400"/>
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide truncate">{v.regNumber}</span>
                  </div>
                  <ChevronRight size={13} className="text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"/>
                </div>
                <div className="text-2xl font-extrabold text-indigo-600 leading-tight">{totalKm.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Total KM</div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  {lastRecord
                    ? <span className="text-[10px] text-slate-500">Last: <span className="font-bold text-slate-600">{lastRecord.date}</span></span>
                    : <span className="text-[10px] text-slate-400 italic">No entries yet</span>
                  }
                  <span className="text-[10px] text-indigo-400 font-bold">{entryCount} {entryCount === 1 ? 'entry' : 'entries'}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* VEHICLE HISTORY MODAL */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Gauge size={18} className="text-indigo-600"/>
                  KM History — <span className="text-indigo-600">{selectedVehicle}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedVehicleRecords.length} {selectedVehicleRecords.length === 1 ? 'entry' : 'entries'} &nbsp;·&nbsp;
                  Total: <span className="font-bold text-emerald-600">
                    {kmRecords.filter(r => r.vehicle_reg === selectedVehicle).reduce((s, r) => s + Number(r.km_entered), 0).toLocaleString('en-IN')} KM
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadCSV(selectedVehicle)}
                  className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 hover:bg-green-100 transition-colors"
                  title="Download CSV"
                >
                  <Download size={16}/>
                </button>
                <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                  <X size={18}/>
                </button>
              </div>
            </div>

            {/* Modal Body — History Table */}
            <div className="overflow-y-auto flex-1">
              {selectedVehicleRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                  <Gauge size={32} className="text-slate-300"/>
                  <div className="font-bold text-sm">No KM records for this vehicle</div>
                  <button
                    onClick={() => { setSelectedVehicle(null); setForm(f => ({ ...f, vehicle_reg: selectedVehicle })); setShowForm(true); setFormError(''); }}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-bold"
                  >
                    <Plus size={13}/> Add first entry
                  </button>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px] whitespace-nowrap sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Month</th>
                      <th className="px-4 py-3 text-right text-yellow-300">KM This Month</th>
                      <th className="px-4 py-3 text-right text-green-300 bg-slate-700">Total KM</th>
                      <th className="px-4 py-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-medium whitespace-nowrap">
                    {selectedVehicleRecords.map(r => {
                      const cumulativeTotal = getCumulativeTotal(r.vehicle_reg, r.id);
                      const monthLabel = new Date(r.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-700">{r.date}</td>
                          <td className="px-4 py-3 text-slate-500">{monthLabel}</td>
                          <td className="px-4 py-3 text-right"><span className="text-yellow-700 font-bold">+{Number(r.km_entered).toLocaleString('en-IN')} km</span></td>
                          <td className="px-4 py-3 text-right bg-slate-50"><span className="text-emerald-700 font-extrabold text-sm">{cumulativeTotal.toLocaleString('en-IN')} km</span></td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => setDeleteId(r.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={14}/></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-300 text-[11px] font-extrabold">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-slate-600 uppercase">Total for {selectedVehicle}</td>
                      <td className="px-4 py-3 text-right text-yellow-700">+{selectedVehicleRecords.reduce((s, r) => s + Number(r.km_entered), 0).toLocaleString('en-IN')} km</td>
                      <td className="px-4 py-3 text-right text-emerald-700 bg-slate-200" colSpan={2}>
                        {kmRecords.filter(r => r.vehicle_reg === selectedVehicle).reduce((s, r) => s + Number(r.km_entered), 0).toLocaleString('en-IN')} km (all time)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex-shrink-0 flex justify-between items-center">
              <button
                onClick={() => { setSelectedVehicle(null); setForm(f => ({ ...f, vehicle_reg: selectedVehicle })); setShowForm(true); setFormError(''); }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all"
              >
                <Plus size={14}/> Add Entry for {selectedVehicle}
              </button>
              <button onClick={() => setSelectedVehicle(null)} className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Gauge size={18} className="text-indigo-600"/> Add KM Entry</h3>
                <p className="text-xs text-slate-400 mt-0.5">One entry per vehicle per month</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              {formError && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg font-medium">{formError}</div>}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Vehicle Number</label>
                <select value={form.vehicle_reg} onChange={e => setForm({ ...form, vehicle_reg: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v: any) => <option key={v.id} value={v.regNumber}>{v.regNumber}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">KM Traveled This Month</label>
                <input type="number" min="1" placeholder="e.g. 1200" value={form.km_entered} onChange={e => setForm({ ...form, km_entered: e.target.value })} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              {form.vehicle_reg && form.km_entered && !isNaN(Number(form.km_entered)) && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs">
                  <span className="text-slate-500">Running total after this entry: </span>
                  <span className="font-extrabold text-indigo-700">
                    {(kmRecords.filter(r => r.vehicle_reg === form.vehicle_reg).reduce((s, r) => s + Number(r.km_entered), 0) + Number(form.km_entered)).toLocaleString('en-IN')} KM
                  </span>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-bold px-5 py-2 rounded-lg shadow transition-all">
                {submitting ? <RefreshCw size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>} Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
            <h3 className="font-bold text-slate-800 mb-2">Delete Entry?</h3>
            <p className="text-sm text-slate-500 mb-5">This will permanently remove this KM record and affect cumulative totals for this vehicle.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow transition-all">
                <Trash2 size={14}/> Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const ActionButton = ({ icon, label, color, onClick }: any) => <button onClick={onClick} className="flex flex-col items-center justify-center py-3 hover:bg-white active:bg-slate-100 transition-colors group"><div className={`${color} mb-1 transition-transform group-hover:scale-110`}>{icon}</div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-700">{label}</span></button>;
const SidebarItem = ({ icon, label, active, onClick }: any) => <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{icon} {label}</button>;
const MobileNavItem = ({ icon, label, active, onClick }: any) => <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}><div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div><span className="text-[10px] font-bold">{label}</span></button>;
