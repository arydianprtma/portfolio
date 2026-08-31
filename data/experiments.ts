import { Experiment } from "@/types";

export const experimentsData: Experiment[] = [
  {
    id: "exp-01",
    title: "V8 Memory Heap Visualizer",
    category: "Developer Tooling",
    description: "An experimental Chrome DevTools extension visualizing Node.js heap allocations in 3D node graphs.",
    year: 2025,
    technologies: ["TypeScript", "Three.js", "Chrome Extension API"],
    github: "https://github.com",
  },
  {
    id: "exp-02",
    title: "GTA V Custom HUD Shader Lab",
    category: "Game Modding",
    description: "HLSL pixel shaders creating dynamic chromatic aberration and retro CRT scans for in-game vehicle cockpits.",
    year: 2025,
    technologies: ["HLSL", "DirectX", "C#"],
    github: "https://github.com",
  },
  {
    id: "exp-03",
    title: "Sub-millisecond Audio Gate",
    category: "Audio Engineering",
    description: "WASM-based noise gate and spectral voice cleanup running locally on Web Audio API threads.",
    year: 2024,
    technologies: ["Rust", "Web Audio API", "WebAssembly"],
    github: "https://github.com",
  },
  {
    id: "exp-04",
    title: "Terminal ASCII Art Generator",
    category: "CLI Utilities",
    description: "Lightning-fast CLI tool transforming images & live webcam feeds into stylized ANSI colored terminal streams.",
    year: 2024,
    technologies: ["Go", "ANSI Escape Codes"],
    github: "https://github.com",
  },
];
