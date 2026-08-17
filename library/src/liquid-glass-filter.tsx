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

export type GlassShape = "rounded" | "circle" | "pill" | "square";

export interface FilterRegistration {
    id: string;
    width: number;
    height: number;
    radius: number;
    shape: GlassShape;
    strength: number;
}

interface BakedMap {
    dataUrl: string;
    scale: number;
}

type Listener = (filters: FilterRegistration[]) => void;

type WorkerMessage = {
    cacheKey: string;
    data: Uint8ClampedArray;
    scale: number;
    w: number;
    h: number;
};

class LiquidGlassManager {
    private filters = new Map<string, FilterRegistration>();
    private listeners = new Set<Listener>();
    private cache = new Map<string, BakedMap>();
    private pending = new Set<string>();
    private worker: Worker | null = null;
    private workerSupported = false;

    constructor() {
        if (typeof window !== "undefined" && typeof Worker !== "undefined") {
            try {
                const workerSource = [
                    "self.onmessage = (event) => {",
                    "  const { width, height, radius, shape, strength, cacheKey } = event.data;",
                    "  const result = computeDisplacement(width, height, radius, shape, strength);",
                    "  self.postMessage({ cacheKey, ...result }, [result.data.buffer]);",
                    "};",
                    "function smoothStep(a, b, t) {",
                    "  t = Math.max(0, Math.min(1, (t - a) / (b - a)));",
                    "  return t * t * (3 - 2 * t);",
                    "}",
                    "function length(x, y) { return Math.sqrt(x * x + y * y); }",
                    "function roundedRectSDF(x, y, w, h, r) {",
                    "  const qx = Math.abs(x) - w + r;",
                    "  const qy = Math.abs(y) - h + r;",
                    "  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - r;",
                    "}",
                    "function computeDisplacement(width, height, radius, shape, strength) {",
                    "  if (!width || !height) return { data: new Uint8ClampedArray(0), scale: 0, w: 0, h: 0 };",
                    "  const w = Math.max(1, Math.min(width, 256));",
                    "  const h = Math.max(1, Math.min(height, 256));",
                    "  const data = new Uint8ClampedArray(w * h * 4);",
                    "  let maxScale = 0;",
                    "  const rawValues = new Float32Array(w * h * 2);",
                    "  for (let i = 0; i < data.length; i += 4) {",
                    "    const x = (i / 4) % w;",
                    "    const y = Math.floor(i / 4 / w);",
                    "    const uvx = x / w;",
                    "    const uvy = y / h;",
                    "    const ix = uvx - 0.5;",
                    "    const iy = uvy - 0.5;",
                    "    let distanceToEdge;",
                    "    if (shape === 'circle') { distanceToEdge = length(ix, iy) - 0.5; }",
                    "    else {",
                    "      const rNorm = shape === 'square' ? 0 : Math.min(radius / width, radius / height) * 0.5;",
                    "      const halfW = 0.5 - rNorm;",
                    "      const halfH = 0.5 - rNorm;",
                    "      distanceToEdge = roundedRectSDF(ix, iy, halfW, halfH, rNorm);",
                    "    }",
                    "    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15) * strength;",
                    "    const scaled = smoothStep(0, 1, displacement);",
                    "    const newUVx = ix * scaled + 0.5;",
                    "    const newUVy = iy * scaled + 0.5;",
                    "    const dx = (newUVx - uvx) * width;",
                    "    const dy = (newUVy - uvy) * height;",
                    "    maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));",
                    "    const idx = (i / 4) * 2;",
                    "    rawValues[idx] = dx;",
                    "    rawValues[idx + 1] = dy;",
                    "  }",
                    "  maxScale *= 0.5;",
                    "  if (maxScale < 0.001) maxScale = 1;",
                    "  for (let i = 0; i < data.length; i += 4) {",
                    "    const idx = (i / 4) * 2;",
                    "    const r = rawValues[idx] / maxScale + 0.5;",
                    "    const g = rawValues[idx + 1] / maxScale + 0.5;",
                    "    data[i] = Math.max(0, Math.min(255, r * 255));",
                    "    data[i + 1] = Math.max(0, Math.min(255, g * 255));",
                    "    data[i + 2] = 0;",
                    "    data[i + 3] = 255;",
                    "  }",
                    "  return { data, scale: maxScale, w, h };",
                    "}",
                ].join("\n");
                const workerBlob = new Blob([workerSource], {type: "application/javascript"});
                const workerUrl = URL.createObjectURL(workerBlob);
                this.worker = new Worker(workerUrl);
                this.worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
                    const {cacheKey, data, scale, w, h} = e.data;
                    const dataUrl = dataToPngDataURL(data, w, h);
                    this.cache.set(cacheKey, {dataUrl, scale});
                    this.pending.delete(cacheKey);
                    this.emit();
                };
                this.worker.onerror = (e) => {
                    console.warn("[@rainy-juzixiao/liquid-glass-react] Worker error:", e.message);
                    this.workerSupported = false;
                };
                this.workerSupported = true;
            } catch (err) {
                console.warn("[@rainy-juzixiao/liquid-glass-react] Worker init failed, falling back to sync:", err);
                this.workerSupported = false;
            }
        }
    }

    register(config: Omit<FilterRegistration, "id">): string {
        const id = `lg-${Math.random().toString(36).slice(2, 11)}`;
        this.filters.set(id, {id, ...config});
        this.requestMap(config);
        this.emit();
        return id;
    }

    unregister(id: string) {
        if (!this.filters.delete(id)) {
            return;
        }
        this.emit();
    }

    subscribe(listener: Listener) {
        this.listeners.add(listener);
        listener(Array.from(this.filters.values()));
        return () => {
            this.listeners.delete(listener);
        };
    }

    private emit() {
        const list = Array.from(this.filters.values());
        this.listeners.forEach((l) => l(list));
    }

    private requestMap(config: Omit<FilterRegistration, "id">) {
        const cacheKey = `${config.width}x${config.height}-${config.radius}-${config.shape}-${config.strength}`;
        if (this.cache.has(cacheKey) || this.pending.has(cacheKey)) {
            return;
        }
        if (config.width === 0 || config.height === 0) {
            return;
        }

        this.pending.add(cacheKey);

        if (this.workerSupported && this.worker) {
            this.worker.postMessage({...config, cacheKey});
        } else {
            const result = generateDisplacementMapSync(config);
            this.cache.set(cacheKey, result);
            this.pending.delete(cacheKey);
            this.emit();
        }
    }

    getDisplacementMap(reg: FilterRegistration): BakedMap | undefined {
        const cacheKey = `${reg.width}x${reg.height}-${reg.radius}-${reg.shape}-${reg.strength}`;
        return this.cache.get(cacheKey);
    }

    isReady(reg: FilterRegistration): boolean {
        const cacheKey = `${reg.width}x${reg.height}-${reg.radius}-${reg.shape}-${reg.strength}`;
        return this.cache.has(cacheKey);
    }
}

