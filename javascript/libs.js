// Libraries.
const libs = {};

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
};
