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

interface RowContextValue {
    gutter: [number, number];
}

const RowContext = React.createContext<RowContextValue>({gutter: [0, 0]});

type ResponsiveValue = number | string | (number | string)[];

// noinspection JSUnusedGlobalSymbols
export const normalizeResponsive = (val?: ResponsiveValue): string => {
    if (val === undefined) {
        return "";
    }
    if (typeof val === "number") {
        return `span ${val} / span ${val}`;
    }
    return String(val);
};

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
    gutter?: number | [number, number];
    align?: "top" | "middle" | "bottom";
    justify?: "start" | "end" | "center" | "between" | "around";
    wrap?: boolean;
}

export const GlassRow = React.forwardRef<HTMLDivElement, RowProps>(
    (
        {className, gutter = 0, align = "top", justify = "start", wrap = true, style, children, ...props},
        ref,
    ) => {
        const gutterArr: [number, number] = Array.isArray(gutter) ? gutter : [gutter, 0];
        const alignClass = {top: "items-start", middle: "items-center", bottom: "items-end"}[align];
        const justifyClass = {
            start: "justify-start",
            end: "justify-end",
            center: "justify-center",
            between: "justify-between",
            around: "justify-around",
        }[justify];

        return (
            <RowContext.Provider value={{gutter: gutterArr}}>
                <div
                    ref={ref}
                    className={cn("flex w-full", alignClass, justifyClass, wrap && "flex-wrap", className)}
                    style={{
                        marginLeft: gutterArr[0] ? -gutterArr[0] / 2 : undefined,
                        marginRight: gutterArr[0] ? -gutterArr[0] / 2 : undefined,
                        rowGap: gutterArr[1] || undefined,
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </div>
            </RowContext.Provider>
        );
    },
);
GlassRow.displayName = "GlassRow";

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
    span?: number;
    offset?: number;
    push?: number;
    pull?: number;
    order?: number;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

export const GlassCol = React.forwardRef<HTMLDivElement, ColProps>(
    (
        {className, span, offset, push, pull, order, xs, sm, md, lg, xl, style, children, ...props},
        ref,
    ) => {
        const {gutter} = React.useContext(RowContext);

        const spanStyle: React.CSSProperties = {
            paddingLeft: gutter[0] ? gutter[0] / 2 : undefined,
            paddingRight: gutter[0] ? gutter[0] / 2 : undefined,
            order,
            marginLeft: offset ? `${(offset / 24) * 100}%` : undefined,
            left: push ? `${(push / 24) * 100}%` : undefined,
            right: pull ? `${(pull / 24) * 100}%` : undefined,
            flexBasis: span !== undefined ? `${(span / 24) * 100}%` : undefined,
            flexGrow: span === undefined ? 1 : 0,
            maxWidth: span !== undefined ? `${(span / 24) * 100}%` : undefined,
            ...style,
        };

        const responsiveClasses = [
            xs !== undefined && `xs:grow-[${xs}]`,
            sm !== undefined && `sm:grow-[${sm}]`,
            md !== undefined && `md:grow-[${md}]`,
            lg !== undefined && `lg:grow-[${lg}]`,
            xl !== undefined && `xl:grow-[${xl}]`,
        ].filter(Boolean);

        return (
            <div
                ref={ref}
                className={cn("relative", ...responsiveClasses, className)}
                style={spanStyle}
                {...props}
            >
                {children}
            </div>
        );
    },
);
GlassCol.displayName = "GlassCol";

// noinspection JSUnusedGlobalSymbols
export const GlassGrid = Object.assign(
    {} as { Row: typeof GlassRow; Col: typeof GlassCol },
    {Row: GlassRow, Col: GlassCol},
);
