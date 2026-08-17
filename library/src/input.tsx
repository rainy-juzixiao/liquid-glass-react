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
import {Eye, EyeOff, X, Search, ChevronDown} from "lucide-react";
import {cn} from "./utils/className";

const inputVariants = cva(
    [
        "w-full rounded-xl bg-transparent transition-all duration-[var(--motion-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
        "font-sans text-foreground placeholder:text-muted-foreground/60",
        "outline-none focus-visible:outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "[&::-webkit-search-cancel-button]:appearance-none",
    ].join(" "),
    {
        variants: {
            variant: {
                default:
                    "glass glass-edge text-foreground px-3.5 focus-visible:shadow-[inset_0_0_0_1px_var(--ring),0_0_0_3px_color-mix(in_oklch,var(--ring)_25%,transparent)]",
                filled: "bg-muted/60 px-3.5 focus-visible:bg-muted/80",
                borderless: "px-1 border-0 shadow-none focus-visible:shadow-none",
            },
            size: {
                lg: "h-12 text-base",
                md: "h-10 text-sm",
                sm: "h-8 text-[13px]",
            },
            status: {
                default: "",
                error: "shadow-[inset_0_0_0_1px_var(--destructive)] focus-visible:shadow-[inset_0_0_0_1px_var(--destructive),0_0_0_3px_color-mix(in_oklch,var(--destructive)_25%,transparent)]",
                warning: "shadow-[inset_0_0_0_1px_var(--warning)] focus-visible:shadow-[inset_0_0_0_1px_var(--warning),0_0_0_3px_color-mix(in_oklch,var(--warning)_25%,transparent)]",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            status: "default",
        },
    },
);

export interface GlassInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "suffix">,
        VariantProps<typeof inputVariants> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    clearable?: boolean;
    onClear?: () => void;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
    (
        {
            className,
            variant,
            size,
            status,
            prefix,
            suffix,
            clearable,
            onClear,
            type = "text",
            value,
            onChange,
            disabled,
            ...props
        },
        ref,
    ) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;
        const hasValue = value !== undefined && value !== "" && value !== null;

        return (
            <div className={cn("relative flex items-center", disabled && "opacity-60")}>
                {prefix && (
                    <span
                        className="pointer-events-none absolute left-3 inline-flex items-center text-muted-foreground [&>svg]:size-4">
            {prefix}
          </span>
                )}
                <input
                    ref={ref}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={cn(
                        inputVariants({variant, size, status}),
                        prefix && "pl-9",
                        (suffix || clearable || isPassword) && "pr-9",
                        className,
                    )}
                    {...props}
                />
                {(suffix || clearable || isPassword) && (
                    <span className="absolute right-2 inline-flex items-center gap-0.5">
            {clearable && hasValue && (
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                        onChange?.({target: {value: ""}} as React.ChangeEvent<HTMLInputElement>);
                        onClear?.();
                    }}
                    className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                >
                    <X className="size-3"/>
                </button>
            )}
                        {isPassword && (
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword((s) => !s)}
                                className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
                            </button>
                        )}
                        {suffix && <span
                            className="inline-flex items-center text-muted-foreground [&>svg]:size-4 pr-1">{suffix}</span>}
          </span>
                )}
            </div>
        );
    },
);
GlassInput.displayName = "GlassInput";

export const GlassSearch = React.forwardRef<HTMLInputElement, GlassInputProps & { onSearch?: (v: string) => void }>(
    ({className, onSearch, prefix, ...props}, ref) => (
        <GlassInput
            ref={ref}
            prefix={prefix ?? <Search/>}
            suffix={
                <button
                    type="button"
                    onClick={() => onSearch?.(String(props.value ?? ""))}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-0.5 text-xs text-primary-foreground hover:brightness-110"
                >
                    Search
                </button>
            }
            className={className}
            {...props}
        />
    ),
);
GlassSearch.displayName = "GlassSearch";

export const GlassInputGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, children, ...props}) => (
    <div className={cn("inline-flex items-stretch rounded-xl glass glass-edge overflow-hidden", className)} {...props}>
        {children}
    </div>
);

