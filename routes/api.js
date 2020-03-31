const express = require('express');
const Airtable = require('airtable');
const router = express.Router();
require('dotenv').config();

// GLOBAL
base = new Airtable({ apiKey: process.env.AIRTABLEKEY }).base(process.env.AIRTABLEBASE);
citiesTable = 'Cities'
lastUpdateTable = 'LastUpdateCities'

/******************
 * ENDPOINTS
 ******************/
router.get('/country/:country', (req, res) => {
    getLastUpdate(req, res)
});

async function getLastUpdate(req, res){
    let lastUpdate = ''
    await base(lastUpdateTable).select({
        maxRecords: 1,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            lastUpdate = record.get('lastUpdate')
            getCities(req, res, lastUpdate)
        });
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

async function getCities(req, res, lastUpdate) {
    let cities = []
    await base(citiesTable).select({
        view: "Grid view",
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
        returnObject(res, cities, lastUpdate)
        fetchNextPage();
    }, function done(err) {
        if (err) { console.error(err); return; }
    });
}

function returnObject(res, cities, lastUpdate) {
    res.json({
        cities,
        lastUpdate
    })
}

module.exports = router;