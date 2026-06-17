// ─── Logger_util Utility (Unified - Supports Winston or OpenTelemetry) ───────────

import winston from "winston";

/**
 * Unified Logger_util interface that supports both Winston and OpenTelemetry backends
 * Use LOG_PROVIDER environment variable to switch: "winston" (default) or "otel"
 */

interface LoggerInstance {
    info(message: string, attributes?: Record<string, string | number | boolean>): void;
    warn(message: string, attributes?: Record<string, string | number | boolean>): void;
    error(message: string, attributes?: Record<string, string | number | boolean>): void;
    debug(message: string, attributes?: Record<string, string | number | boolean>): void;
}

/**
 * Winston Logger_util Implementation
 */
class WinstonLoggerInstance implements LoggerInstance {
    constructor(private winstonLogger: winston.Logger) {}

    info(message: string): void {
        this.winstonLogger.info(message);
    }

    warn(message: string): void {
        this.winstonLogger.warn(message);
    }

    error(message: string): void {
        this.winstonLogger.error(message);
    }

    debug(message: string): void {
        this.winstonLogger.debug(message);
    }
}

/**
 * OpenTelemetry Logger_util Implementation
 */
class OTelLoggerInstance implements LoggerInstance {
    private readonly context: Map<string, string | number | boolean> = new Map();

    constructor(private moduleName: string) {}

    setContext(attributes: Record<string, string | number | boolean>): void {
        Object.entries(attributes).forEach(([key, value]) => {
            this.context.set(key, value);
        });
    }

    info(message: string, attributes?: Record<string, string | number | boolean>): void {
        this.logWithLevel("INFO", message, attributes);
    }

    warn(message: string, attributes?: Record<string, string | number | boolean>): void {
        this.logWithLevel("WARN", message, attributes);
    }

    error(message: string, attributes?: Record<string, string | number | boolean>): void {
        this.logWithLevel("ERROR", message, attributes);
    }

    debug(message: string, attributes?: Record<string, string | number | boolean>): void {
        if (process.env.LOG_LEVEL === "debug") {
            this.logWithLevel("DEBUG", message, attributes);
        }
    }

    private logWithLevel(
        level: string,
        message: string,
        attributes?: Record<string, string | number | boolean>
    ): void {
        const timestamp = new Date().toISOString();
        const mergedAttributes = { ...Object.fromEntries(this.context), ...attributes };

        const attributesStr = Object.keys(mergedAttributes).length > 0
            ? ` | ${JSON.stringify(mergedAttributes)}`
            : "";

        const output = `[${timestamp}] [${this.moduleName}] [${level}] ${message}${attributesStr}`;

        if (level === "ERROR") {
            console.error(output);
        } else if (level === "WARN") {
            console.warn(output);
        } else if (level === "DEBUG") {
            console.debug(output);
        } else {
            console.log(output);
        }
    }
}

/**
 * Unified Logger_util factory class
 * Supports both Winston and OpenTelemetry backends
 */
class LoggerUtil {
    private static readonly loggers: Map<string, LoggerInstance> = new Map();
    private static readonly provider: string = process.env.LOG_PROVIDER || "winston";
    private static readonly winstonLoggers: Map<string, winston.Logger> = new Map();
    private static readonly otelLoggers: Map<string, OTelLoggerInstance> = new Map();

    /**
     * Get or create a logger for the given module name
     * @param moduleName The name of the module
     * @returns A logger instance (Winston or OpenTelemetry based on LOG_PROVIDER)
     */
    static getLogger(moduleName: string): LoggerInstance {
        if (this.loggers.has(moduleName)) {
            return this.loggers.get(moduleName)!;
        }

        let logger: LoggerInstance;

        if (this.provider === "otel") {
            logger = this.createOTelLogger(moduleName);
        } else {
            logger = this.createWinstonLogger(moduleName);
        }

        this.loggers.set(moduleName, logger);
        return logger;
    }

    /**
     * Create a Winston logger instance
     */
    private static createWinstonLogger(moduleName: string): LoggerInstance {
        if (this.winstonLoggers.has(moduleName)) {
            return new WinstonLoggerInstance(this.winstonLoggers.get(moduleName)!);
        }

        const winstonLogger = winston.createLogger({
            level: process.env.LOG_LEVEL || "info",
            format: winston.format.combine(
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] [${moduleName}] [${level.toUpperCase()}] ${message}`;
                })
            ),
            transports: [new winston.transports.Console()],
        });

        this.winstonLoggers.set(moduleName, winstonLogger);
        return new WinstonLoggerInstance(winstonLogger);
    }

    /**
     * Create an OpenTelemetry logger instance
     */
    private static createOTelLogger(moduleName: string): LoggerInstance {
        if (this.otelLoggers.has(moduleName)) {
            return this.otelLoggers.get(moduleName)!;
        }

        const otelLogger = new OTelLoggerInstance(moduleName);
        this.otelLoggers.set(moduleName, otelLogger);
        return otelLogger;
    }

    /**
     * Shutdown all loggers (cleanup resources)
     */
    static async shutdown(): Promise<void> {
        this.loggers.clear();
        this.winstonLoggers.clear();
        this.otelLoggers.clear();
    }

    /**
     * Get the current logger provider
     */
    static getProvider(): string {
        return this.provider;
    }
}

export { LoggerUtil };
