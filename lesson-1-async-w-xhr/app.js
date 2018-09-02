(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // make sure your add your api keys for each request

        const imgRequest = new XMLHttpRequest(); // create a new xhr object
        // set the HTTP method and the URL of the resource to be fetched
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        // set this to a function that will run upon a successful fetch
        imgRequest.onload = addImage;
        // set this to a function that will run when an error occurs
        imgRequest.onerror = function (err) {
            requestError(err, 'image');
        };
        // set request header to obtain Authorization for your api key
        imgRequest.setRequestHeader('Authorization', 'Client-ID <Your API Key Here>');
        // send the request
        imgRequest.send();

        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function (err) {
            requestError(err, 'articles');
        };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=<Your API Key Here>`);
        articleRequest.send();
    });

    function addImage() {
        let htmlContent = '';
        // parse the JSON response to a javascript object
        const data = JSON.parse(this.responseText);
        // ensure there is some sort of response before creating html content
        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
              <img src="${firstImage.urls.regular}" alt="${searchedForText}">
              <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            // no response set html content to an error message
            htmlContent = '<div class="error-no-image">No Images Available</div>';
        }
        // insert html content into response container
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);
        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
              <h2><a href="${article.web_url}">${article.headline.main}</h2>
              <p>${article.snippet}</p>
              </li>`).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    // runs when an error occurs
    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning error-${part}">Oh no! ${part} did not load!</p>`);
    }
})();
