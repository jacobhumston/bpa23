// Libraries.
const libs = {};
const storage = localStorage;

// Library which helps with the insertion of HTML documents.
libs.include = {
    /**
     * Include a html file in the body.
     * @param {Document} document
     * @param {string} url
     * @param {"start"|"end"} place
     */
    includeBody: function (document, url, place) {
        let finalPlace = place;
        if (place === 'start') finalPlace = 'afterbegin';
        if (place === 'end') finalPlace = 'beforeend';
        fetch(url).then(async function (response) {
            document.body.insertAdjacentHTML(finalPlace, await response.text());
        });
    },

    /**
     * Include a css file in the head.
     * @param {Document} document
     * @param {string} url
     * @param {"start"|"end"} place
     */
    includeHeadCSS: function (document, url, place) {
        let finalPlace = place;
        if (place === 'start') finalPlace = 'afterbegin';
        if (place === 'end') finalPlace = 'beforeend';
        const rel = document.createElement('link');
        rel.rel = 'stylesheet';
        rel.href = url;
        document.head.insertAdjacentElement(finalPlace, rel);
    },
};

/**
 * @typedef {Object} cartItem Represents an item in the cart/bag.
 * @property {string} id ID of this item.
 * @property {string} displayName Display name of this item.
 */

// Library to add and remove items from the shopping cart.
libs.cart = {
    /** @type {cartItem[]} IDs of the items. */
    items: [],

    /**
     * Save all items in cart.
     */
    save: function () {
        storage.setItem('cartData_v2', JSON.stringify(this.items));
    },

    /**
     * Add an item to the cart.
     * @param {string} id The ID of the item to add.
     * @param {string} displayName Display name of the item to add.
     */
    add: function (id, displayName) {
        this.items.push({ id: id, displayName: displayName });
        this.save();
    },

    /**
     * Remove an item from the cart.
     * @param {string} displayName The displayName of the item to remove.
     */
    remove: function (displayName) {
        let removed = false;
        this.items.forEach((value, index) => {
            if (value !== null && removed == false) {
                if (value.displayName === displayName) {
                    removed = true;
                    this.items.splice(index);
                }
            }
        });
        if (removed === false) throw 'Item not found.';
        this.save();
    },

    /**
     * Clear all items from the cart.
     */
    clear: function () {
        this.items = [];
        this.save();
    },
};

if (storage.getItem('cartData_v2') !== null) {
    libs.cart.items = JSON.parse(storage.getItem('cartData_v2'));
}

/**
 * Function to parse JSONC.
 * @param {string} string 
 * @returns {any} JSON
 */
function parseJSONC(string) {
    return JSON.parse(string.replace(new RegExp('//.*', 'mg'), ''))
}

// Wasn't really sure how to do this, but I found a good solution on stack overflow that matched my needs.
/**
 * Function to sort objects.
 * SOURCE: https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
 */
const sortObjectByKeys = (object, { desc = false } = {}) => Object.fromEntries(
    Object.entries(object).sort(([k1], [k2]) => k1 < k2 ^ desc ? -1 : 1),
)