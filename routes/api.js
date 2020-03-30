const express = require('express');
const router = express.Router();
require('dotenv').config();

// GLOBAL
base = new Airtable({ apiKey: process.env.AIRTABLEKEY }).base(process.env.AIRTABLEBASE);

/******************
 * ENDPOINTS
 ******************/
router.get('/airtables/:country', (req, res) => {
});

module.exports = router;
