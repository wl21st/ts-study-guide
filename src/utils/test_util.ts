// ─── Test Data Generator Utility ──────────────────────────────────────────────

import User from "../eo/user.js";

/**
 * Utility class for generating random test data
 * Provides methods to generate sample data for testing and demonstrations
 */
class Test_util {
    /**
     * Sample first names for random user generation
     */
    private static readonly FIRST_NAMES: string[] = [
        "Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry",
        "Ivy", "Jack", "Kate", "Leo", "Megan", "Noah", "Olivia", "Peter"
    ];

    /**
     * Sample last names for random user generation
     */
    private static readonly LAST_NAMES: string[] = [
        "Johnson", "Smith", "White", "Brown", "Martinez", "Garcia", "Wilson",
        "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin", "Lee"
    ];

    /**
     * Sample email domains
     */
    private static readonly EMAIL_DOMAINS: string[] = [
        "example.com", "test.com", "demo.com", "sample.org", "mail.net"
    ];

    /**
     * Generate a fixed set of sample users for consistent testing
     * @returns Array of predefined User objects
     */
    static generateSampleUsers(): User[] {
        return [
            new User(1, "Alice Johnson",  32, "alice@example.com",  true),
            new User(2, "Bob Smith",      24, "bob@example.com",    false),
            new User(3, "Carol White",    45, "carol@example.com",  true),
            new User(4, "David Brown",    19, "david@example.com",  false),
            new User(5, "Eve Martinez",   38, "eve@example.com",    true),
        ];
    }

    /**
     * Generate a random user with auto-generated data
     * @param id User ID (optional, increments if not provided)
     * @returns A randomly generated User object
     */
    static generateRandomUser(id: number = Math.floor(Math.random() * 10000)): User {
        const firstName = this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)] ?? "First";
        const lastName = this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)] ?? "Last";
        const age = Math.floor(Math.random() * 60) + 18; // Age between 18 and 78
        const domain = this.EMAIL_DOMAINS[Math.floor(Math.random() * this.EMAIL_DOMAINS.length)] ?? "example.com";
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
        const isSenior = age >= 30; // Consider 30+ as senior

        return new User(id, `${firstName} ${lastName}`, age, email, isSenior);
    }

    /**
     * Generate multiple random users
     * @param count Number of users to generate
     * @returns Array of randomly generated User objects
     */
    static generateRandomUsers(count: number): User[] {
        const users: User[] = [];
        for (let i = 1; i <= count; i++) {
            users.push(this.generateRandomUser(i));
        }
        return users;
    }

    /**
     * Generate a batch of users with specific criteria
     * @param count Number of users to generate
     * @param minAge Minimum age (optional)
     * @param maxAge Maximum age (optional)
     * @returns Array of User objects matching criteria
     */
    static generateUsersByCriteria(count: number, minAge?: number, maxAge?: number): User[] {
        const users: User[] = [];
        for (let i = 1; i <= count; i++) {
            let age = Math.floor(Math.random() * 60) + 18;
            
            if (minAge !== undefined && maxAge !== undefined) {
                age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
            }

            const firstName = this.FIRST_NAMES[Math.floor(Math.random() * this.FIRST_NAMES.length)] ?? "First";
            const lastName = this.LAST_NAMES[Math.floor(Math.random() * this.LAST_NAMES.length)] ?? "Last";
            const domain = this.EMAIL_DOMAINS[Math.floor(Math.random() * this.EMAIL_DOMAINS.length)] ?? "example.com";
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
            const isSenior = age >= 30;

            users.push(new User(i, `${firstName} ${lastName}`, age, email, isSenior));
        }
        return users;
    }
}

export default Test_util;