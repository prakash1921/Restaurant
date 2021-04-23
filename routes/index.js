var express = require('express');
var router = express.Router();
var app=express();

/* GET home page. */
const restaurant = require('../component/restaurant/restaurant.router')
router.use('/restaurant',restaurant)
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
