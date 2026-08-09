import { Router } from 'express';
import healthRoute from './health.route.js';
import mondayRoute from './monday.route.js';
import chatRoute from './chat.route.js';
import statusRoute from './status.route.js';

const router = Router();

router.use('/health', healthRoute);
router.use('/monday', mondayRoute);
router.use('/chat', chatRoute);
router.use('/status', statusRoute);

export default router;
