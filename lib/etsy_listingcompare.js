'use strict';

/*
Brute force approach.
It seems more stores only have a few items, so this should work fine.
If tracking stores with hundreds of items, probably want to opimize with a hash.
*/
const deepDiff = require('deep-diff');
const deepEqual = require('deep-equal');

var findItemByID = function(Listings, ID) {
    for (let l of Listings) {
        if (l.listing_id === ID) {
            return l;
        }
    }
};

var removeSame = function(Listings, Invalids) {
    return Listings.filter((item) => {
        return !Invalids.includes(item);
    });
};

var removeDifferent = function(Listings, Invalids) {
    return Listings.filter((item) => {
        return Invalids.includes(item);
    });
};

var formatResults = function(deleted, added, changed) {
    //Basic formatting for console
    deleted = deleted.map((e) => {
        e = ` - removed listing ${e}`;
        return e;
    });
    added = added.map((e) => {
        e = ` + added listing ${e}`;
        return e;
    });

    //Show which listings changed with details
    changed = changed.map((e) => {
        let changes = '';
        e.Diff.forEach(t => {
            switch(t.kind) {
                case 'N':
                    changes += `    + added ${t.path} - ${t.rhs} \n`;
                    break;
                case 'D':
                    changes += `    - removed ${t.path} - ${t.rhs} \n`;
                    break;
                case 'E':
                    changes += `    # modified ${t.path} - ${t.lhs} => ${t.rhs} \n`;
                    break;
                case 'A':
                    changes += `    # modified ${t.path} - ${t.item} \n`;
                    break;
            }
        });
        e = ` # modified listing ${e.ID}\n${changes}`;
        return e;
    });

    //Combine three sets for single change list.
    return deleted.concat(added, changed);
};

var compare = function(OldListing, NewListing) {
    let OldIDs = [];
    let NewIDs = [];

    for (let l of OldListing) {
        OldIDs.push(l.listing_id);
    }
    for (let l of NewListing) {
        NewIDs.push(l.listing_id);
    }

    //Find items only in OldListing
    let deleted = removeSame(OldIDs, NewIDs);

    //Find items only in NewListing
    let added = removeSame(NewIDs, OldIDs);

    //Find items in both
    let both = removeDifferent(NewIDs, OldIDs);
    
    let changed = [];
    //Need to do a deeper comparison on IDs that carry over.
    //Compare items with matching IDS for product changes
    for (let id of both) {
        let oldItem = findItemByID(OldListing, id);
        let newItem = findItemByID(NewListing, id);
        if (!deepEqual(oldItem, newItem)) {
            changed.push({ID: id, Diff: deepDiff(oldItem, newItem)});
        }
    }

    //Create human readable form
    return formatResults(deleted, added, changed);
};

//Export functions
module.exports.Compare = compare;
