import { IdentityProvider } from "@/theme/IdentityContext";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CursorGlow } from "@/components/CursorGlow";
import { Hero } from "@/components/Hero";
import { About } from "@/components/sections/About";
import { Research } from "@/components/sections/Research";
import { Publications } from "@/components/sections/Publications";
import { Projects } from "@/components/sections/Projects";
import { Music } from "@/components/sections/Music";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function App() {
  return (
    <IdentityProvider>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <About />
        <Research />
        <Publications />
        <Projects />
        <Music />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </IdentityProvider>
  );
}
