"use strict";

var config = require('./config'),
    
    path = require('path'),
    Mailgun = require('mailgun').Mailgun,
    express = require('express'),
    bodyParser = require('body-parser'),
    Analytics = require('analytics-node'),
    analytics = new Analytics(config.segmentwritekey),
    
    app = express(),
    mg = new Mailgun(config.mailgun.api);


// Filter
function filterNonApps(req, res, next) {
    if (req && req.header('User-Agent') && req.header('User-Agent').indexOf(config.apisecuritystring) === 0) {
        next();
    } else {
        res.status(404).send("Cannot " + req.method + " " + req.originalUrl);
    }
}

// Analytics
function tracker(req, res, next) {
    analytics.track({
        event: 'Hit Server',
        userId: 'anonymous_user',
        properties: {
            'User-Agent': req.header('User-Agent'),
            'HTTP-Method': req.method,
            'Accept-Language': req.header('Accept-Language')
        }
    });
    console.log('app hit');
    next();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/apps/lsftw', function (req, res, next) {
    res.writeHead(301, {
        Location: 'http://lsftw.com'
    });
    res.end();
});

app.post('/email', function (req, res, next) {
    
    var message = JSON.stringify(req.body),
        email = req.body.email;
    if (email) {
        mg.sendText(config.mailgun.smtp, config.mailgun.emails, 'Email from ' + email, message, config.mailgun.headers, function (err) {
            if (err) {
                return res.status(403).json(err);
            }

            // gatta send empty so it is considered successul
            res.status(200).json({});
        });
    } else {
        res.status(403).json({message: "Email is required"});
    }
});

app.use('/api/utils/time', filterNonApps, tracker, function (req, res, next) {
    return res.status(200).json({seconds: Math.round(Date.now() / 1000)});
});

app.listen(3000);

console.log('Server started: http://localhost:3000/');