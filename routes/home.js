module.exports = function ( app ) {
    app.get('/home', function (req, res) {
        if(req.session.user){
            var userName = req.session.userName,
                User = global.dbHelper.getModel('user');
            //console.log(userName);
            User.findOne({name: userName}, function (error, doc) {
                console.log(doc);
                if (error) {
                    //console.log('err');
                    res.sendStatus(500);
                } else{
                    //console.log('TRIP');
                }
                res.render('index',{'trip':doc.trip});
            });
        }else{
            req.session.error = "请先登录";
            res.redirect('/login');
        }
    });

};