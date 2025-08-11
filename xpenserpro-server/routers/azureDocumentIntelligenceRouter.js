import express from 'express';

import { isAuthenticated } from '../middlewares/authorization.js';

import {
    analyze
} from '../controllers/azureDocumentIntelligenceController.js';

const router = new express.Router();

router.route('/azure-document-intelligence/analyze')
    .post(isAuthenticated, analyze);

export default router;