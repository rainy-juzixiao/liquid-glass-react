"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils/className";

const titleVariants = cva(
  "font-semibold tracking-[-0.01em] text-foreground leading-tight",
  {
    variants: {
      level: {
        display: "text-[44px] md:text-[56px] tracking-[-0.025em] leading-[1.05]",
        h1: "text-[32px] md:text-[40px] tracking-[-0.02em] leading-[1.1]",
        h2: "text-[24px] md:text-[28px] tracking-[-0.018em] leading-[1.15]",
        h3: "text-[20px] md:text-[22px] tracking-[-0.014em] leading-[1.2]",
        h4: "text-[18px] tracking-[-0.012em] leading-[1.25]",
        h5: "text-[16px] tracking-[-0.01em] leading-[1.3]",
      },
    },
    defaultVariants: { level: "h3" },
  },
);

const textVariants = cva("leading-relaxed", {
  variants: {
    size: {
      body: "text-[15px]",
      small: "text-[13px] text-muted-foreground",
      caption: "text-[12px] text-muted-foreground uppercase tracking-[0.08em]",
      code: "font-mono text-[13px] bg-muted/60 px-1.5 py-0.5 rounded-md",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
  },
  defaultVariants: { size: "body", weight: "regular" },
});

export interface GlassTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  level?: NonNullable<VariantProps<typeof titleVariants>["level"]>;
}

export const GlassTitle = React.forwardRef<HTMLHeadingElement, GlassTitleProps>(
  ({ className, level = "h3", ...props }, ref) => {
    const Tag = (level === "display" ? "h1" : level) as React.ElementType;
    return React.createElement(Tag, {
      ref,
      className: cn(titleVariants({ level }), className),
      ...props,
    });
  },
);
GlassTitle.displayName = "GlassTitle";

export interface GlassTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {}

export const GlassText = React.forwardRef<HTMLSpanElement, GlassTextProps>(
  ({ className, size, weight, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(textVariants({ size, weight }), className)}
      {...props}
    />
  ),
);
GlassText.displayName = "GlassText";

export const GlassParagraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    ellipsis?: boolean | number;
  }
>(({ className, ellipsis, style, children, ...props }, ref) => {
  const ellipsisStyle: React.CSSProperties =
    typeof ellipsis === "number"
      ? {
          display: "-webkit-box",
          WebkitLineClamp: ellipsis,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }
      : ellipsis
        ? {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }
        : {};

  return (
    <p
      ref={ref}
      className={cn("text-[15px] leading-relaxed text-foreground/90", className)}
      style={{ ...ellipsisStyle, ...style }}
      {...props}
    >
      {children}
    </p>
  );
});
GlassParagraph.displayName = "GlassParagraph";

export const GlassLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "text-primary underline-offset-4 hover:underline transition-colors duration-[var(--motion-base)] cursor-pointer",
      className,
    )}
    {...props}
  >
    {children}
  </a>
));
GlassLink.displayName = "GlassLink";

export const GlassCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "font-mono text-[13px] bg-muted/70 text-foreground px-1.5 py-0.5 rounded-md border border-border/50",
      className,
    )}
    {...props}
  >
    {children}
  </code>
));
GlassCode.displayName = "GlassCode";

export const GlassMark = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <mark
    ref={ref}
    className={cn(
      "bg-[color:var(--warning)]/25 text-foreground px-1.5 py-0.5 rounded-md",
      className,
    )}
    {...props}
  >
    {children}
  </mark>
));
GlassMark.displayName = "GlassMark";

export const GlassTypography = Object.assign(
  {} as {
    Title: typeof GlassTitle;
    Text: typeof GlassText;
    Paragraph: typeof GlassParagraph;
    Link: typeof GlassLink;
    Code: typeof GlassCode;
    Mark: typeof GlassMark;
  },
  {
    Title: GlassTitle,
    Text: GlassText,
    Paragraph: GlassParagraph,
    Link: GlassLink,
    Code: GlassCode,
    Mark: GlassMark,
  },
);
