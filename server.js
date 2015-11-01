var app, connect, port, stat;

port = 8080;

connect = require('connect');
stat = require('serve-static');
app = connect();

app.use(stat("./src"));
app.use(stat("./"));
app.use(stat("./dist"));
app.listen(port, function () {
    console.log('Serving Snappy Bat on localhost:' + port);
});
