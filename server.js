const express = require('express');
const fs = require('fs');
const cors = require('cors')
var app = express();

app.use(cors());

const exec = require('child_process').exec;
const urlencode = require('urlencode');
const crypto = require('crypto');


const BASE_DIR = './generated_content';

const random_string = function() {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

app.get('/', function(req, res) {
  var dir = random_string();
  var file_name = random_string();

  var html_file = `${dir}/${file_name}.html`;
  var html_file_loc = `${BASE_DIR}/${html_file}`;

  var css_file = `${dir}/${file_name}.css`;
  var css_file_loc = `${BASE_DIR}/${css_file}`;

  var thumb_file = `${dir}/${file_name}.jpg`;
  var thumb_file_loc = `${BASE_DIR}/${thumb_file}`;

  var url = urlencode.decode(req.query.url);

  fs.mkdirSync(`${BASE_DIR}/${dir}`);

  var child = exec(`phantomjs ./thumbnail-generator.js ${url} ${thumb_file_loc}`,
    (error, stdout, stderr) => {
        console.log(`phantomjs stdout: ${stdout}`);
        console.log(`phantomjs stderr: ${stderr}`);
        if (error !== null) {
            console.log(`phantomjs exec error: ${error}`);
        }
  });

  var child = exec(`./node_modules/page-computed-style/index.js -p ${url} -o ${css_file_loc} -t ${html_file_loc}`,
    (error, stdout, stderr) => {
        console.log(`page-computed-style stdout: ${stdout}`);
        console.log(`page-computed-style stderr: ${stderr}`);
        if (error !== null) {
            console.log(`page-computed-style exec error: ${error}`);
        }
  });

  res.json({
    'html': html_file,
    'css': css_file,
    'thumbnail': thumb_file
  });
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
