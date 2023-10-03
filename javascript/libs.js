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

// Library to add and remove items from the shopping cart.
libs.cart = {
    /** @type {string[]} IDs of the items. */
    items: [],

    /**
     * Save all items in cart.
     */
    save: function () {
        storage.setItem('cartData', JSON.stringify(this.items));
    },

    /**
     * Add an item to the cart.
     * @param {string} id The ID of the item to add.
     */
    add: function (id) {
        this.items.push(id);
        this.save();
    },

    /**
     * Remove an item from the cart.
     * @param {number} id The ID of the item to remove.
     */
    remove: function (id) {
        let removed = false;
        this.items.forEach((value, index) => {
            if (value !== null && removed == false) {
                if (value === id) {
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

if (storage.getItem('cartData') !== null) {
    libs.cart.items = JSON.parse(storage.getItem('cartData'));
}