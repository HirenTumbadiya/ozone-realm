"use client";

import { useEffect, useRef } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function ScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    import("locomotive-scroll").then((LocomotiveScrollModule) => {
      const LocomotiveScroll = LocomotiveScrollModule.default;
      const scroll = new LocomotiveScroll({
        el: containerRef.current as unknown as HTMLElement,
        smooth: true,
      });

      return () => scroll.destroy();
    });
  }, []);

  return (
    <div data-scroll-container ref={containerRef}>
      {children}
    </div>
  );
}
