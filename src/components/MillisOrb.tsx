import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Loader2, Square, AlertCircle, Bot, X } from "lucide-react";
import Millis, { AgentState } from "@millisai/web-sdk";

export function MillisOrb() {
  const [sessionState, setSessionState] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [agentState, setAgentState] = useState<AgentState>(AgentState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clientRef = useRef<any>(null);

  const publicKey = import.meta.env['VITE_MILLIS_PUBLIC_KEY'] || "dummy_public_key";
  const agentId = import.meta.env['VITE_MILLIS_AGENT_ID'] || "dummy_agent_id";

  const cleanup = useCallback(async () => {
    if (clientRef.current) {
      try {
        await clientRef.current.stop();
      } catch (e) {
        console.error("Error stopping Millis client:", e);
      }
      clientRef.current = null;
    }
    setSessionState("idle");
    setAgentState(AgentState.IDLE);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const toggleSession = async () => {
    if (sessionState === "idle" || sessionState === "error") {
      setSessionState("connecting");
      setErrorMessage(null);

      try {
        if (!clientRef.current) {
          clientRef.current = Millis.createClient({
            publicKey: publicKey,
          });

          clientRef.current.on("onready", () => {
            setSessionState("active");
          });

          clientRef.current.on("onagentstate", (state: AgentState) => {
            setAgentState(state);
          });

          clientRef.current.on("onerror", (err: any) => {
            console.error("Millis error:", err);
            setSessionState("error");
            setErrorMessage("Connection failed");
            setTimeout(() => {
              cleanup();
            }, 5000);
          });

          clientRef.current.on("onclose", () => {
            cleanup();
          });
        }

        await clientRef.current.start({
          agent: {
            agent_id: agentId,
          },
        });
      } catch (error) {
        console.error("Failed to start Millis session:", error);
        setSessionState("error");
        setErrorMessage("Microphone/Connection failed");
        setTimeout(() => {
          cleanup();
        }, 5000);
      }
    } else {
      // Disconnect
      await cleanup();
    }
  };

  // Determine appearance based on state
  let icon = <Bot className="h-6 w-6 stroke-[1.5] text-[#e8ebd9] transition-all duration-500 group-hover:scale-110 group-hover:text-white" />;
  let orbClass = "bg-[#0d1f16] border-[#e8ebd9]/20 shadow-[0_0_15px_rgba(13,31,22,0.4)] hover:border-[#e8ebd9]/40 hover:shadow-[0_0_25px_rgba(232,235,217,0.15)]"; 
  let statusText = "Talk to ACTIF";
  let showTooltip = true;

  // Active rings
  let rings = null;
  let animateOrb = "animate-[breathe_4s_ease-in-out_infinite]";

  if (sessionState === "connecting") {
    icon = <Loader2 className="h-6 w-6 text-[#e8ebd9] animate-spin stroke-[1.5]" />;
    statusText = "Connecting...";
    orbClass = "bg-[#112a1d] border-[#e8ebd9]/40 shadow-[0_0_25px_rgba(232,235,217,0.2)]";
    animateOrb = ""; // disable breathing
    rings = (
      <div className="absolute inset-0 rounded-full border border-[#e8ebd9]/30 animate-[spin_3s_linear_infinite]" />
    );
  } else if (sessionState === "active") {
    icon = <X className="h-6 w-6 stroke-[1.5] text-[#e8ebd9]/80 group-hover:text-white transition-colors" />; // Cancel/Stop icon
    showTooltip = false; // Usually don't need tooltip when active
    
    if (agentState === AgentState.PREPARE_ANSWER) {
      // Processing
      orbClass = "bg-[#153424] border-[#e8ebd9]/50 shadow-[0_0_30px_rgba(232,235,217,0.3)]";
      animateOrb = "animate-[pulse_1.5s_ease-in-out_infinite]";
      rings = (
        <div className="absolute -inset-2.5 rounded-full border border-[#e8ebd9]/20 animate-[spin_2s_linear_infinite]" />
      );
    } else if (agentState === AgentState.ANSWER) {
      // Speaking
      orbClass = "bg-[#18402a] border-[#e8ebd9]/60 shadow-[0_0_35px_rgba(232,235,217,0.4)]";
      animateOrb = "";
      rings = (
        <>
          <div className="absolute inset-0 rounded-full border border-[#e8ebd9]/40 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute inset-0 rounded-full border border-[#e8ebd9]/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]" />
        </>
      );
    } else {
      // Listening
      orbClass = "bg-[#1a4a30] border-[#e8ebd9]/40 shadow-[0_0_30px_rgba(232,235,217,0.3)]";
      animateOrb = "animate-[breathe_1.5s_ease-in-out_infinite]"; // faster breathing
      rings = (
        <>
          <div className="absolute -inset-1.5 rounded-full bg-[#e8ebd9]/10 animate-[pulse_1s_ease-in-out_infinite]" />
          <div className="absolute -inset-3 rounded-full border border-[#e8ebd9]/20 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </>
      );
    }
  } else if (sessionState === "error") {
    icon = <AlertCircle className="h-6 w-6 stroke-[1.5] text-red-300" />;
    orbClass = "bg-red-950 border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.3)]";
    statusText = errorMessage || "Unable to connect.";
    animateOrb = "";
  }

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[breathe_4s_ease-in-out_infinite\\],
          .animate-\\[breathe_1\\.5s_ease-in-out_infinite\\],
          .animate-\\[spin_3s_linear_infinite\\],
          .animate-\\[spin_2s_linear_infinite\\],
          .animate-\\[ping_2\\.5s_cubic-bezier\\(0\\,0\\,0\\.2\\,1\\)_infinite\\],
          .animate-\\[ping_3s_cubic-bezier\\(0\\,0\\,0\\.2\\,1\\)_infinite_0\\.5s\\],
          .animate-\\[pulse_1s_ease-in-out_infinite\\],
          .animate-\\[pulse_1\\.5s_ease-in-out_infinite\\] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="group fixed bottom-22.5 right-6 z-50 md:bottom-27 md:right-10 flex items-center justify-end">
        {/* Tooltip */}
        <div 
          className={`absolute right-19 whitespace-nowrap transition-all duration-300 ease-in-out pointer-events-none 
            ${showTooltip ? 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0' : 'opacity-0'}
            ${sessionState === 'connecting' || sessionState === 'error' ? 'opacity-100 translate-x-0' : ''}
          `}
        >
          <div className="rounded-full bg-[#0d1f16]/90 backdrop-blur-md px-4 py-2 text-sm font-medium text-[#e8ebd9] border border-[#e8ebd9]/10 shadow-lg">
            {statusText}
          </div>
        </div>

        {/* Orb */}
        <button
          onClick={toggleSession}
          aria-label={sessionState === "active" ? "End ACTIF AI conversation" : "Talk to ACTIF AI"}
          className={`relative flex h-15 w-15 md:h-17 md:w-17 items-center justify-center rounded-full border transition-all duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-[#e8ebd9]/50 focus:ring-offset-2 focus:ring-offset-[#0d1f16] group-hover:scale-105 ${orbClass} ${animateOrb}`}
        >
          {/* Subtle ambient halo */}
          <div className="absolute inset-0 rounded-full bg-[#e8ebd9]/0 transition-colors duration-500 group-hover:bg-[#e8ebd9]/5" />
          
          {/* Dynamic state rings */}
          {rings}
          
          {/* Icon Container */}
          <div className="relative z-10 flex items-center justify-center">
            {icon}
          </div>
        </button>
      </div>
    </>
  );
}
