import { format, transports } from 'winston';
import pc from 'picocolors';

export const winstonLoggerOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        format.printf((info) => {
          const timestamp = (info.timestamp as string) || '';
          const level = (info.level as string) || 'info';
          const message = info.message;
          const context = info.context as string | undefined;
          const stack = info.stack as string | undefined;

          // Colorize Level
          let coloredLevel = level.toUpperCase();
          if (level === 'info') coloredLevel = pc.blue(coloredLevel);
          else if (level === 'error') coloredLevel = pc.red(pc.bold(coloredLevel));
          else if (level === 'warn') coloredLevel = pc.yellow(coloredLevel);
          else if (level === 'debug') coloredLevel = pc.magenta(coloredLevel);

          // Format Context
          const formattedContext = context ? pc.gray(`[${context}]`) : '';

          // Check if message is a structured HTTP request log
          let formattedMessage = String(message);
          if (typeof message === 'object' && message !== null && 'method' in message && 'url' in message) {
            const httpLog = message as { method: string; url: string; status: number; duration: number };
            const { method, url, status, duration } = httpLog;

            // Colorize Method
            let coloredMethod = pc.bold(method);
            if (method === 'GET') coloredMethod = pc.green(coloredMethod);
            else if (method === 'POST') coloredMethod = pc.cyan(coloredMethod);
            else if (method === 'PUT' || method === 'PATCH') coloredMethod = pc.yellow(coloredMethod);
            else if (method === 'DELETE') coloredMethod = pc.red(coloredMethod);

            // Colorize Status Code
            let coloredStatus = String(status);
            if (status >= 200 && status < 300) coloredStatus = pc.green(coloredStatus);
            else if (status >= 300 && status < 400) coloredStatus = pc.yellow(coloredStatus);
            else if (status >= 400) coloredStatus = pc.red(pc.bold(coloredStatus));

            // Colorize Duration
            const coloredDuration = pc.gray(`${duration}ms`);

            formattedMessage = `${coloredMethod} ${pc.white(url)} - Status: ${coloredStatus} - ${coloredDuration}`;
          }

          const logOutput = `${pc.gray(`[CCIAMA]`)} ${pc.gray(timestamp)} ${coloredLevel} ${formattedContext} ${formattedMessage}`;
          return stack ? `${logOutput}\n${pc.red(stack)}` : logOutput;
        })
      ),
    }),
  ],
};
