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

    const duration = 2000;
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
    <div ref={ref} className="text-2xl font-bold text-primary md:text-4xl lg:text-5xl tabular-nums">
      {prefix}{displayValue}{suffix}
    </div>
  );
}

export function AnimatedStats({ stats, className }: AnimatedStatsProps) {
  return (
    <section className={cn("border-y bg-muted/30", className)}>
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AnimatedNumber value={stat.value} />
              <div className="mt-2 text-xs font-medium text-muted-foreground md:text-sm">
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
