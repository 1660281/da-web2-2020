function getRegistConference(req, res){
    res.render('regist-conference');
}

function postRegistConference(req, res) {
    const check = Boolean(req.body.checkattend) || false;
    var name = req.body.name;
    var arr = name.split(' ');
    var firstName = arr[arr.length - 1];
    const message = check ? `${req.session.message.acceptConference}, cám ơn ${firstName}` : `${req.session.message.notAcceptConference}, ${firstName}`;

    req.session.guests.push({
        name: name,
        email: req.body.mail,
        attend: req.body.checkattend == 'okie' ? 'oke': 'Cáo bận'
    });
    console.log(req.body.checkattend);
    res.render('regist-conference-result', { message });
}

module.exports = {
    getRegistConference,
    postRegistConference,
}