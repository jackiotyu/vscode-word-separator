// augmenations.d.ts

// Ensure this file is parsed as a module regardless of dependencies.
export {};

declare module 'vue-router' {
    interface RouteMeta {
        transition?: string;
        mode?: 'in-out' | 'out-in' | 'default';
    }
}
