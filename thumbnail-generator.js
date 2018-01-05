const webPage = require('webpage');
const system = require('system');

const url = system.args[1];
const file_location_to_save = system.args[2];

if(!url || !file_location_to_save) {
  console.log("Usage: phantomjs thumbnail-generator.js <url> <file_location_to_save>");
  phantom.exit();
}

var page = webPage.create();

page.viewportSize = { width: 1440, height: 810 };

page.open(url, function start(status) {
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    page.evaluate(function() {
      $("head").prepend('<style> body { background-color: #ffffff; } </style>');
    });
    page.render(file_location_to_save, {format: 'jpg', quality: '85'});
    phantom.exit();
  });
});
