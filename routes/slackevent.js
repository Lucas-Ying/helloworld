var express = require('express');
var router = express.Router();

// var fs = require('fs');
// var token = fs.readFileSync('../token.txt', 'utf8');
// console.log(token);

/* sse */
var sse = require('../sse');
router.use(sse);

var connection;

router.get('/api', function(req, res) {
    res.sseSetup();
    connection = res;
});

/* GET slack listening. */
router.get('/', function(req, res, next) {
    res.send('slackbot message');
});

var token = ['xoxb-21', '7575678592-Fc', '5fMc3GoPtvSE', '6B9x2hajkj'];

/* Start a rtm client for slack bot. */
var RtmClient = require('@slack/client').RtmClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var bot_token = token.join('');
var rtm = new RtmClient(bot_token);

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
    if (message.attachments) {
        connection.sseSend(message.attachments[0].text);
    } else {
        connection.sseSend(message.text);
    }
});

rtm.start();

module.exports = router;
