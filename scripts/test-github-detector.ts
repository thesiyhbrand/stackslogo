import {
  detectTechnologies,
  type PackageJson,
} from "../apps/web/lib/github-detector";

interface TestCase {
  name: string;
  files: Array<{
    name: string;
    path: string;
    type: "file" | "dir";
  }>;
  packageJsons?: PackageJson[];
  expected: string[];
}

const tests: TestCase[] = [
  {
    name: "Next.js + TypeScript + Tailwind",
    files: [
      {
        name: "package.json",
        path: "package.json",
        type: "file",
      },
      {
        name: "tsconfig.json",
        path: "tsconfig.json",
        type: "file",
      },
      {
        name: "tailwind.config.ts",
        path: "tailwind.config.ts",
        type: "file",
      },
    ],
    packageJsons: [
      {
        dependencies: {
          next: "^15.0.0",
        },
        devDependencies: {
          typescript: "^5.0.0",
          tailwindcss: "^4.0.0",
        },
      },
    ],
    expected: [
      "nextjs",
      "react",
      "typescript",
      "tailwindcss",
      "nodejs",
    ],
  },

  {
    name: "Monorepo with nested configs",
    files: [
      {
        name: "package.json",
        path: "package.json",
        type: "file",
      },
      {
        name: "package.json",
        path: "apps/web/package.json",
        type: "file",
      },
      {
        name: "tailwind.config.ts",
        path: "apps/web/tailwind.config.ts",
        type: "file",
      },
      {
        name: "vite.config.ts",
        path: "apps/web/vite.config.ts",
        type: "file",
      },
      {
        name: "schema.prisma",
        path: "prisma/schema.prisma",
        type: "file",
      },
    ],
    packageJsons: [
      {
        dependencies: {
          react: "^19.0.0",
        },
        devDependencies: {
          vite: "^7.0.0",
        },
      },
    ],
    expected: [
      "react",
      "vite",
      "tailwindcss",
      "prisma",
      "nodejs",
    ],
  },

  {
    name: "Docker + Kubernetes + GitHub Actions",
    files: [
      {
        name: "Dockerfile",
        path: "Dockerfile",
        type: "file",
      },
      {
        name: "deployment.yaml",
        path: "k8s/deployment.yaml",
        type: "file",
      },
      {
        name: "service.yaml",
        path: "k8s/service.yaml",
        type: "file",
      },
      {
        name: "deploy.yml",
        path: ".github/workflows/deploy.yml",
        type: "file",
      },
    ],
    expected: [
      "docker",
      "kubernetes",
      "github-actions",
    ],
  },

  {
    name: "Database stack",
    files: [
      {
        name: "package.json",
        path: "package.json",
        type: "file",
      },
    ],
    packageJsons: [
      {
        dependencies: {
          pg: "^8.0.0",
          redis: "^5.0.0",
          mongoose: "^8.0.0",
        },
      },
    ],
    expected: [
      "postgresql",
      "redis",
      "mongodb",
      "nodejs",
    ],
  },
];

let failed = 0;

for (const test of tests) {
  const result = detectTechnologies(
    test.files,
    test.packageJsons ?? []
  );

  const actual = result.map(
    (technology) => technology.slug
  );

  const missing = test.expected.filter(
    (slug) => !actual.includes(slug)
  );

  if (missing.length > 0) {
    failed++;

    console.error(`\n❌ ${test.name}`);
    console.error(`Missing: ${missing.join(", ")}`);
    console.error(`Detected: ${actual.join(", ")}`);

    continue;
  }

  console.log(`✅ ${test.name}`);
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}

console.log("\nAll GitHub detector tests passed.");