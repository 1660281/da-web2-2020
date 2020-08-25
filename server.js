const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const cookieSession = require('cookie-session');
const path = require('path');
var ejs = require('ejs');
ejs.open = '{{';
ejs.close = '}}';

const db = require('./services/db');
const app = express();

app.set('views', './views');
app.set('login', './views/login');
app.set('layout', './views/layout');
app.set('regist', './views/regist');
app.set('index', './views/index');
app.set('view engine', 'ejs');
app.use('/content', express.static( "content" ) );
app.use('/uploads', express.static("uploads"));
app.use('/bootstrap-4.5.2-dist', express.static(path.join(__dirname, 'public/bootstrap-4.5.2-dist')))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieSession({
    name: 'session',
    keys: ['123456', '789'],
    maxAge: 24 * 60 * 60 * 1000 // 5p cho 1 lần login 
}));
// app.get('/', (req, res) => {
//     res.render('index');
// });
const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

app.use(require('./routes/login'));
app.use(require('./routes/regist'));
app.use(require('./routes/index'));
app.use(require('./routes/emp'));

db.sync().then(function () {
    app.listen(port);
    console.log(`server is listening on port ${port}`);
}).catch(function (err) {
    console.error(err);
})