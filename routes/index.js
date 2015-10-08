var express = require('express');
var router = express.Router();

// API Ping
router.all('/', function(req, res, next) {
	res.json({
		request: {
			type:'ping'
		},
		response: {
			content: 'pong'
		}
	});
});

// API list endpoints
router.all('/help', function(req, res, next) {
	res.json({
		request: {
			type:'help'
		},
		response: {
			endpoints: [
				{
					url: '/',
					type:'ping'
				},
				{
					url: '/help',
					type:'help'
				}
			]
		}
	});
});

module.exports = router;
