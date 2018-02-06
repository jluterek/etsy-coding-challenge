'use strict';

const apikey = 'g3txc73pjsjr9aipyd899ws5';
const program = require('commander');
const etsyTrack = require('./lib/etsy_listingtrack');

function list(val) {
    return val.split(',');
}

program
  .version('0.0.1')
  .description('Application to track etsy store listing changes')
  .option('-k, --apikey', 'Etsy API Key')
  .option('-i, --ids <items>', 'Comma Separated Store IDs', list)
  .option('-s, --save', 'Update listings in database')
  .parse(process.argv);

if (!program.apikey) {
    console.log(`API Key (-k) is required.`);
    return;
}

if (program.ids && program.ids.length > 0) {
    let save = false;
    if (program.save) save = true;
    RunComparison(apikey, program.ids, save);
}

async function RunComparison(apikey, ids, save) {
    await Promise.all(ids.map(async (id) => {
        let results = await etsyTrack.Track(apikey, id, save);
        console.log(`\nShop ID ${id}`);
        if (results.length > 0) {
            for (let result of results) {
                console.log(result);
            }
        }
        else {
            console.log('No Changes since last sync');
        }
        console.log();
    }));
};

