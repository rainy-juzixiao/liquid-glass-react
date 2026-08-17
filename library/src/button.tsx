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
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils/className";
import { useGlassRefraction, mergeRefs } from "./liquid-glass-filter";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "select-none overflow-hidden rounded-full",
    "transition-[background-color,box-shadow,transform,color] duration-[var(--motion-base)]",
    "ease-[cubic-bezier(0.32,0.72,0,1)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none",
    "[&>svg]:pointer-events-none [&>svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "text-primary-foreground bg-primary glass-specular glass-pressable-strong hover:brightness-110 shadow-[0_8px_24px_-12px_var(--primary)]",
        default:
          "text-foreground glass glass-edge glass-pressable hover:brightness-105",
        dashed:
          "text-foreground border border-dashed border-border/70 bg-transparent hover:bg-muted/40",
        text:
          "text-foreground bg-transparent hover:bg-muted/50 shadow-none",
        link:
          "text-primary bg-transparent underline-offset-4 hover:underline shadow-none px-0",
        ghost:
          "text-foreground bg-transparent hover:bg-muted/40 shadow-none",
        danger:
          "text-white bg-destructive glass-specular shadow-[0_8px_24px_-12px_rgba(220,38,38,0.6)] hover:brightness-110 active:scale-[0.985]",
      },
      size: {
        lg: "h-12 px-7 text-[15px] [&>svg]:size-5",
        md: "h-10 px-5 text-sm [&>svg]:size-4",
        sm: "h-8 px-4 text-[13px] [&>svg]:size-3.5",
        xs: "h-7 px-3 text-xs [&>svg]:size-3",
      },
      iconOnly: {
        true: "aspect-square px-0",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "lg", className: "size-12" },
      { iconOnly: true, size: "md", className: "size-10" },
      { iconOnly: true, size: "sm", className: "size-8" },
      { iconOnly: true, size: "xs", className: "size-7" },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      iconOnly: false,
    },
  },
);

const REFRACTIVE_VARIANTS = new Set(["default"]);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  refraction?: boolean;
}

export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconOnly,
      asChild = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      refraction,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const shouldRefract = refraction ?? (variant ? REFRACTIVE_VARIANTS.has(variant) : false);
    const refract = useGlassRefraction({
      enabled: shouldRefract,
      radius: 9999,
      shape: "pill",
      strength: 0.6,
    });

    const Comp = asChild ? Slot : "button";
    const isIconOnly = Boolean(iconOnly) && !children;

    return (
      <Comp
        ref={mergeRefs(forwardedRef, refract.ref as React.Ref<HTMLButtonElement>)}
        className={cn(buttonVariants({ variant, size, iconOnly: isIconOnly }), className)}
        disabled={disabled || loading}
        style={{
          backdropFilter: refract.backdropFilter,
          WebkitBackdropFilter: refract.backdropFilter,
        }}
        {...props}
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  },
);
GlassButton.displayName = "GlassButton";

const GlassButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { attached?: boolean }
>(({ className, attached = true, children, ...props }, ref) => {
  if (!attached) {
    return (
      <div ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full glass glass-edge p-1 gap-0.5",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) {return child;}
        return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
          className: cn(
            "shadow-none bg-transparent border-0 rounded-full",
            "[box-shadow:none!important]",
            (child.props as { className?: string }).className,
          ),
          key: i,
        });
      })}
    </div>
  );
});
GlassButtonGroup.displayName = "GlassButtonGroup";

export { buttonVariants, GlassButtonGroup };
