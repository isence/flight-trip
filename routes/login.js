module.exports = function ( app ) {
    app.get('/login',function(req,res){
        res.render('login');
    });
    app.post('/login', function (req, res) {

      //global.dbHelper.getModel()获取数据库的某个集合
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
          //console.log(doc);
            if (error) {
                console.log(1);
                res.send(500);
            } else if (!doc) {
              console.log(2);
                req.session.error = '用户名不存在！';
                res.send(404);
            } else {
              console.log(3);
               if(req.body.upwd != doc.password){
                   req.session.error = "密码错误!";
                   res.send(404);
               }else{
                console.log(4);
                   req.session.error = "";
                   req.session.user=doc;
                   res.send(200);
               }
            }
        });
    });
}