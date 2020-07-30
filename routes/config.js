function getConfig(req, res, next) {
    if (req.session.user != null){
        message = req.session.message;
        res.render('config', { message });    
    }
    else {
        res.redirect('/login');
    }
}

function postConfig(req, res, next) {
    message = {
        home: req.body.home,
        acceptConference: req.body.acceptConference,
        notAcceptConference: req.body.notAcceptConference
    }
    req.session.message = message;
    res.render('config', { message });
}

module.exports = {
    getConfig,
    postConfig
}