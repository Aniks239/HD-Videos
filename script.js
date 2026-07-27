const feed = "https://api.allorigins.win/raw?url=" + encodeURIComponent("https://teraasave.blogspot.com/feeds/posts/default?alt=json&max-results=20");

fetch(feed)
.then(response => response.json())
.then(data => {

const posts = data.feed.entry;
let html = "";

posts.forEach(post => {

const title = post.title.$t;

const link = post.link.find(l => l.rel === "alternate").href;

const image = post.media$thumbnail
? post.media$thumbnail.url.replace("s72-c","s500")
: "https://via.placeholder.com/500x300?text=No+Image";

html += `
<div class="card">
<img src="${image}">
<h2>${title}</h2>
<a href="${link}">
<button>Watch Now</button>
</a>
</div>
`;

});

document.getElementById("posts").innerHTML = html;

})
.catch(err=>{
document.getElementById("posts").innerHTML="Error Loading Posts";
console.log(err);
});
