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

window.addEventListener('load', function () {
    changeTitle(document, document.title, 'NAME');
    includeLib.includeBody(document, 'includes/menuBar.html', 'start');
});
