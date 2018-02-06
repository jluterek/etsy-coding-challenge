'use strict';

const axios = require('axios');
var apikey = '';

//Configure apikey.
//Can update to object if updating to oauth
var configure = function(key) {
    apikey = key;
};

//Pull data through rest API
var getListingData = async function(shopID, limit, offset) {
    try {
        const res = await axios.get(`https://openapi.etsy.com/v2/shops/${shopID}/listings/active`, {
            params: {
                api_key: apikey,
                limit: limit,
                offset: offset
            }
          });
        return res.data;
    }
    catch (err) {
        //Normally add proper error handling and logging on a project wide basis
        //In this instance we may retry X times, and log with something like winston.
        //Displaying in console for simplicity and time
        console.log(err.response);
    }
};

//Recursive function to handle paging
var getShopListingAll = async function(shopID, limit, offset, results) {
    const data = await getListingData(shopID, limit, offset);
    //Add new data to array.
    results = results.concat(data.results);
    if (data.pagination.next_offset != null) {
        //More than one page, pull additional results
        results = await getShopListingAll(shopID, limit, data.pagination.next_offset, results);
    }
    return results;
};

//Main function call.
var getShopListing = async function(shopID) {
    let limit = 25;
    let offset = 0;
    let results = [];
    const data = await getShopListingAll(shopID, limit, offset, results);
    return data;
};

//Export functions
module.exports.Configure = configure;
module.exports.GetShopListing = getShopListing;
