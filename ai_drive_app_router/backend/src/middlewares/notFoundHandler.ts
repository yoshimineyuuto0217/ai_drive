import { Request, Response } from 'express';

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    message: '指定されたエンドポイントが見つかりません',
  });
};
