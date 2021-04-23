var express = require('express');
var router = express.Router();

var UserController = require('../restaurant/restaurant.controller')

router.get('/List', UserController.getRestaurant);
router.post('/add', UserController.add);
router.post('/update', UserController.updateRestaurant);
router.get('/getbyid/:id', UserController.getbyid);
router.get('/delete', UserController.delete);
router.get('/getAllLocation', UserController.getAllLocation);
router.get('/pagination', UserController.pagination);
router.get('/uniquecheck', UserController.uniquecheck);






module.exports = router;