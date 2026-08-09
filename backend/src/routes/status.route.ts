import { Router } from 'express';
import { StatusController } from '../controllers/status.controller.js';

const router = Router();
const controller = new StatusController();

router.get('/', controller.getStatus);

export default router;
