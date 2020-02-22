var express = require('express');
var router = express.Router();
const fs = require('fs');
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  downloadImages()
  res.render('download');
});


const download_image = async (url, image_path) =>{
  let wasFound = false;
  await axios({
    url,
    responseType: 'stream',
    crossdomain: true 
  }).then(
    response  =>
      new Promise((resolve, reject) => {
        wasFound = response !== undefined
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  ).catch(err => {});
  return wasFound;
}

  const downloadImages = async () => {
    for (let i=7; i<8; i++) {
      for (let j=0; j<130; j++) {
        let notFoundK = 0;
        for (let k=0; k<96; k++) {
          // let url = `https://rdr2map.com/images/tiles/rdr2-default/${i}-${j}_${k}.jpg`;
          let url = `https://rdr2map.com/images/tiles/rdr2-dark/${i}-${j}_${k}.jpg`;
          let imageName = `${i}-${j}_${k}.jpg`;
          let wasFound = await download_image(url, imageName);
          if (!wasFound) {
            console.log(`image: [${imageName}] does not exist! skipping to next iteration`)
            notFoundK++;
            if (notFoundK == 3) {
              notFoundK = 0;
              break;
            }
            continue;
          } else {
            //console.log(`${imageName} downloaded`)
          }
        }
      }
    }
    console.log('Image downloading completed');
  }

module.exports = router;
