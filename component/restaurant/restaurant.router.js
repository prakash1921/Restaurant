var express = require('express');
var router = express.Router();

var UserController = require('../restaurant/restaurant.controller')

router.get('/List', UserController.getRestaurant);
router.post('/add', UserController.add);
router.post('/update', UserController.updateRestaurant);
router.get('/getbyid/:id', UserController.getbyid);
router.get('/delete', UserController.delete);
router.get('/getAllLocation', UserController.getAllLocation);
router.get('/uniquecheck', UserController.uniquecheck);
router.get('/deletemenu', UserController.deletemenu);


router.get('/getlocationbycoodinates/:lat/:lng/:locationName/:rt/:maneuname',UserController.getlocationbycoodinates);

router.get('/getratbylatlng/:rt/:menuname/:lat/:lng/:locationName',UserController.getratbylatlng);
router.get('/getratorbylocationname',UserController.getratbylatlng);






module.exports = router;