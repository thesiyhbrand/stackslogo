export interface DetectedTechnology {
    slug: string;
    confidence: number;
    reason: string;
}

interface GitHubFile {
    name: string;
    path: string;
    type: "file" | "dir";
}

export interface PackageJson {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
}

const FILE_DETECTIONS: Record<
    string,
    {
        slug: string;
        reason: string;
    }
> = {
    "package.json": {
        slug: "nodejs",
        reason: "package.json found",
    },

    "tsconfig.json": {
        slug: "typescript",
        reason: "tsconfig.json found",
    },

    dockerfile: {
        slug: "docker",
        reason: "Dockerfile found",
    },

    "docker-compose.yml": {
        slug: "docker",
        reason: "Docker Compose file found",
    },

    "docker-compose.yaml": {
        slug: "docker",
        reason: "Docker Compose file found",
    },

    "requirements.txt": {
        slug: "python",
        reason: "Python requirements file found",
    },

    "pyproject.toml": {
        slug: "python",
        reason: "Python project file found",
    },

    "pom.xml": {
        slug: "java",
        reason: "Maven project file found",
    },

    "go.mod": {
        slug: "go",
        reason: "Go module found",
    },

    "cargo.toml": {
        slug: "rust",
        reason: "Rust Cargo manifest found",
    },

    "composer.json": {
        slug: "php",
        reason: "Composer file found",
    },
};

const PACKAGE_DETECTIONS: Array<{
    packages: string[];
    slug: string;
    reason: string;
    confidence: number;
}> = [
        {
            packages: ["next"],
            slug: "nextjs",
            reason: "next dependency found",
            confidence: 100,
        },

        {
            packages: ["react"],
            slug: "react",
            reason: "react dependency found",
            confidence: 100,
        },

        {
            packages: ["vue"],
            slug: "vue",
            reason: "vue dependency found",
            confidence: 100,
        },

        {
            packages: ["@angular/core"],
            slug: "angular",
            reason: "@angular/core dependency found",
            confidence: 100,
        },

        {
            packages: ["svelte"],
            slug: "svelte",
            reason: "svelte dependency found",
            confidence: 100,
        },

        {
            packages: ["tailwindcss"],
            slug: "tailwindcss",
            reason: "tailwindcss dependency found",
            confidence: 95,
        },

        {
            packages: ["express"],
            slug: "express",
            reason: "express dependency found",
            confidence: 100,
        },

        {
            packages: ["@nestjs/core"],
            slug: "nestjs",
            reason: "@nestjs/core dependency found",
            confidence: 100,
        },

        {
            packages: ["mongodb", "mongoose"],
            slug: "mongodb",
            reason: "MongoDB dependency found",
            confidence: 95,
        },

        {
            packages: ["pg", "postgres", "postgresql"],
            slug: "postgresql",
            reason: "PostgreSQL dependency found",
            confidence: 95,
        },

        {
            packages: ["mysql", "mysql2"],
            slug: "mysql",
            reason: "MySQL dependency found",
            confidence: 95,
        },

        {
            packages: ["redis", "ioredis"],
            slug: "redis",
            reason: "Redis dependency found",
            confidence: 95,
        },
    ];

const CONFIG_DETECTIONS: Array<{
    files: string[];
    slug: string;
    reason: string;
    confidence: number;
}> = [
        {
            files: [
                "tailwind.config.js",
                "tailwind.config.ts",
                "tailwind.config.cjs",
                "tailwind.config.mjs",
            ],
            slug: "tailwindcss",
            reason: "Tailwind configuration found",
            confidence: 95,
        },

        {
            files: [
                "vite.config.js",
                "vite.config.ts",
                "vite.config.mjs",
                "vite.config.cjs",
            ],
            slug: "vite",
            reason: "Vite configuration found",
            confidence: 95,
        },

        {
            files: [
                "prisma/schema.prisma",
            ],
            slug: "prisma",
            reason: "Prisma schema found",
            confidence: 100,
        },

        {
            files: [
                "drizzle.config.ts",
                "drizzle.config.js",
            ],
            slug: "drizzle",
            reason: "Drizzle configuration found",
            confidence: 95,
        },

        {
            files: [
                "firebase.json",
                ".firebaserc",
            ],
            slug: "firebase",
            reason: "Firebase configuration found",
            confidence: 95,
        },

        {
            files: [
                "supabase/config.toml",
            ],
            slug: "supabase",
            reason: "Supabase configuration found",
            confidence: 95,
        },

        {
            files: [
                ".eslintrc",
                ".eslintrc.js",
                ".eslintrc.json",
                "eslint.config.js",
                "eslint.config.mjs",
            ],
            slug: "eslint",
            reason: "ESLint configuration found",
            confidence: 95,
        },
    ];

export function detectTechnologies(
    files: GitHubFile[],
    packageJson?: PackageJson
): DetectedTechnology[] {
    const detected =
        new Map<string, DetectedTechnology>();

    for (const file of files) {
        const filename =
            file.name.toLowerCase();

        const detection =
            FILE_DETECTIONS[filename];

        if (!detection) {
            continue;
        }

        addDetection(
            detected,
            detection.slug,
            80,
            detection.reason
        );
    }

    for (const detection of CONFIG_DETECTIONS) {
        const found =
            detection.files.some(
                (filePath) =>
                    files.some(
                        (file) =>
                            file.path === filePath
                    )
            );

        if (!found) {
            continue;
        }

        addDetection(
            detected,
            detection.slug,
            detection.confidence,
            detection.reason
        );
    }

    if (packageJson) {
        const dependencies = {
            ...(packageJson.dependencies ?? {}),
            ...(packageJson.devDependencies ?? {}),
        };

        const dependencyNames =
            Object.keys(dependencies);

        for (const detection of PACKAGE_DETECTIONS) {
            const matchedPackage =
                detection.packages.find(
                    (packageName) =>
                        dependencyNames.includes(
                            packageName
                        )
                );

            if (!matchedPackage) {
                continue;
            }

            addDetection(
                detected,
                detection.slug,
                detection.confidence,
                detection.reason
            );
        }
    }

    return Array.from(
        detected.values()
    ).sort(
        (a, b) =>
            b.confidence -
            a.confidence
    );
}

function addDetection(
    detected: Map<
        string,
        DetectedTechnology
    >,
    slug: string,
    confidence: number,
    reason: string
) {
    const existing =
        detected.get(slug);

    if (
        !existing ||
        confidence > existing.confidence
    ) {
        detected.set(slug, {
            slug,
            confidence,
            reason,
        });
    }
}