function dataToPngDataURL(data: Uint8ClampedArray, w: number, h: number): string {
    if (typeof document === "undefined") {
        return "";
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return "";
    }
    // @ts-ignore
    ctx.putImageData(new ImageData(data, w, h), 0, 0);
    return canvas.toDataURL("image/png");
}

function smoothStep(a: number, b: number, t: number) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
}

function length(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
}

function roundedRectSDF(x: number, y: number, w: number, h: number, r: number) {
    const qx = Math.abs(x) - w + r;
    const qy = Math.abs(y) - h + r;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - r;
}

function generateDisplacementMapSync(reg: Omit<FilterRegistration, "id">): BakedMap {
    if (typeof document === "undefined") {
        return {dataUrl: "", scale: 0};
    }
    const {width, height, radius, shape, strength} = reg;
    if (width === 0 || height === 0) {
        return {dataUrl: "", scale: 0};
    }

    const w = Math.max(1, Math.min(width, 256));
    const h = Math.max(1, Math.min(height, 256));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return {dataUrl: "", scale: 0};
    }

    const data = new Uint8ClampedArray(w * h * 4);
    let maxScale = 0;
    const rawValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        const uvx = x / w;
        const uvy = y / h;
        const ix = uvx - 0.5;
        const iy = uvy - 0.5;

        let distanceToEdge: number;
        if (shape === "circle") {
            distanceToEdge = length(ix, iy) - 0.5;
        } else {
            const rNorm = shape === "square" ? 0 : Math.min(radius / width, radius / height) * 0.5;
            const halfW = 0.5 - rNorm;
            const halfH = 0.5 - rNorm;
            distanceToEdge = roundedRectSDF(ix, iy, halfW, halfH, rNorm);
        }

        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15) * strength;
        const scaled = smoothStep(0, 1, displacement);

        const newUVx = ix * scaled + 0.5;
        const newUVy = iy * scaled + 0.5;
        const dx = (newUVx - uvx) * width;
        const dy = (newUVy - uvy) * height;

        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
    }

    maxScale *= 0.5;
    if (maxScale < 0.001) {
        maxScale = 1;
    }

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
        const r = rawValues[index++] / maxScale + 0.5;
        const g = rawValues[index++] / maxScale + 0.5;
        data[i] = Math.max(0, Math.min(255, r * 255));
        data[i + 1] = Math.max(0, Math.min(255, g * 255));
        data[i + 2] = 0;
        data[i + 3] = 255;
    }

    ctx.putImageData(new ImageData(data, w, h), 0, 0);

    return {
        dataUrl: canvas.toDataURL("image/png"),
        scale: maxScale,
    };
}

