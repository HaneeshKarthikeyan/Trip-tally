import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

const DriverWallet = () => {
  // --- STATE ---
  const [drivers, setDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  
  // Wallet Data
  const [trips, setTrips] = useState([]);        // The Table Data
  const [openingBalance, setOpeningBalance] = useState(0); // The "Old" Net Added
  const [cashPaid, setCashPaid] = useState('');  // Amount you pay now
  
  // The Calculated Result
  const [netAdded, setNetAdded] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- 1. LOAD DRIVERS LIST ---
  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await supabase.from('drivers').select('id, name');
      if (data) setDrivers(data);
    };
    fetchDrivers();
  }, []);

  // --- 2. LOAD DATA WHEN DRIVER IS SELECTED ---
  useEffect(() => {
    if (!selectedDriverId) return;

    const loadWallet = async () => {
      setLoading(true);

      // A. Fetch the Permanent Balance (Previous Net Added)
      const { data: driverData } = await supabase
        .from('drivers')
        .select('current_balance')
        .eq('id', selectedDriverId)
        .single();
      
      if (driverData) {
        setOpeningBalance(driverData.current_balance || 0);
      }

      // B. Fetch Only Unsettled Trips (Populates the Table)
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('driver_id', selectedDriverId)
        .eq('status', 'Unsettled');

      if (tripData) {
        setTrips(tripData);
      }

      setCashPaid(''); // Reset input
      setLoading(false);
    };

    loadWallet();
  }, [selectedDriverId]);

  // --- 3. THE MATH (Runs automatically) ---
  useEffect(() => {
    const tripTotal = trips.reduce((sum, trip) => sum + (trip.amount || 0), 0);
    const payment = parseFloat(cashPaid) || 0;
    
    // FORMULA: (Old Balance + New Trips) - Cash Paid
    const finalAmount = (openingBalance + tripTotal) - payment;
    
    setNetAdded(finalAmount);
  }, [trips, openingBalance, cashPaid]);


  // --- 4. THE SETTLE ACTION (The Logic You Asked For) ---
  const handleSettle = async () => {
    if (!selectedDriverId) return;
    if (!window.confirm(`Confirm Settle? Net Balance ₹${netAdded} will carry forward.`)) return;

    setLoading(true);

    // CAPTURE THE VALUE: We save the current 'Net Added' to carry it over
    const carryOverAmount = netAdded;

    try {
      // A. Database: Mark trips in the table as 'Settled'
      const tripIds = trips.map(t => t.id);
      if (tripIds.length > 0) {
        await supabase
          .from('trips')
          .update({ status: 'Settled', settlement_date: new Date() })
          .in('id', tripIds);
      }

      // B. Database: Update the Driver's permanent balance
      await supabase
        .from('drivers')
        .update({ current_balance: carryOverAmount })
        .eq('id', selectedDriverId);

      // --- C. UI UPDATE: THE VISUAL TRICK ---
      
      // 1. Clear the table (Trips are gone)
      setTrips([]); 

      // 2. Move 'Net Added' into 'Opening Balance'
      // This ensures the math stays correct: (carryOver + 0 trips - 0 paid) = carryOver
      setOpeningBalance(carryOverAmount);

      // 3. Clear the payment input
      setCashPaid('');

      alert("Settled! Table cleared, balance carried forward.");

    } catch (error) {
      console.error("Error:", error);
      alert("Settlement failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Driver Wallet Settlement</h2>

      {/* Driver Select */}
      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">Select Driver</label>
        <select 
          className="w-full p-2 border rounded"
          value={selectedDriverId}
          onChange={(e) => setSelectedDriverId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {selectedDriverId && (
        <>
          {/* Dashboard Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-gray-100 p-4 rounded">
              <p className="text-gray-500 text-sm">Previous Balance</p>
              <p className="text-xl font-bold">₹{openingBalance}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-blue-600 text-sm">Trip Total</p>
              <p className="text-xl font-bold">
                ₹{trips.reduce((s, t) => s + (t.amount || 0), 0)}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded border border-green-300">
              <p className="text-green-700 text-sm">NET ADDED</p>
              <p className="text-2xl font-bold text-green-800">₹{netAdded}</p>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded mb-6 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">From</th>
                  <th className="p-3 border-b">To</th>
                  <th className="p-3 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No new trips. Balance only.
                    </td>
                  </tr>
                ) : (
                  trips.map((trip) => (
                    <tr key={trip.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{new Date(trip.created_at).toLocaleDateString()}</td>
                      <td className="p-3">{trip.from_location}</td>
                      <td className="p-3">{trip.to_location}</td>
                      <td className="p-3 text-right font-medium">₹{trip.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Settle Area */}
          <div className="flex items-end gap-4 bg-gray-50 p-4 rounded">
            <div className="flex-1">
              <label className="block text-gray-700 font-bold mb-1">Cash Paid Now</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                placeholder="Enter amount..."
                value={cashPaid}
                onChange={(e) => setCashPaid(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSettle}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Settling...' : 'SETTLE PAY'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DriverWallet;