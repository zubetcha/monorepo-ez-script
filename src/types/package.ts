export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'deno';
export type ValidPackageManager = Exclude<PackageManager, 'deno'>;
