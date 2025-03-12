const API_KEY = "ed6bcd172fa44c8b90a4f7a8ebce52e6";
const url = "https://newsapi.org/v2/everything";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    try {
        showLoading(true);
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await res.json();

        if (data.articles.length === 0) {
            alert("No news found for this topic. Try another search.");
        }

        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        alert("Failed to fetch news. Please try again later.");
    } finally {
        showLoading(false);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title || "No title available";
    newsDesc.innerHTML = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name || "Unknown Source"} · ${date}`;

    // Make the entire card clickable
    cardClone.firstElementChild.style.cursor = "pointer";
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);

    if (curSelectedNav) {
        curSelectedNav.classList.remove("active");
    }

    curSelectedNav = document.getElementById(id);
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    if (curSelectedNav) curSelectedNav.classList.remove("active");
    curSelectedNav = null;
});

// Show loading state while fetching news
function showLoading(isLoading) {
    const cardsContainer = document.getElementById("cards-container");
    if (isLoading) {
        cardsContainer.innerHTML = "<h2>Loading news...</h2>";
    }
}
