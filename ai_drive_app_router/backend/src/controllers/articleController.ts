import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { articleService } from '../services/articleService';

const parseIdParam = (value: string): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError('記事IDが不正です');
  }
  return id;
};

export const articleController = {
  async list(_req: Request, res: Response) {
    const articles = await articleService.list();
    res.status(200).json(articles);
  },

  async getById(req: Request, res: Response) {
    const id = parseIdParam(req.params.id);
    const article = await articleService.getById(id);
    res.status(200).json(article);
  },

  async create(req: Request, res: Response) {
    const article = await articleService.create(req.body);
    res.status(201).json(article);
  },

  async update(req: Request, res: Response) {
    const id = parseIdParam(req.params.id);
    const article = await articleService.update(id, req.body);
    res.status(200).json(article);
  },

  async remove(req: Request, res: Response) {
    const id = parseIdParam(req.params.id);
    await articleService.remove(id);
    res.status(204).send();
  },
};
