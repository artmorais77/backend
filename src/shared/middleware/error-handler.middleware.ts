import {
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";
import { AppError } from "@/shared/errors/AppError";
import { env } from "@/env";
import z from "zod";

type PrismaErrorDetailsMap = {
  statusCode: number;
  message: string;
};

const prismaErrorDetails = (code: string) => {
  const map: Record<string, PrismaErrorDetailsMap> = {
    P2002: {
      statusCode: 409,
      message: "Já existe um registro com este valor.",
    },
    P2025: { statusCode: 404, message: "Registro não encontrado." },
    P2003: { statusCode: 400, message: "Registro relacionado não encontrado." },
    P2014: { statusCode: 400, message: "Violação de integridade referencial." },
  };

  return (
    map[code] ?? {
      statusCode: 500,
      message: "Erro inesperado no banco de dados.",
    }
  );
};

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (env.NODE_ENV === "development") {
    console.error("Erro: ", err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      issues: err.issues,
      tree: z.treeifyError(err),
    });
  }

  if (err instanceof PrismaClientValidationError) {
    return res
      .status(400)
      .json({ message: "Erro de validação no banco de dados" });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    const { message, statusCode } = prismaErrorDetails(err.code);

    return res.status(statusCode).json({ message: message });
  }

  return res.status(500).json({ message: "Erro interno do servidor" });
};
