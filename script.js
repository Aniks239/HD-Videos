fetch("/api/feed")
.then(res => res.json())
.then(data => {

const posts = data.feed.entry || [];

let html = "";

posts.forEach(post=>{

const title = post.title.$t;

const content = post.content.$t;

// Sirf Telegram link nikalo
let link = "#";

const telegramLink = content.match(/https:\/\/t\.me\/[^"]+/);

if (telegramLink) {
    link = telegramLink[0];
}

const image = post.media$thumbnail
? post.media$thumbnail.url.replace("s72-c","s500")
: "";

html += `
<div class="card">
<img src="${image}">
<h2>${title}</h2>
<a href="${link}" target="_blank" rel="noopener">
<button>Watch Now</button>
</a>
</div>
`;

});

document.getElementById("posts").innerHTML = html;

})
.catch(e=>{
document.getElementById("posts").innerHTML="Error Loading";
console.log(e);
});