const GLASS_MANAGER_KEY = "__liquidGlassManager__";

function getLiquidGlassManager(): LiquidGlassManager {
    if (typeof window !== "undefined") {
        const w = window as unknown as { [GLASS_MANAGER_KEY]?: LiquidGlassManager };
        if (!w[GLASS_MANAGER_KEY]) {
            w[GLASS_MANAGER_KEY] = new LiquidGlassManager();
        }
        return w[GLASS_MANAGER_KEY]!;
    }
    return new LiquidGlassManager();
}

const liquidGlassManager = getLiquidGlassManager();

export function useLiquidGlassFilter(options: {
    width: number;
    height: number;
    radius: number;
    shape?: GlassShape;
    strength?: number;
    enabled?: boolean;
}) {
    const {width, height, radius, shape = "rounded", strength = 0.7, enabled = true} = options;
    const [filterId, setFilterId] = React.useState<string | null>(null);
    const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

    const key = `${width}x${height}-${radius}-${shape}-${strength}-${enabled}`;

    React.useEffect(() => {
        if (!enabled || width === 0 || height === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilterId(null);
            return;
        }
        const id = liquidGlassManager.register({
            width,
            height,
            radius,
            shape,
            strength,
        });
        setFilterId(id);
        return () => liquidGlassManager.unregister(id);
    }, [key, enabled, width, height, radius, shape, strength]);

    React.useEffect(() => {
        if (!filterId) {
            return;
        }
        const reg: FilterRegistration = {
            id: filterId,
            width,
            height,
            radius,
            shape: shape ?? "rounded",
            strength: strength ?? 0.7,
        };
        if (liquidGlassManager.isReady(reg)) {
            return;
        }
        return liquidGlassManager.subscribe(() => {
            if (liquidGlassManager.isReady(reg)) {
                forceUpdate();
            }
        });
    }, [filterId, width, height, radius, shape, strength]);

    return filterId;
}

export function useGlassRefraction(options: {
    enabled: boolean;
    radius: number;
    shape?: GlassShape;
    strength?: number;
}) {
    const {enabled, radius, shape = "rounded", strength = 0.7} = options;
    const internalRef = React.useRef<HTMLDivElement | HTMLElement | null>(null);
    const [size, setSize] = React.useState<{ w: number; h: number }>({w: 0, h: 0});

    const setRef = React.useCallback((node: HTMLDivElement | HTMLElement | null) => {
        internalRef.current = node;
        if (!node) {
            return;
        }
        const rect = node.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        setSize((prev) => (prev.w === w && prev.h === h ? prev : {w, h}));
    }, []);

    React.useEffect(() => {
        if (!enabled) {
            return;
        }
        const el = internalRef.current;
        if (!el) {
            return;
        }

        const update = () => {
            const rect = el.getBoundingClientRect();
            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            setSize((prev) => (prev.w === w && prev.h === h ? prev : {w, h}));
        };

        const ro = new ResizeObserver(update);
        ro.observe(el);

        return () => ro.disconnect();
    }, [enabled]);

    const filterId = useLiquidGlassFilter({
        width: size.w,
        height: size.h,
        radius,
        shape,
        strength,
        enabled,
    });

    const filterUrl = filterId ? `url(#${filterId}_filter)` : undefined;
    const backdropFilter = filterUrl
        ? `${filterUrl} blur(0.4px) saturate(1.6) brightness(1.06) contrast(1.05)`
        : undefined;

    return {ref: setRef, backdropFilter, filterId, ready: Boolean(filterId)};
}

