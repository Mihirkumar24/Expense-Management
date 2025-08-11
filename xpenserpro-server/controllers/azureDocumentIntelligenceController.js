import DocumentIntelligence, {
    getLongRunningPoller,
    isUnexpected
} from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';

import asyncErrorHandler from '../middlewares/asyncErrorHandler.js';
import CustomError from '../utils/CustomError.js';

const endpoint = process.env.AZURE_ENDPOINT;
const key = process.env.AZURE_KEY;

export const analyze = asyncErrorHandler(async (req, res, next) => {
    const { base64Source } = req.body;

    const client = DocumentIntelligence(endpoint, new AzureKeyCredential(key));

    const initialResponse = await client
        .path('/documentModels/{modelId}:analyze', 'prebuilt-receipt')
        .post({
            contentType: 'application/json',
            body: {
                base64Source,
            }
        });

    if (isUnexpected(initialResponse)) {
        throw initialResponse.body.error;
    }

    const poller = getLongRunningPoller(client, initialResponse);

    const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

    const result = analyzeResult?.documents[0];

    const fields = {};

    if (result) {
        const {
            MerchantName,
            Total,
            TransactionDate
        } = result.fields;

        if (MerchantName) {
            fields.merchant = MerchantName.valueString;
        }

        if (Total) {
            fields.amount = Total.valueCurrency.amount;
            fields.currency = Total.valueCurrency.currencyCode;
        }

        if (TransactionDate) {
            fields.date = TransactionDate.valueDate;
        }
    }

    res.json({ fields });
});