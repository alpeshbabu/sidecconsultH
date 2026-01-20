"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  trackContactFormStart,
  trackContactFormComplete,
  trackContactFormError,
  trackServiceInterest,
} from "@/lib/analytics";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Rocket,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MainLayout } from "@/components/layout";
import {
  SERVICE_INTEREST_OPTIONS,
  PROJECT_TIMELINE_OPTIONS,
} from "@/lib/constants";
import {
  contactInquirySchema,
  type ContactInquiryFormValues,
} from "@/lib/validations";

// Process steps
const processSteps = [
  {
    icon: MessageSquare,
    title: "Submit Your Inquiry",
    description: "Share your challenge or project details through this form.",
  },
  {
    icon: Phone,
    title: "Discovery Call",
    description:
      "We'll schedule a call to understand your specific needs and goals.",
  },
  {
    icon: Users,
    title: "Know Your Needs",
    description:
      "Deep dive into your requirements, constraints, and success criteria.",
  },
  {
    icon: CheckCircle,
    title: "Tailored Proposal",
    description:
      "Receive a customized approach designed for your unique situation.",
  },
  {
    icon: FileCheck,
    title: "Contract Agreement",
    description: "Finalize scope, timeline, and terms with a clear agreement.",
  },
  {
    icon: Rocket,
    title: "Start Consultation",
    description:
      "Begin working together to achieve your manufacturing goals.",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactInquiryFormValues>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      serviceInterest: "",
      projectTimeline: "",
      message: "",
      privacyAccepted: false,
    },
  });

  // Track form start on first interaction
  useEffect(() => {
    const handleFormFocus = () => {
      if (!hasStartedForm) {
        trackContactFormStart();
        setHasStartedForm(true);
      }
    };

    const formElement = document.querySelector("form");
    if (formElement) {
      formElement.addEventListener("focus", handleFormFocus, true);
      return () => formElement.removeEventListener("focus", handleFormFocus, true);
    }
  }, [hasStartedForm]);

  async function onSubmit(data: ContactInquiryFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        trackContactFormError(result.error || "submission_failed");
        throw new Error(result.error || "Failed to submit inquiry");
      }

      // Track successful form completion
      trackContactFormComplete(data.serviceInterest);
      trackServiceInterest(data.serviceInterest, "contact_form");

      setIsSubmitted(true);
      form.reset();
      toast.success("Inquiry submitted successfully!", {
        description: "We'll be in touch within 24-48 hours.",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit inquiry", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const messageLength = form.watch("message")?.length || 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-primary/30 bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2 text-primary" />
              Start the Conversation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Let&apos;s Understand{" "}
              <span className="text-gradient">Your Needs</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Every great partnership starts with understanding. Share your
              challenges and goals, and we&apos;ll work together to find the
              right solution for your organization.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center lg:items-start lg:text-left xl:items-center xl:text-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 text-xs font-medium text-primary">
                      Step {index + 1}
                    </div>
                    <h3 className="font-semibold text-sm">{step.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                // Success State
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900">
                      Thank You for Reaching Out!
                    </h2>
                    <p className="mt-4 max-w-md text-green-700">
                      Your inquiry has been received. We&apos;ll review your
                      information and get back to you within{" "}
                      <strong>24-48 hours</strong> to schedule a discovery call.
                    </p>
                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          form.reset();
                        }}
                        variant="outline"
                      >
                        Submit Another Inquiry
                      </Button>
                      <Link href="/">
                        <Button>Return to Homepage</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Form
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Tell Us About Your Project
                    </CardTitle>
                    <CardDescription>
                      The more details you provide, the better we can prepare
                      for our conversation. All fields marked with * are
                      required.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Contact Information
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="john@company.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="+1 (555) 123-4567"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Optional</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="companyName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Company Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Acme Medical Devices"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>Optional</FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Project Details */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Project Details
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="serviceInterest"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Service Area of Interest *
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a service area" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {SERVICE_INTEREST_OPTIONS.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="projectTimeline"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Timeline *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="When do you need help?" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {PROJECT_TIMELINE_OPTIONS.map((option) => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Tell Us About Your Challenge *
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please describe your current situation, challenges you're facing, and what you hope to achieve. The more context you provide, the better we can understand your needs."
                                    className="min-h-[150px] resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <div className="flex justify-between text-xs">
                                  <FormMessage />
                                  <span
                                    className={`${
                                      messageLength < 500
                                        ? "text-muted-foreground"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {messageLength}/500 minimum characters
                                  </span>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>

                        <Separator />

                        {/* Privacy & Submit */}
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="privacyAccepted"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal">
                                    I agree to the{" "}
                                    <Link
                                      href="/privacy"
                                      className="text-primary underline hover:no-underline"
                                    >
                                      Privacy Policy
                                    </Link>{" "}
                                    and consent to being contacted about my
                                    inquiry. *
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full btn-glow"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                Submit Inquiry
                                <Send className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>

                          <p className="text-center text-xs text-muted-foreground">
                            We typically respond within 24-48 business hours.
                          </p>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* What to Expect */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Response within 24-48 hours</p>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll review your inquiry and reach out
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      2
                    </div>
                    <div>
                      <p className="font-medium">30-minute discovery call</p>
                      <p className="text-sm text-muted-foreground">
                        Understand your needs and goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Customized proposal</p>
                      <p className="text-sm text-muted-foreground">
                        Tailored approach for your situation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Directly */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule Directly
                  </CardTitle>
                  <CardDescription>
                    Prefer to book a time that works for you? Schedule a
                    discovery call directly on our calendar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/schedule" className="block">
                    <Button className="w-full btn-glow">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Discovery Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    30-minute free consultation • No obligation
                  </p>
                </CardContent>
              </Card>

              {/* Direct Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Prefer Direct Contact?
                  </CardTitle>
                  <CardDescription>
                    You can also reach out through these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href="mailto:contact@sidecconsulting.com"
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contact@sidecconsulting.com
                      </p>
                    </div>
                  </a>
                </CardContent>
              </Card>

              {/* IP Protection Guarantee */}
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">
                      Complete Privacy Guaranteed
                    </p>
                    <p className="text-sm text-green-700">
                      Protect your intellectual property with confidence. Your
                      information is always kept strictly confidential.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">Quick Response Guaranteed</p>
                    <p className="text-sm text-muted-foreground">
                      We respond to all inquiries within 24-48 business hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Common Questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Answers to frequently asked questions about our consulting
                process
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {[
                {
                  question: "What happens after I submit the contact form?",
                  answer:
                    "Within 24-48 hours, you'll receive an email from us to schedule a discovery call. This initial call is free and helps us understand your specific needs, challenges, and goals.",
                },
                {
                  question: "How long is the discovery call?",
                  answer:
                    "The initial discovery call typically lasts 30-45 minutes. We'll discuss your current situation, challenges, and what success looks like for your project. There's no obligation after this call.",
                },
                {
                  question: "What information should I include in my message?",
                  answer:
                    "The more context you provide, the better. Include details about your company, the specific challenges you're facing, your timeline, and any constraints (budget, resources, regulatory requirements). This helps us prepare for our conversation.",
                },
                {
                  question: "Do you work with companies of all sizes?",
                  answer:
                    "Yes! We work with startups bringing their first medical device to market, mid-size manufacturers scaling operations, and large enterprises optimizing global supply chains. Our approach is tailored to your specific needs and resources.",
                },
              ].map((faq, index) => (
                <Card key={index} className="card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
