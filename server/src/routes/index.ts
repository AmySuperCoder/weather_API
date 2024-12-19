import { Router } from 'express';
const router = Router();

import weatherRoutes from './api/weatherRoutes.js';
import htmlRoutes from './htmlRoutes.js'

router.use('/', htmlRoutes)
router.use('/api/weather', weatherRoutes);


export default router;
