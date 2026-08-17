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
import { cn } from "../utils/className";

type Material = "thin" | "regular" | "strong";

interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  material?: Material;
  specular?: boolean;
  edge?: boolean;
  pressable?: boolean;
  as?: React.ElementType;
}

const materialClass: Record<Material, string> = {
  thin: "glass-thin",
  regular: "glass",
  strong: "glass-strong",
};

const pressableClass: Record<Material, string> = {
  thin: "glass-pressable-thin",
  regular: "glass-pressable",
  strong: "glass-pressable-strong",
};

export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    {
      className,
      material = "regular",
      specular = false,
      edge = true,
      pressable = false,
      as: Component = "div",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          materialClass[material],
          specular && "glass-specular",
          edge && "glass-edge",
          pressable && pressableClass[material],
          "glass-focus-visible",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
GlassSurface.displayName = "GlassSurface";
