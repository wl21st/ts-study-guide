// ─── Logger Utility using Winston (Production-Ready Logger) ─────────────────

import winston from "winston";

/**
 * Logger utility class to initialize loggers from class names
 * Uses Winston, a production-ready logging library
 */
class Logger {
    private static readonly loggers: Map<string, winston.Logger> = new Map();

    /**
     * Initialize or retrieve a logger for the given class name
     * @param className The name of the class requesting the logger
     * @returns A Winston logger instance configured for the class
     */
    static getLogger(className: string): winston.Logger {
        if (this.loggers.has(className)) {
            return this.loggers.get(className)!;
        }

        const logger = winston.createLogger({
            level: process.env.LOG_LEVEL || "info",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${className}] [${level.toUpperCase()}] ${message}`;
                })
            ),
            transports: [new winston.transports.Console()],
        });

        this.loggers.set(className, logger);
        return logger;
    }
}

export default Logger;