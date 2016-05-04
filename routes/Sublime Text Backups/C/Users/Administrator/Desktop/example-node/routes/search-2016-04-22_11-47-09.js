var request = require("request");
module.exports = function ( app ) {
    app.post('/search', function (req, res) {

      //global.dbHelper.getModel()获取数据库的某个集合
          var destination = req.body.destination;
          console.log(destination);
          var url ='http://piao.qunar.com/ticket/list.json?keyword='+destination+'&region=&from=mps_search_suggest&page=1';
          console.log(url);
        request.get('url', function (error, response, body) {
                        console.log(response);
                        if (!error && response.statusCode == 200) {
                            console.log(response);
                        }
                    });
        
    });
}