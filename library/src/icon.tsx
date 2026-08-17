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

const iconWrapper = cva(
  "inline-flex items-center justify-center shrink-0 transition-colors duration-[var(--motion-base)]",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        muted: "text-muted-foreground",
        success: "text-[color:var(--success)]",
        warning: "text-[color:var(--warning)]",
        danger: "text-destructive",
        info: "text-[color:var(--info)]",
      },
      size: {
        xs: "size-7 [&>svg]:size-3",
        sm: "size-8 [&>svg]:size-3.5",
        md: "size-10 [&>svg]:size-4",
        lg: "size-12 [&>svg]:size-5",
      },
      shape: {
        circle: "rounded-full glass-thin glass-edge",
        square: "rounded-xl glass-thin glass-edge",
        plain: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "plain",
    },
  },
);

export interface GlassIconProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof iconWrapper> {
  label?: string;
}

export const GlassIcon = React.forwardRef<HTMLSpanElement, GlassIconProps>(
  ({ className, variant, size, shape, label, children, ...props }, ref) => (
    <span
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconWrapper({ variant, size, shape }), className)}
      {...props}
    >
      {children}
    </span>
  ),
);
GlassIcon.displayName = "GlassIcon";

export const GlassIconButton = React.forwardRef<
  HTMLButtonElement,
  GlassButtonHTMLAttributes
>(({ className, variant, size, label, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    className={cn(
      iconWrapper({ variant, size, shape: "circle" }),
      "glass-pressable-thin hover:brightness-110 focus-visible:outline-none",
      "disabled:opacity-50 disabled:pointer-events-none",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
GlassIconButton.displayName = "GlassIconButton";

type GlassButtonHTMLAttributes = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconWrapper> & {
    label?: string;
  };
