// ─── User Class ──────────────────────────────────────────────────────────────

import Logger from "./logger.js";

class User {
    constructor(
        public readonly id: number,
        public name: string,
        public age: number,
        public email: string,
        public isSenior: boolean
    ) {}

    toString(): string {
        return `User(id=${this.id}, name="${this.name}", age=${this.age}, email="${this.email}", isSenior=${this.isSenior})`;
    }
}

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

// ─── Main Logic ───────────────────────────────────────────────────────────────

function main(): void {
    const logger = Logger.getLogger("main");
    logger.info("Starting user generation");

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

    logger.info("User generation completed");
}

main();
