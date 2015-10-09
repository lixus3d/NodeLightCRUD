var express = require('express');
var core = app_require('nlc/core');
var router = express.Router();

// API Ping
router.all('/', function(req, res, next) {
	res.json( core.buildApiResponse(req, 'ping', 'pong') );
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
