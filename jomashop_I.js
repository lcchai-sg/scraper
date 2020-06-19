const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  const lPage = 200;
  const base = 'https://www.jomashop.com/';
  const entry = 'https://www.jomashop.com/watches.html';

  const results = [];
  let ttl_time = 0;
  try {
    for (let i = 1; i <= lPage; i++) {
      const link = `${entry}?p=${i}`
      console.log(link)
      const data = (await axios.get(link)).data;
      const $ = cheerio.load(data);
      const start = new Date();

      $('.products-grid li').each((idx, el) => {
        const url = $(el).find('a').attr('href');
        let thumbnail = '';
        if ($(el).find('a img').attr('data-original')) {
          thumbnail = $(el).find('a img').attr('data-original');
        } else {
          thumbnail = $(el).find('a img').attr('src');
        }

        results.push({
          url,
          source: 'jomashop',
          thumbnail,
        });
      });

      const end = new Date();
      ttl_time += end - start;
    }

    console.log(`number of watches >>>`, results.length)
    console.log(`total time elapsed >>> `, ttl_time)
    console.log(`avg time >>> `, ttl_time / lPage)
  } catch (error) {
    console.log(error)
  }
})();

