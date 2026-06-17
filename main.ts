// ─── User Class ──────────────────────────────────────────────────────────────

import Logger from "./logger.js";
import User from "./eo/user.js"

// ─── Generate Sample Users ────────────────────────────────────────────────────

function generateSampleUsers(): User[] {
    return [
        new User(1, "Alice Johnson",  32, "alice@example.com",  true),
        new User(2, "Bob Smith",      24, "bob@example.com",    false),
        new User(3, "Carol White",    45, "carol@example.com",  true),
        new User(4, "David Brown",    19, "david@example.com",  false),
        new User(5, "Eve Martinez",   38, "eve@example.com",    true),
    ];
}

// ─── Main Logic with Winston Logger ─────────────────────────────────────────

function mainWithWinstonLogger(): void {
    const logger = Logger.getLogger("main-winston");
    logger.info("========== Starting with Winston Logger ==========");

    const users: User[] = generateSampleUsers();
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

// ─── Main Logic with OpenTelemetry Logger ───────────────────────────────────

function mainWithOTelLogger(): void {
    const logger = Logger.getLogger("main-otel");
    logger.info("========== Starting with OpenTelemetry Logger ==========");

    const users: User[] = generateSampleUsers();
    logger.info(`Generated ${users.length} users`, { userCount: users.length });

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
    logger.info(`Filtered ${seniors.length} senior users`, { seniorCount: seniors.length });
    seniors.forEach((user) => {
        logger.info(user.toString(), {
            userId: user.id,
            userName: user.name,
            age: user.age
        });
    });

    logger.info("User generation completed with OpenTelemetry");
}

// ─── Run Both Demonstrations ──────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║         Logger Comparison: Winston vs OpenTelemetry        ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n");

    // Run Winston Logger demonstration
    mainWithWinstonLogger();

    console.log("\n");
    console.log("─".repeat(60));
    console.log("\n");

    // Run OpenTelemetry Logger demonstration
    mainWithOTelLogger();

    // Cleanup
    await Logger.shutdown();

    console.log("\n");
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                  Demonstration Completed                   ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n");
}

main();