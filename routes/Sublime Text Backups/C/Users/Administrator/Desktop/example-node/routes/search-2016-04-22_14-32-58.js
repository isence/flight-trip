var request = require("request");
module.exports = function ( app ) {
    app.post('/search', function (req, res) {

      //global.dbHelper.getModel()获取数据库的某个集合
          var destination = req.body.destination;
          var url ='http://piao.qunar.com/ticket/list.json?keyword='+destination+'&region=&from=mps_search_suggest&page=1';
        request.get(url, function (error, response, body) {
          return response;
                        if (!error && response.statusCode == 200) {
                            return response;
                        }
                    });
    });
}