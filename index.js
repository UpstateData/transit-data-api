const express = require('express');
const mongoose = require('mongoose');
const gtfs = require('gtfs');
const config = require('./config').config

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb_uri);

let app = express();
if(!module.parent){
    app.listen(3000);
}
module.exports = app;

app.get('/', (req, res) => {
	res.json( { message: 'Upstate transit data API'} );
});

// List agencies.
app.get('/agencies', (req, res) => {
	gtfs.agencies((err, agencies) => {
		if(!err) {
			res.json(agencies);
		}
	});
});

// List details for a specific agency.
app.get('/agencies/:agency', (req, res) => {
	gtfs.getAgency(req.params.agency, (err, agency) => {
		if(!err) {
			res.json(agency);
		}
	});
});

// List agencies near a point.
app.get('/agencies/nearby/:lat/:lon', (req, res) => {
	let radius = req.query.radius || config.default_radius;
	gtfs.getAgenciesByDistance(req.params.lat, req.params.lon, radius, (err, agency) => {
		if(!err) {
			res.json(agency);
		}
	});
});

// List stop times for a trip.
app.get('/agencies/:agency/trips/:tripid', (req, res) => {
	gtfs.getStoptimesByTrip(req.params.agency, req.params.tripid, (err, stoptimes) => {
		if(!err) {
			res.json(stoptimes);
		}
	});
});

// List routes for an agency.
app.get('/agencies/:agency/routes', (req, res) => {
	gtfs.getRoutesByAgency(req.params.agency, (err, routes) => {
		if(!err) {
			res.json(routes);
		}
	});
});

// List routes by route ID.
app.get('/agencies/:agency/routes/:routeid', (req, res) => {
	gtfs.getRoutesById(req.params.agency, req.params.routeid, (err, routes) => {
		if(!err) {
			res.json(routes);
		}
	});
});

// List trips for a route.
app.get('/agencies/:agency/routes/:routeid/trips', (req, res) => {
	if(!req.query.direction) {
		res.status(500).json( { message: 'You must supply a direction parameter'});
		return;
	}
	gtfs.getTripsByRouteAndDirection(req.params.agency, req.params.routeid, req.query.direction, (err, trips) => {
		if(!err) {
			res.json(trips);
		}
	});
});

// List stops for a route.
app.get('/agencies/:agency/routes/:routeid/stops', (req, res) => {
	if(!req.query.direction) {
		res.status(500).json( { message: 'You must supply a direction parameter'});
		return;
	}
	gtfs.getStopsByRoute(req.params.agency, req.params.routeid, req.query.direction, (err, stops) => {
		if(!err) {
			res.json(stops);
		}
	});
});

// List stop times for a stop.
app.get('/agencies/:agency/routes/:routeid/stops/:stopid/stoptimes', (req, res) => {
	if(!req.query.direction) {
		res.status(500).json( { message: 'You must supply a direction parameter'});
		return;
	}
	gtfs.getStoptimesByStop(req.params.agency, req.params.routeid, req.params.stopid, req.query.direction, (err, stoptimes) => {
		if(!err) {
			res.json(stoptimes);
		}
	});
});

// List routes that serve a specific stop.
app.get('/agencies/:agency/stops/:stopid/routes', (req, res) => {
	gtfs.getRoutesByStop(req.params.agency, req.params.stopid, (err, routes) => {
		if(!err) {
			res.json(routes);
		}
	});
});


// List stops by stop ID.
app.get('/agencies/:agency/stops/:stopid', (req, res) => {
	gtfs.getStops(req.params.agency, req.params.stopid, (err, stops) => {
		if(!err) {
			res.json(stops);
		}
	});
});

// List stops near a point.
app.get('/agencies/:agency/stops/nearby/:lat/:lon', (req, res) => {
	let radius = req.query.radius || config.default_radius;
	gtfs.getStopsByDistance(req.params.lat, req.params.lon, radius, (err, stops) => {
		if(!err) {
			res.json(stops);
		}
	});
});

// List calendars
app.get('/agencies/:agency/calendars', (req, res) => {
	let start_date = req.query.start_date || 0;
	let end_date = req.query.end_date || 0;
	gtfs.getCalendars(req.params.agency, start_date, end_date, true, true, true, true, true, false, false, (err, calendars) => {
		if(!err) {
			res.json(calendars);
		}
	});
});

// List calendars by service IDs
app.get('/agencies/:agency/calendars/:service_id', (req, res) => {
	gtfs.getCalendarsByService(req.params.service_id, (err, calendars) => {
		if(!err) {
			res.json(calendars);
		}
	});
});


