// src/api/error/ErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class ErrorHandler extends Error {
    public statusCode: number;
    
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Middleware de tratamento de erro
export const handleError = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', error);

    // Se for um ZodError (erro de validação)
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Dados inválidos",
            errors: error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }

    // Se for um ErrorHandler customizado
    if (error instanceof ErrorHandler) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
        return;
    }

    // Erro genérico
    res.status(500).json({
        success: false,
        message: "Erro interno do servidor"
    });
};