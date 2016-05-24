var request = require("request");
module.exports = function ( app ) {
    app.post('/search', function (req, res) {
      var destination = req.body.destination;
      var page = req.body.page;
      var url ='http://piao.qunar.com/ticket/list.json?keyword='+destination+'&region=&from=mps_search_suggest&page='+page+'';
      var data ='';
      request.get(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      data = body;
                      //console.log(data);
                      res.send(data);
                      res.end();
                    }
                });
    });
    app.post('/searchFlight', function (req, res) {
      var homecity_name =req.body.homecity_name;
      var getcity_name =req.body.getcity_name;
      //var datepicker =req.body.datepicker;
      //var clender =req.body.clender;
      var url ='http://apis.haoservice.com/plan/s2s?key=41e546565f2942fbbecdaf3546a754f5&start='+homecity_name+'&end='+getcity_name;
      var data ='';
      console.log(url);
      request.get(url, function (error, response, body) {
         console.log(response);
                    if (!error && response.statusCode == 200) {
                      data = body;
                      console.log(data);
                      res.send(data);
                      res.end();
                    }
                });
    });
};
