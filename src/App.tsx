import { Routes, Route } from "react-router-dom";
import { WipeProvider } from "@/components/WipeTransition";
import { useLenis } from "@/lib/useLenis";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Landing } from "@/routes/Landing";
import { ResearchWorld } from "@/routes/ResearchWorld";
import { MusicWorld } from "@/routes/MusicWorld";

export default function App() {
  const reduced = useReducedMotion();
  useLenis(!reduced);
  return (
    <WipeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/research" element={<ResearchWorld />} />
        <Route path="/music" element={<MusicWorld />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </WipeProvider>
  );
}
