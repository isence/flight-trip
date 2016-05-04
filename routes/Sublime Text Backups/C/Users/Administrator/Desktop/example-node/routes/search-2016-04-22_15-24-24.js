var request = require("request");
 //var fs = require('fs');
 //var events = require('events'); 
module.exports = function ( app ) {
    app.post('/search', function (req, res) {

      //global.dbHelper.getModel()获取数据库的某个集合
          var destination = req.body.destination;
          var url ='http://piao.qunar.com/ticket/list.json?keyword='+destination+'&region=&from=mps_search_suggest&page=1';
          var data ='';
          request.get(url, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          data = body;

                        }
                    });
          console.log(data);
          res.send(data);
          res.end();
    });
}