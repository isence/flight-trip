var request = require("request");
module.exports = function ( app ) {
    app.post('/search', function (req, res) {
      var destination = req.body.destination;
      var url ='http://piao.qunar.com/ticket/list.json?keyword='+destination+'&region=&from=mps_search_suggest&page=1';
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
      var datepicker =req.body.datepicker;
      var clender =req.body.clender;
      var url ='https://sjipiao.alitrip.com/searchow/search.htm?&callback=jsonp176&tripType=0&depCityName='+homecity_name+'&arrCityName='+getcity_name+'&depDate='+datepicker+'&searchSource=99&searchBy=1277&needMemberPrice=true&_input_charset=utf-8';
      var data ='';
      console.log(url);
      request.get(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      data = body;
                      console.log(data);
                      res.send(data);
                      res.end();
                    }
                });
    });
}