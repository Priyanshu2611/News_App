const API_KEY = "495ada4826f2417ebb2013820c78e7e0";
const url = "https://newsapi.org/v2/everything?q=";
const maxTextLength = 100;

window.addEventListener('load', () => fetchNews("India"));

async function fetchNews(query) {
    showLoader();
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}&language=en`);
    const data = await res.json();
    const sortedArticles = data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const filteredArticles = sortedArticles.filter(article => article.urlToImage);
    bindData(filteredArticles);
    hideLoader();
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description.length > maxTextLength ? 
                         article.description.slice(0, maxTextLength) + '...' : 
                         article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} <span>&#8226;</span> ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

function showLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav = navItem;
    curSelectedNav.classList.add('active');
    closeMenu();
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
    closeMenu();
});

const hamburgerMenu = document.getElementById('hamburger-menu');
const navLinks = document.getElementById('nav-links');
const searchBar = document.getElementById('search-bar');

hamburgerMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    searchBar.classList.toggle('active');
});

function closeMenu() {
    navLinks.classList.remove('active');
    searchBar.classList.remove('active');
}
