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
                console.log('err');
                res.sendStatus(500);
            } else if (!doc) {
              console.log('id err！');
                req.session.error = '用户名不存在！';
                req.session.user='';
                res.sendStatus(404);
            } else {
               if(req.body.upwd != doc.password){
                console.log("password err!");
                   req.session.error = "密码错误!";
                   req.session.user='';
                   res.sendStatus(404);
               }else{
                console.log('scueess');
                   req.session.error = "";
                   req.session.user=doc;
                   req.session.userName='欢迎'+doc.name;
                   res.sendStatus(200);
               }
            }
        });
    });
}