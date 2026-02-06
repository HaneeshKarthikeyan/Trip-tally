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
  Package, Square, CheckCircle2, Menu 
} from 'lucide-react';

// --- 1. CONFIGURATION ---

const CONTRACTOR_LOADS: Record<string, string[]> = {
  "Null":["Null"],
  "KSP": ["Maize", "Rape Seed", "Soya", "Fertilizer"],
  "TKS": ["Fertilizer"],
  "SBT": ["Rice", "Wheat", "Fertilizer"],
  "MP SAMY": ["Rape Seed"],
  "SS":["Maize"],
  "KGS":["Sugar"],
};

const DESTINATION_RATES = [
  { name: "Null", rate: 0 },{ name: "RGS", rate: 295 },
  { name: "Perundurai-41", rate: 295 },{ name: "Perundurai-42", rate: 295 },{ name: "Perundurai-43", rate: 295 },{ name: "Perundurai-KK8", rate: 295 }
  ,{ name: "SKM", rate: 200 },{ name: "KK Nagar", rate: 0 },{ name: "Thirumagal", rate: 0 },{ name: "SVM", rate: 0 },{ name: "SK Samy", rate: 0 },{ name: "Moolapalayam", rate: 90 },{ name: "Perundurai", rate: 295 },{ name: "Athani", rate: 430 }, { name: "Anthiyur", rate: 430 }, { name: "Ammapettai", rate: 445 },
  { name: "Arachalur", rate: 370 }, { name: "Alangiyam", rate: 600 }, { name: "Alukuli", rate: 460 },
  { name: "Avinashi", rate: 550 }, { name: "Hanumanpalli", rate: 350 }, { name: "Appakudal", rate: 410 },
  { name: "Anaimalai", rate: 700 }, { name: "Irayamangalam", rate: 365 }, { name: "Udumalpet", rate: 650 },
  { name: "Uthukuli (Tiruppur)", rate: 445 }, { name: "Edappadi", rate: 490 }, { name: "Ettikuttai", rate: 440 },
  { name: "Erangattur", rate: 540 }, { name: "Erisanampatti", rate: 680 }, { name: "Elathur Chettipalayam", rate: 510 },
  { name: "Ellakadai", rate: 400 }, { name: "Elumathur", rate: 390 }, { name: "Ayyansalai", rate: 540 },
  { name: "Odapalli", rate: 350 }, { name: "Oddanchatram", rate: 600 }, { name: "Gangapuram", rate: 260 },
  { name: "Ganapathipalayam", rate: 360 }, { name: "Kaniyur", rate: 620 }, { name: "Kandasamypalayam", rate: 420 },
  { name: "Kapilarmalai", rate: 450 }, { name: "Karumandampalayam", rate: 390 }, { name: "Karur", rate: 510 },
  { name: "Kavindapadi", rate: 365 }, { name: "Kallipatti", rate: 465 }, { name: "Kanakapuram", rate: 320 },
  { name: "Kangeyam", rate: 470 }, { name: "Kasipalayam (Gobi)", rate: 460 }, { name: "Kasiyur", rate: 460 },
  { name: "Kanjikoil", rate: 360 }, { name: "Karamadai", rate: 650 }, { name: "Kalingarayanpalayam", rate: 340 },
  { name: "Keelvani", rate: 430 }, { name: "Gudimangalam", rate: 600 }, { name: "Kuttamuniyappan Kovil", rate: 420 },
  { name: "Kundadam", rate: 550 }, { name: "Gunduchettipalayam", rate: 380 }, { name: "Kumaralingam", rate: 670 },
  { name: "Kumarapalayam", rate: 370 }, { name: "Kurumandur", rate: 480 }, { name: "Guruvareddiyur", rate: 480 },
  { name: "Kunnathur", rate: 435 }, { name: "Getticheviyur", rate: 420 }, { name: "Kemmanaickenpalayam", rate: 540 },
  { name: "Kesarimangalam", rate: 390 }, { name: "Kokkarayanpettai", rate: 360 }, { name: "Konganapuram", rate: 500 },
  { name: "Kodumudi", rate: 445 }, { name: "Koduvai", rate: 550 }, { name: "Kolumam", rate: 680 },
  { name: "Kolathur", rate: 560 }, { name: "Kolappalur", rate: 430 }, { name: "Kottur", rate: 670 },
  { name: "Gobi", rate: 430 }, { name: "Kovai (Coimbatore)", rate: 650 }, { name: "Koneripatti", rate: 450 },
  { name: "Koneripatti Pirivu", rate: 430 }, { name: "Sankagiri", rate: 390 }, { name: "Sathyamangalam", rate: 510 },
  { name: "Chathiram", rate: 590 }, { name: "Chandrapuram", rate: 590 }, { name: "Sanisanthai", rate: 510 },
  { name: "Salaipudur", rate: 445 }, { name: "Singampettai", rate: 440 }, { name: "Chithar", rate: 430 },
  { name: "Chithalandur", rate: 450 }, { name: "Chithode", rate: 315 }, { name: "SIPCOT", rate: 385 },
  { name: "Sivagiri", rate: 410 }, { name: "Sirumugai", rate: 650 }, { name: "Chinnapuliyur", rate: 360 },
  { name: "Chinna Valavadi", rate: 660 }, { name: "Chinniyampalayam", rate: 340 }, { name: "Sulur", rate: 650 },
  { name: "Chengapalli", rate: 450 }, { name: "Senjerimalai", rate: 600 }, { name: "Selakkaraisal", rate: 600 },
  { name: "Chennampatti", rate: 510 }, { name: "Chennimalai", rate: 400 }, { name: "Salem", rate: 470 },
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
  { name: "Jedarpalayam", rate: 430 }, { name: "D.G Pudur", rate: 510 }, { name: "5. Periyapalayam", rate: 490 },
  { name: "T.N Palayam", rate: 500 }
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
}

