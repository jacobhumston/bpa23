/**
 * This file looks large, however it's just in charge of the menu.
 * The goal was to create a menu that feels real as possible.
 *
 * Because of this, no payment is actually made once you reach the payment page.
 * This file also includes a lot of helper functions to make the menu work.
 *
 * One of the most important things to note is that the menu is dynamic.
 * It's loaded via a jsonc file that is converted to json then to an array of items.
 *
 * This allows us to easily add new items to the menu without having to modify the code.
 * That menu file also includes icons for the item categories.
 *
 * The menu also includes a cart system.
 * The cart system (source code found in lib) is used to store the items.
 *
 * The information contained in a cart item is listed bellow:
 */

/**
 * Represents a cart function.
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

/**
 * Main function, executed once the window is loaded.
 */
async function main() {
    // location.hash = '';

    // Last window position before popup.
    let lastWindowPositionBeforePopup = 0;

    /**
     * This function displays a popup with action buttons, or just text depending on what is provided.
     * @param {string} title
     * @param {string} message
     * @param {{ type: 'button'|'input'|'select'|'secondaryButton'|'br'|'hr', maxWidth: [string], svg: string, options: string[]?, text: string, onclick: function?, inputType: string?, textChanged: function? }[]} actions
     * @param {Function} callback
     */
    async function displayPopup(title, message, actions, callback) {
        // Modify the last window position.
        lastWindowPositionBeforePopup =
            window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

        // Scroll to the top of the page.
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Await for the page to scroll to the top.
        await new Promise(async function (resolve) {
            while (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0 !== 0) {
                await wait();
            }
            resolve();
        });

        // Get the popup elements.
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popupTitle');
        const popupCloseButton = document.getElementById('popupCloseButton');
        const popupBackground = document.getElementById('popupBackground');
        const popupDescription = document.getElementById('popupDescription');
        const popupActionContainer = document.getElementById('popupActionContainer');
        const popupCloseSeparator = document.getElementById('popupCloseSeparator');

        // Modify the popup elements.
        document.documentElement.style.overflow = 'hidden';
        popupTitle.innerText = title;
        popupDescription.innerHTML = message.replace('\n', '<br>');
        popup.style.display = 'block';
        popupBackground.style.display = 'block';
        popupActionContainer.innerHTML = '';

        // Create the action elements for the popup.
        const elements = [];
        for (const action of actions) {
            if (action.type === 'button') {
                const button = document.createElement('button');
                button.type = 'button';
                button.innerHTML = action.text;
                if (action.svg)
                    button.innerHTML = `${action.svg}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text">${action.text}</span>`;
                button.classList.add('popupActionButton');
                button.addEventListener('click', () => action.onclick());
                popupActionContainer.insertAdjacentElement('beforeend', button);
                if (action.maxWidth) button.style.maxWidth = action.maxWidth;
                if (action.maxWidth) button.style.display = 'inline';
                elements.push(button);
            } else if (action.type === 'secondaryButton') {
                const button = document.createElement('button');
                button.type = 'button';
                button.innerHTML = action.text;
                if (action.svg)
                    button.innerHTML = `${action.svg}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text">${action.text}</span>`;
                button.classList.add('popupActionButtonSecondary');
                button.addEventListener('click', () => action.onclick());
                popupActionContainer.insertAdjacentElement('beforeend', button);
                if (action.maxWidth) button.style.maxWidth = action.maxWidth;
                if (action.maxWidth) button.style.display = 'inline';
                elements.push(button);
            } else if (action.type === 'input') {
                const input = document.createElement('input');
                input.type = action.inputType || 'text';
                input.placeholder = action.text;
                input.required = true;
                input.classList.add('popupActionInput');
                if (action.textChanged) {
                    input.addEventListener('input', () => {
                        let value = input.value;
                        if (value === '') value = null;
                        action.textChanged(value);
                    });
                }
                popupActionContainer.insertAdjacentElement('beforeend', input);
                if (action.maxWidth) input.style.maxWidth = action.maxWidth;
                if (action.maxWidth) input.style.display = 'inline';
                elements.push(input);
            } else if (action.type === 'select') {
                // console.log(action);
                const select = document.createElement('select');
                select.classList.add('popupActionSelect');
                for (const option of action.options) {
                    const optionElement = document.createElement('option');
                    optionElement.innerText = option;
                    select.insertAdjacentElement('beforeend', optionElement);
                }
                if (action.textChanged) {
                    select.addEventListener('input', () => {
                        let value = select.value;
                        if (value === '') value = null;
                        action.textChanged(value);
                    });
                }
                popupActionContainer.insertAdjacentElement('beforeend', select);
                if (action.maxWidth) select.style.maxWidth = action.maxWidth;
                if (action.maxWidth) select.style.display = 'inline';
                elements.push(select);
            } else if (action.type === 'br') {
                const br = document.createElement('br');
                popupActionContainer.insertAdjacentElement('beforeend', br);
            } else if (action.type === 'hr') {
                const hr = document.createElement('hr');
                hr.classList.add('popupActionSeparator');
                popupActionContainer.insertAdjacentElement('beforeend', hr);
            }
        }

        // Modify the close button.
        if (actions.length === 0) {
            popupCloseButton.innerText = 'Close';
            popupCloseSeparator.style.display = 'none';
        } else {
            popupCloseButton.innerText = 'Cancel';
            popupCloseSeparator.style.display = 'block';
        }

        // Wait a few milliseconds, then display the popup.
        await wait(100);
        popup.style.transform = 'scale(1)';
        popupBackground.style.opacity = '1';

        // Close the popup when the close button is clicked.
        popupCloseButton.onclick = function () {
            hidePopup();
            if (callback) setTimeout(callback, 100);
        };

        // Return the elements.
        return elements;
    }

    /**
     * Function to hide the popup and reset the window position back to what it was.
     */
    async function hidePopup() {
        const popup = document.getElementById('popup');
        const popupBackground = document.getElementById('popupBackground');

        document.documentElement.style.overflow = 'auto';

        popup.style.transform = 'scale(0)';
        popupBackground.style.opacity = '0';

        await wait(400);
        popup.style.display = 'none';
        popupBackground.style.display = 'none';
        window.scrollTo({ top: lastWindowPositionBeforePopup, behavior: 'smooth' });
    }

    // Fetch the list of menu items.
    fetch('./data/menu-items.jsonc').then(async function (response) {
        // Get elements.
        const itemsDiv = document.getElementById('items');
        const itemCategoriesDiv = document.getElementById('itemCategories');
        const rawResponse = await response.text();

        // Parse the JSONC.
        /** @type {item[]} */
        const items = parseJSONC(rawResponse);
        const allItems = parseJSONC(rawResponse);

        // Sort the items by category.
        /** @type {Object.<string, Array<item>>} */
        let categories = {};

        // Create a list of category buttons.
        /** @type {Object.<string, HTMLButtonElement>} */
        const categoriesButtons = {};

        // Get the icons. Then remove them from the items list.
        const icons = items[0].icons;
        items.shift();
        allItems.shift();

        // An array of toggle description functions.
        const toggleDescriptionFunctions = [];

        // Loop through each item and add it to the categories object.
        items.forEach(function (item) {
            if (!categories[item.category]) categories[item.category] = [];
            categories[item.category].push(item);
        });

        // categories = sortObjectByKeys(categories);
        let displayItemsDebounce = false;

        /**
         * Function to update the checkout.
         */
        function updateCheckout() {
            // Get the checkout elements.
            const checkoutItems = document.getElementById('checkoutItems');
            const checkoutTotal = document.getElementById('checkoutTotal');
            const checkoutButton = document.getElementById('checkoutButton');

            // Modify the checkout list, reset it, and then add the current items.
            checkoutItems.innerHTML = '';
            let total = 0;
            for (const item of libs.cart.items) {
                const div = document.createElement('div');
                div.classList.add('checkoutItem');

                // We need to make sure we calculate for price increase and the amount.
                const itemPrice =
                    items.find((i) => i.id === item.id).price * item.amount + item.priceIncrease * item.amount;

                const p = document.createElement('p');
                p.insertAdjacentHTML(
                    'afterbegin',
                    `<span class="amount">${item.amount}x&nbsp;&nbsp;</span> <span class="name">${
                        item.displayName
                    }</span> <span class="price">&nbsp;&nbsp;...&nbsp;${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(itemPrice)}</span> `
                );

                p.getElementsByClassName('name')
                    .item(0)
                    .addEventListener('click', function () {
                        libs.cart.remove(item.bagId);
                    });

                div.insertAdjacentElement('beforeend', p);
                checkoutItems.insertAdjacentElement('beforeend', div);
                checkoutItems.insertAdjacentElement('beforeend', document.createElement('br'));

                // Add the price to the total.
                total += itemPrice;
            }

            // Add a line break and the total.
            checkoutItems.insertAdjacentElement('beforeend', document.createElement('br'));

            checkoutTotal.innerHTML = `Your total is <span class="total">${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(total)}</span>.`;

            // console.log(total);

            // Modify the checkout button. Depending on if their is any items in the bag
            // or not, we will disable the button and change the text.
            if (libs.cart.items.length === 0) {
                checkoutButton.disabled = true;
                checkoutButton.innerText = 'Checkout';
                checkoutTotal.innerHTML = '';
                checkoutButton.hidden = true;
                checkoutItems.innerHTML = '<p><b>Please add an item to your bag before checking out!</b></p>';
            } else {
                checkoutButton.disabled = false;
                checkoutButton.hidden = false;
                checkoutButton.innerText = `Checkout`;
            }
        }

        // Add the update checkout function to the window.
        // We need to do this because lib.js needs to access it whenever an item is added.
        window.updateCheckout = updateCheckout;
        updateCheckout(); // Update the checkout for the first time.

        /**
         * This function displays all the items of in the provided list.
         * @param {item[]} items
         * @param {boolean|undefined} isAll
         */
        async function displayItems(items, isAll) {
            // Add a little debounce, just to make sure things don't get too mixed up.
            if (displayItemsDebounce === true) return;
            displayItemsDebounce = true;

            // Loop over the array of buttons and remove the current class from all of them except the current category.
            for (const [_, button] of Object.entries(categoriesButtons)) {
                button.classList.remove('current');
                if (isAll === true) {
                    if (button.innerText.split(' ')[0] === 'All') button.classList.add('current');
                } else {
                    if (items[0].category === button.innerText.split(' ')[0]) button.classList.add('current');
                }
            }

            // This loops over the current items displayed and animates them out.
            for (const div of itemsDiv.children) {
                div.style.transform = 'scale(0)';
            }

            // Wait a few milliseconds then wipe the items divider.
            await wait(500);
            itemsDiv.innerHTML = '';

            // Iterate over each item and add and display it.
            let currentIndex = -1;
            for (const item of items) {
                currentIndex++;

                // Create the item divider.
                const div = document.createElement('div');
                div.classList.add('item');
                div.id = `itemDiv${Math.floor(Math.random() * 999999999999999)}`;

                // Create the item title.
                const title = document.createElement('p');
                title.innerHTML = `<b>${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(parseFloat(item.price))}</b> ${item.name}`;
                if (isAll) title.insertAdjacentHTML('afterbegin', ` ${icons[item.category]}`);

                // Create the item image.
                const image = document.createElement('img');
                image.src = item.image;
                image.alt = item.name;

                // Create the item description.
                const description = document.createElement('p');
                description.classList.add('description');
                description.dataset.state = 'none';
                description.style.fontSize = '0px';
                description.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;${(
                    item.description || 'No description available.'
                ).replace('\n', '<br>&nbsp;&nbsp;&nbsp;&nbsp;')}`;

                // Create the item description button.
                const descriptionButton = document.createElement('button');
                descriptionButton.innerHTML = 'View Description';
                descriptionButton.id = 'viewDescription';
                descriptionButton.style.marginTop = '-17px';

                /**
                 * Function to hide the description.
                 */
                function hideDescription() {
                    description.dataset.state = 'none';
                    description.style.fontSize = '0px';
                    descriptionButton.innerText = 'View Description';
                    descriptionButton.style.marginTop = '-17px';
                }

                /**
                 * Function to show the description.
                 */
                function showDescription() {
                    description.style.fontSize = 'medium';
                    description.dataset.state = 'inline-block';
                    descriptionButton.innerText = 'Hide Description';
                    descriptionButton.style.marginTop = '0px';
                }

                // Add the event listener to the description button.
                // This toggles the description.
                descriptionButton.addEventListener('click', () => {
                    if (description.dataset.state === 'none') {
                        showDescription();
                    } else {
                        hideDescription();
                    }
                });

                // Add the above functions to the toggle description functions array.
                // This array is used by the toggle all descriptions button.
                toggleDescriptionFunctions.push({ hide: hideDescription, show: showDescription });

                const bagIcon =
                    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="currentColor" d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>';
                const optionsIcon =
                    "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>";

                const button = document.createElement('button');
                button.innerHTML = `${bagIcon}<span class="text">Add to Bag<span>`;
                button.classList.add('lastButton');

                // Check if the item can be a meal or is a drink.
                if (item.canBeMeal || item.isDrink) {
                    // If it is one of those two, the add to bag button changes to a show options button.
                    button.innerHTML = `${optionsIcon}<span class="text">Show Options</span>`;

                    // Listen for clicks on the button.
                    button.addEventListener('click', async () => {
                        // Popup an error if the user's bag is full.
                        if (libs.cart.items.length > 30) {
                            return displayPopup(
                                'Oh no!',
                                'You can only have up to 30 different items in your bag at once.\nPlease checkout or remove an item.',
                                []
                            );
                        }

                        // If the item is a drink, we need to display all the sizes first.
                        // Each size has a price increase except small, so we make sure to account for those as well.
                        if (item.isDrink) {
                            // Set the current size and price increase.
                            let currentSize = 'small';
                            let priceIncrease = 0;

                            // Create the popup, returns the elements.
                            const buttons = await displayPopup('Size', 'What size drink would you like?', [
                                {
                                    text: 'Small <i>(selected)</i>',
                                    type: 'secondaryButton',
                                    onclick: () => {
                                        currentSize = 'small';
                                        priceIncrease = 0;
                                        buttons[0].innerHTML = 'Small <i>(selected)</i>';
                                        buttons[1].innerHTML = 'Medium (+$0.25)';
                                        buttons[2].innerHTML = 'Large (+$0.50)';
                                    },
                                },
                                {
                                    text: 'Medium (+$0.25)',
                                    type: 'secondaryButton',
                                    onclick: () => {
                                        currentSize = 'medium';
                                        priceIncrease = 0.25;
                                        buttons[0].innerHTML = 'Small';
                                        buttons[1].innerHTML = 'Medium <i>(selected)</i> (+$0.25)';
                                        buttons[2].innerHTML = 'Large (+$0.50)';
                                    },
                                },
                                {
                                    text: 'Large (+$0.50)',
                                    type: 'secondaryButton',
                                    onclick: () => {
                                        currentSize = 'large';
                                        priceIncrease = 0.5;
                                        buttons[0].innerHTML = 'Small';
                                        buttons[1].innerHTML = 'Medium (+$0.25)';
                                        buttons[2].innerHTML = 'Large <i>(selected)</i> (+$0.50)';
                                    },
                                },
                                {
                                    type: 'hr',
                                },
                                {
                                    text: 'Next',
                                    type: 'button',
                                    svg: "<svg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 20 20' height='48px' viewBox='0 0 20 20' width='48px' fill='currentColor'><g><g><rect fill='none' height='20' width='20'/></g></g><g><polygon points='4.59,16.59 6,18 14,10 6,2 4.59,3.41 11.17,10'/></g></svg>",
                                    onclick: async () => {
                                        // Now we ask how many of these items they want.
                                        const elements = await displayPopup(
                                            'Amount',
                                            'How many would you like to add to your bag?',
                                            [
                                                {
                                                    inputType: 'number',
                                                    text: 'Amount',
                                                    type: 'input',
                                                    textChanged: (value) => {
                                                        let number = value ?? 0;
                                                        if (number > 10) {
                                                            elements[0].value = 10;
                                                            number = 10;
                                                        } else if (0 >= number) {
                                                            elements[0].value = '';
                                                            amount = 0;
                                                            elements[1].innerHTML = 'Insert an amount above.';
                                                            elements[1].disabled = true;
                                                            return;
                                                        }
                                                        amount = number;
                                                        elements[1].innerText = `Submit x${amount}`;
                                                        elements[1].disabled = false;
                                                    },
                                                },
                                                {
                                                    text: 'Submit',
                                                    type: 'button',
                                                    onclick: () => {
                                                        if (amount === 0) return;
                                                        libs.cart.add(
                                                            item.id,
                                                            `${item.name} (${currentSize})`,
                                                            amount,
                                                            priceIncrease
                                                        );
                                                        hidePopup();
                                                    },
                                                },
                                            ]
                                        );
                                        elements[0].focus(); // We focus on the input so the user can start typing right away.
                                        elements[0].value = '1'; // You'll notice we set the value to 1, because more then likely they will only want one of an item.
                                        amount = 1;
                                    },
                                },
                            ]);
                        } else {
                            // Same deal as the drink, except we ask if they want a meal first.
                            // Something cool about this however, is we create a list of all sides dynamically and use that as a selection.
                            await displayPopup('Meal', 'Would you like to make this a meal?', [
                                {
                                    text: 'Yes (+$4.00)',
                                    type: 'button',
                                    svg: "<svg xmlns='http://www.w3.org/2000/svg' height='48px' viewBox='0 0 24 24' width='48px' fill='currentColor'><path d='M0 0h24v24H0z' fill='none'/><path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z'/></svg>",
                                    onclick: async () => {
                                        let side1 = allItems
                                            .filter((item) => item.category === 'Sides')
                                            .map((item) => item.name)[0];
                                        let side2 = allItems
                                            .filter((item) => item.category === 'Sides')
                                            .map((item) => item.name)[0];
                                        await displayPopup(
                                            'Meal',
                                            'Select the two sides you would like to include in your meal.',
                                            [
                                                {
                                                    type: 'select',
                                                    options: allItems
                                                        .filter((item) => item.category === 'Sides')
                                                        .map((item) => item.name),
                                                    textChanged: (value) => {
                                                        side1 = value;
                                                    },
                                                },
                                                {
                                                    type: 'select',
                                                    options: allItems
                                                        .filter((item) => item.category === 'Sides')
                                                        .map((item) => item.name),
                                                    textChanged: (value) => {
                                                        side2 = value;
                                                    },
                                                },
                                                {
                                                    type: 'hr',
                                                },
                                                {
                                                    text: 'Next',
                                                    type: 'button',
                                                    svg: "<svg xmlns='http://www.w3.org/2000/svg' enable-background='new 0 0 20 20' height='48px' viewBox='0 0 20 20' width='48px' fill='currentColor'><g><g><rect fill='none' height='20' width='20'/></g></g><g><polygon points='4.59,16.59 6,18 14,10 6,2 4.59,3.41 11.17,10'/></g></svg>",
                                                    onclick: async () => {
                                                        const elements = await displayPopup(
                                                            'Amount',
                                                            'How many would you like to add to your bag?',
                                                            [
                                                                {
                                                                    inputType: 'number',
                                                                    text: 'Amount',
                                                                    type: 'input',
                                                                    textChanged: (value) => {
                                                                        let number = value ?? 0;
                                                                        if (number > 10) {
                                                                            elements[0].value = 10;
                                                                            number = 10;
                                                                        } else if (0 >= number) {
                                                                            elements[0].value = '';
                                                                            amount = 0;
                                                                            elements[1].innerHTML =
                                                                                'Insert an amount above.';
                                                                            elements[1].disabled = true;
                                                                            return;
                                                                        }
                                                                        amount = number;
                                                                        elements[1].innerText = `Submit x${amount}`;
                                                                        elements[1].disabled = false;
                                                                    },
                                                                },
                                                                {
                                                                    text: 'Submit',
                                                                    type: 'button',
                                                                    onclick: () => {
                                                                        if (amount === 0) return;
                                                                        libs.cart.add(
                                                                            item.id,
                                                                            `${item.name} (Meal: ${side1}, ${side2})`,
                                                                            amount,
                                                                            4
                                                                        );
                                                                        hidePopup();
                                                                    },
                                                                },
                                                            ]
                                                        );
                                                        elements[0].focus();
                                                        elements[0].value = '1';
                                                        amount = 1;
                                                    },
                                                },
                                            ]
                                        );
                                    },
                                },
                                {
                                    // If they don't want to make it a meal, we will just ask for the amount.
                                    text: 'No',
                                    type: 'button',
                                    svg: "<svg xmlns='http://www.w3.org/2000/svg' height='48px' viewBox='0 0 24 24' width='48px' fill='currentColor'><path d='M0 0h24v24H0z' fill='none'/><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>",
                                    onclick: async () => {
                                        const elements = await displayPopup(
                                            'Amount',
                                            'How many would you like to add to your bag?',
                                            [
                                                {
                                                    inputType: 'number',
                                                    text: 'Amount',
                                                    type: 'input',
                                                    textChanged: (value) => {
                                                        let number = value ?? 0;
                                                        if (number > 10) {
                                                            elements[0].value = 10;
                                                            number = 10;
                                                        } else if (0 >= number) {
                                                            elements[0].value = '';
                                                            amount = 0;
                                                            elements[1].innerHTML = 'Insert an amount above.';
                                                            elements[1].disabled = true;
                                                            return;
                                                        }
                                                        amount = number;
                                                        elements[1].innerText = `Submit x${amount}`;
                                                        elements[1].disabled = false;
                                                    },
                                                },
                                                {
                                                    text: 'Submit',
                                                    type: 'button',
                                                    onclick: () => {
                                                        if (amount === 0) return;
                                                        libs.cart.add(item.id, item.name, Number(amount));
                                                        hidePopup();
                                                    },
                                                },
                                            ]
                                        );
                                        elements[0].focus();
                                        elements[0].value = '1';
                                        amount = 1;
                                    },
                                },
                            ]);
                        }
                    });
                } else {
                    // If it can't be a meal or a drink, we just ask for the amount as usual.
                    button.addEventListener('click', async () => {
                        let amount = 0;
                        if (libs.cart.items.length > 30) {
                            return displayPopup(
                                'Oh no!',
                                'You can only have up to 30 different items in your bag at once.\nPlease checkout or remove an item.',
                                []
                            );
                        }
                        const elements = await displayPopup('Amount', 'How many would you like to add to your bag?', [
                            {
                                inputType: 'number',
                                text: 'Amount',
                                type: 'input',
                                textChanged: (value) => {
                                    let number = value ?? 0;
                                    if (number > 10) {
                                        elements[0].value = 10;
                                        number = 10;
                                    } else if (0 >= number) {
                                        elements[0].value = '';
                                        amount = 0;
                                        elements[1].innerHTML = 'Insert an amount above.';
                                        elements[1].disabled = true;
                                        return;
                                    }
                                    amount = number;
                                    elements[1].innerText = `Submit x${amount}`;
                                    elements[1].disabled = false;
                                },
                            },
                            {
                                text: 'Submit',
                                type: 'button',
                                onclick: () => {
                                    if (amount === 0) return;
                                    libs.cart.add(item.id, item.name, amount);
                                    hidePopup();
                                },
                            },
                        ]);
                        elements[0].focus();
                        elements[0].value = '1';
                        amount = 1;
                    });
                }

                // Insert all the elements we created.
                div.insertAdjacentElement('beforeend', title);
                div.insertAdjacentElement('beforeend', image);
                div.insertAdjacentElement('beforeend', description);
                div.insertAdjacentElement('beforeend', descriptionButton);
                div.insertAdjacentHTML('beforeend', '<hr>');
                div.insertAdjacentElement('beforeend', button);
                itemsDiv.insertAdjacentElement('beforeend', div);

                div.style.transform = 'scale(0)';
                if (isElementInViewport(div)) {
                    // If the divider is in the viewport, we animate it in.
                    setTimeout(
                        () => {
                            div.style.transform = 'scale(1)';
                        },
                        100 + currentIndex * 100
                    );
                } else {
                    // If it isn't then we wait for it to be before we animate it in.
                    setTimeout(async function () {
                        await new Promise(async function (resolve) {
                            while (!isElementInViewport(div)) {
                                await wait(0);
                            }
                            resolve();
                        });
                        setTimeout(function () {
                            div.style.transform = 'scale(1)';
                        }, 100);
                    }, 0);
                }
            }

            // Toggle all the descriptions so they align with the current state of the display all descriptions button.
            toggleDescriptions();
            await wait(1000);

            // We are done now, debounce over! :)
            displayItemsDebounce = false;
        }

        // Create a few icons.
        const toggleOnIcon =
            "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>";
        const toggleOffIcon =
            "<svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='#FFFFFF'><path d='M0 0h24v24H0z' fill='none'/><path d='M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'/></svg>";

        // Create the toggle description button.
        const toggleDescriptionsButton = document.createElement('button');
        toggleDescriptionsButton.id = 'toggleDescriptions';
        toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOffIcon}`;
        toggleDescriptionsButton.type = 'button';

        // Create the checkout button.
        const checkoutOpenButton = document.createElement('button');
        checkoutOpenButton.id = 'checkoutOpenButton';
        checkoutOpenButton.innerHTML =
            'Checkout <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path fill="currentColor" d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>';
        checkoutOpenButton.type = 'button';

        // Add the event listeners to the buttons.
        checkoutOpenButton.addEventListener('click', function () {
            document.getElementById('checkout').style.display = 'block';
            itemCategoriesDiv.style.display = 'none';
            itemsDiv.style.display = 'none';
        });

        document.getElementById('backToMenu').addEventListener('click', function () {
            document.getElementById('checkout').style.display = 'none';
            itemCategoriesDiv.style.display = 'inline-block';
            itemsDiv.style.display = 'inline-flex';
        });

        // Function to toggle all the descriptions.
        // This aligns with the toggle all descriptions button.
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

        // Toggle descriptions button event listener.
        toggleDescriptionsButton.addEventListener('click', () => {
            descriptionsShowed = !descriptionsShowed;
            descriptionsShowed === true
                ? (toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOffIcon}`)
                : (toggleDescriptionsButton.innerHTML = `Toggle Descriptions ${toggleOnIcon}`);
            toggleDescriptions();
        });

        // Create the categories title.
        const categoriesTitle = document.createElement('p');
        categoriesTitle.innerHTML = '<b>Categories</b>';
        itemCategoriesDiv.insertAdjacentElement('beforeend', categoriesTitle);

        // Create the all categories button.
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

        // Loop over each category and create a button for it.
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

        // Insert all the elements we created. (We do this a lot lol...)
        itemCategoriesDiv.insertAdjacentHTML('beforeend', '<br><br><p><b>Actions</b></p>');
        itemCategoriesDiv.insertAdjacentElement('beforeend', checkoutOpenButton);
        itemCategoriesDiv.insertAdjacentElement('beforeend', toggleDescriptionsButton);

        // Display the first category and update the state of all descriptions.
        displayItems(categories[Object.keys(categories)[0]]);
        toggleDescriptions();

        // Listen for clicks on the checkout button.
        document.getElementById('checkoutButton').addEventListener('click', function () {
            // Create the payment popup.
            const elements = displayPopup('Payment', 'Fill in the information required bellow to pay for your order.', [
                {
                    type: 'input',
                    text: 'Card Number (xxxx xxxx xxxx xxxx)',
                    maxWidth: '80%',
                },
                {
                    type: 'input',
                    text: 'MM/YY',
                    maxWidth: '20%',
                },
                {
                    type: 'input',
                    text: 'CVC',
                    maxWidth: '20%',
                },
                {
                    type: 'hr',
                },
                {
                    type: 'input',
                    text: 'Street Address',
                    maxWidth: '80%',
                },
                {
                    type: 'input',
                    text: 'City',
                    maxWidth: '30%',
                },
                {
                    type: 'select',
                    text: 'State',
                    maxWidth: '50%',
                    options: [
                        'Alabama',
                        'Alaska',
                        'Arizona',
                        'Arkansas',
                        'California',
                        'Colorado',
                        'Connecticut',
                        'Delaware',
                        'Florida',
                        'Georgia',
                        'Hawaii',
                        'Idaho',
                        'Illinois',
                        'Indiana',
                        'Iowa',
                        'Kansas',
                        'Kentucky',
                        'Louisiana',
                        'Maine',
                        'Maryland',
                        'Massachusetts',
                        'Michigan',
                        'Minnesota',
                        'Mississippi',
                        'Missouri',
                        'Montana',
                        'Nebraska',
                        'Nevada',
                        'New Hampshire',
                        'New Jersey',
                        'New Mexico',
                        'New York',
                        'North Carolina',
                        'North Dakota',
                        'Ohio',
                        'Oklahoma',
                        'Oregon',
                        'Pennsylvania',
                        'Rhode Island',
                        'South Carolina',
                        'South Dakota',
                        'Tennessee',
                        'Texas',
                        'Utah',
                        'Vermont',
                        'Virginia',
                        'Washington',
                        'West Virginia',
                        'Wisconsin',
                        'Wyoming',
                    ],
                },
                {
                    type: 'input',
                    text: 'Zip Code',
                    maxWidth: '30%',
                },
                {
                    type: 'hr',
                },
                {
                    text: 'Pay',
                    type: 'button',
                    onclick: () => {
                        // We don't actually make a payment because the restaurant isn't real!
                        // But it's the thought that counts, right?
                        displayPopup(
                            'Thank you!',
                            'Thank you for your purchase! \nYour order will be ready and delivered soon. 🎉',
                            [],
                            () => {
                                libs.cart.clear();
                                updateCheckout();
                                document.getElementById('checkout').style.display = 'none';
                                itemCategoriesDiv.style.display = 'inline-block';
                                itemsDiv.style.display = 'inline-flex';
                            }
                        );
                    },
                },
            ]);
        });
    });
    /** 
        .catch(function (err) {
            console.error(`${err}`, err);
            const result = confirm(`Failed to load menu items, would you like to refresh the page?\n\nERR: ${err}`);
            if (result) document.location.reload();
        });
        */
}

// We hook all of that up to the window load event.
window.addEventListener('load', main);

// Some how...
// We reached a thousand lines of code. 🎉
