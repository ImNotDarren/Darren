import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyPalette, type Identity } from "@/theme/palettes";

interface IdentityContextValue {
  identity: Identity;
  setIdentity: (id: Identity) => void;
  toggle: () => void;
}

const IdentityCtx = createContext<IdentityContextValue | null>(null);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<Identity>("researcher");

  const setIdentity = useCallback((id: Identity) => {
    setIdentityState(id);
    applyPalette(id);
  }, []);

  const toggle = useCallback(() => {
    setIdentityState((prev) => {
      const next: Identity = prev === "researcher" ? "musician" : "researcher";
      applyPalette(next);
      return next;
    });
  }, []);

  useEffect(() => {
    applyPalette(identity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ identity, setIdentity, toggle }),
    [identity, setIdentity, toggle],
  );

  return <IdentityCtx.Provider value={value}>{children}</IdentityCtx.Provider>;
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityCtx);
  if (!ctx) throw new Error("useIdentity must be used within IdentityProvider");
  return ctx;
}
