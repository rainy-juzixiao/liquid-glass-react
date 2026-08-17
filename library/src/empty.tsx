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
import { cn } from "./utils/className";

interface EmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: "default" | "simple" | "search" | "error";
  size?: "sm" | "md" | "lg";
  image?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const sizeClass = {
  sm: "py-6 text-sm",
  md: "py-12 text-base",
  lg: "py-20 text-lg",
};

const variantIcon: Record<NonNullable<EmptyProps["variant"]>, React.ReactNode> = {
  default: (
    <svg viewBox="0 0 64 64" className="size-16" fill="none">
      <rect x="8" y="12" width="48" height="40" rx="6" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M8 22h48" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <circle cx="14" cy="17" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="17" r="1.5" fill="currentColor" opacity="0.4" />
      <path d="M22 36l8-8 6 6 8-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  ),
  simple: null,
  search: (
    <svg viewBox="0 0 64 64" className="size-16" fill="none">
      <circle cx="28" cy="28" r="14" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M38 38l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M22 32c0-4 4-7 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 64 64" className="size-16" fill="none">
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M32 20v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="32" cy="42" r="2" fill="currentColor" opacity="0.6" />
    </svg>
  ),
};

const GlassEmpty: React.FC<EmptyProps> = ({
  className,
  variant = "default",
  size = "md",
  image,
  title = "No data",
  description,
  actions,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center text-muted-foreground",
      sizeClass[size],
      className,
    )}
    {...props}
  >
    <div className="mb-4 opacity-60">
      {image ?? variantIcon[variant]}
    </div>
    {title && <div className="font-medium text-foreground">{title}</div>}
    {description && <div className="mt-1 text-sm">{description}</div>}
    {actions && <div className="mt-4 flex items-center gap-2">{actions}</div>}
  </div>
);
export default GlassEmpty;