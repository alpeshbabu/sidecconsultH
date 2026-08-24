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
  SERVICE_SPECIFIC_FIELDS,
  type ServiceFieldConfig,
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
      supplierAddress: "",
      estimatedBudget: "",
      otherSites: "",
      otherSiteLocations: "",
      expectedDocuments: "",
      regulatoryStandards: "",
      privacyAccepted: false,
    },
  });

  // Preselect the service area from a ?service= query param (e.g. funnel CTAs
  // pointing to /contact?service=ai-readiness). Read from the URL directly to
  // avoid a useSearchParams Suspense boundary.
  useEffect(() => {
    const svc = new URLSearchParams(window.location.search).get("service");
    if (svc && SERVICE_INTEREST_OPTIONS.some((o) => o.value === svc)) {
      form.setValue("serviceInterest", svc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const selectedService = form.watch("serviceInterest");
  const serviceFields: ServiceFieldConfig[] =
    SERVICE_SPECIFIC_FIELDS[selectedService] || [];
  const messageLength = form.watch("message")?.length || 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <div className="grid-blueprint absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 top-0 h-px bg-signal/40" />
        </div>

        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-5 justify-center">Start the Conversation</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Let&apos;s discuss your{" "}
              <span className="text-signal">manufacturing challenge</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Tell us about your project — process validation, quality systems,
              facility design, scientific molding, or smart manufacturing — and
              we&apos;ll work with you to design a tailored solution.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="hairline-t hairline-b bg-muted/20 py-12">
        <div className="container-wide">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center lg:items-start lg:text-left xl:items-center xl:text-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-primary">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                      Step {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="font-display font-semibold text-sm">{step.title}</h3>
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
                <Card className="card-technical rounded-none">
                  <CardContent className="flex flex-col items-center py-16 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center border border-hairline text-signal">
                      <CheckCircle className="h-10 w-10" />
                    </div>
                    <p className="eyebrow mb-3 justify-center text-signal">Inquiry Received</p>
                    <h2 className="font-display text-2xl font-bold tracking-tight">
                      Thank You for Reaching Out!
                    </h2>
                    <p className="mt-4 max-w-md text-muted-foreground">
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
                      <Button asChild variant="technical">
                        <Link href="/">Return to Homepage</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Form
                <Card className="card-technical rounded-none">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl tracking-tight">
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
                          <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Contact Information
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Full Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Smith" className="rounded-sm focus-visible:ring-signal" {...field} />
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
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Email Address *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="john@company.com"
                                      className="rounded-sm focus-visible:ring-signal"
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
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="tel"
                                      placeholder="+1 (555) 123-4567"
                                      className="rounded-sm focus-visible:ring-signal"
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
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Company Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Acme Medical Devices"
                                      className="rounded-sm focus-visible:ring-signal"
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
                          <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Project Details
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="serviceInterest"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                    Service Area of Interest *
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="rounded-sm focus-visible:ring-signal">
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
                                  <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">Project Timeline *</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="rounded-sm focus-visible:ring-signal">
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

                          {/* Service-Specific Fields */}
                          {serviceFields.length > 0 && (
                            <div className="border border-hairline bg-muted/20 p-4 space-y-4">
                              <div className="flex items-center gap-2">
                                <h4 className="font-display text-sm font-semibold">
                                  Help Us Understand Your{" "}
                                  {SERVICE_INTEREST_OPTIONS.find(
                                    (o) => o.value === selectedService
                                  )?.label || "Project"}{" "}
                                  Needs
                                </h4>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                These optional fields help us prepare a more
                                relevant response for your specific service area.
                              </p>
                              <div className="grid gap-4">
                                {serviceFields.map((fieldConfig) => (
                                  <FormField
                                    key={fieldConfig.key}
                                    control={form.control}
                                    name={fieldConfig.key}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{fieldConfig.label}</FormLabel>
                                        <FormControl>
                                          {fieldConfig.type === "textarea" ? (
                                            <Textarea
                                              placeholder={fieldConfig.placeholder}
                                              className="min-h-[80px] resize-none rounded-sm bg-background focus-visible:ring-signal"
                                              {...field}
                                            />
                                          ) : (
                                            <Input
                                              placeholder={fieldConfig.placeholder}
                                              className="rounded-sm bg-background focus-visible:ring-signal"
                                              {...field}
                                            />
                                          )}
                                        </FormControl>
                                        {fieldConfig.description && (
                                          <FormDescription>
                                            {fieldConfig.description}
                                          </FormDescription>
                                        )}
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                  Tell Us About Your Challenge *
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Please describe your current situation, challenges you're facing, and what you hope to achieve. The more context you provide, the better we can understand your needs."
                                    className="min-h-[150px] resize-none rounded-sm focus-visible:ring-signal"
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
                                    className="mt-1 h-4 w-4 rounded-sm border-hairline text-signal focus-visible:ring-signal"
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
                            variant="technical"
                            size="lg"
                            className="w-full"
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
              <Card className="card-technical rounded-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Calendar className="h-5 w-5 text-signal" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-hairline font-mono text-xs font-bold text-primary">
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
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-hairline font-mono text-xs font-bold text-primary">
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
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-hairline font-mono text-xs font-bold text-primary">
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
              <Card className="card-technical rounded-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Calendar className="h-5 w-5 text-signal" />
                    Schedule Directly
                  </CardTitle>
                  <CardDescription>
                    Prefer to book a time that works for you? Schedule a
                    discovery call directly on our calendar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="technical" className="w-full">
                    <Link href="/schedule">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Discovery Call
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    30-minute free consultation • No obligation
                  </p>
                </CardContent>
              </Card>

              {/* Direct Contact */}
              <Card className="card-technical rounded-none">
                <CardHeader>
                  <CardTitle className="font-display text-lg">
                    Prefer Direct Contact?
                  </CardTitle>
                  <CardDescription>
                    You can also reach out through these channels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <a
                    href="mailto:contact@sidecconsulting.com"
                    className="flex items-center gap-3 border border-hairline p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center border border-hairline text-primary">
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
              <Card className="card-technical rounded-none">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-hairline text-signal">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display font-semibold">
                      Complete Privacy Guaranteed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Protect your intellectual property with confidence. Your
                      information is always kept strictly confidential.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="surface-ink relative overflow-hidden rounded-none border-0">
                <div className="grid-dots absolute inset-0 opacity-50" aria-hidden />
                <CardContent className="relative flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/15 text-signal">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-ink-foreground">Quick Response Guaranteed</p>
                    <p className="text-sm text-ink-muted">
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
      <section className="section-padding hairline-t bg-muted/20">
        <div className="container-wide">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="eyebrow mb-5 justify-center">FAQ</p>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
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
                <Card key={index} className="card-technical rounded-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base font-semibold">
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
