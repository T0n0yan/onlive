import { useCallback, useEffect, useState } from "react";
import { Generator } from "./Generator.tsx";
import { Hero } from "./Hero.tsx";
import { Cursor, setScrollLocked, useSmoothScroll } from "./motion.tsx";
import { Contact, Footer, Marquee, Nav, Preloader, Process, ScrollProgress, Services, Stats, Why } from "./Sections.tsx";
import { Work } from "./Work.tsx";

export function App() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  useSmoothScroll();

  useEffect(() => {
    setScrollLocked(!ready);
    document.documentElement.classList.toggle("is-loading", !ready);
  }, [ready]);

  return (
    <>
      <Preloader onDone={done} />
      <Cursor />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Stats />
        <Work />
        <Services />
        <Why />
        <Generator />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
