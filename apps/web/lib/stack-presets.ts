export interface StackPreset {
  id: string;
  name: string;
  description: string;
  icons: string[];
}

export const STACK_PRESETS: StackPreset[] = [
  {
    id: "frontend",
    name: "Frontend Developer",
    description: "Modern frontend stack",
    icons: [
      "html",
      "css",
      "javascript",
      "react",
      "nextjs",
      "tailwindcss",
    ],
  },

  {
    id: "mern",
    name: "MERN Stack",
    description: "MongoDB, Express, React & Node",
    icons: [
      "mongodb",
      "express",
      "react",
      "nodejs",
    ],
  },

  {
    id: "fullstack",
    name: "Full Stack",
    description: "Frontend, backend & database",
    icons: [
      "html",
      "css",
      "javascript",
      "react",
      "nodejs",
      "postgresql",
      "docker",
    ],
  },

  {
    id: "devops",
    name: "DevOps",
    description: "Tools for modern DevOps",
    icons: [
      "git",
      "github",
      "docker",
      "kubernetes",
      "github-actions",
    ],
  },
];