/**
 * MIT License
 *
 * Copyright (c) 2026 rainy-juzixiao
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils/className";
import { useGlassRefraction, mergeRefs } from "./liquid-glass-filter";

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-[var(--motion-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
  {
    variants: {
      variant: {
        default: "glass glass-edge rounded-2xl",
        bordered: "bg-card border border-border rounded-2xl",
        hoverable:
          "glass glass-edge rounded-2xl hover:brightness-105 hover:shadow-[0_12px_36px_-12px_rgba(20,30,60,0.18)] hover:-translate-y-0.5",
        compact: "glass glass-edge rounded-xl",
        ghost: "bg-transparent",
      },
      size: {
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  cover?: React.ReactNode;
  actions?: React.ReactNode[];
  loading?: boolean;
  refraction?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, cover, actions, loading, refraction = true, children, ...props }, forwardedRef) => {
    const refract = useGlassRefraction({
      enabled: refraction && variant !== "ghost" && variant !== "bordered",
      radius: variant === "compact" ? 14 : 20,
      shape: "rounded",
      strength: 0.5,
    });

    if (loading) {
      return (
        <div className={cn(cardVariants({ variant, size: "md" }), "animate-pulse", className)}>
          <div className="space-y-3">
            <div className="h-4 w-1/3 rounded-full bg-muted/60" />
            <div className="h-3 w-full rounded-full bg-muted/50" />
            <div className="h-3 w-2/3 rounded-full bg-muted/50" />
          </div>
        </div>
      );
    }
    return (
      <div
        ref={mergeRefs(forwardedRef, refract.ref as React.Ref<HTMLDivElement>)}
        className={cn(cardVariants({ variant, size }), className)}
        style={{
          backdropFilter: refract.backdropFilter,
          WebkitBackdropFilter: refract.backdropFilter,
        }}
        {...props}
      >
        {cover && <div className="-m-px mb-4 overflow-hidden rounded-t-2xl">{cover}</div>}
        {children}
        {actions && actions.length > 0 && (
          <div className="-mx-5 -mb-5 mt-4 flex items-center justify-around border-t border-border/40 px-2 py-2">
            {actions.map((a, i) => (
              <div key={i} className="flex-1 text-center text-sm text-muted-foreground [&>button]:inline-flex [&>button]:items-center [&>button]:gap-1 [&>button]:rounded-md [&>button]:px-3 [&>button]:py-1.5 [&>button]:transition-colors [&>button]:hover:bg-muted/60 [&>button]:hover:text-foreground">
                {a}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";

export const GlassCardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("mb-3 flex items-start justify-between gap-2", className)} {...props}>
    {children}
  </div>
);

export const GlassCardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={cn("text-base font-semibold tracking-tight text-foreground", className)} {...props}>
    {children}
  </h3>
);

export const GlassCardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export const GlassCardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("text-sm text-foreground/90", className)} {...props}>
    {children}
  </div>
);

export const GlassCardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("mt-4 flex items-center justify-end gap-2", className)} {...props}>
    {children}
  </div>
);

export const GlassCardMeta: React.FC<{
  avatar?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}> = ({ avatar, title, description, className }) => (
  <div className={cn("flex items-start gap-3", className)}>
    {avatar && <div className="shrink-0">{avatar}</div>}
    <div className="min-w-0 flex-1">
      {title && <div className="font-medium text-foreground">{title}</div>}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </div>
  </div>
);

Object.assign(GlassCard, {
  Header: GlassCardHeader,
  Title: GlassCardTitle,
  Description: GlassCardDescription,
  Body: GlassCardBody,
  Footer: GlassCardFooter,
  Meta: GlassCardMeta,
});
