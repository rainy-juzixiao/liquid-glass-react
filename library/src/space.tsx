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
import {cn} from "./utils/className";

interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "horizontal" | "vertical";
    size?: "sm" | "md" | "lg" | number;
    align?: "start" | "end" | "center" | "baseline";
    wrap?: boolean;
    split?: React.ReactNode;
}

const sizeMap = {sm: 8, md: 16, lg: 24};

export const GlassSpace = React.forwardRef<HTMLDivElement, SpaceProps>(
    (
        {className, direction = "horizontal", size = "md", align = "center", wrap = false, split, children, ...props},
        ref,
    ) => {
        const gap = typeof size === "number" ? size : sizeMap[size];
        const alignClass = {
            start: "items-start",
            end: "items-end",
            center: "items-center",
            baseline: "items-baseline",
        }[align];

        const items = React.Children.toArray(children).filter(Boolean);

        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex",
                    direction === "vertical" ? "flex-col" : "flex-row",
                    alignClass,
                    wrap && "flex-wrap",
                    className,
                )}
                style={{gap}}
                {...props}
            >
                {split
                    ? items.map((child, i) => (
                        <React.Fragment key={i}>
                            {child}
                            {i < items.length - 1 &&
                                <span className="text-muted-foreground/40 inline-flex items-center">{split}</span>}
                        </React.Fragment>
                    ))
                    : items}
            </div>
        );
    },
);
GlassSpace.displayName = "GlassSpace";

export const GlassCompact = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { direction?: "horizontal" | "vertical" }
>(({className, direction = "horizontal", children, ...props}, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex",
            direction === "vertical" ? "flex-col" : "flex-row",
            className,
        )}
        style={{gap: 0}}
        {...props}
    >
        {React.Children.map(children, (child, i) => {
            if (!React.isValidElement(child)) {
                return child;
            }
            const isLast = i === React.Children.count(children) - 1;
            return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
                className: cn(
                    "rounded-none",
                    !isLast && (direction === "horizontal" ? "border-r-0" : "border-b-0"),
                    (child.props as { className?: string }).className,
                ),
            });
        })}
    </div>
));
GlassCompact.displayName = "GlassCompact";

(GlassSpace as unknown as { Compact: typeof GlassCompact }).Compact = GlassCompact;
