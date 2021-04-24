
const restaurantModel = require('../restaurant/restaurant.model')
const mongoose = require('mongoose');
const _ = require('lodash')
const async = require('async')
const arrayList = require('../../data.json')


//get List of LocationName present in Restaurant collection 
exports.getAllLocation = async function (req, res, next) {
    try {
        var users = await restaurantModel.find({});
        let result = users.map(a => a.location);
        result = _.uniq(result)
        return res.status(200).json({ status: 200, data: result, message: "Succesfully Users Retrieved" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

//Add resturant in Restaurant collection
exports.add = async function (req, res, next) {
    const datapresent = await restaurantModel.find({ name: req.body.name });
    if (datapresent.length != 0) {
        return res.status(200).json({ status: 200, message: 'Data Already Exist' });
    } else {


        var data = req.body;
        var addRestaurant = new restaurantModel(data);
        await addRestaurant.save(function (err, resp) {
            if (err) {
                return res.status(400).json({ status: 400, message: err });

            }
            else {
                res.send(resp)

            }
        })
    }
}


//update restaurant by its _id
exports.updateRestaurant = async function (req, res, next) {
    try {
        var users = await restaurantModel.update({ _id: req.body.id }, {
            $set: {
                Rid: req.body.data.Rid,
                password: req.body.data.password,
                name: req.body.data.name,
                location: req.body.data.location,
                address: req.body.data.address,
                zip: req.body.data.zip,
                cuisines: req.body.data.cuisines
            }
        });
        res.status(200).json({ status: 200, data: users, message: "Succesfully Users Updated" });
    } catch (e) {
        res.status(400).json({ status: 400, message: e.message });
    }
}
//delete restaurant from collection by _id
exports.delete = async function (req, res, next) {
    try {
        var users = await restaurantModel.remove({ _id: req.query.id });
        return res.status(200).json({ status: 200, data: users, message: "Succesfully Users Deleted" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

//get resturant by page change
//server side pagtination
exports.pagination = async function (req, res, next) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var location = req.query.location;

    var query = {}
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    query.skip = size * (pageNo - 1)
    query.limit = size
    if (location == 'ALL') {
        const totalCount = await restaurantModel.count({})
        const data = await restaurantModel.find({}).skip(query.skip).limit(query.limit);
        response = { data, totalCount };
        res.send(response);
    } else {
        const totalCounts = await restaurantModel.find({ location: location })
        const data = await restaurantModel.find({ location: location }).skip(query.skip).limit(query.limit);
        const totalCount = totalCounts.length;

        response = { data, totalCount };
        res.send(response);
    }

}

//Get List of restaurant
exports.getbyid = async function (req, res, next) {
    try {
        var users = await restaurantModel.find({ _id: mongoose.Types.ObjectId(req.params.id) });
        res.status(200).json({ status: 200, data: users, message: "Succesfully Users Deleted" });
    } catch (e) {
        res.status(400).json({ status: 400, message: e.message });
    }
}


//To check duplicate entry of a restaurant
exports.uniquecheck = async function (req, res, next) {

    try {
        var users = await restaurantModel.find({ Rid: req.query.id });
        if (users.length) {
            res.status(200).json({ status: 200, data: users, message: 'Data already exist' });
        } else {
            res.status(200).json({ status: 200, data: users, message: "Data don't exist" });
        }
    } catch (e) {
        res.status(400).json({ status: 400, message: e.message });
    }
}

//Search restaurant by location
exports.getRestaurant = async function (req, res, next) {
    var searchquery;
    if (req.query) {
        searchquery = req.query.location;
    } else {
        searchquery = ' '
    }
    try {
        if (searchquery == 'ALL') {
            var users = await restaurantModel.find({});

        } else {
            var users = await restaurantModel.find({ location: { $regex: searchquery, $options: 'i' } });

        }
        res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

 function getdata() {
    async.eachSeries(arrayList,  function (file, outercb) {
        if (file) {
            console.log('fileee', file.Rid)
            restaurantModel.find({Rid:file.Rid},function(err,resp){
                if(err){
                    outercb()
                }else{
                    var duplicatedata=resp;
                    if(duplicatedata.length!=0){
                        console.log('data already present')
                        outercb();
                    }else{
                        var addRestaurant = new restaurantModel(file);
                      addRestaurant.save();
                        console.log('saved data')
                        outercb();
                    }
                }
            });
        } else {
            outercb();
        }
    },function(ree,ree){
        console.log(ree)
    })
}


//Run this function only once to  dumy restaurant data
// to store int database collection
//and commit function once executed
// getdata();