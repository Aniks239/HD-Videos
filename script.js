const feed =
"https://teraasave.blogspot.com/feeds/posts/default?alt=json&max-results=20";

fetch(feed)
.then(res => res.json())
.then(data => {

const posts = data.feed.entry;

let html = "";

posts.forEach(post=>{

let title = post.title.$t;

let link = post.link.find(l=>l.rel=="alternate").href;

let image = "";

if(post.media$thumbnail){
image = post.media$thumbnail.url.replace("s72-c","s500");
}

html += `
<div class="card">

<img src="${image}" width="100%">

<h2>${title}</h2>

<a href="${link}" target="_blank">
<button>Watch Now</button>
</a>

</div>
`;

});

document.getElementById("posts").innerHTML = html;

});
