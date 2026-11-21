// Only these non-sensitive flags may be exposed to client bundles.
export const featureFlags = {
  monitoring: process.env.NEXT_PUBLIC_MONITORING_ENABLED !== "false",
} as const;
