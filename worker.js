// @ts-check
// @ts-ignore
const { parentPort } = require('worker_threads');
const axios = require('axios');
const cheerio = require('cheerio');

parentPort.once("message", async ({ currentURL, baseURL }) => {
  let url = currentURL;
  // unvisited.delete(url);
  // if (visisted.has(url)) return;
  const newLinks = [];
  let res = await fetchData(url);
  if (!res || !res.data) {
    // console.log("Invalid data Obj");
    return;
  }
  const html = res.data;
  const $ = cheerio.load(html);

  const allAncherAttrs = $('a');
  allAncherAttrs.each(function () {
    let link = $(this).attr('href');
    link = link && !link.includes('http') ? `${(new URL(url)).origin}${link}` : link;
    if (isBelongToSameDomain(link, baseURL)) {
      // unvisited.add(link);
      newLinks.push(link);
      // console.log(link);
    }
  });
  parentPort.postMessage(newLinks);
});

async function fetchData(url) {
  // @ts-ignore
  try {
    // @ts-ignore
    let response = await axios(url);
    if (response.status !== 200) {
      return;
    }
    return response;

  }
  catch (err) {
    return;
  }

}
function isBelongToSameDomain(url, baseURL) {
  try {
    const newUrl = new URL(url);
    const newbaseUrl = new URL(baseURL);
    // @ts-ignore
    return newUrl.origin == newbaseUrl.origin;
  }
  catch {
    return false;
  }

}