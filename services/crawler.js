const axios = require('axios');
const cheerio = require('cheerio');

const crawler = async (url) => {
  global.unvisitedURLSet.delete(link);
  if (global.visistedURLSet.has(url)) return;
  
  let res = await fetchData(url);
  if (!res.data) {
    console.log("Invalid data Obj");
    return;
  }
  const html = res.data;
  const $ = cheerio.load(html);

  const allAncherAttrs = $('a');
  allAncherAttrs.each(function () {
    const link = $(this).attr('href');
    link = !link.includes('http') ? `${global.baseUrl}${link}` : link;
    if (isBelongToSameDomain(link)) {
      global.unvisitedURLSet.add(link);
      console.log(link);
    }
  });

  return true;
}
async function fetchData(url) {
  let response = await axios(url).catch((err) => console.log(err));
  if (response.status !== 200) {
    e
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}
function isBelongToSameDomain(url) {
  const newUrl = new URL(url);
  return newUrl.origin() == global.baseUrl;
}
module.exports = crawler;