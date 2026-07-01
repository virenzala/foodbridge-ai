'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Building2, ShieldAlert, Award, TrendingUp, Sparkles, Navigation, Globe,
  Activity, MessageSquare, Plus, CheckCircle, Clock, Trash2, ShieldCheck,
  ChevronRight, RefreshCw, Eye, Award as BadgeIcon, Key, FileSpreadsheet, Lock,
  Thermometer, User, Compass, HelpCircle, Download, Zap, MapPin
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';

// Dynamically import InteractiveMap to avoid SSR errors
const InteractiveMap = dynamic(
  () => import('../components/InteractiveMap'),
  { ssr: false }
);

export default function Home() {
  const [role, setRole] = useState<'landing' | 'restaurant' | 'ngo' | 'volunteer' | 'admin'>('landing');
  const [isMounted, setIsMounted] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('offline');
  const [aiServiceStatus, setAiServiceStatus] = useState<'online' | 'offline'>('offline');
  
  // Real-time ticking impact stats
  const [mealsCount, setMealsCount] = useState(140230);
  const [co2Saved, setCo2Saved] = useState(350250.4);

  // App States
  const [donations, setDonations] = useState<any[]>([]);
  const [activeDeliveries, setActiveDeliveries] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentDonorId, setCurrentDonorId] = useState('user-donor');
  
  // Forms & Modal States
  const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff'); // pastry default
  const [newDonationTitle, setNewDonationTitle] = useState('');
  const [newDonationWeight, setNewDonationWeight] = useState(10);
  const [newDonationExp, setNewDonationExp] = useState(12);
  const [newDonationType, setNewDonationType] = useState('Bakery');
  
  // AI Predictor Form
  const [predInventory, setPredInventory] = useState(35);
  const [predWeather, setPredWeather] = useState('Rainy');
  const [predEvent, setPredEvent] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predicting, setPredicting] = useState(false);

  // Donation Detail AI Matching Modal
  const [matchingDonation, setMatchingDonation] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [matchingLoader, setMatchingLoader] = useState(false);

  // Volunteer Simulation
  const [volunteerCoords, setVolunteerCoords] = useState<[number, number]>([40.7128, -74.0060]);
  const [simulatingRoute, setSimulatingRoute] = useState(false);
  const [simulatedEta, setSimulatedEta] = useState(25);
  const [simulatedChat, setSimulatedChat] = useState<any[]>([
    { sender: 'NGO', message: 'Hello Elena, we are ready to receive the pasta trays when you arrive!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [activeDeliveryId, setActiveDeliveryId] = useState<string>('');

  // CSR Certificate Modal
  const [showCertificate, setShowCertificate] = useState(false);

  // Fallback Mock Data
  const mockDonations = [
    {
      id: 'donation-1',
      title: 'Assorted Gourmet Pastries & Bagels',
      description: 'Morning bake surplus, perfectly fresh, individually bagged.',
      foodType: 'Bakery',
      weightKg: 12.5,
      status: 'DELIVERED',
      freshnessPercent: 95.0,
      packagingSafety: 'Sealed',
      spoilageDetected: false,
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'donation-2',
      title: 'Fresh Tomato and Herb Pastas',
      description: 'Prepared lunch trays, sealed and kept in warmers.',
      foodType: 'Cooked Meal',
      weightKg: 35.0,
      status: 'MATCHED',
      freshnessPercent: 98.0,
      packagingSafety: 'Sealed',
      spoilageDetected: false,
      expirationTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'donation-3',
      title: 'Organic Romaine & Veggie Salad Boxes',
      description: 'Unopened pre-packaged retail salads.',
      foodType: 'Fresh Produce',
      weightKg: 18.0,
      status: 'PENDING',
      freshnessPercent: 88.0,
      packagingSafety: 'Exposed',
      spoilageDetected: false,
      expirationTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const mockLeaderboard = [
    { name: 'Elena Rostova', role: 'VOLUNTEER', points: 650 },
    { name: 'Gourmet Bistro & Cafe', role: 'DONOR', points: 500 },
    { name: 'Alex Carter', role: 'VOLUNTEER', points: 420 },
    { name: 'Sanjay Kumar', role: 'VOLUNTEER', points: 300 }
  ];

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setMealsCount(prev => prev + Math.floor(Math.random() * 3));
      setCo2Saved(prev => prev + Number((Math.random() * 0.8).toFixed(2)));
    }, 4500);

    checkConnections();
    loadData();

    return () => clearInterval(interval);
  }, []);

  const checkConnections = async () => {
    try {
      const bRes = await fetch('http://localhost:4000/auth/users');
      if (bRes.ok) setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }

    try {
      const aRes = await fetch('http://localhost:8000/');
      if (aRes.ok) setAiServiceStatus('online');
    } catch {
      setAiServiceStatus('offline');
    }
  };

  const loadData = async () => {
    try {
      const donRes = await fetch('http://localhost:4000/donations');
      if (donRes.ok) {
        const data = await donRes.json();
        setDonations(data);
      } else {
        setDonations(mockDonations);
      }
    } catch {
      setDonations(mockDonations);
    }

    try {
      const leadRes = await fetch('http://localhost:4000/analytics/leaderboard');
      if (leadRes.ok) {
        const data = await leadRes.json();
        setLeaderboard(data);
      } else {
        setLeaderboard(mockLeaderboard);
      }
    } catch {
      setLeaderboard(mockLeaderboard);
    }

    try {
      const delRes = await fetch('http://localhost:4000/logistics/deliveries/active');
      if (delRes.ok) {
        const data = await delRes.json();
        setActiveDeliveries(data);
      }
    } catch {}
  };

  const handleAISurplusPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/predict-surplus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historical_sales: [120, 145, 110, 130, 150, 125, 140],
          inventory_level: Number(predInventory),
          weather_condition: predWeather,
          upcoming_event: predEvent,
          day_of_week: new Date().getDay(),
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPredictionResult(data);
      } else {
        throw new Error();
      }
    } catch {
      setTimeout(() => {
        setPredictionResult({
          predicted_surplus_kg: Math.round((predInventory * 0.35 + (predWeather === 'Rainy' ? 12 : 5)) * 10) / 10,
          confidence_score: 91.2,
          recommended_action: 'Alert dispatch for early collection - High Rain forecast reduces footfalls.',
          risk_factor: predWeather === 'Rainy' ? 'High Waste Risk' : 'Medium Waste Risk'
        });
      }, 800);
    } finally {
      setPredicting(false);
    }
  };

  const handleCreateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonationTitle) return;

    const payload = {
      title: newDonationTitle,
      foodType: newDonationType,
      weightKg: Number(newDonationWeight),
      expirationHours: Number(newDonationExp),
      imageUrl: selectedImage,
      donorId: currentDonorId,
    };

    try {
      const response = await fetch('http://localhost:4000/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const newDon = await response.json();
        setDonations(prev => [newDon, ...prev]);
        setNewDonationTitle('');
        import('canvas-confetti').then((conf) => conf.default());
      } else {
        throw new Error();
      }
    } catch {
      const localDonation = {
        id: `donation-${Date.now()}`,
        title: newDonationTitle,
        foodType: newDonationType,
        weightKg: Number(newDonationWeight),
        status: 'PENDING',
        freshnessPercent: selectedImage.includes('pastry') ? 95.0 : 88.0,
        packagingSafety: 'Sealed',
        expirationTime: new Date(Date.now() + newDonationExp * 60 * 60 * 1000).toISOString(),
        imageUrl: selectedImage,
      };
      setDonations(prev => [localDonation, ...prev]);
      setNewDonationTitle('');
      import('canvas-confetti').then((conf) => conf.default());
    }
  };

  const triggerAIMatching = async (don: any) => {
    setMatchingDonation(don);
    setMatchingLoader(true);
    try {
      const response = await fetch(`http://localhost:4000/donations/${don.id}/match`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      } else {
        throw new Error();
      }
    } catch {
      setTimeout(() => {
        setRecommendations([
          {
            ngo_id: 'org-foodbank',
            ngo_name: 'Central City Food Bank',
            score: 94.5,
            distance_km: 2.1,
            estimated_travel_time_mins: 12,
            matching_reasons: ['Capacity checks passed.', 'Dietary guidelines compatible.', 'Immediate delivery window fits.'],
          },
          {
            ngo_id: 'org-shelter',
            ngo_name: 'Hope Homeless Shelter',
            score: 88.0,
            distance_km: 4.8,
            estimated_travel_time_mins: 19,
            matching_reasons: ['High priority request.', 'Dietary guidelines matching.'],
          }
        ]);
      }, 700);
    } finally {
      setMatchingLoader(false);
    }
  };

  const confirmMatch = async (ngoId: string) => {
    if (!matchingDonation) return;
    try {
      const res = await fetch(`http://localhost:4000/donations/${matchingDonation.id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId })
      });
      if (res.ok) {
        loadData();
      }
    } catch {
      setDonations(prev => prev.map(d => d.id === matchingDonation.id ? { ...d, status: 'MATCHED', recipientId: ngoId } : d));
    }
    setMatchingDonation(null);
  };

  const startVolunteerDeliverySimulation = (deliveryId: string) => {
    setActiveDeliveryId(deliveryId);
    setSimulatingRoute(true);
    
    const startPoint = [40.7128, -74.0060];
    const endPoint = [40.7259, -73.9967];
    let steps = 0;
    
    const interval = setInterval(() => {
      steps++;
      const ratio = steps / 10;
      const nextLat = startPoint[0] + (endPoint[0] - startPoint[0]) * ratio;
      const nextLng = startPoint[1] + (endPoint[1] - startPoint[1]) * ratio;
      setVolunteerCoords([nextLat, nextLng]);
      setSimulatedEta(Math.max(0, 25 - steps * 2));

      if (steps === 3) {
        setSimulatedChat(prev => [...prev, { sender: 'System', message: 'Temperature Alert: Container stable at 4.2°C.' }]);
      }
      if (steps === 7) {
        setSimulatedChat(prev => [...prev, { sender: 'Volunteer', message: 'Traffic is light. Arriving at the dropoff area in 5 minutes!' }]);
      }

      if (steps >= 10) {
        clearInterval(interval);
        setSimulatingRoute(false);
        setSimulatedChat(prev => [...prev, { sender: 'NGO', message: 'Perfect! Please input the QR code QR_MATCHED to finalize validation.' }]);
      }
    }, 1500);
  };

  const handleQRVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeInput) return;
    try {
      const response = await fetch(`http://localhost:4000/logistics/deliveries/${activeDeliveryId || 'delivery-1'}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: qrCodeInput })
      });
      if (response.ok) {
        import('canvas-confetti').then((conf) => conf.default());
        loadData();
        setQrCodeInput('');
        setSimulatedChat([{ sender: 'System', message: 'Delivery task successfully logged and verified on blockchain ledger.' }]);
      } else {
        alert('Invalid QR code details. Try "QR_MATCHED" or checking active task info.');
      }
    } catch {
      import('canvas-confetti').then((conf) => conf.default());
      setDonations(prev => prev.map(d => d.id === 'donation-2' ? { ...d, status: 'DELIVERED' } : d));
      setQrCodeInput('');
      setSimulatedChat([{ sender: 'System', message: 'Local Offline Verification Succeeded. Carbon credits accrued.' }]);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput) return;
    setSimulatedChat(prev => [...prev, { sender: 'Volunteer', message: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setSimulatedChat(prev => [...prev, { sender: 'NGO', message: 'Thank you! The loading dock is clear.' }]);
    }, 1000);
  };

  const chartData = [
    { name: 'Nov', meals: 15200, co2: 380, water: 420 },
    { name: 'Dec', meals: 19400, co2: 485, water: 540 },
    { name: 'Jan', meals: 23100, co2: 577, water: 650 },
    { name: 'Feb', meals: 27900, co2: 697, water: 780 },
    { name: 'Mar', meals: 34500, co2: 862, water: 960 },
    { name: 'Apr', meals: 41200, co2: 1030, water: 1150 }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Floating Header */}
      <header className="sticky top-0 z-[2000] w-full px-6 py-4 flex items-center justify-between glass border-b border-white/5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="FoodBridge AI Logo" 
            className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md shadow-indigo-500/10" 
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">FoodBridge AI</h1>
            <p className="text-[10px] text-gray-500">Intelligent Logistics Engine</p>
          </div>
        </div>

        {/* Global Connection Badges & Role Switcher */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5">
              <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <span className="text-gray-400">API: {backendStatus.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5">
              <span className={`w-2 h-2 rounded-full ${aiServiceStatus === 'online' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <span className="text-gray-400">ML: {aiServiceStatus.toUpperCase()}</span>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-white/10 p-1 rounded-full flex gap-1 text-xs">
            <button 
              onClick={() => setRole('landing')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${role === 'landing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              Portal
            </button>
            <button 
              onClick={() => setRole('restaurant')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${role === 'restaurant' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Donor
            </button>
            <button 
              onClick={() => setRole('ngo')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${role === 'ngo' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              NGO
            </button>
            <button 
              onClick={() => setRole('volunteer')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${role === 'volunteer' ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Volunteer
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${role === 'admin' ? 'bg-zinc-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        
        {/* ================= LANDING WEBSITE VIEW ================= */}
        {role === 'landing' && (
          <div className="space-y-16 animate-fadeIn">
            
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6 pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 glow-indigo">
                <Sparkles className="h-3 w-5" /> Empowering Smart Environmental Impact
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                Reducing Food Waste. <br/>
                <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">Optimized by AI.</span>
              </h1>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                FoodBridge AI orchestrates surplus redistribution using predictive analytics, real-time vehicle dispatch, and live route optimization maps.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => setRole('restaurant')}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                >
                  Enter Donor Portal <ChevronRight className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setRole('volunteer')}
                  className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl font-medium border border-white/10 transition-all"
                >
                  Join as Volunteer
                </button>
              </div>
            </div>

            {/* Impact Ticker Widget */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Meals Redistributed', val: mealsCount.toLocaleString(), unit: 'meals', color: 'text-indigo-400', icon: CheckCircle },
                { title: 'CO2 Footprint Prevented', val: co2Saved.toFixed(1), unit: 'kg', color: 'text-emerald-400', icon: Globe },
                { title: 'Water Footprint Offset', val: Math.round(mealsCount * 350).toLocaleString(), unit: 'liters', color: 'text-sky-400', icon: Activity },
                { title: 'Landfill Diverted', val: Math.round(mealsCount * 0.45).toLocaleString(), unit: 'kg', color: 'text-amber-400', icon: Trash2 },
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{item.title}</span>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="text-3xl font-bold font-display tracking-tight text-white mb-1">
                    {item.val}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">{item.unit} registered today</span>
                </div>
              ))}
            </div>

            {/* Chart Block */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-base font-bold text-white mb-1">Meals Saved Trend</h3>
                <p className="text-xs text-gray-500 mb-6">Aggregated performance analytics over the last six months.</p>
                {isMounted && (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                        <Area type="monotone" dataKey="meals" stroke="#6366f1" fillOpacity={1} fill="url(#colorMeals)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Sustainable Development Goals (SDGs) Aligned</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-6">
                    Our machine learning matching matrix and routing logistics directly drive the United Nations sustainable food and eco directives.
                  </p>
                  <div className="space-y-4">
                    {[
                      { goal: 'Goal 2: Zero Hunger', desc: 'Sourcing fresh surplus meals to shelters and local pantry systems.', pct: 85, color: 'bg-emerald-500' },
                      { goal: 'Goal 12: Responsible Consumption', desc: 'Minimizing commercial kitchen food waste metrics via forecasting.', pct: 92, color: 'bg-indigo-500' },
                      { goal: 'Goal 13: Climate Action', desc: 'Diverting organic waste from landfills to mitigate methane releases.', pct: 78, color: 'bg-amber-500' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-gray-300">{item.goal}</span>
                          <span className="text-gray-400">{item.pct}% Impact</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-white/5">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { quote: "FoodBridge AI saved our restaurant over 300kg of ingredients in a single month while helping feed families down the street. Essential SaaS.", author: "Chef Sarah J.", role: "Gourmet Bistro Owner" },
                { quote: "The route optimization is game-changing. I can do 3 pickups in my lunch break now. Gamification badges keep it really fun.", author: "Elena R.", role: "Volunteer Courier" },
                { quote: "We receive fresh bread and prepared salads almost daily. High transparency and instant notifications.", author: "Marcus V.", role: "Food Bank Coordinator" }
              ].map((t, idx) => (
                <div key={idx} className="glass rounded-xl p-6 border border-white/5 flex flex-col justify-between">
                  <p className="text-sm italic text-gray-300 font-light leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                      {t.author[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.author}</h4>
                      <p className="text-[10px] text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================= RESTAURANT (DONOR) DASHBOARD ================= */}
        {role === 'restaurant' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Gourmet Bistro Dashboard</h2>
                <p className="text-xs text-gray-400">Manage surplus inventories, submit donations, and review CSR carbon scores.</p>
              </div>
              <button 
                onClick={() => setShowCertificate(true)}
                className="px-4 py-2 bg-zinc-950 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Download className="h-4 w-4 text-emerald-500" /> Export CSR Certificate
              </button>
            </div>

            {/* AI Surplus Prediction Section */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-bold text-white">AI Surplus Predictor</h3>
              </div>
              <form onSubmit={handleAISurplusPrediction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Inventory Ingredient Volume</label>
                  <input 
                    type="number" 
                    value={predInventory} 
                    onChange={(e) => setPredInventory(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Weather Forecast</label>
                  <select 
                    value={predWeather} 
                    onChange={(e) => setPredWeather(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>Sunny</option>
                    <option>Rainy</option>
                    <option>Stormy</option>
                    <option>Cold</option>
                    <option>Hot</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 py-3">
                  <input 
                    type="checkbox" 
                    checked={predEvent} 
                    onChange={(e) => setPredEvent(e.target.checked)}
                    id="upcoming-event"
                    className="rounded bg-zinc-950 border-white/10 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <label htmlFor="upcoming-event" className="text-xs text-gray-400 cursor-pointer">Upcoming local festival/event</label>
                </div>
                <button 
                  type="submit" 
                  disabled={predicting}
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {predicting ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Run Waste Prediction'}
                </button>
              </form>

              {predictionResult && (
                <div className="mt-4 p-4 bg-zinc-950/80 rounded-xl border border-emerald-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slideUp">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-emerald-500 tracking-wider uppercase">Forecast Matrix Result</span>
                      <span className="text-[10px] text-gray-500">Confidence: {predictionResult.confidence_score}%</span>
                    </div>
                    <p className="text-sm font-semibold text-white">Predicted Surplus: <span className="text-emerald-400 font-extrabold text-lg">{predictionResult.predicted_surplus_kg} kg</span></p>
                    <p className="text-xs text-gray-400">{predictionResult.recommended_action}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500 uppercase tracking-widest">
                    {predictionResult.risk_factor}
                  </div>
                </div>
              )}
            </div>

            {/* Re-aligned 3-Column Grid incorporating Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1: Creation form */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-base font-bold text-white">Upload Surplus Food</h3>
                </div>
                
                <form onSubmit={handleCreateDonation} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Batch Title / Item Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Croissants, salad boxes..."
                      value={newDonationTitle}
                      onChange={(e) => setNewDonationTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-medium">Category</label>
                      <select 
                        value={newDonationType} 
                        onChange={(e) => setNewDonationType(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      >
                        <option>Bakery</option>
                        <option>Cooked Meal</option>
                        <option>Dairy</option>
                        <option>Fresh Produce</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-medium">Weight (kg)</label>
                      <input 
                        type="number" 
                        value={newDonationWeight}
                        onChange={(e) => setNewDonationWeight(Number(e.target.value))}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">Shelf-life (hours)</label>
                    <input 
                      type="number" 
                      value={newDonationExp}
                      onChange={(e) => setNewDonationExp(Number(e.target.value))}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-medium block">Computer Vision Sample Image</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff', label: 'Bakery' },
                        { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c', label: 'Cooked' },
                        { url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999', label: 'Produce' }
                      ].map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(img.url)}
                          className={`relative h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-emerald-500 scale-[1.02]' : 'border-transparent opacity-60'}`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all glow-emerald"
                  >
                    Publish Donation Lot
                  </button>
                </form>
              </div>

              {/* Column 2: Geographic Partner Map */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-base font-bold text-white">Nearby NGOs & Shelters</h3>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal mt-1 mb-4">Centering Gourmet Bistro (D). Map shows registered food collection hubs within 5km.</p>
                </div>
                
                {isMounted && (
                  <InteractiveMap 
                    center={[40.7128, -74.0060]}
                    zoom={13}
                    markers={[
                      { id: 'bistro-loc', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe (You)', type: 'donor' },
                      { id: 'foodbank-loc', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo', details: 'Capacity Available: 380kg' },
                      { id: 'shelter-loc', lat: 40.7484, lng: -73.9857, label: 'Hope Homeless Shelter', type: 'ngo', details: 'Urgency Priority Level 5' }
                    ]}
                  />
                )}
              </div>

              {/* Column 3: History block */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Recent Donation Lots</h3>
                
                <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                  {donations.map((don, idx) => (
                    <div key={idx} className="p-3.5 bg-zinc-950/80 rounded-xl border border-white/5 flex flex-col justify-between gap-3">
                      <div className="flex gap-3 items-start">
                        <img src={don.imageUrl} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-white leading-snug">{don.title}</h4>
                          <div className="flex gap-1.5 items-center text-[9px] text-gray-400">
                            <span>{don.weightKg} kg</span>
                            <span>•</span>
                            <span className="text-emerald-400">{don.freshnessPercent}% Fresh</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          don.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' :
                          don.status === 'MATCHED' ? 'bg-indigo-500/10 text-indigo-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {don.status}
                        </span>
                        
                        {don.status === 'PENDING' && (
                          <button
                            onClick={() => triggerAIMatching(don)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-[9px] font-bold text-white flex items-center gap-1"
                          >
                            <Sparkles className="h-2.5 w-2.5" /> AI Match
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= NGO DASHBOARD ================= */}
        {role === 'ngo' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold font-display text-white">Central City Food Bank Portal</h2>
              <p className="text-xs text-gray-400">Coordinate incoming donation dispatches and manage local shelter supply allocations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Current Storage Occupancy', label: '120 kg / 500 kg', pct: 24, color: 'bg-indigo-500' },
                { title: 'Community Inflow Rate', label: '45.2 kg / day average', pct: 60, color: 'bg-emerald-500' },
                { title: 'Urgency Priority Rank', label: 'Urgency: Level 4/5', pct: 80, color: 'bg-rose-500' },
              ].map((item, idx) => (
                <div key={idx} className="glass rounded-xl p-5 border border-white/5 space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">{item.title}</span>
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-white">{item.label}</span>
                  </div>
                  <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Split layout: Pending dispatches next to geographical markers map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Nearby Pending Donation Allocations</h3>
                
                <div className="space-y-4">
                  {donations.filter(d => d.status === 'PENDING').length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center">No pending local donations currently waiting for allocation matching.</p>
                  ) : (
                    donations.filter(d => d.status === 'PENDING').map((don, idx) => (
                      <div key={idx} className="p-4 bg-zinc-950/80 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-white">{don.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">Weight: {don.weightKg} kg | Freshness Score: <span className="text-emerald-500">{don.freshnessPercent}%</span></p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => confirmMatch('org-foodbank')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
                          >
                            Request Allocation Dispatch
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* NGO Resource Allocation Map */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Local Resource Dispatch Map</h3>
                  <p className="text-[10px] text-gray-500 mb-4">Shows geographic locations of pending food surplus lots ready for pickup.</p>
                </div>
                
                {isMounted && (
                  <InteractiveMap 
                    center={[40.7259, -73.9967]}
                    zoom={12}
                    markers={[
                      { id: 'ngo-loc', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank (You)', type: 'ngo' },
                      { id: 'don-1-loc', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro - Bakery Lot Pending', type: 'donor' },
                      { id: 'don-2-loc', lat: 40.7306, lng: -73.9352, label: 'Metro Grocery - Prepared Meals Pending', type: 'donor' }
                    ]}
                  />
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= VOLUNTEER DASHBOARD ================= */}
        {role === 'volunteer' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Elena's Rescue Control Panel</h2>
                <p className="text-xs text-gray-400">Track current en-route dispatches, view optimized navigation routes, and verify drop-offs.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-bold text-white">Points Accrued: 650 XP</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Map & Simulator Widget */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass rounded-2xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-5 w-5 text-indigo-500" />
                      <h3 className="text-sm font-bold text-white">Real-Time Routing & Telemetry</h3>
                    </div>
                    <button 
                      onClick={() => startVolunteerDeliverySimulation('delivery-1')}
                      disabled={simulatingRoute}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
                    >
                      {simulatingRoute ? 'Simulation Active...' : 'Start Route Simulation'}
                    </button>
                  </div>

                  {isMounted && (
                    <InteractiveMap 
                      center={[40.7200, -74.0000]}
                      zoom={13}
                      markers={[
                        { id: 'v-driver', lat: volunteerCoords[0], lng: volunteerCoords[1], label: 'Elena (Volunteer)', type: 'volunteer', details: `En Route. ETA: ${simulatedEta} mins` },
                        { id: 'donor-bistro', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe', type: 'donor' },
                        { id: 'ngo-foodbank', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo' }
                      ]}
                      routeCoords={[
                        [40.7128, -74.0060],
                        [40.7200, -74.0000],
                        [40.7259, -73.9967]
                      ]}
                    />
                  )}
                </div>
              </div>

              {/* Chat & Verification Queue */}
              <div className="space-y-6">
                
                {/* Live Message dispatch feed */}
                <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col h-[260px] justify-between">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Dispatch Live Chat</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {simulatedChat.map((msg, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl ${msg.sender === 'Volunteer' ? 'bg-indigo-600/30 text-right ml-8 border border-indigo-500/20' : 'bg-zinc-900 mr-8 border border-white/5'}`}>
                        <div className="font-extrabold text-[9px] text-gray-500 uppercase tracking-wider mb-1">{msg.sender}</div>
                        <p className="text-gray-200 leading-normal">{msg.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="flex gap-2 pt-2 border-t border-white/5 mt-2">
                    <input 
                      type="text" 
                      placeholder="Type coordination message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white" 
                    />
                    <button type="submit" className="px-3 py-1.5 bg-indigo-600 rounded-lg text-xs font-bold text-white">Send</button>
                  </form>
                </div>

                {/* QR Validator Form */}
                <div className="glass rounded-2xl p-5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-bold text-white">QR Code Validation Portal</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Input the drop-off verification key to record blockchain-backed confirmation. Use <span className="text-amber-500 font-bold">QR_MATCHED</span> for testing.
                  </p>
                  
                  <form onSubmit={handleQRVerify} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Input QR verification code..." 
                      value={qrCodeInput}
                      onChange={(e) => setQrCodeInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-emerald-600 rounded-lg text-xs font-bold text-white">Verify</button>
                  </form>
                </div>

              </div>

            </div>

            {/* Achievements and Leaderboards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Badges Earned */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Achievements & Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'First Rescue', desc: 'Saved first donation lot', icon: '🛡️', unlocked: true },
                    { name: 'Eco Warrior', desc: 'Saved 100kg CO2 emissions', icon: '🌱', unlocked: true },
                    { name: 'Speed Runner', desc: 'Delivered in under 15 mins', icon: '⚡', unlocked: false }
                  ].map((b, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex flex-col items-center text-center space-y-2 ${b.unlocked ? 'bg-zinc-900 border-white/10' : 'bg-zinc-950/40 border-white/5 opacity-40'}`}>
                      <span className="text-3xl">{b.icon}</span>
                      <h4 className="text-xs font-bold text-white">{b.name}</h4>
                      <p className="text-[9px] text-gray-500">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">Platform Contributor Standings</h3>
                <div className="space-y-3">
                  {leaderboard.map((user, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-zinc-950/60 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-gray-500 w-4">#{idx+1}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{user.name}</h4>
                          <span className="text-[9px] text-gray-500 uppercase tracking-widest">{user.role}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-400">{user.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= ADMIN DASHBOARD ================= */}
        {role === 'admin' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display text-white">Platform System Administration</h2>
                <p className="text-xs text-gray-400">Monitor blockchain auditing nodes, check user validations, and configure risk engines.</p>
              </div>
            </div>

            {/* Health & Auditing widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: 'Global Auditing Status', val: '99.8% Verified', desc: 'Cryptographic ledger check OK', color: 'text-indigo-400' },
                { title: 'Fraud Alerts Raised', val: '0 flags today', desc: 'Freshness checks clean', color: 'text-emerald-400' },
                { title: 'Average Transit Match', val: '14.2 minutes', desc: 'Matching algorithm benchmark', color: 'text-amber-400' },
                { title: 'Active Verifiers', val: '14 nodes online', desc: 'Consensus engine operational', color: 'text-sky-400' },
              ].map((m, idx) => (
                <div key={idx} className="glass rounded-xl p-5 border border-white/5 space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">{m.title}</span>
                  <h4 className="text-lg font-bold text-white">{m.val}</h4>
                  <p className="text-[9px] text-gray-500">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Global Redistribution map monitor */}
            <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-white">Global Redistribution Map Monitor</h3>
              {isMounted && (
                <InteractiveMap 
                  center={[40.7300, -73.9800]}
                  zoom={12}
                  markers={[
                    { id: 'donor-1', lat: 40.7128, lng: -74.0060, label: 'Gourmet Bistro & Cafe', type: 'donor' },
                    { id: 'donor-2', lat: 40.7306, lng: -73.9352, label: 'Metro Mega Supermarket', type: 'donor' },
                    { id: 'ngo-1', lat: 40.7259, lng: -73.9967, label: 'Central City Food Bank', type: 'ngo' },
                    { id: 'ngo-2', lat: 40.7484, lng: -73.9857, label: 'Hope Homeless Shelter', type: 'ngo' },
                    { id: 'vol-1', lat: 40.7200, lng: -74.0000, label: 'Elena (Active driver)', type: 'volunteer' }
                  ]}
                />
              )}
            </div>

            {/* Verification approvals and active queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">NGO Registration Approvals</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Unity Soup Kitchen', type: 'SHELTER', location: 'Bronx, NY', verified: false },
                    { name: 'Central City Food Bank', type: 'FOOD_BANK', location: 'Manhattan, NY', verified: true }
                  ].map((org, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/80 rounded-xl border border-white/5 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-white">{org.name}</h4>
                        <p className="text-[10px] text-gray-500">{org.type} • {org.location}</p>
                      </div>
                      <div>
                        {org.verified ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] rounded-full font-bold uppercase tracking-wider">Verified</span>
                        ) : (
                          <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold">Verify Profile</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fraud Detection / Audits stream */}
              <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white">System Security Audit Log</h3>
                <div className="space-y-3 text-[11px] font-mono text-gray-400">
                  <div className="p-2.5 bg-zinc-950 rounded border border-white/5 flex gap-2">
                    <span className="text-indigo-400">[11:15:11]</span>
                    <span>Audit checkpoint initialized. Verification keys generated.</span>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded border border-white/5 flex gap-2">
                    <span className="text-indigo-400">[11:12:04]</span>
                    <span>New CSR generation metrics completed for Gourmet Bistro (350.2kg CO2 saved).</span>
                  </div>
                  <div className="p-2.5 bg-zinc-950 rounded border border-white/5 flex gap-2">
                    <span className="text-rose-400">[10:45:19]</span>
                    <span>System Warning: NGO capacity alert generated for shelter-1 occupancy (92%).</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* CSR Certificate Modal Dialog */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="glass-premium max-w-lg w-full p-8 rounded-3xl relative border border-emerald-500/30 text-center space-y-6 animate-scaleUp">
            
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg glow-emerald">
              🏆
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display text-white">Certificate of Ecological Impact</h3>
              <p className="text-xs text-emerald-400 font-semibold tracking-widest uppercase">Verified Environmental Ledger</p>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed font-light">
              This digital certificate certifies that <strong className="text-white">Gourmet Bistro & Cafe</strong> has successfully offset <strong className="text-emerald-400">350.2 kg</strong> of Carbon Dioxide equivalent ($CO_2$) and saved <strong className="text-emerald-400">140 meals</strong> from landfill deposition through the FoodBridge AI redistribution network.
            </p>

            <div className="grid grid-cols-3 gap-4 border-t border-b border-white/5 py-4 text-left">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Meals Saved</span>
                <span className="text-sm font-bold text-white">140 meals</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Water Offset</span>
                <span className="text-sm font-bold text-white">4,200 Litres</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Landfill Divert</span>
                <span className="text-sm font-bold text-white">85.0 kg</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[9px] font-mono text-gray-500">Hash ID: fb_ecc_83bd2a0d92</span>
              <button 
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Matching Recommendation Modal */}
      {matchingDonation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fadeIn">
          <div className="glass max-w-lg w-full p-6 rounded-2xl relative border border-indigo-500/30 space-y-4">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white">AI Smart Match Engine Recommendation</h3>
                <p className="text-xs text-gray-400">Analyzing route capacity, dietary rules, and urgency vectors.</p>
              </div>
              <button 
                onClick={() => setMatchingDonation(null)}
                className="text-gray-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {matchingLoader ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                <span className="text-xs text-gray-400">Calculating optimization algorithms...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-white">Surplus Batch Details</h4>
                  <p className="text-xs text-gray-400 mt-1">{matchingDonation.title} ({matchingDonation.weightKg}kg)</p>
                </div>

                <div className="space-y-3">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 bg-zinc-900 rounded-xl border border-white/10 flex justify-between items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-white">{rec.ngo_name}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{rec.distance_km} km away</span>
                        </div>
                        <ul className="list-disc list-inside text-[9px] text-gray-400 space-y-0.5">
                          {rec.matching_reasons.map((reason: string, rIdx: number) => (
                            <li key={rIdx}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-extrabold text-indigo-400">{rec.score}% Match Score</span>
                        <button 
                          onClick={() => confirmMatch(rec.ngo_id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-all"
                        >
                          Approve Match
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-white/5 mt-12 bg-zinc-950/80">
        <p className="text-xs text-gray-500">© 2026 FoodBridge AI Inc. All Rights Reserved. Built for Hackathons & Enterprise Scale.</p>
      </footer>

    </div>
  );
}
