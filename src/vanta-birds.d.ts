declare module "three" {
  export const WebGLRenderer: unknown;
}

declare module "vanta/dist/vanta.birds.min" {
  interface VantaEffect {
    destroy: () => void;
    setOptions: (options: Record<string, unknown>) => void;
  }

  const BIRDS: (options: Record<string, unknown>) => VantaEffect;
  export default BIRDS;
}
