"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface AnimatedStatsProps {
  stats: readonly Stat[];
  className?: string;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Extract numeric part and text part
  const numericMatch = value.match(/^(\d+)/);
  const numericPart = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const textPart = value.replace(/^\d+/, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || numericPart === 0) {
      setDisplayValue(value);
      return;
    }

    const duration = 1600;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(numericPart * easeOutQuart);
      setDisplayValue(`${currentValue}${textPart}`);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, numericPart, textPart, value]);

  return (
    <div
      ref={ref}
      className="whitespace-nowrap font-display text-3xl font-bold leading-none tracking-tight tabular-nums text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
    >
      {prefix}
      {displayValue}
      {suffix}
    </div>
  );
}

export function AnimatedStats({ stats, className }: AnimatedStatsProps) {
  return (
    <section className={cn("hairline-t hairline-b bg-muted/20", className)}>
      <div className="container-wide py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "group relative px-4 py-6 md:px-8",
                // hairline column dividers (skip first in each visual row)
                index % 2 !== 0 && "hairline-l",
                index !== 0 && "md:hairline-l",
                index === 2 && "max-md:hairline-t",
                index === 3 && "max-md:hairline-t"
              )}
            >
              {/* measurement tick + index */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-px bg-signal" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <AnimatedNumber value={stat.value} />
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimatedStats;