export function mergeRefs<T>(
    ...refs: Array<React.Ref<T> | undefined | null>
): (node: T | null) => void {
    return (node) => {
        for (const r of refs) {
            if (!r) {
                continue;
            }
            if (typeof r === "function") {
                r(node);
            } else {
                (r as React.MutableRefObject<T | null>).current = node;
            }
        }
    };
}

interface LiquidGlassHostState {
    filters: FilterRegistration[];
    version: number;
}

export const LiquidGlassHost: React.FC = () => {
    const [state, setState] = React.useState<LiquidGlassHostState>({filters: [], version: 0});

    React.useEffect(() => {
        return liquidGlassManager.subscribe((filters) =>
            setState((prev) => ({filters, version: prev.version + 1})),
        );
    }, []);

    if (state.filters.length === 0) {
        return null;
    }

    return (
        <svg
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
            width="0"
            height="0"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9998,
                width: 0,
                height: 0,
            }}
        >
            <defs>
                {state.filters.map((f) => {
                    const map = liquidGlassManager.getDisplacementMap(f);
                    if (!map) {
                        return null;
                    }
                    return (
                        <filter
                            key={f.id}
                            id={`${f.id}_filter`}
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                            x="0"
                            y="0"
                            width={f.width}
                            height={f.height}
                        >
                            <feImage
                                id={`${f.id}_map`}
                                width={f.width}
                                height={f.height}
                                href={map.dataUrl}
                                xlinkHref={map.dataUrl}
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2={`${f.id}_map`}
                                xChannelSelector="R"
                                yChannelSelector="G"
                                scale={map.scale}
                            />
                        </filter>
                    );
                })}
            </defs>
        </svg>
    );
};

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
    radius?: number;
    shape?: GlassShape;
    strength?: number;
    material?: "thin" | "regular" | "strong";
    specular?: boolean;
    edge?: boolean;
    children?: React.ReactNode;
}

export const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
    (
        {
            className,
            radius = 20,
            shape = "rounded",
            strength = 0.7,
            material = "regular",
            specular = true,
            edge = true,
            style,
            children,
            ...props
        },
        forwardedRef,
    ) => {
        const innerRef = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDivElement);

        const [size, setSize] = React.useState<{ w: number; h: number }>({w: 0, h: 0});

        React.useEffect(() => {
            const el = innerRef.current;
            if (!el) {
                return;
            }
            const update = () => {
                const rect = el.getBoundingClientRect();
                const w = Math.round(rect.width);
                const h = Math.round(rect.height);
                setSize((prev) => (prev.w === w && prev.h === h ? prev : {w, h}));
            };
            update();
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }, []);

        const filterId = useLiquidGlassFilter({
            width: size.w,
            height: size.h,
            radius,
            shape,
            strength,
            enabled: size.w > 0 && size.h > 0,
        });

        const materialClass = {
            thin: "glass-thin",
            regular: "glass",
            strong: "glass-strong",
        }[material];

        const filterUrl = filterId ? `url(#${filterId}_filter)` : undefined;
        const backdropFilter = filterUrl
            ? `${filterUrl} blur(0.4px) saturate(1.6) brightness(1.06) contrast(1.05)`
            : undefined;

        return (
            <div
                ref={innerRef}
                className={cn(materialClass, specular && "glass-specular", edge && "glass-edge", className)}
                style={{
                    borderRadius: radius,
                    backdropFilter,
                    WebkitBackdropFilter: backdropFilter,
                    ...style,
                }}
                {...props}
            >
                {children}
            </div>
        );
    },
);
LiquidGlass.displayName = "LiquidGlass";
