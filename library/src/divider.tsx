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

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "solid" | "dashed";
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  label?: React.ReactNode;
}

const sizeMap = {
  sm: { h: "my-2", v: "mx-2 h-4" },
  md: { h: "my-4", v: "mx-3 h-6" },
  lg: { h: "my-6", v: "mx-4 h-8" },
};

export const GlassDivider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      className,
      orientation = "horizontal",
      variant = "solid",
      align = "center",
      size = "md",
      label,
      ...props
    },
    ref,
  ) => {
    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            "inline-block w-px self-stretch border-l",
            variant === "dashed" && "border-dashed",
            "border-border/60",
            sizeMap[size].v,
            className,
          )}
          {...props}
        />
      );
    }

    if (!label) {
      return (
        <div
          ref={ref}
          role="separator"
          className={cn(
            "w-full border-t",
            variant === "dashed" && "border-dashed",
            "border-border/60",
            sizeMap[size].h,
            className,
          )}
          {...props}
        />
      );
    }

    const alignClass = {
      left: "justify-start [&::before]:hidden",
      center: "justify-center",
      right: "justify-end [&::after]:hidden",
    }[align];

    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          "flex items-center gap-3 my-4",
          alignClass,
          className,
        )}
        {...props}
      >
        <span className="flex-1 border-t border-border/60" style={variant === "dashed" ? { borderStyle: "dashed" } : undefined} />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
        <span className="flex-1 border-t border-border/60" style={variant === "dashed" ? { borderStyle: "dashed" } : undefined} />
      </div>
    );
  },
);
GlassDivider.displayName = "GlassDivider";
