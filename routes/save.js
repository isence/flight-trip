module.exports = function ( app ) {
    app.post('/save', function (req, res) {
          console.log(111111);
      //global.dbHelper.getModel()获取数据库的某个集合
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname,
            tripArr = [];
            trip = req.body.trip;
            //console.log(uname);
            //console.log(trip);
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                console.log('err');
                res.sendStatus(500);
            } else if (!doc) {
              console.log('id err！');
                req.session.error = '用户名不存在！';
                req.session.user='';
                res.sendStatus(404);
            } else {
                    tripArr = doc.trip;
                    tripArr.push(trip);
                    console.log(tripArr);
                    User.update (
                                    { name : uname},
                                    { $set : { trip:tripArr } },
                                    function( err, result ) {
                                        if ( err ) {
                                          console.log(555);
                                          throw err;
                                        }
                                    }
                                );
                    //User.update({name:uname},{$set:{trip:tripArr}});
                    console.log(doc);
                   res.sendStatus(200);
               }
            }
        );
    });
}