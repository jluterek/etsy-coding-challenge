'use strict';

const etsyGet = require('../lib/etsy_listingget');
const etsyStore = require('../lib/etsy_listingstore');
const etsyCompare = require('../lib/etsy_listingcompare');

//Main function call.
var track = async function(apikey, shopID, saveChanges) {

    //Get current listing data
    etsyGet.Configure(apikey);
    let listingData = await etsyGet.GetShopListing(shopID);

    //Retrieve past listing data
    let lastListingData = await etsyStore.Get(shopID);

    //Compare listings and return results
    let result = etsyCompare.Compare(lastListingData, listingData);

    //Save new data for next comparison
    if (saveChanges) {
        etsyStore.Save(shopID, listingData);
    }

    return result;
};

//Export functions
module.exports.Track = track;
