/**
 * @typedef item
 * @property {string} name
 * @property {string} id
 * @property {number} price
 * @property {string} image
 */

async function main() {
    const items = document.getElementById('items');
    fetch('./data/menu-items.jsonc').then(async function (response) {
        /** @type {item[]} */
        const json = await JSON.parse((await response.text()).replace(new RegExp('//.*', 'mg'), ''));
        json.forEach((value) => {
            const div = document.createElement('div');
            div.classList.add('item');
            div.insertAdjacentHTML(
                'beforeend',
                `<p><b>${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(value.price)}</b> ${value.name}</p><img src="${value.image}" alt="${
                    value.name
                }"><button type="button">Add to Bag</button>`
            );
            items.insertAdjacentElement('beforeend', div);

            const button = div.getElementsByTagName('button').item(0);
            let debounce = false;
            button.addEventListener('click', () => {
                if (debounce) return;
                debounce = true;
                libs.cart.add(value.id);
                button.innerText = 'Added!';
                setTimeout(() => {
                    button.innerText = 'Add to Bag';
                    debounce = false;
                }, 1000);
            });
        });
    });
}

window.addEventListener('load', main);
