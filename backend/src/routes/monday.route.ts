import { Router } from 'express';
import { MondayController } from '../controllers/monday.controller.js';
import { MondayService } from '../services/monday.service.js';
import { config } from '../config/environment.js';

const router = Router();
const mondayService = new MondayService({
  apiToken: process.env.MONDAY_API_TOKEN || '',
  apiUrl: process.env.MONDAY_API_URL || 'https://api.monday.com/v2',
  dealBoardId: process.env.DEAL_FUNNEL_BOARD_ID,
  workOrderBoardId: process.env.WORK_ORDER_TRACKER_BOARD_ID
});
const controller = new MondayController(mondayService);

router.get('/status', controller.getStatus);
router.get('/deals', controller.getDeals);
router.get('/work-orders', controller.getWorkOrders);

export default router;
