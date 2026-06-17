// ─── User Class ──────────────────────────────────────────────────────────────


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

export { User };