interface TripRecord {
  id: number;
  regNumber: string;
  date: string;
  billNo: string;
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

const printSection = (elementId: string, title: string) => {
  const content = document.getElementById(elementId)?.innerHTML;
  if (!content) return;

  const printWindow = window.open('', '', 'width=1200,height=800');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            
            @media print {
              @page { size: landscape; margin: 8mm; }
              body { 
                font-family: 'Inter', sans-serif;
                background: white !important; 
                padding: 0; 
                margin: 0; 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }
              .no-print { display: none !important; }
              
              /* Ensure the grid of summary cards prints side-by-side */
              .grid { display: grid !important; grid-template-columns: repeat(5, 1fr) !important; gap: 10px !important; margin-bottom: 20px !important; }
              
              /* Table styling for high density data */
              table { width: 100% !important; border-collapse: collapse !important; table-layout: auto !important; }
              th, td { border: 1px solid #e2e8f0 !important; padding: 4px 6px !important; font-size: 9px !important; line-height: 1.2 !important; }
              th { background-color: #1e293b !important; color: white !important; -webkit-print-color-adjust: exact; }
              
              /* Force specific background colors to show */
              .bg-blue-900 { background-color: #1e3a8a !important; color: white !important; }
              .bg-slate-800 { background-color: #1e293b !important; color: white !important; }
              .bg-slate-700 { background-color: #334155 !important; color: white !important; }
              .text-green-600 { color: #16a34a !important; font-weight: bold !important; }
              .text-red-600 { color: #dc2626 !important; font-weight: bold !important; }
              .bg-blue-50 { background-color: #eff6ff !important; }
            }
          </style>
        </head>
        <body class="p-4">
          <div class="flex justify-between items-center mb-4 border-b-2 border-slate-200 pb-4">
            <div>
              <h1 class="text-xl font-extrabold text-slate-800">${title}</h1>
              <p class="text-[10px] text-slate-500 uppercase font-bold">Trip Tally Management System • ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-black text-blue-600">TRIP TALLY</p>
            </div>
          </div>
          ${content}
          <div class="mt-4 pt-4 border-t border-slate-100 text-center">
            <p class="text-[8px] text-slate-400 italic">This is a computer generated statement. For any discrepancies, please contact the depot office.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    // 1 second delay allows Tailwind to finish processing before the print dialog opens
    setTimeout(() => { 
      printWindow.print(); 
      printWindow.close(); 
    }, 1000);
  }
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
            <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">{loading ? <RefreshCw className="animate-spin" size={18}/> : (isLogin ? 'Login to Dashboard' : 'Sign Up')}</button>
          </form>
          <div className="mt-6 text-center text-sm"><span className="text-slate-500">{isLogin ? "Don't have an account?" : "Already have an account?"}</span><button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold ml-1 hover:underline">{isLogin ? 'Sign Up' : 'Login'}</button></div>
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
          creditedAmount: t.credited_amount // NEW FIELD
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
        checkDate(v.vehicleDetails.greenTax, 'Green Tax');
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
                       (Number(tripToDelete.weighbridgeCharge) || 0);
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
        currentUser // Pass user down for inserts
    };

    switch(currentView) {
      case "dashboard": return <DashboardView {...props} />;
      case "trips": return <TripsView {...props} />;
      case "drivers": return <DriversView {...props} />;
      case "finance": return <FinanceView {...props} />;
      case "history": return <HistoryView {...props} />;
      case "fuel": return <FuelView {...props} />; 
      case "credited": return <AmountCreditedView {...props} />;
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
          <h1 className="text-2xl font-bold flex items-center gap-2"><Truck className="text-blue-500" /> <span className="tracking-tight">Trip Tally</span></h1>
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
          <SidebarItem icon={<History/>} label="History" active={currentView === "history"} onClick={() => { setFilterReg(null); setCurrentView("history"); }} />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold w-full p-2 rounded hover:bg-slate-800 transition-colors"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 relative">
          <div className="md:hidden font-bold text-lg flex items-center gap-2"><Truck className="text-blue-600"/> Trip Tally</div>
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
        notifications.map(n => (
          <div key={n.id} className={`mb-2 p-3 rounded-lg border-l-4 ${n.severity === 'critical' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'}`}>
            <div className="flex justify-between items-start">
              <span className="font-bold text-sm text-slate-800">{n.type}</span>
              {/* EDIT button was removed from here */}
            </div>
            <div className="text-xs text-slate-600 mt-1">Lorry: <strong>{n.vehicle}</strong></div>
            <div className={`text-xs mt-1 font-medium ${n.severity === 'critical' ? 'text-red-600' : 'text-orange-600'}`}>
              {n.daysLeft < 0 ? `Expired ${Math.abs(n.daysLeft)} days ago` : `Expires in ${n.daysLeft} days`}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4">
          {renderView()}
        </main>

{/* --- MOBILE "MORE" MENU POPUP --- */}
        {showMobileMenu && (
          <div className="md:hidden fixed bottom-20 right-4 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 animate-in slide-in-from-bottom-5 flex flex-col gap-1 w-48">
             <button onClick={() => { setCurrentView("drivers"); setShowMobileMenu(false); }} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700 w-full text-left">
                <Users size={18} className="text-blue-600"/> Drivers
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

const DashboardView = ({ vehicles, setVehicles, drivers, setDrivers, transactions, setTransactions, trips, setTrips, setCurrentView, handleFilterSelect, setHistoryLogs, currentUser }: any) => {
  const [activeModal, setActiveModal] = useState<{ type: string; data: any; vehicleId?: number } | null>(null);
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
  loadingCharge: '500',           // ✅ PRE-FILLED DEFAULT
  unloadingCharge: '0',
  driverTripPay: 0, 
  dieselPrice: '0', 
  dieselLiters: '0', 
  weighbridgeCharge: '130', 
  from: '',
  expense: '0',
  commissionType: 'percentage' as 'percentage' | 'fixed', 
  commissionValue: '15',
  advance: '0'
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
        loadingCharge: vehicle.currentTrip.loadingCharge || '500', 
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
      unloading = weight > 0 ? Math.round((weight * 45) + 30).toString() : "0";
      
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
    updatedForm.unloadingCharge = Math.round((weight * 45) + 30).toString();
  }
}


  // --- AUTO-CALCULATE RGS UNLOADING WHEN WEIGHT CHANGES ---
  if (field === 'netWeight' && updatedForm.to === 'RGS') {
    const weight = Number(value) || 0;
    updatedForm.unloadingCharge = Math.round((45 * weight) + 30).toString();
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
      updatedForm.loadingCharge = '500';
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
        final_pay: finalPay, // This uses the new formula
        commission_type: tripForm.commissionType, 
        commission_value: tripForm.commissionValue,
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
      <div className="space-y-4">{vehicles.map((vehicle: Vehicle) => (<VehicleCard key={vehicle.id} data={vehicle} onAction={(type) => openActionModal(type, vehicle)} onFilter={handleFilterSelect} />))}</div>
      
      {activeModal?.type === 'details' && <DetailsModal data={activeModal.data} onClose={() => setActiveModal(null)} />}
      
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
              
              <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className={`text-xs font-bold uppercase mb-1 block ${errors.includes('driverName') ? 'text-red-500' : 'text-slate-500'}`}>Driver Name *</label>
                  <div className="relative">
                      <input list="driverOptions" className={`w-full border p-2.5 rounded-lg text-sm outline-none transition-all ${errors.includes('driverName') ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`} value={tripForm.driverName} onChange={(e) => handleInputChange('driverName', e.target.value)} placeholder="Type or Select..." required />
                      <datalist id="driverOptions">{drivers.map((d: Driver) => <option key={d.id} value={d.name} />)}</datalist>
                  </div>
               </div>
               <Input label="Advance (Driver) *" type="number" value={tripForm.advance} onChange={(e) => handleInputChange('advance', e.target.value)} error={errors.includes('advance')} />
              </div>
              
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

              <div className="grid grid-cols-2 gap-3">
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
               <Input label="Cost Per Ton (₹)" type="number" value={tripForm.rate} onChange={(e) => handleInputChange('rate', e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <Input 
  label="Extra Expense (₹)" 
  type="number" 
  value={tripForm.expense} 
  onChange={(e) => handleInputChange('expense', e.target.value)} 
  placeholder="0"
/>

                 <Input label="Net Weight *" type="number" value={tripForm.netWeight} onChange={(e) => handleInputChange('netWeight', e.target.value)} required error={errors.includes('netWeight')} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <Input label="Weighbridge Charge *" type="number" value={tripForm.weighbridgeCharge} onChange={(e) => handleInputChange('weighbridgeCharge', e.target.value)} error={errors.includes('weighbridgeCharge')} />
                 <div></div>
              </div>

             
              
              {/* --- LABOUR CHARGES SECTION --- */}
{/* --- LABOUR CHARGES SECTION --- */}
{/* --- LABOUR CHARGES --- */}
{/* --- LABOUR CHARGES SECTION --- */}
<h4 className="font-bold text-xs text-blue-600 uppercase mt-2">Labour Charges</h4>
<div className="grid grid-cols-2 gap-3 bg-slate-50 p-2 rounded border border-slate-100">
  <Input 
    label="Loading Charge *" 
    type="number" 
    value={tripForm.loadingCharge} 
    onChange={(e) => handleInputChange('loadingCharge', e.target.value)} 
  />
  <Input 
    label="Unloading Charge *" 
    type="number" 
    value={tripForm.unloadingCharge} 
    onChange={(e) => handleInputChange('unloadingCharge', e.target.value)} 
  />
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
                    <span className="text-lg font-bold text-green-600">₹ {tripForm.driverTripPay.toLocaleString()}</span>
                 </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center"><div className="flex items-center gap-2 text-blue-800"><Calculator size={16}/> <span className="text-xs font-bold uppercase">Total Rent (Auto)</span></div><span className="text-lg font-bold text-slate-900">₹ {tripForm.tripTotal.toLocaleString()}</span></div>
              <button disabled={isSubmitting} type="submit" className={`w-full text-white py-3 rounded-lg font-bold mt-2 ${isSubmitting ? 'bg-slate-400' : (editingTripId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700')}`}>{isSubmitting ? 'Saving...' : (editingTripId ? 'Update Edited Details' : 'Save Trip & Update Rent')}</button>
          </form>
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
            {Object.keys(CONTRACTOR_LOADS).map((contractor) => (
                <div key={contractor} onClick={() => setSelectedContractor(contractor)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 cursor-pointer transition-all hover:shadow-md group">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Building2 size={20}/></div>
                    <h3 className="font-bold text-lg text-slate-800">{contractor}</h3>
                    <p className="text-xs text-slate-500 mt-1">View Loads</p>
                </div>
            ))}
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
                        const count = contractorTrips.filter((t:any) => t.loadType === load).length;
                        return (
                            <div key={load} onClick={() => setSelectedLoadType(load)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md group">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Package size={20}/></div>
                                <h3 className="font-bold text-lg text-slate-800">{load}</h3>
                                <p className={`text-xs mt-1 ${count > 0 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{count} Trips Records</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <button onClick={() => setSelectedContractor(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">Contractors</button>
            <span className="text-slate-300">/</span>
            <button onClick={() => setSelectedLoadType(null)} className="text-sm font-bold text-slate-400 hover:text-slate-600">{selectedContractor}</button>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-blue-600">{selectedLoadType}</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between">
             <h3 className="font-bold text-slate-700">Trips: {selectedContractor} - {selectedLoadType}</h3>
             <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{finalTrips.length} Records</span>
          </div>
          <table className="w-full text-sm text-left whitespace-nowrap">
             <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                <tr>
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
                   <th className="px-4 py-3 text-center">Action</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {finalTrips.length === 0 ? (
                   <tr><td colSpan={11} className="p-6 text-center text-slate-400">No trips recorded for {selectedLoadType}.</td></tr>
                ) : (
                   finalTrips.map((trip: TripRecord) => (
                      <tr key={trip.id} className={`transition-all duration-500 ${trip.contractorPaidDate ? "bg-green-50/50 text-slate-400" : "bg-white"}`}>
                          <td className="px-4 py-3 text-slate-600">{trip.date}</td>
                          <td className="px-4 py-3 font-mono font-bold">{trip.billNo}</td>
                          <td className="px-4 py-3 text-blue-600 font-bold">{trip.regNumber}</td>
                          <td className="px-4 py-3 text-xs">{trip.from} ➔ {trip.to}</td>
                          <td className="px-4 py-3 font-bold">{trip.netWeight}</td>
                          <td className="px-4 py-3">₹{trip.rate}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">₹ {trip.tripTotal.toLocaleString()}</td>
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
};

const FuelView = ({ trips, filterReg, setFilterReg, setTrips }: any) => {
  
  // 1. FILTER: Exclude Bill No "0" globally for this page
  const visibleTrips = trips.filter((t: any) => String(t.billNo) !== "0");

  // 2. SORTING
  const unpaidTrips = visibleTrips.filter((t: any) => !t.fuelPaidDate).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const paidTrips = visibleTrips.filter((t: any) => t.fuelPaidDate).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const sortedTrips = [...unpaidTrips, ...paidTrips];

  // 3. DATE UPDATE FUNCTION
  const handleUpdateFuelDate = async (tripId: number, date: string) => {
    const val = date || null;
    const { error } = await supabase.from('trips').update({ fuel_paid_date: val }).eq('id', tripId);
    if(error) {
        alert("Error saving date: " + error.message);
    } else {
        if(setTrips) {
            setTrips((prev: any) => prev.map((t: any) => 
                t.id === tripId ? { ...t, fuelPaidDate: val } : t
            ));
        }
    }
  };

  // 4. CALCULATIONS
  const totalFuelCost = visibleTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselPrice) || 0), 0);
  const totalLiters = visibleTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselLiters) || 0), 0);
  const remainingPayment = unpaidTrips.reduce((acc: number, t: any) => acc + (Number(t.dieselPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Fuel Logs & Payment Tracker</h2>
        {filterReg && <button onClick={() => setFilterReg(null)} className="text-xs bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-slate-700">Clear Filter: {filterReg}</button>}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-2xl">
         <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
            <div className="text-orange-600 font-bold text-xs uppercase mb-1">Total Fuel Cost</div>
            <div className="text-2xl font-bold text-slate-800">₹ {totalFuelCost.toLocaleString()}</div>
         </div>
         <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="text-blue-600 font-bold text-xs uppercase mb-1">Total Liters</div>
            <div className="text-2xl font-bold text-slate-800">{totalLiters.toLocaleString()} L</div>
         </div>
         <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
            <div className="text-red-600 font-bold text-xs uppercase mb-1">Pending Payment</div>
            <div className="text-2xl font-bold text-slate-800">₹ {remainingPayment.toLocaleString()}</div>
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
                <th className="px-6 py-4 text-right">Km</th>
                <th className="px-6 py-4 text-right">Liters</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4">Paid On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTrips.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-slate-400">No fuel records found.</td></tr>
              ) : (
                sortedTrips.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700">{trip.date}</td>
                    <td className="px-6 py-4 font-bold text-blue-600">{trip.regNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{trip.from} ➔ {trip.to}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">{trip.expense
 || '-'}</td>
                    <td className="px-6 py-4 text-right font-mono">{trip.dieselLiters || '-'} L</td>
                    <td className="px-6 py-4 text-right font-bold text-orange-600">₹ {Number(trip.dieselPrice).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="date" 
                        className={`border p-1 rounded text-xs outline-none ${trip.fuelPaidDate ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-red-50 border-red-200 text-red-700 font-bold'}`}
                        defaultValue={trip.fuelPaidDate}
                        onBlur={(e) => handleUpdateFuelDate(trip.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TripsView = ({ trips, handleFilterSelect, handleDeleteTrip }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTrips = trips.filter((t: any) => {
    if (String(t.billNo) === "0") return false;
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Trip History & Earnings</h2>
        <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs whitespace-nowrap">
  <tr>
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
    <tr><td colSpan={20} className="p-6 text-center text-slate-400">No trips recorded for this period.</td></tr>
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
      
      return (
        <tr key={`${trip.id}-${index}`} className="hover:bg-slate-50">
          <td className="px-4 py-3">{trip.date}</td>
          <td className="px-4 py-3 font-mono">{trip.billNo}</td>
          <td className="px-4 py-3 font-bold border-l border-r border-slate-100 bg-slate-50/30 cursor-pointer text-blue-600 hover:underline" onClick={() => handleFilterSelect && handleFilterSelect(trip.regNumber, 'trips')}>{trip.regNumber}</td>
          <td className="px-4 py-3">{trip.driverName}</td>
          <td className="px-4 py-3">{trip.from} ➔ {trip.to}</td>
          <td className="px-4 py-3">{trip.contractor}</td>
          <td className="px-4 py-3">{trip.loadType}</td>
          <td className="px-4 py-3">{trip.netWeight}</td>
          <td className="px-4 py-3">₹{trip.rate}</td>
          <td className="px-4 py-3 font-bold text-blue-700 bg-blue-50/50">₹{(trip.tripTotal || 0).toLocaleString()}</td>
          <td className="px-4 py-3 text-blue-600 font-medium">₹{trip.advance}</td>
          <td className="px-4 py-3 bg-indigo-50/30 font-mono">₹{Number(trip.expense || 0).toLocaleString()}</td>
          <td className="px-4 py-3 text-red-500">{trip.loadingCharge} / {trip.unloadingCharge}</td>
          <td className="px-4 py-3 bg-orange-50/30">{trip.dieselLiters} L</td>
          <td className="px-4 py-3 bg-orange-50/30">₹{trip.dieselPrice}</td>
          <td className="px-4 py-3">₹{trip.weighbridgeCharge}</td>
          <td className="px-4 py-3 text-green-600">₹{(trip.driverTripPay || 0).toLocaleString()}</td>
          <td className="px-4 py-3 font-bold text-red-700 bg-red-50/50">₹{totalExpense.toLocaleString()}</td>
          <td className={`px-4 py-3 font-bold bg-slate-50/50 text-right ${profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{profit.toLocaleString()}</td>
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

const DriversView = ({ drivers, setDrivers, trips, setTrips, currentUser }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [newDriver, setNewDriver] = useState({ name: "", phone: "", license: "", walletBalance: 0 });

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
                <th className="px-6 py-4 text-right">Net Added Amount</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {drivers.map((driver: Driver) => {
                const netAdded = -driver.walletBalance; 
                return (
                  <tr key={driver.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                    <td className="px-6 py-4"><div className="font-bold text-slate-800">{driver.name}</div></td>
                    <td className="px-6 py-4 text-slate-600">{driver.phone}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono uppercase">{driver.license}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`py-1 px-3 rounded-full font-bold text-xs ${netAdded >= 0 ? 'bg-blue-50 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        ₹ {netAdded.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center items-center gap-4">
                      {driver.walletBalance > 0 && (<button onClick={(e) => handleSettleDriver(driver.id, driver.name, driver.walletBalance, e)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm z-10"><RefreshCw size={12} /> Settle</button>)}
                      <ChevronRight size={16} className="text-slate-400" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedDriver && <DriverDetailsModal driver={selectedDriver} setDrivers={setDrivers} onClose={() => setSelectedDriver(null)} currentUser={currentUser} />}
      {isAdding && (<ModalWrapper title="Register Driver" onClose={() => setIsAdding(false)}><form onSubmit={handleAddDriver} className="space-y-4"><Input label="Name" value={newDriver.name} onChange={(e) => setNewDriver({...newDriver, name: e.target.value})} required /><Input label="Phone" value={newDriver.phone} onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})} required /><Input label="License" value={newDriver.license} onChange={(e) => setNewDriver({...newDriver, license: e.target.value})} uppercase required /><button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Save Driver to Database</button></form></ModalWrapper>)}
    </div>
  );
};

const FinanceView = ({ transactions, drivers, trips, handleDeleteTrip }: any) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 1. FILTERING
  const filteredTrips = trips.filter((t: any) => {
    if (String(t.billNo) === "0") return false;
    if (!startDate && !endDate) return true;
    const tripDate = new Date(t.date);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return tripDate >= start && tripDate <= end;
  });

  // 2. CALCULATIONS (Rounded)
  const totalRentRevenue = Math.round(filteredTrips.reduce((acc: number, trip: TripRecord) => acc + (Number(trip.tripTotal) || 0), 0));
  const totalFuelLiters = Math.round(filteredTrips.reduce((acc: number, trip: TripRecord) => acc + (Number(trip.dieselLiters) || 0), 0));
    
const totalExpenses = Math.round(
  filteredTrips.reduce((acc: number, trip: TripRecord) => {
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
    
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <div>
             <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2"><Wallet className="text-blue-600"/> Financial Overview</h2>
             <p className="text-xs text-slate-500 font-medium">Track Earnings, Expenses & Downloads</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <DateFilter startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <button onClick={handleDownloadExcel} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"><Download size={16}/> Excel</button>
            <button onClick={() => printSection('finance-print-area', 'Financial Report')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"><Printer size={16}/> Print</button>
          </div>
      </div>

      <div id="finance-print-area" className="flex-1 overflow-y-auto space-y-6 pr-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-xl shadow-lg text-white">
             <div className="flex items-center gap-2 opacity-80 font-bold text-[10px] uppercase tracking-wider mb-1"><Briefcase size={14}/> Revenue</div>
             <div className="text-xl font-extrabold tracking-tight">₹ {totalRentRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
             <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-wider mb-1"><Droplet size={14}/> Total Fuel</div>
             <div className="text-xl font-extrabold text-slate-800">{totalFuelLiters.toLocaleString()} L</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-red-600 font-bold text-[10px] uppercase tracking-wider mb-1"><Receipt size={14}/> Total Expense</div>
            <div className="text-xl font-extrabold text-slate-800">₹ {totalExpenses.toLocaleString()}</div>
            <div className="text-[9px] text-slate-400 mt-1 font-medium leading-tight">Load+Unload+Fuel+Weight+DrPay</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 opacity-80 font-bold text-[10px] uppercase tracking-wider mb-1"><TrendingUp size={14}/> Net Profit</div>
            <div className="text-xl font-extrabold tracking-tight">₹ {totalProfit.toLocaleString()}</div>
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
            ₹{tripTotal.toLocaleString()}
          </td>
          
          <td className="px-3 py-2 border-r border-slate-50 text-right text-orange-600 font-semibold">₹{trip.advance}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-slate-600">₹{trip.weighbridgeCharge}</td>
          
          {/* Expense Section Reordered */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-500 font-bold">₹{Number(trip.loadingCharge || 0).toLocaleString()}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-500 font-bold">₹{Number(trip.unloadingCharge || 0).toLocaleString()}</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-600 font-bold bg-red-50/50">₹{Number(trip.expense || 0).toLocaleString()}</td>

          {/* Use defined drPay */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-green-600 font-bold bg-green-50/30">
            ₹{drPay.toLocaleString()}
          </td>
          
          <td className="px-3 py-2 border-r border-slate-50 text-right text-slate-600">{trip.dieselLiters} L</td>
          <td className="px-3 py-2 border-r border-slate-50 text-right text-orange-600">₹{trip.dieselPrice}</td>
          
          {/* Use defined tripExpense */}
          <td className="px-3 py-2 border-r border-slate-50 text-right text-red-600 font-bold bg-red-50/30">
            ₹{tripExpense.toLocaleString()}
          </td>
          
          {/* Use defined tripProfit */}
          <td className={`px-3 py-2 text-right font-extrabold ${tripProfit >= 0 ? 'text-emerald-600 bg-emerald-50/50' : 'text-red-600 bg-red-50/50'}`}>
            ₹{tripProfit.toLocaleString()}
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
                         <div className="text-green-600 font-bold text-lg">₹ {log.totalExpense.toLocaleString()}</div>
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
                                   ₹ {advance.toLocaleString()}
                                 </td>
                                 <td className="px-5 py-4 text-red-600">
                                   <div className="font-bold">₹ {totalTripExpenses.toLocaleString()}</div>
                                   <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                     L:{loadChg} / U:{unloadChg} / W:{weightChg}
                                   </div>
                                 </td>
                                 <td className="px-5 py-4 text-slate-600 font-medium">
                                   ₹ {tripRent.toLocaleString()}
                                 </td>
                                 <td className="px-5 py-4 text-green-700 font-bold">
                                   ₹ {drPay.toLocaleString()}
                                 </td>
                                 <td className="px-5 py-4 bg-blue-50 border-l border-blue-100 text-blue-700 font-extrabold text-right">
                                   ₹ {finalPay.toLocaleString()}
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

const VehicleCard = ({ data, onAction, onFilter }: { data: Vehicle, onAction: (type: string) => void, onFilter: (reg: string, view: string) => void }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onAction('trip')}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl border bg-slate-50 border-slate-100 text-slate-500"><Truck size={24} /></div>
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
  const [editForm, setEditForm] = useState(data.vehicleDetails);

  const handleUpdate = async () => {
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
  };

  const renderField = (label: string, key: string, type = "text") => (
    <div>
      <span className="text-slate-500 font-semibold block text-[10px] uppercase">{label}</span>
      {isEditing ? (
        <input 
          type={type} 
          className="w-full border rounded p-1 text-sm bg-white" 
          value={editForm[key] || ''} 
          onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} 
        />
      ) : (
        <span className="text-slate-800 font-medium">{editForm[key] || 'N/A'}</span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-5 border-b bg-slate-50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">{data.regNumber}</h3>
            <p className="text-xs text-slate-500">Technical & Compliance Records</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-blue-100 text-blue-700'}`}
            >
              {isEditing ? 'SAVE CHANGES' : 'EDIT DETAILS'}
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"><X size={20}/></button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* IDENTIFICATION */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            {renderField("Model", "model")}
            {renderField("Engine Number", "engineNo")}
            {renderField("Chassis Number", "chassisNo")}
            {renderField("Registering Authority", "registeringAuthority")}
          </div>

          {/* COMPLIANCE */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Validity Dates</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {renderField("Insurance Valid", "insuranceValidUpto", "date")}
              {renderField("Fitness (FC)", "fitnessValidUpto", "date")}
              {renderField("Road Tax", "roadTaxValidUpto", "date")}
              {renderField("Green Tax", "greenTaxValidUpto", "date")}
              {renderField("PUCC Valid", "puccValidUpto", "date")}
              {renderField("Permit Valid", "permitValidUpto", "date")}
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
             <h4 className="text-xs font-bold text-blue-700 uppercase mb-3">Insurance & National Permit</h4>
             <div className="grid grid-cols-2 gap-4">
               {renderField("Insurance Co.", "insuranceCompany")}
               {renderField("Policy No.", "insurancePolicyNo")}
               {renderField("NP Number", "nationalPermitNo")}
               {renderField("NP Valid Upto", "nationalPermitValidUpto", "date")}
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
                          ₹{calculatedNetAdded.toLocaleString()}
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
        <div className="text-xl font-bold text-orange-600">₹ {totalAdvance.toLocaleString()}</div>
    </div>

    {/* 2. L/U/W Sum */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">L/U/W Sum</div>
        <div className="text-xl font-bold text-red-600">₹ {(totalLoadingCharge + totalUnloadingCharge + totalWeighbridgeCharge).toLocaleString()}</div>
    </div>

    {/* 3. Extra Exp */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">Extra Exp</div>
        <div className="text-xl font-bold text-red-600">₹ {totalExtraExpense.toLocaleString()}</div>
    </div>

    {/* 4. Gross Pay */}
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="text-xs font-bold text-slate-400 uppercase">Gross Pay</div>
        <div className="text-xl font-bold text-slate-800">₹ {totalGrossPay.toLocaleString()}</div>
    </div>

    {/* 5. Net Added (Result of New Formula) */}
    {/* 5. Net Added (Result of New Formula) */}
<div className="bg-white p-4 rounded-xl border-l-4 border-l-indigo-600 shadow-md">
    <div className="text-xs font-bold text-slate-400 uppercase">Net Added</div>
    <div className={`text-2xl font-bold ${selectedTripsSum >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
      ₹ {selectedTripsSum.toLocaleString()}
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
                    <th className="px-4 py-3">Route</th> 
                    <th className="px-4 py-3">Load Type</th>
                    {/* Displaying Entered Net Weight */}
                    <th className="px-4 py-3 text-center bg-slate-700 text-white">Net Weight</th>
                    <th className="px-4 py-3 text-right text-orange-400">Advance</th>
                    {/* Dedicated Weighbridge Column */}
                    <th className="px-4 py-3 text-right text-red-300">Weighbridge</th>
                    <th className="px-4 py-3 text-center">L / U / E</th>
                    <th className="px-4 py-3 text-right text-green-400">Dr Pay</th>
                    <th className="px-4 py-3 text-right text-red-400">Total Exp</th>
                    <th className="px-4 py-3 text-right text-white bg-blue-900">Net Added</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] font-medium">
                {loading ? (
                    <tr><td colSpan={10} className="p-8 text-center text-slate-400">Loading History...</td></tr>
                ) : filteredHistory.length === 0 ? (
                    <tr><td colSpan={10} className="p-8 text-center text-slate-400">No active trips found.</td></tr>
                ) : filteredHistory.map((h, index) => {
                    const isSelected = selectedTripIds.has(h.id);
                    const netAddedValue = h.netAmount; 

                    return (
                        <tr 
                            key={`${h.id}-${index}`} 
                            onClick={() => !submitting && handleToggleRow(h.id)} 
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-slate-50'}`}
                        >
                            <td className="px-4 py-3 font-bold text-slate-700">
                                {h.date}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400">➔</span> {h.to || "N/A"}
                                </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-800">
                                {h.loadType}
                            </td>
                            {/* THE ENTERED NET WEIGHT COLUMN */}
<td className="px-4 py-3 text-center">
    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-md font-extrabold">
        {/* Use h.netWeight and handle potential null/undefined */}
        {h.netWeight || h.net_weight || "0"} T
    </span>
</td>
                            <td className="px-4 py-3 text-right text-orange-600 font-bold">
                                ₹{h.advance.toLocaleString()}
                            </td>
                            {/* SEPARATE WEIGHBRIDGE CHARGE */}
                            <td className="px-4 py-3 text-right text-red-600 font-bold">
                                ₹{h.weighbridgeCharge.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-center bg-slate-50/50">
                                <div className="flex flex-col items-center">
                                    <div className="font-mono text-slate-700">
                                        {h.loadingCharge}/{h.unloadingCharge}/<span className="text-red-500 font-bold">{h.extraExpense}</span>
                                    </div>
                                    <div className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                                        L / U / E
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right text-green-600 font-bold">
                                ₹{h.driverTripPay.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600 font-bold bg-red-50/30">
                                ₹{h.totalExpenses.toLocaleString()}
                            </td>
                            <td className={`px-4 py-3 text-right font-bold border-l border-slate-100 ${
                                netAddedValue >= 0 ? 'text-emerald-600 bg-emerald-50/10' : 'text-red-600 bg-red-50/10'
                            }`}>
                                ₹{netAddedValue.toLocaleString()}
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

const ActionButton = ({ icon, label, color, onClick }: any) => <button onClick={onClick} className="flex flex-col items-center justify-center py-3 hover:bg-white active:bg-slate-100 transition-colors group"><div className={`${color} mb-1 transition-transform group-hover:scale-110`}>{icon}</div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-700">{label}</span></button>;
const SidebarItem = ({ icon, label, active, onClick }: any) => <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{icon} {label}</button>;
const MobileNavItem = ({ icon, label, active, onClick }: any) => <button onClick={onClick} className={`flex flex-col items-center justify-center w-16 transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}><div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div><span className="text-[10px] font-bold">{label}</span></button>;