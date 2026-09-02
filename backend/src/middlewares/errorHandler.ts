import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        statusCode: 404,
        message: '指定されたリソースが見つかりません',
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        statusCode: 400,
        message: '関連するデータが存在しません',
      });
    }
  }

  console.error(err);

  return res.status(500).json({
    statusCode: 500,
    message: 'サーバー内部でエラーが発生しました',
  });
};
