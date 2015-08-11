var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var initialUrl = "http://substack.net/images/";
var baseUrl = "http://substack.net";
var folders = [];
var rows = "";

function writeFile(content){
  fs.writeFile('./images.csv', content, function(err){
    if (err){
      console.log(err);
    }
    console.log("saved!");
  })
}

function extractHtml(url){
  console.log(url);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var p = $('code').text();
      var a = $('a');
      p = p.split(")");
      for (var i=0; i < p.length-1; i++){
        var permission = p[i].slice(-10);
        var url = baseUrl+a[i].attribs.href
        var notfolder = url.match(/.\w{3}$/);
        var fileType;
        if (notfolder) {
          var period = url.lastIndexOf(".");
          fileType = url.substr(period + 1);
          rows += permission + "," + url + "," + fileType + "\n";
        } else{
          if (i > 0){
            folders.push(url);
          } 
        }
      }
      if (folders.length > 0){
          extractHtml(folders.shift());
        }else {
          console.log("complete");
          writeFile(rows);
        }
    }else if(error){
      console.error(error);
    }  
  });
}

extractHtml(initialUrl);