export default async function handler(req, res) {
  const url =
    "https://teraasave.blogspot.com/feeds/posts/default?alt=json";

  const response = await fetch(url);
  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
