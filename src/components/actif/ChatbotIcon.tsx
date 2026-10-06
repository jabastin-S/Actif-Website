import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function ChatbotIcon() {
  return (
    <>
      <style>{`
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[float-subtle_5s_ease-in-out_infinite\\] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <div className="group fixed bottom-6 right-6 z-40 md:bottom-10 md:right-10 flex items-center justify-end">
        {/* Tooltip */}
        <div className="absolute right-17 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out pointer-events-none whitespace-nowrap">
          <div className="rounded-full bg-[#0d1f16]/90 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-[#e8ebd9] border border-[#e8ebd9]/10 shadow-lg">
            Chat with ACTIF
          </div>
        </div>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-13 w-13 items-center justify-center rounded-full bg-[#0d1f16] border border-[#e8ebd9]/10 text-[#e8ebd9] shadow-[0_4px_20px_rgba(13,31,22,0.2)] transition-all duration-300 hover:border-[#e8ebd9]/30 hover:shadow-[0_4px_25px_rgba(13,31,22,0.4)] animate-[float-subtle_5s_ease-in-out_infinite]"
          aria-label="Open chat"
        >
          {/* Subtle ambient hover */}
          <div className="absolute inset-0 rounded-full bg-[#e8ebd9]/0 transition-colors duration-300 group-hover:bg-[#e8ebd9]/5" />
          
          <MessageSquare className="relative z-10 h-5 w-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
          
          {/* Subtle notification dot */}
          <span className="absolute right-3 top-3 flex h-2.5 w-2.5 z-20">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8ebd9] opacity-40"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e8ebd9]/80"></span>
          </span>
        </motion.button>
      </div>
    </>
  );
}
