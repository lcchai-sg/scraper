const axios = require('axios');
const xml2js = require('xml2js');

(async () => {
  try {
    const result = [];
    const cats = [];
    const sitemap = 'https://www.watchmaxx.com/sitemap.xml';
    const json = (await axios.get(sitemap)).data;
    const parser = new xml2js.Parser();
    parser.parseString(json, function (err, result) {
      for (let i = 0; i < result.sitemapindex.sitemap.length; i++) {
        cats.push({ url: result.sitemapindex.sitemap[i].loc })
      }
    });

    for (const cat of cats) {
      console.log(cat.url)
      const sitemap = cat.url.toString();
      const json = (await axios.get(sitemap)).data;
      const parser = new xml2js.Parser();
      parser.parseString(json, function (err, res) {
        for (let i = 0; i < res.urlset.url.length; i++) {
          const url = res.urlset.url[i].loc.toString().replace('[', '').replace(']', '');
          result.push({
            url,
            source: 'watchmaxx',
          });
        }
      });
    }

    for (const res of result) console.log('res >>> ', res)
    process.exit(0)
  }
  catch (error) {
    console.log('Failed for indexing class of Watchmaxx with error : ' + error)
    process.exit(1)
  }
})();
