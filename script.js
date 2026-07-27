fetch("/api/feed")
.then(res => res.json())
.then(data => {

const posts = data.feed.entry || [];

let html = "";

posts.forEach(post=>{

const title = post.title.$t;

    // Post ke andar ka HTML
const content = post.content.$t;

let link = "#";

const match = content.match(/https:\/\/t\.me\/[^\s"'<>]+/);

if (match) {
    link = match[0];
}

const image = post.media$thumbnail
? post.media$thumbnail.url.replace("s72-c","s500")
: "";

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
.catch(e=>{
document.getElementById("posts").innerHTML="Error Loading";
console.log(e);
});
