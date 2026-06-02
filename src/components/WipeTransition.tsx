import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface WipeContextValue {
  wipeTo: (route: string, color: string) => void;
}
const WipeCtx = createContext<WipeContextValue | null>(null);

export function WipeProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [color, setColor] = useState("#0b4cff");
  const pending = useRef<string | null>(null);

  const wipeTo = useCallback((route: string, c: string) => {
    setColor(c);
    pending.current = route;
    setActive(true);
  }, []);

  function onCovered() {
    if (pending.current) {
      navigate(pending.current);
      pending.current = null;
      window.scrollTo(0, 0);
      setActive(false);
    }
  }

  return (
    <WipeCtx.Provider value={{ wipeTo }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ backgroundColor: color, transformOrigin: "bottom" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            onAnimationComplete={onCovered}
          />
        )}
      </AnimatePresence>
    </WipeCtx.Provider>
  );
}

export function useWipe(): WipeContextValue {
  const ctx = useContext(WipeCtx);
  if (!ctx) throw new Error("useWipe must be used within WipeProvider");
  return ctx;
}
