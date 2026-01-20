import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ProfileCardProps {
  name: string;
  title: string;
  company?: string;
  bio?: string;
  image?: string;
  email?: string;
  linkedIn?: string;
  website?: string;
  expertise?: string[];
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function ProfileCard({
  name,
  title,
  company,
  bio,
  image,
  email,
  linkedIn,
  website,
  expertise,
  variant = "default",
  className,
}: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (variant === "compact") {
    return (
      <Card className={cn("h-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              {image ? (
                <AvatarImage src={image} alt={name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{name}</h3>
              <p className="text-sm text-muted-foreground truncate">{title}</p>
              {company && (
                <p className="text-xs text-muted-foreground truncate">
                  {company}
                </p>
              )}
            </div>
            {linkedIn && (
              <Link href={linkedIn} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card className={cn("h-full overflow-hidden", className)}>
        <div className="grid md:grid-cols-2">
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {initials}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <CardTitle className="text-2xl mb-1">{name}</CardTitle>
            <p className="text-lg text-primary font-medium">{title}</p>
            {company && (
              <p className="text-sm text-muted-foreground mt-1">{company}</p>
            )}
            {bio && (
              <CardDescription className="mt-4 text-base leading-relaxed">
                {bio}
              </CardDescription>
            )}
            {expertise && expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {expertise.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-2">
              {linkedIn && (
                <Link href={linkedIn} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </Link>
              )}
              {email && (
                <Link href={`mailto:${email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </Link>
              )}
              {website && (
                <Link href={website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("h-full text-center", className)}>
      <CardHeader className="pb-4">
        {/* Avatar */}
        <div className="mx-auto mb-4">
          {image ? (
            <div className="relative h-28 w-28 rounded-full overflow-hidden ring-4 ring-primary/20">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <Avatar className="h-28 w-28 border-4 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <p className="text-primary font-medium">{title}</p>
        {company && (
          <p className="text-sm text-muted-foreground">{company}</p>
        )}
      </CardHeader>
      <CardContent>
        {bio && (
          <CardDescription className="leading-relaxed mb-4">
            {bio}
          </CardDescription>
        )}
        {expertise && expertise.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {expertise.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}
        {/* Social Links */}
        <div className="flex items-center justify-center gap-2">
          {linkedIn && (
            <Link href={linkedIn} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {email && (
            <Link href={`mailto:${email}`}>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {website && (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
