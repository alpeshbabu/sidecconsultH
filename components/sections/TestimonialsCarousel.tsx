"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

// Placeholder testimonials for demonstration
const placeholderTestimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "SIDEC Consulting transformed our quality management system. Their deep understanding of ISO 13485 and FDA requirements helped us achieve certification ahead of schedule.",
    author: "Sarah Johnson",
    role: "VP of Quality",
    company: "MedTech Innovations",
  },
  {
    id: "2",
    quote:
      "The injection molding expertise brought to our process validation was exceptional. We reduced scrap rates by 40% and improved cycle times significantly.",
    author: "Michael Chen",
    role: "Director of Manufacturing",
    company: "Precision Medical Devices",
  },
  {
    id: "3",
    quote:
      "Their facility design guidance was invaluable. From cleanroom specifications to production flow optimization, every recommendation was practical and impactful.",
    author: "Emily Rodriguez",
    role: "Operations Manager",
    company: "BioMed Solutions",
  },
];

export function TestimonialsCarousel({
  testimonials = placeholderTestimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, autoPlayInterval, nextSlide]);

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className={cn("relative", className)}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-0 left-0 -translate-x-2 -translate-y-2">
              <Quote className="h-16 w-16 text-primary/10 rotate-180" />
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10 text-center px-4 md:px-12 py-8">
              <blockquote className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-foreground/90 max-w-4xl mx-auto">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  {currentTestimonial.image ? (
                    <AvatarImage
                      src={currentTestimonial.image}
                      alt={currentTestimonial.author}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {currentTestimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold text-foreground">
                    {currentTestimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="h-10 w-10 rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all duration-300",
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-primary/30 hover:bg-primary/50"
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="h-10 w-10 rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TestimonialsCarousel;
