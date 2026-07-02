"use client";

import { useEffect } from "react";

export default function SparkEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find nearest button or link target
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.classList.contains("btn") ||
        target.classList.contains("admin-nav-link");

      if (!isInteractive) return;

      const x = e.clientX;
      const y = e.clientY;

      // Create local wrapper for the spark particles
      const container = document.createElement("div");
      container.className = "spark-container";
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      document.body.appendChild(container);

      // Create laser beam slice lines (one vertical and one horizontal crossing)
      const laserV = document.createElement("div");
      laserV.className = "laser-beam laser-vertical";
      container.appendChild(laserV);

      // Create dynamic sparks (16 particles)
      const sparkCount = 16;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        spark.className = "spark-particle";

        // Angles between 0 and 360 degrees
        const angle = Math.random() * Math.PI * 2;
        // Travel distance between 50px and 150px
        const distance = 40 + Math.random() * 110;

        // Long thin streak width/height
        const width = 1 + Math.random() * 1.5;
        const height = 12 + Math.random() * 20;

        // Calculate translation targets
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        // Rotate the particle to face its travel trajectory (90 offset since standard is vertical)
        const rotationDeg = (angle * 180) / Math.PI + 90;

        // Set CSS custom properties
        spark.style.width = `${width}px`;
        spark.style.height = `${height}px`;
        spark.style.setProperty("--tx", `${tx}px`);
        spark.style.setProperty("--ty", `${ty}px`);
        spark.style.setProperty("--rot", `${rotationDeg}deg`);

        // Randomized delay and duration for organic spread (extending to up to 2 seconds)
        spark.style.animationDelay = `${Math.random() * 0.08}s`;
        spark.style.animationDuration = `${1.0 + Math.random() * 1.0}s`;

        // Color palettes from hot white to deep metallic orange
        const colors = [
          "#ffffff", // Core hot white
          "#fff1ad", // Bright yellow
          "#ffca3a", // Amber
          "#f26d21", // Accent orange
          "#e05e15", // Deep heat red
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.color = color;
        spark.style.backgroundColor = color;

        container.appendChild(spark);
      }

      // Automatically clean up elements from DOM after animations complete (extending to 2.5s)
      setTimeout(() => {
        container.remove();
      }, 2500);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
}
