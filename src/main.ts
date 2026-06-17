// ─── Imports ──────────────────────────────────────────────────────────────────

import LoggerUtil from "./utils/logger_util.js";
import TestUtil from "./utils/test_util.js";

import User from "./eo/user.js";

// ─── Logger_util Instance in Main Scope ────────────────────────────────────────────

const _logger = LoggerUtil.getLogger("main");

// ─── Main Logic with Winston Logger_util ─────────────────────────────────────────

function mainWithWinstonLogger(): void {
    const logger = LoggerUtil.getLogger("main-winston");
    logger.info("========== Starting with Winston Logger_util ==========");

    const users: User[] = TestUtil.generateSampleUsers();
    logger.info(`Generated ${users.length} users`);

    logger.info(`\n--- All Users (${users.length}) ---`);
    users.forEach((user) => {
        logger.info(user.toString());
    });

    const seniors = users.filter((u) => u.isSenior);
    logger.info(`\n--- Seniors only (${seniors.length}) ---`);
    logger.info(`Filtered ${seniors.length} senior users`);
    seniors.forEach((user) => {
        logger.info(user.toString());
    });

    logger.info("User generation completed with Winston");
}

// ─── Main Logic with OpenTelemetry Logger_util ───────────────────────────────────

function mainWithOTelLogger(): void {
    const logger = LoggerUtil.getLogger("main-otel");
    logger.info("========== Starting with OpenTelemetry Logger_util ==========");

    const users: User[] = TestUtil.generateSampleUsers();
    logger.info(`Generated ${users.length} users`, {userCount: users.length});

    logger.info(`\n--- All Users (${users.length}) ---`);
    users.forEach((user) => {
        logger.info(user.toString(), {
            userId: user.id,
            userName: user.name,
            isSenior: user.isSenior
        });
    });

    const seniors = users.filter((u) => u.isSenior);
    logger.info(`\n--- Seniors only (${seniors.length}) ---`);
    logger.info(`Filtered ${seniors.length} senior users`, {seniorCount: seniors.length});
    seniors.forEach((user) => {
        logger.info(user.toString(), {
            userId: user.id,
            userName: user.name,
            age: user.age
        });
    });

    logger.info("User generation completed with OpenTelemetry");
}

function any_demo() {
    let data: any = "Hello"; // eslint-disable-line @typescript-eslint/no-explicit-any
    _logger.info(`Any data length: ${data.length}`); // OK (Dangerous! No compiler check)

    let safeData: unknown = "Hello";
    // safeData.length; // Error: Object is of type 'unknown'

    if (typeof safeData === "string") {
        _logger.info(`SafeData length is ${safeData.length}!`);
    }
}

// ─── Run Both Demonstrations ──────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║         Logger_util Comparison: Winston vs OpenTelemetry        ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n");

    // Run Winston Logger_util demonstration
    mainWithWinstonLogger();

    console.log("\n");
    console.log("─".repeat(60));
    console.log("\n");

    // Run OpenTelemetry Logger_util demonstration
    mainWithOTelLogger();

    // Language feature demo
    any_demo();

    // Cleanup
    await LoggerUtil.shutdown();

    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                  Demonstration Completed                   ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n");
}


main();