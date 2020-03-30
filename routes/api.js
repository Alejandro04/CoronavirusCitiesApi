const express = require('express');
const router = express.Router();
const Airtable = require('airtable');
require('dotenv').config();

// GLOBAL
base = new Airtable({ apiKey: process.env.AIRTABLEKEY }).base(process.env.AIRTABLEBASE);
citiesTable = 'Cities'

/******************
 * ENDPOINTS
 ******************/
router.get('/airtables/:country', (req, res) => {
    base(citiesTable).select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            if(record.get('country') === req.params.country){
                console.log('Retrieved', record.get('country'));
            }
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
});

module.exports = router;
