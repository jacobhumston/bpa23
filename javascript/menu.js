/**
 * @typedef item
 * @property {string} name
 * @property {string} id
 * @property {number} price
 * @property {string} image
 * @property {string} category
 * @property {string|undefined} description
 * @property {true|undefined} canBeMeal
 * @property {true|undefined} isDrink
 */

async function main() {
    fetch('./data/menu-items.jsonc')
        .then(async function (response) {
            const itemsDiv = document.getElementById('items');
            const itemCategoriesDiv = document.getElementById('itemCategories');
            const rawResponse = await response.text();

            /** @type {item[]} */
            const items = parseJSONC(rawResponse);

            /** @type {Object.<string, Array<item>>} */
            let categories = {};

            /** @type {Object.<string, HTMLButtonElement>} */
            const categoriesButtons = {};

            const icons = items[0].icons;
            items.shift();

            const toggleDescriptionFunctions = [];

            items.forEach(function (item) {
                if (!categories[item.category]) categories[item.category] = [];
                categories[item.category].push(item);
            });

            // categories = sortObjectByKeys(categories);
            let displayItemsDebounce = false;

            /**
             * @param {item[]} items
             * @param {boolean|undefined} isAll
             */
            async function displayItems(items, isAll) {
                if (displayItemsDebounce === true) return;
                displayItemsDebounce = true;

                for (const [_, button] of Object.entries(categoriesButtons)) {
                    button.classList.remove('current');
                    if (isAll === true) {
                        if (button.innerText.split(' ')[0] === 'All') button.classList.add('current');
                    } else {
                        if (items[0].category === button.innerText.split(' ')[0]) button.classList.add('current');
                    }
                }

                for (const div of itemsDiv.children) {
                    div.style.transform = 'scale(0)';
                };

                await new Promise((resolve) => setTimeout(resolve, 500));
                
                let currentIndex = -1;
                for (const item of items) {
                    currentIndex++;

                    const div = document.createElement('div');
                    div.classList.add('item');

                    const title = document.createElement('p');
                    title.innerHTML = `<b>${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(parseFloat(item.price))}</b> ${item.name}`;
                    if (isAll) title.insertAdjacentHTML('afterbegin', ` ${icons[item.category]}`);

                    const image = document.createElement('img');
                    image.src = item.image;
                    image.alt = item.name;

                    const description = document.createElement('p');
                    description.classList.add('description');
                    description.dataset.state = 'none';
                    description.style.fontSize = '0px';
                    description.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;${(
                        item.description || 'No description available.'
                    ).replace('\n', '<br>&nbsp;&nbsp;&nbsp;&nbsp;')}`;

                    const descriptionButton = document.createElement('button');
                    descriptionButton.innerHTML = 'View Description';
                    descriptionButton.id = 'viewDescription';
                    descriptionButton.style.marginTop = '-17px';

                    function hideDescription() {
                        description.dataset.state = 'none';
                        description.style.fontSize = '0px';
                        descriptionButton.innerText = 'View Description';
                        descriptionButton.style.marginTop = '-17px';
                    }

                    function showDescription() {
                        description.style.fontSize = 'medium';
                        description.dataset.state = 'inline-block';
                        descriptionButton.innerText = 'Hide Description';
                        descriptionButton.style.marginTop = '0px';
                    }

                    descriptionButton.addEventListener('click', () => {
                        if (description.dataset.state === 'none') {
                            showDescription();
                        } else {
                            hideDescription();
                        }
                    });

                    toggleDescriptionFunctions.push({ hide: hideDescription, show: showDescription });

                    const bagIcon =
                        '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="currentColor" d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>';
                    const optionsIcon =
                        "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>";

                    const button = document.createElement('button');
                    button.innerHTML = `${bagIcon}<span class="text">Add to Bag<span>`;
                    button.classList.add('lastButton');

                    if (item.canBeMeal || item.isDrink)
                        button.innerHTML = `${optionsIcon}<span class="text">Show Options</span>`;

                    div.insertAdjacentElement('beforeend', title);
                    div.insertAdjacentElement('beforeend', image);
                    div.insertAdjacentElement('beforeend', description);
                    div.insertAdjacentElement('beforeend', descriptionButton);
                    div.insertAdjacentHTML('beforeend', '<hr>');
                    div.insertAdjacentElement('beforeend', button);
                    itemsDiv.insertAdjacentElement('beforeend', div);

                    div.style.transform = 'scale(0)';
                    setTimeout(
                        () => {
                            div.style.transform = 'scale(1)';
                        },
                        0 + currentIndex * 100
                    );
                }

                displayItemsDebounce = false;
            }

            const toggleOnIcon =
                "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>";
            const toggleOffIcon =
                "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>";

            const toggleDescriptionsButton = document.createElement('button');
            toggleDescriptionsButton.id = 'toggleDescriptions';
            toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOffIcon}`;

            let descriptionsShowed = true;
            function toggleDescriptions() {
                if (descriptionsShowed === true) {
                    for (const toggleDescriptionFunction of toggleDescriptionFunctions) {
                        toggleDescriptionFunction.hide();
                    }
                } else {
                    for (const toggleDescriptionFunction of toggleDescriptionFunctions) {
                        toggleDescriptionFunction.show();
                    }
                }
            }

            toggleDescriptionsButton.addEventListener('click', () => {
                descriptionsShowed = !descriptionsShowed;
                descriptionsShowed === true
                    ? (toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOffIcon}`)
                    : (toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOnIcon}`);
                toggleDescriptions();
            });

            const categoriesTitle = document.createElement('p');
            categoriesTitle.innerHTML = '<b>Categories</b>';
            itemCategoriesDiv.insertAdjacentElement('beforeend', categoriesTitle);

            const allCategoriesButton = document.createElement('button');
            allCategoriesButton.type = 'button';
            allCategoriesButton.innerHTML = `All ${icons.All}`;
            allCategoriesButton.classList.add('categoryButton');
            categoriesButtons.All = allCategoriesButton;
            allCategoriesButton.addEventListener('click', () => {
                displayItems(items, true);
                toggleDescriptions();
            });
            itemCategoriesDiv.insertAdjacentElement('beforeend', allCategoriesButton);

            for (const category of Object.keys(categories)) {
                const button = document.createElement('button');
                button.type = 'button';
                button.innerHTML = `${category} ${icons[category]}`;
                button.classList.add('categoryButton');
                categoriesButtons[category] = button;
                button.addEventListener('click', () => {
                    displayItems(categories[category]);
                    toggleDescriptions();
                });
                itemCategoriesDiv.insertAdjacentElement('beforeend', button);
            }

            itemCategoriesDiv.insertAdjacentHTML('beforeend', '<br><br><p><b>Actions</b></p>');
            itemCategoriesDiv.insertAdjacentElement('beforeend', toggleDescriptionsButton);

            displayItems(categories[Object.keys(categories)[0]]);
            toggleDescriptions();
        })
        .catch(function (err) {
            const result = confirm(`Failed to load menu items, would you like to refresh the page?\n\nERR: ${err}`);
            if (result) document.location.reload();
        });
}

window.addEventListener('load', main);
