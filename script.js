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

// Pehla external link nikalo jo blogger image ya blogger URL na ho
const links = content.match(/https?:\/\/[^"]+/g);

if (links) {
    const external = links.find(url =>
        !url.includes("blogger.googleusercontent.com") &&
        !url.includes("teraasave.blogspot.com")
    );

    if (external) {
        link = external;
    }
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
