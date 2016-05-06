module.exports = function ( app ) {
    app.post('/save', function (req, res) {
          console.log(1);
      //global.dbHelper.getModel()获取数据库的某个集合
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
            trip = req.body.trip;
        User.findOne({name: uname}, function (error, doc) {
          //console.log(doc);
            if (error) {
                console.log('err');
                res.sendStatus(500);
            } else if (!doc) {
              console.log('id err！');
                req.session.error = '用户名不存在！';
                req.session.user='';
                res.sendStatus(404);
            } else {
                    doc.trip.push(trip);
                   res.sendStatus(200);
               }
            }
        );
    });
}