import winston from 'winston';

const customFormat = winston.format.printf(({ timestamp, level, message, correlationId, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
  const requestIdString = correlationId ? ` requestId: ${correlationId}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}${requestIdString}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DDTHH:mm:ss.sssZ', // Zulu time
    }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    // Uncomment this line to log to a file
    // new winston.transports.File({ filename: "app.log" }),
  ],
});

export default logger;
