// This script is executed on ALL pages.
// Responsible for simple such as modifying the title.

/**
 * Change the documents title. (Append the name.)
 * @param {Document} document
 * @param {string} title
 * @param {string} name
 */
function changeTitle(document, title, name) {
    document.title = `${title} | ${name}`;
}

/**
 * Wait for an element to be present/loaded via it's ID.
 * @param {string} id ID of the element to wait for.
 * @returns {Promise.<void>}
 */
function waitForElement(id) {
    return new Promise(function (resolve) {
        const interval = setInterval(function () {
            if (document.getElementById(id) !== null) {
                clearInterval(interval);
                resolve();
            }
        });
    });
}

/**
 * Update the menu bar to the correct state.
 */
function updateMenuBar() {
    const menubar = document.getElementById('menuBar');
    const anchors = menubar.getElementsByClassName('menuBarNormal');
    for (let i = 0; i !== anchors.length; i++) {
        const item = anchors.item(i);
        if (item.href === window.location.href) {
            item.classList.add('menuBarNormalCurrent');
        }
    }
}

window.addEventListener('load', function () {
    changeTitle(document, document.title, 'Game Day Grill');
    libs.include.includeBody(document, 'includes/menuBar.html', 'start');
    libs.include.includeHeadCSS(document, 'css/menuBar.css', 'end');
    waitForElement('menuBar').then(updateMenuBar);
});

import { wait, log,  } from 'https://cdn.jsdelivr.net/gh/jacobhumston/lib@master/web/core.js';
wait(1000).then(function () {
    log('Success', 'waited');
});
