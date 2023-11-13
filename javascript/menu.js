/**
 * @typedef item
 * @property {string} name
 * @property {string} id
 * @property {number} price
 * @property {string} image
 * @property {string|undefined} description
 * @property {true|undefined} canBeMeal
 * @property {true|undefined} isDrink
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
                }).format(parseFloat(value.price))}</b> ${value.name}</p><img src="${value.image}" alt="${
                    value.name
                }"><p class="description">${
                    value.description
                        ? '&nbsp;&nbsp;&nbsp;&nbsp;' +
                          value.description.replaceAll('\n', '<br><br>&nbsp;&nbsp;&nbsp;&nbsp;')
                        : ''
                }</p>`
            );

            if (value.canBeMeal) {
                div.insertAdjacentHTML(
                    'beforeend',
                    `<button>Add to Bag</button><button class="lastButton">Add to Bag (Make a Meal)</button>`
                );
            } else {
                if (!value.isDrink) {
                    div.insertAdjacentHTML('beforeend', `<button class="lastButton">Add to Bag</button>`);
                } else {
                    div.insertAdjacentHTML(
                        'beforeend',
                        `<button>Add to Bag (Small)</button>
                    <button>Add to Bag (Medium)</button>
                    <button class="lastButton">Add to Bag (Large)</button>`
                    );
                }
            }
            items.insertAdjacentElement('beforeend', div);

            const buttons = div.getElementsByTagName('button');
            for (const button of buttons) {
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
            }
        });
    });
}

window.addEventListener('load', main);
