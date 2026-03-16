import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Camera, 
  Send, 
  Bell, 
  CheckCheck, 
  Pill, 
  User,
  Smartphone,
  Bot,
  Sparkles,
  FileText,
  Calendar
} from 'lucide-react';

const stepPrompts: Record<number, string> = {
  0: "Ready to order? Dekhiye Pharmelo kaise users, doctors, aur local shops ko connect karta hai.",
  1: "User apna prescription WhatsApp par bhejta hai. Koi naya app download karne ki zaroorat nahi.",
  2: "Pharmelo AI prescription ko read karta hai aur doctor booking suggest karta hai.",
  3: "Order turant Consumer App mein sync ho jata hai, jahan saare health records securely store hote hain.",
  4: "Order Partner Pharmacy App mein dikhayi deta hai. Real-time notifications se koi delay nahi hota.",
  5: "Pharmacist order accept karta hai aur medicines prepare karna shuru karta hai.",
  6: "User ko confirmation message mil jata hai. Ek seamless aur fast experience sabke liye."
};

const PRESCRIPTION_IMG = "https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTc0ZGMyNDcwLTRlNzEtMTFlZi04MGUwLTg5MTBmNjk1YjZkZS5qcGc=";

interface PresentationAnimationProps {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

const PresentationAnimation: React.FC<PresentationAnimationProps> = ({ onComplete, onProgress }) => {
  const [step, setStep] = useState(0);

  // Update progress whenever step changes
  useEffect(() => {
    if (onProgress) {
      onProgress(((step + 1) / 7) * 100);
    }
  }, [step, onProgress]);

  // Function to move to next step
  const nextStep = () => {
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  // Step timer
  useEffect(() => {
    const timer = setTimeout(() => {
      // Use browser TTS for local narrative
      if ('speechSynthesis' in window) {
         const ut = new SpeechSynthesisUtterance(stepPrompts[step]);
         window.speechSynthesis.speak(ut);
      }
      nextStep();
    }, 5000); 
    
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-slate-800">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-tr from-blue-600/20 via-transparent to-indigo-600/20 blur-[100px] pointer-events-none" />

      {/* Connection Bridge Line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center justify-items-center">
        
        {/* Connection Beam Animation */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div
              key="connection-beam-1"
              initial={{ x: "-50%", y: "-10%", opacity: 0, scale: 0 }}
              animate={{ 
                x: ["-50%", "0%"], 
                y: ["-10%", "-10%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.5, 0.5]
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-blue-400 flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Syncing App</span>
                </div>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="connection-beam-2"
              initial={{ x: "0%", y: "-10%", opacity: 0, scale: 0 }}
              animate={{ 
                x: ["0%", "50%"], 
                y: ["-10%", "-10%"],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.5, 1.5, 0.5]
              }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-400 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-3 rounded-2xl shadow-2xl border-2 border-indigo-400 flex items-center gap-2">
                  <Sparkles className="text-indigo-500 w-5 h-5" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Sending Order</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone 1: WhatsApp AI Chat */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-green-400 font-bold mb-4 uppercase tracking-widest text-xs">1. Pharmelo AI (WhatsApp)</p>
          <div className="w-full h-[560px] bg-slate-800 rounded-[3rem] border-[6px] border-slate-700 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-20" />
            
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] p-4 pt-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Pharmelo AI</p>
                <p className="text-white/60 text-[10px]">online</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-3 space-y-3 h-[420px] overflow-y-auto bg-[#E5DDD5] custom-scrollbar pb-16">
              <AnimatePresence>
                {step >= 1 && (
                  <motion.div 
                    key="chat-prescription"
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-[#DCF8C6] p-2 rounded-lg self-end ml-auto max-w-[85%] shadow-sm text-xs"
                  >
                    <div className="bg-slate-200 h-28 w-full rounded mb-1 overflow-hidden relative">
                      <img src={PRESCRIPTION_IMG} alt="Prescription" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <p>Here is my prescription.</p>
                  </motion.div>
                )}

                {step >= 2 && (
                  <motion.div 
                    key="chat-ai-processing"
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-white p-2 rounded-lg mr-auto max-w-[90%] shadow-sm text-xs relative overflow-hidden"
                  >
                    {step === 2 && (
                      <motion.div 
                        key="ai-scan-line"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute left-0 w-full h-1 bg-blue-500 blur-sm z-10"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-3 h-3 text-emerald-600" />
                      <span className="font-bold text-[10px]">Pharmelo AI</span>
                    </div>
                    <p>{step === 2 ? "Reading prescription..." : "I read your prescription. I've found Paracetamol and Amoxicillin. I've also found a local doctor for your consultation."}</p>
                  </motion.div>
                )}

                {step >= 6 && (
                  <motion.div 
                    key="chat-confirmation"
                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className="bg-white p-2 rounded-lg mr-auto max-w-[90%] shadow-sm text-xs border-l-4 border-emerald-500"
                  >
                    <p className="font-bold text-emerald-600 mb-1 flex items-center gap-1">
                      <CheckCheck className="w-3 h-3" /> Order Confirmed
                    </p>
                    <p>Your order for Paracetamol & Amoxicillin is confirmed! Delivery in 15 mins.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* WhatsApp Input */}
            <div className="absolute bottom-0 w-full bg-slate-100 p-2 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-full px-3 py-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>Type a message...</span>
                <Camera size={14} />
              </div>
              <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                <Send size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Consumer App */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-xs">2. Pharmelo App (Consumer)</p>
          <div className="w-full h-[560px] bg-white rounded-[3rem] border-[6px] border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
            
            {/* App Header */}
            <div className="bg-blue-600 p-6 pt-10 text-white">
              <div className="flex justify-between items-center mb-4">
                <Bot className="w-6 h-6" />
                <Bell className="w-5 h-5 opacity-80" />
              </div>
              <h3 className="text-xl font-black">My Health</h3>
              <p className="text-xs opacity-80">Welcome back, Binay!</p>
            </div>

            <div className="p-4 space-y-4">
              {/* Records Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-slate-800">New Records</h4>
                  <span className="text-[10px] text-blue-600 font-bold">View All</span>
                </div>
                <div className="space-y-2">
                  {step >= 3 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FileText className="text-blue-600 w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">Prescription Sync</p>
                        <p className="text-[10px] text-slate-500">From WhatsApp • Just now</p>
                      </div>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>
                  ) : (
                    <div className="h-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                      <p className="text-[10px] text-slate-400">Waiting for data...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctors Section */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">Upcoming Booking</h4>
                {step >= 3 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="text-indigo-600 w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">Dr. Rajesh Sharma</p>
                      <p className="text-[10px] text-slate-500">4:00 PM • Confirmed</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center">
                    <p className="text-[10px] text-slate-400">No active bookings</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-12 bg-slate-800 rounded-2xl flex items-center justify-around px-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Pill className="text-white w-4 h-4" />
              </div>
              <Calendar className="text-slate-500 w-4 h-4" />
              <FileText className="text-slate-500 w-4 h-4" />
              <User className="text-slate-500 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Phone 3: Partner App */}
        <div className="flex flex-col items-center w-full max-w-[280px]">
          <p className="text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">3. Pharmelo Partner (Shop)</p>
          <div className="w-full h-[560px] bg-slate-900 rounded-[3rem] border-[6px] border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
            
            {/* App Header */}
            <div className="bg-indigo-600 p-6 pt-10 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">Partner Portal</h3>
                <p className="text-xs opacity-80">Apollo Pharmacy, Solan</p>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                <Bell className="w-5 h-5" />
                {step >= 4 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-indigo-600 flex items-center justify-center text-[8px] font-bold"
                  >
                    1
                  </motion.div>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">Active Orders</h4>
                <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] rounded-full font-bold">LIVE</div>
              </div>

              <AnimatePresence mode="wait">
                {step >= 4 ? (
                  <motion.div
                    key="order-card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800 border border-slate-700 p-4 rounded-3xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-400">Order #8832</p>
                        <p className="text-sm font-bold text-white">2 Items • Binay S.</p>
                      </div>
                      <div className="px-2 py-1 bg-indigo-500 text-white text-[8px] rounded-lg font-bold">NEW</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <CheckCheck className="w-3 h-3 text-green-500" /> Paracetamol 500mg
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300">
                        <CheckCheck className="w-3 h-3 text-green-500" /> Amoxicillin 250mg
                      </div>
                    </div>

                    <div className="pt-2">
                      <motion.button
                        key={step >= 5 ? "accepted-btn" : "accept-btn"}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                          step >= 5 ? 'bg-green-600 text-white' : 'bg-white text-indigo-600'
                        }`}
                      >
                        {step >= 5 ? 'PREPARING ORDER' : 'ACCEPT ORDER'}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-32 bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-2">
                    <Smartphone className="w-6 h-6 text-slate-600" />
                    <p className="text-[10px] text-slate-500">Waiting for orders...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Status Bar */}
            <div className="absolute bottom-0 w-full bg-slate-800 p-4 border-t border-slate-700">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Shop Status</span>
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> OPEN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Legend Overlay */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm">
        <div className="flex-1 space-y-1 text-center md:text-left">
          <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-3 h-3" /> Step {step + 1} of 7
          </p>
          <h4 className="text-white text-lg font-bold">{stepPrompts[step]}</h4>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-slate-600 transition-colors shadow-lg"
          >
            ←
          </button>
          
          <div className="h-1 w-24 md:w-32 bg-slate-700 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-blue-500"
               initial={{ width: 0 }}
               animate={{ width: `${((step + 1) / 7) * 100}%` }}
             />
          </div>

          <button 
            onClick={nextStep}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-colors"
          >
            {step === 6 ? 'REPLAY TOUR' : 'NEXT STEP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationAnimation;