export const GlassInputPrefix: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({className, children, ...props}) => (
    <span
        className={cn("inline-flex items-center bg-muted/40 px-3 text-sm text-muted-foreground [&>svg]:size-4", className)} {...props}>
    {children}
  </span>
);

export const GlassInputSuffix: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({className, children, ...props}) => (
    <span
        className={cn("inline-flex items-center bg-muted/40 px-3 text-sm text-muted-foreground [&>svg]:size-4", className)} {...props}>
    {children}
  </span>
);

export const GlassTextarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant?: "default" | "filled" | "borderless";
    autoSize?: boolean | { minRows?: number; maxRows?: number };
    showCount?: boolean;
    maxLength?: number;
}
>(
    (
        {className, variant = "default", autoSize, showCount, maxLength, value, onChange, rows = 3, ...props},
        ref,
    ) => {
        const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
        React.useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

        React.useEffect(() => {
            if (!autoSize || !innerRef.current) {
                return;
            }
            const el = innerRef.current;
            const adjust = () => {
                el.style.height = "auto";
                const opts = typeof autoSize === "object" ? autoSize : {};
                const minH = opts.minRows ? opts.minRows * 24 : 60;
                const maxH = opts.maxRows ? opts.maxRows * 24 : 240;
                el.style.height = `${Math.min(Math.max(el.scrollHeight, minH), maxH)}px`;
            };
            adjust();
            el.addEventListener("input", adjust);
            return () => el.removeEventListener("input", adjust);
        }, [autoSize]);

        const variantClass =
            variant === "filled" ? "bg-muted/60 focus-visible:bg-muted/80" : variant === "borderless" ? "shadow-none" : "glass glass-edge";

        return (
            <div className="relative w-full">
        <textarea
            ref={innerRef}
            value={value}
            onChange={onChange}
            rows={rows}
            maxLength={maxLength}
            className={cn(
                "w-full rounded-xl px-3.5 py-2.5 text-sm text-foreground",
                "outline-none resize-none transition-all duration-(--motion-base)",
                variantClass,
                showCount && "pb-7",
                className,
            )}
            {...props}
        />
                {showCount && (
                    <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
            {String(value ?? "").length}
                        {maxLength ? `/${maxLength}` : ""}
          </span>
                )}
            </div>
        );
    },
);
GlassTextarea.displayName = "GlassTextarea";

export const GlassInputNumber = React.forwardRef<
    HTMLInputElement,
    GlassInputProps & { step?: number; min?: number; max?: number; controls?: boolean }
>(({className, step = 1, min, max, controls = true, value, onChange, ...props}, ref) => {
    const clamp = (v: number) => {
        if (min !== undefined && v < min) {
            return min;
        }
        if (max !== undefined && v > max) {
            return max;
        }
        return v;
    };

    const stepBy = (dir: 1 | -1) => {
        const current = typeof value === "number" ? value : parseFloat(String(value ?? "0")) || 0;
        const next = clamp(current + dir * step);
        onChange?.({target: {value: String(next)}} as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <GlassInput
            ref={ref}
            type="number"
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            suffix={
                controls ? (
                    <span className="flex flex-col -mr-1">
            <button
                type="button"
                tabIndex={-1}
                onClick={() => stepBy(1)}
                className="inline-flex h-4 w-5 items-center justify-center rounded-t text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <ChevronDown className="size-3 rotate-180"/>
            </button>
            <button
                type="button"
                tabIndex={-1}
                onClick={() => stepBy(-1)}
                className="inline-flex h-4 w-5 items-center justify-center rounded-b text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            >
              <ChevronDown className="size-3"/>
            </button>
          </span>
                ) : null
            }
            className={className}
            {...props}
        />
    );
});
GlassInputNumber.displayName = "GlassInputNumber";

const GlassInputField = Object.assign(GlassInput, {
    Search: GlassSearch,
    Group: GlassInputGroup,
    Prefix: GlassInputPrefix,
    Suffix: GlassInputSuffix,
    Textarea: GlassTextarea,
    Number: GlassInputNumber,
});

export default GlassInputField;
