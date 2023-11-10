/**
 * @typedef item
 * @property {string} name
 * @property {string} id
 * @property {number} price
 * @property {string} image
 */

async function main() {
    const response = await fetch('./data/menu-items.jsonc');
    const items = await JSON.parse((await response.text()).replace(new RegExp('//.*', 'mg'), ''));

    async function update() {
        let currentItems = libs.cart.items;
        const currentItemsCount = {};
        currentItems.forEach((value) => {
            currentItemsCount[value] = (currentItemsCount[value] ?? 0) + 1;
        });
        currentItems = currentItems.filter(function (value, index, array) {
            return array.indexOf(value) === index;
        });
        const itemDiv = document.getElementById('items');
        itemDiv.innerHTML = '';
        currentItems.forEach((value) => {
            const details = items.find((item) => item.id === value);
            if (!details) return;
            itemDiv.insertAdjacentHTML('beforeend', `<br>${details.name} x${currentItemsCount[value]}<br>`);
        });
    }

    update();
}

window.addEventListener('load', main);
