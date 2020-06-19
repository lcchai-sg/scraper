require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

(async () => {
  const lPage = 752;
  const base = 'https://www.jomashop.com/';
  const entry = 'https://www.jomashop.com/watches.html';

  const conn = await MongoClient.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
  });
  const db = 'synopsis';

  const results = [];
  let ttl_time = 0;
  try {
    for (let i = 1; i <= lPage; i++) {
      const link = `${entry}?p=${i}`
      console.log(link)
      const data = (await axios.get(link)).data;
      const $ = cheerio.load(data);

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
    }

    for (const result of results) {
      await conn.db(db)
      .collection('indexing_url')
      .insertOne(result);
    }
  } catch (error) {
    console.log(error)
  }
})();

