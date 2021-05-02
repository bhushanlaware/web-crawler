const { Worker } = require('worker_threads');
let workDir = __dirname + "/worker.js";
const args = require('minimist')(process.argv.slice(2));

const run = () => {

  const baseURL = args["_"].toString(); //||'https://google.com/';
  const visisted = new Set();
  const unvisited = new Set();
  let threads = args["n"] ||100;

  console.log(`Crawling ${baseURL} with ${threads} workers`);
  if(!baseURL.includes('http')) return;


  unvisited.add(baseURL);

  const crawler = () => {
    if (unvisited.size > 0) {
      unvisited.forEach(x => {
        if (!visisted.has(x)) {
          if (threads > 0) {
            threads--;
            const worker = new Worker(workDir);
            visisted.add(x);
            unvisited.delete(x);
            worker.postMessage({ currentURL: x, baseURL });
            worker.on("message", (newLinks = []) => {
              threads++;
              newLinks.forEach(x => {
                if(!unvisited.has(x)){
                  unvisited.add(x);
                  console.log(x);
                }
                else{
                  // console.log('Already added');
                }
              })
            });
          }
        }
      });
    }
  }
  crawler();
  const interval = setInterval(() => {
    if (unvisited.size > 0)
      crawler();
    else
      clearInterval(interval);
  }, 1000);
  const interval2 = setInterval(() => {
    if (unvisited.size > 0)
      crawler();
    else
      clearInterval(interval2);
  }, 4000);

}


run();