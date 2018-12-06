import { Router } from 'express';
import { QuotesController } from './controllers/quotes-controller';
import { ParametersValidator } from './controllers/params-validator';

export const router = Router();
const quotesController = new QuotesController();

router.get('/', [
    ParametersValidator.validate,
    quotesController.handle.bind(quotesController)
]);

router.get('/:asset', [
    ParametersValidator.validate,
    quotesController.handle.bind(quotesController)
]);

export default router;
