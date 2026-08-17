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
import {cva, type VariantProps} from "class-variance-authority";
import {CheckCircle2, Info, AlertTriangle, XCircle, X} from "lucide-react";
import {cn} from "./utils/className";

const alertVariants = cva(
    "relative flex items-start gap-3 rounded-2xl p-4 transition-all duration-[var(--motion-base)]",
    {
        variants: {
            variant: {
                info: "bg-[color:var(--info)]/10 text-foreground border border-[color:var(--info)]/20",
                success: "bg-[color:var(--success)]/10 text-foreground border border-[color:var(--success)]/20",
                warning: "bg-[color:var(--warning)]/12 text-foreground border border-[color:var(--warning)]/25",
                error: "bg-destructive/10 text-foreground border border-destructive/20",
                banner: "bg-muted/40 text-foreground border-0 rounded-none",
            },
        },
        defaultVariants: {variant: "info"},
    },
);

const iconByVariant: Record<string, React.ReactNode> = {
    info: <Info className="size-5 text-(--info)"/>,
    success: <CheckCircle2 className="size-5 text-(--success)"/>,
    warning: <AlertTriangle className="size-5 text-(--warning)"/>,
    error: <XCircle className="size-5 text-destructive"/>,
    banner: <Info className="size-5 text-muted-foreground"/>,
};

interface AlertProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
        VariantProps<typeof alertVariants> {
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode | false;
    closable?: boolean;
    onClose?: () => void;
    action?: React.ReactNode;
    showIcon?: boolean;
}

export const GlassAlert = React.forwardRef<HTMLDivElement, AlertProps>(
    (
        {
            className,
            variant = "info",
            title,
            description,
            icon,
            closable,
            onClose,
            action,
            showIcon = true,
            children,
            ...props
        },
        ref,
    ) => {
        const [closed, setClosed] = React.useState(false);
        if (closed) {
            return null;
        }

        const handleClose = () => {
            setClosed(true);
            onClose?.();
        };

        return (
            <div ref={ref} role="alert" className={cn(alertVariants({variant}), className)} {...props}>
                {showIcon && (icon !== undefined ? icon : iconByVariant[variant ?? "info"])}
                <div className="flex-1 min-w-0">
                    {title && <div className="font-semibold text-foreground">{title}</div>}
                    {description && <div className="mt-0.5 text-sm text-muted-foreground">{description}</div>}
                    {children}
                </div>
                {action && <div className="shrink-0">{action}</div>}
                {closable && (
                    <button
                        type="button"
                        onClick={handleClose}
                        className="shrink-0 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                        aria-label="Close"
                    >
                        <X className="size-3.5"/>
                    </button>
                )}
            </div>
        );
    },
);
GlassAlert.displayName = "GlassAlert";
