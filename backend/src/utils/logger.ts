import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "info";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const defaultFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm" }),
    winston.format.printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
);

const colorizedFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    })
);

const date = new Date();
const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const transports = [
    new winston.transports.Console({
        format: colorizedFormat,
    }),
    new winston.transports.File({
        filename: `logs/${dateString}.log`,
        maxFiles: 2,
        format: defaultFormat,
    }),
];

export const logger = winston.createLogger({
    level: level(),
    levels,
    transports,
});
