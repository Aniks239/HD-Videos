// ========================================
// Storage Helpers (Favorites)
// ========================================

const FAV_KEY = "teraaSaveFavorites";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function isFavorited(id) {
  return getFavorites().some(f => f.id === id);
}

// Simple hash to generate a stable unique id from title+link
function makeId(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return "id" + Math.abs(hash);
}

// ========================================
// Fetch & Render Posts
// ========================================

fetch("/api/feed")
  .then(res => res.json())
  .then(data => {
    const posts = data.feed.entry || [];

    let html = "";

    posts.forEach(post => {
      const title = post.title.$t;
      const content = post.content.$t;

      // Sirf Telegram link nikalo
      let link = "#";

      const links = content.match(/https?:\/\/[^"]+/g);

      if (links) {
        const external = links.find(
          url =>
            !url.includes("blogger.googleusercontent.com") &&
            !url.includes("teraasave.blogspot.com")
        );

        if (external) {
          link = external;
        }
      }

      const image = post.media$thumbnail
        ? post.media$thumbnail.url.replace("s72-c", "s500")
        : "";

      const id = makeId(title + link);
      const favActive = isFavorited(id) ? "active" : "";
      const heartIcon = isFavorited(id) ? "❤️" : "🤍";

      html += `
        <div class="card" data-id="${id}">
          <img src="${image}">
          <h2>${title}</h2>
          <a href="${link}" target="_blank" rel="noopener">
            <button>Watch Now</button>
          </a>
          <div class="actions">
            <button class="action-btn favorite-btn ${favActive}"
              data-id="${id}"
              data-title="${title.replace(/"/g, '&quot;')}"
              data-image="${image}"
              data-link="${link}">
              ${heartIcon} Favorite
            </button>
            <button class="action-btn share-btn"
              data-title="${title.replace(/"/g, '&quot;')}"
              data-link="${link}">
              🔗 Share
            </button>
          </div>
        </div>
      `;
    });

    document.getElementById("posts").innerHTML = html;
  })
  .catch(e => {
    document.getElementById("posts").innerHTML = "Error Loading";
    console.log(e);
  });

// ========================================
// Favorite Button Logic (event delegation)
// ========================================

document.getElementById("posts").addEventListener("click", function (e) {
  const favBtn = e.target.closest(".favorite-btn");
  const shareBtn = e.target.closest(".share-btn");

  if (favBtn) {
    const id = favBtn.dataset.id;
    const title = favBtn.dataset.title;
    const image = favBtn.dataset.image;
    const link = favBtn.dataset.link;

    let favs = getFavorites();
    const existingIndex = favs.findIndex(f => f.id === id);

    if (existingIndex > -1) {
      // Already favorited -> remove
      favs.splice(existingIndex, 1);
      favBtn.classList.remove("active");
      favBtn.innerHTML = "🤍 Favorite";
    } else {
      // Add to favorites
      favs.push({ id, title, image, link });
      favBtn.classList.add("active");
      favBtn.innerHTML = "❤️ Favorite";
    }

    saveFavorites(favs);
    renderFavorites();
  }

  if (shareBtn) {
    const title = shareBtn.dataset.title;
    const link = shareBtn.dataset.link;
    shareContent(title, link);
  }
});

// ========================================
// Share Logic
// ========================================

function shareContent(title, link) {
  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: title,
        url: link
      })
      .catch(err => console.log("Share cancelled:", err));
  } else if (navigator.clipboard) {
    navigator.clipboard
      .writeText(link)
      .then(() => alert("✅ Link copied to clipboard!"))
      .catch(() => alert("❌ Could not copy link."));
  } else {
    // Very old browser fallback
    prompt("Copy this link:", link);
  }
}

// ========================================
// Favorites Section Rendering
// ========================================

function renderFavorites() {
  const favs = getFavorites();
  const container = document.getElementById("favorites");

  if (favs.length === 0) {
    container.innerHTML = "<p>No favorite videos yet.</p>";
    return;
  }

  let html = "";
  favs.forEach(fav => {
    html += `
      <div class="favorite-card" data-id="${fav.id}">
        <a href="${fav.link}" target="_blank" rel="noopener">
          <img src="${fav.image}">
        </a>
        <button class="action-btn favorite-btn active" data-id="${fav.id}"
          data-title="${fav.title.replace(/"/g, '&quot;')}"
          data-image="${fav.image}"
          data-link="${fav.link}">
          ❌ Remove
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Remove from favorites section directly
document.getElementById("favorites").addEventListener("click", function (e) {
  const favBtn = e.target.closest(".favorite-btn");
  if (!favBtn) return;

  const id = favBtn.dataset.id;
  let favs = getFavorites();
  favs = favs.filter(f => f.id !== id);
  saveFavorites(favs);
  renderFavorites();

  // Also update the button state on the main posts list, if visible
  const mainBtn = document.querySelector(`#posts .favorite-btn[data-id="${id}"]`);
  if (mainBtn) {
    mainBtn.classList.remove("active");
    mainBtn.innerHTML = "🤍 Favorite";
  }
});

// Initial render of favorites on page load
renderFavorites();

// ========================================
// Bottom Nav: Home / Favorites scroll
// ========================================

document.getElementById("homeBtn").addEventListener("click", function () {
  document.getElementById("posts").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("favoriteBtn").addEventListener("click", function () {
  document.getElementById("favorites-section").scrollIntoView({ behavior: "smooth" });
});
