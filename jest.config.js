const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "src/drizzle/db.ts",
        "src/drizzle/schema.ts",
        "src/mailer/mailer.ts",
    ],
};
