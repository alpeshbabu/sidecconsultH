"use client";

import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function CVDownloadButton() {
  const handleDownload = () => {
    toast.info("CV download coming soon!", {
      description: "Please contact us for more information about our qualifications.",
    });
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardContent className="p-0">
        <button
          className="flex w-full items-center gap-4 p-6 text-left transition-colors hover:bg-muted/50"
          onClick={handleDownload}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Download className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Download CV</h3>
            <p className="text-sm text-muted-foreground">
              Professional summary and qualifications (PDF)
            </p>
          </div>
          <Badge variant="secondary">Coming Soon</Badge>
        </button>
      </CardContent>
    </Card>
  );
}

export default CVDownloadButton;
