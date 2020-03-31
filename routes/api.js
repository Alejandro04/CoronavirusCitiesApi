const express = require('express');
const Airtable = require('airtable');
const router = express.Router();
require('dotenv').config();

// GLOBAL
base = new Airtable({ apiKey: process.env.AIRTABLEKEY }).base(process.env.AIRTABLEBASE);
citiesTable = 'Cities'
cities = []

/******************
 * ENDPOINTS
 ******************/
router.get('/country/:country', (req, res) => {
    getCities(req, res)
});

async function getCities(req, res) {
    await base(citiesTable).select({
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function (record) {
            if (record.get('country') === req.params.country) {
                cities.push({
                    state: record.get('state'),
                    cases: record.get('cases'),
                    deaths: record.get('deaths')
                })
            }
        });
        returnObject(res)
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

function returnObject(res) {
    res.json(cities)
}

module.exports = router;