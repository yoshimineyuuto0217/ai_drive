import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(articleController.list));
router.get('/:id', asyncHandler(articleController.getById));
router.post('/', asyncHandler(articleController.create));
router.patch('/:id', asyncHandler(articleController.update));
router.delete('/:id', asyncHandler(articleController.remove));

export default router;
