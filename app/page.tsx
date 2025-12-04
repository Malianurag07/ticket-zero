"use client";
import { useState, useEffect } from "react";

// --- TYPES ---
interface Ticket {
  title: string;
  severity: string;
  summary: string;
  steps: string[];
  fix: string;
}

// --- CUSTOM HAND-DRAWN SVGS (The "Mini Drawings") ---
const DoodleBug = () => (
  <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    {/* Body */}
    <path d="M50 30 C 70 30, 80 50, 80 65 C 80 85, 65 95, 50 95 C 35 95, 20 85, 20 65 C 20 50, 30 30, 50 30 Z" />
    {/* Head */}
    <path d="M35 30 Q 50 10, 65 30" />
    {/* Legs Left */}
    <path d="M25 45 L 10 40" />
    <path d="M20 65 L 5 65" />
    <path d="M25 80 L 10 90" />
    {/* Legs Right */}
    <path d="M75 45 L 90 40" />
    <path d="M80 65 L 95 65" />
    <path d="M75 80 L 90 90" />
    {/* Antennas */}
    <path d="M40 20 Q 30 5, 20 10" />
    <path d="M60 20 Q 70 5, 80 10" />
  </svg>
);

const DoodlePencil = () => (
  <svg className="w-6 h-6 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 3l5 5L8 21H3v-5L16 3z" />
    <path d="M10 16l4-4" /> 
    {/* Scribble line under it */}
    <path d="M2 23c3-1 5 1 8-1s5-2 9 0" className="opacity-50" />
  </svg>
);

const DoodleUpload = () => (
  <svg className="w-12 h-12 text-slate-500 group-hover:text-cyan-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
    {/* Little sparkles */}
    <path d="M19 4l1 2" className="opacity-50" />
    <path d="M21 6l-2 1" className="opacity-50" />
  </svg>
);

const DoodleCheck = () => (
  <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function Home() {
  // --- STATE ---
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- RATE LIMIT STATE ---
  const DAILY_LIMIT = 1500;
  const [credits, setCredits] = useState(DAILY_LIMIT);
  const [cooldown, setCooldown] = useState(0);

  // --- LOAD CREDITS ---
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("ticketZero_date");
    const storedCredits = localStorage.getItem("ticketZero_credits");

    if (lastDate !== today) {
      setCredits(DAILY_LIMIT);
      localStorage.setItem("ticketZero_date", today);
      localStorage.setItem("ticketZero_credits", DAILY_LIMIT.toString());
    } else if (storedCredits) {
      setCredits(parseInt(storedCredits));
    }
  }, []);

  // --- HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    if (!ticket) return;
    const markdown = `
**Title:** ${ticket.title}
**Severity:** ${ticket.severity}

**Summary:**
${ticket.summary}

**Steps to Reproduce:**
${ticket.steps.map(s => `- ${s}`).join('\n')}

**Suggested Fix:**
\`${ticket.fix}\`
    `;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateTicket = async () => {
    if (credits <= 0) {
      alert("Daily limit reached.");
      return;
    }

    setLoading(true);
    setTicket(null);
    setCopied(false);

    try {
      const res = await fetch("/api/analyze-ticket", {
        method: "POST",
        body: JSON.stringify({ emailText: text, imageBase64: image }),
      });
      
      if (!res.ok) throw new Error("API Failed");
      
      const data = await res.json();
      setTicket(data);

      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem("ticketZero_credits", newCredits.toString());

      setCooldown(4);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(timer);
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Generation failed:", error); 
      alert("Error generating ticket.");
    }
    setLoading(false);
  };

  return (
    // DARK THEME BACKGROUND (Inspired by your Zap image)
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* Background Gradients (Subtle Glows) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="w-full border-b border-slate-800/50 bg-[#0f172a]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="group-hover:rotate-12 transition-transform duration-300">
            <DoodleBug />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">TicketZero</h1>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">AI Triage Agent</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-300 bg-cyan-950/30 border border-cyan-900/50 px-4 py-1.5 rounded-full shadow-inner">
          <span className="animate-pulse">⚡</span>
          <span>{credits} / {DAILY_LIMIT} credits</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6 md:p-12 flex flex-col items-center relative z-10">
        
        {/* INPUT CARD - Matte Glass Look */}
        <div className="w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden group">
          
          {/* Subtle top highlight border */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />

          <div className="flex items-center gap-3 mb-6">
            <DoodlePencil />
            <h2 className="text-lg font-medium text-slate-200">Describe the Issue</h2>
          </div>
          
          <div className="mb-6 relative">
            <textarea
              className="w-full p-5 bg-slate-950/50 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all h-40 resize-none text-slate-300 placeholder:text-slate-600 shadow-inner text-base leading-relaxed"
              placeholder="Paste the angry email here... (e.g. 'The checkout button is frozen on iPhone!')"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">Evidence (Optional)</label>
            <div className="flex items-center justify-center w-full">
              <label className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group
                ${image 
                  ? 'border-cyan-500/50 bg-cyan-950/10' 
                  : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                }`}>
                
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center z-10">
                  {image ? (
                    <>
                      <span className="text-2xl mb-2">📸</span>
                      <p className="text-sm text-cyan-400 font-medium">Screenshot Attached</p>
                      <p className="text-xs text-slate-500 mt-1">Click to change</p>
                    </>
                  ) : (
                    <>
                      <DoodleUpload />
                      <p className="mt-3 text-sm text-slate-400">Drag & drop or <span className="text-cyan-400 font-medium border-b border-cyan-400/30">browse</span></p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <button
            onClick={generateTicket}
            disabled={loading || cooldown > 0 || text.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98]
              ${loading || cooldown > 0 || text.length === 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-cyan-500/20 hover:to-cyan-500 border border-white/10"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white/80" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : cooldown > 0 ? (
              <span className="font-mono">Cooldown: {cooldown}s</span>
            ) : (
              "Triagify Ticket ✨"
            )}
          </button>
        </div>

        {/* OUTPUT TICKET */}
        {ticket && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-slate-900 border-l-4 border-cyan-500 rounded-r-xl shadow-2xl shadow-black/50 overflow-hidden">
              
              {/* Header */}
              <div className="bg-slate-950/50 p-6 border-b border-slate-800 flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">{ticket.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                     <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border
                      ${ticket.severity.toLowerCase().includes("critical") || ticket.severity.toLowerCase().includes("high")
                        ? "bg-red-500/10 text-red-400 border-red-500/20" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                      {ticket.severity}
                    </span>
                    <span className="text-slate-500 text-xs">AI Generated</span>
                  </div>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors group relative"
                  title="Copy to Clipboard"
                >
                  {copied ? <DoodleCheck /> : (
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div>
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Summary</h4>
                   <p className="text-slate-300 leading-relaxed border-l-2 border-slate-800 pl-4">{ticket.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Steps to Reproduce</h4>
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800/50">
                      <ul className="space-y-3">
                        {ticket.steps?.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-300">
                            <span className="text-cyan-500 font-mono select-none">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Suggested Fix</h4>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-500" />
                      <div className="relative bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-cyan-200/90 shadow-inner">
                        {ticket.fix}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}