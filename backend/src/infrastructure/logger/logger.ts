// Domain Layer - Interfaces e Entidades
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface ILogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

export interface ILogger {
  info(message: string, context?: Record<string, any>): Promise<void>;
  warn(message: string, context?: Record<string, any>): Promise<void>;
  error(message: string, context?: Record<string, any>): Promise<void>;
  debug(message: string, context?: Record<string, any>): Promise<void>;
}

export interface ILoggerRepository {
  save(logEntry: ILogEntry): Promise<void>;
}

// Infrastructure Layer - Implementação do Repository
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileLoggerRepository implements ILoggerRepository {
  private readonly logsDir: string;

  constructor(logsDir: string = './logs') {
    this.logsDir = logsDir;
    this.ensureLogsDirectory();
  }

  private async ensureLogsDirectory(): Promise<void> {
    try {
      await fs.access(this.logsDir);
    } catch {
      await fs.mkdir(this.logsDir, { recursive: true });
    }
  }

  private getFileName(): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${dateStr}.json`;
  }

  private getFilePath(): string {
    return path.join(this.logsDir, this.getFileName());
  }

  async save(logEntry: ILogEntry): Promise<void> {
    try {
      const filePath = this.getFilePath();
      const logLine = JSON.stringify(logEntry) + '\n';
      
      await fs.appendFile(filePath, logLine, 'utf8');
    } catch (error) {
      console.error('Erro ao salvar log:', error);
      // Em caso de erro, não falha a aplicação
    }
  }
}

// Application Layer - Use Case
export class LoggerService implements ILogger {
  constructor(private readonly loggerRepository: ILoggerRepository) {}

  private async createLogEntry(
    level: LogLevel, 
    message: string, 
    context?: Record<string, any>
  ): Promise<void> {
    const logEntry: ILogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context })
    };

    await this.loggerRepository.save(logEntry);
  }

  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.createLogEntry(LogLevel.INFO, message, context);
  }

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.createLogEntry(LogLevel.WARN, message, context);
  }

  async error(message: string, context?: Record<string, any>): Promise<void> {
    await this.createLogEntry(LogLevel.ERROR, message, context);
  }

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    await this.createLogEntry(LogLevel.DEBUG, message, context);
  }
}

// Dependency Injection - Factory
export class LoggerFactory {
  private static instance: ILogger;

  static getInstance(): ILogger {
    if (!LoggerFactory.instance) {
      const repository = new FileLoggerRepository();
      LoggerFactory.instance = new LoggerService(repository);
    }
    return LoggerFactory.instance;
  }

  static create(logsDir?: string): ILogger {
    const repository = new FileLoggerRepository(logsDir);
    return new LoggerService(repository);
  }
}

// Exemplo de uso no Express
import express, { Request, Response, NextFunction } from 'express';

// Middleware de logging
export const loggingMiddleware = (logger: ILogger) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    // Log da requisição
    await logger.info('Requisição recebida', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Intercepta o final da resposta
    res.on('finish', async () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
      
      if (level === LogLevel.ERROR) {
        await logger.error('Resposta com erro', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`
        });
      } else {
        await logger.info('Resposta enviada', {
          method: req.method,
          url: req.url,
          statusCode: res.statusCode,
          duration: `${duration}ms`
        });
      }
    });

    next();
  };
};

// Exemplo de uso em uma rota
export const exampleRoute = (logger: ILogger) => {
  return async (req: Request, res: Response) => {
    try {
      await logger.info('Processando exemplo', { userId: req.body?.userId });
      
      // Sua lógica aqui...
      
      res.json({ success: true });
    } catch (error) {
      await logger.error('Erro no processamento', { 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};

// Como usar no app principal
/*
const app = express();
const logger = LoggerFactory.getInstance();

app.use(loggingMiddleware(logger));
app.get('/exemplo', exampleRoute(logger));

export default app;
*/