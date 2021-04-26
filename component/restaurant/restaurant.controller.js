
const restaurantModel = require('../restaurant/restaurant.model')
const mongoose = require('mongoose');
const _ = require('lodash')
const async = require('async')
const arrayList = require('../../data.json');
const datwithcoordinatesList = require('../../locationdata.json');
const MongoClient = require('mongodb').MongoClient;



//get List of LocationName present in Restaurant collection 
exports.getAllLocation = async function (req, res, next) {
    try {
        var users = await restaurantModel.find({});
        let result = users.map(a => a.locationName);
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
        console.log('location', data)
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
        console.log('req.body.location', req.body.location)
        var users = await restaurantModel.update({ _id: req.body.id }, {
            $set: {
                Rid: req.body.data.Rid,
                password: req.body.data.password,
                name: req.body.data.name,
                locationName: req.body.data.locationName,
                address: req.body.data.address,
                zip: req.body.data.zip,
                cuisines: req.body.data.cuisines,
                location: req.body.location,
                rating: req.body.data.rating
                // "location.type":req.body.location.type,
                // "location.coordinates":req.body.location.coordinates
            }
        });
        var menuList = req.body.menuList;
        if (menuList.length != 0) {
            for (var i = 0; i < menuList.length; i++) {
                if (menuList[i]._id == undefined) {
                    var users = await restaurantModel.update({ _id: req.body.id },
                        { "$push": { "menuList": { "menuname": menuList[i].menuname, "cost": menuList[i].cost } } })

                }
            }
        }
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


exports.deletemenu = async function (req, res, next) {
    try {
        var users = await restaurantModel.update({ _id: req.query.id },
            { "$pull": { "menuList": { "_id": req.query.nid } } });
        return res.status(200).json({ status: 200, data: users, message: "Succesfully menu Deleted" });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
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
    console.log('lll', req.query)
    if (req.query) {
        searchquery = req.query.locationName;
    } else {
        searchquery = ' '
    }
    try {
        if (req.query.lat == undefined && req.query.lng == undefined) {
            if (searchquery == 'ALL') {
                if(req.query.rt!='ALL'){
                    console.log('bbbbq')
                   if(req.query.menuname==''){
                    var users = await restaurantModel.find({rating:Number(req.query.rt)});
                    res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                    
                    } else{
                        console.log('aaaaaaaaallllllllllla')
                var users = await restaurantModel.find({$and:[{rating:Number(req.query.rt)},{ menuList: { $elemMatch: { menuname: {$regex:req.query.menuname.toString(),$options:'i' }} } }]})
                //.sort({'menuList.cost':-1});
                res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                

                    }
               
                }else{
                    if(req.query.menuname==''){
                        console.log('gggii')
                var users = await restaurantModel.find({});
                res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                
                    }else{
                        console.log('aaaaaaaaallllllllllla')
                var users = await restaurantModel.find({ menuList: { $elemMatch: { menuname: {$regex:req.query.menuname.toString(),$options:'i' }} } })
                //.sort({'menuList.cost':-1});
                res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                

                    }
                }
            }
            else {
                console.log('bbbb')
                if(req.query.rt!='ALL'){
                    console.log('bbbbq')
                    if(req.query.menuname!=''){
                        console.log('bbbbq')
                        var users = await restaurantModel.find({$and:[{ locationName: { $regex: searchquery, $options: 'i' } },{rating:Number(req.query.rt)},{ menuList: { $elemMatch: { menuname: {$regex:req.query.menuname.toString(),$options:'i' }} } }]});
                        res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                   
                    }else{
                        var users = await restaurantModel.find({$and:[{ locationName: { $regex: searchquery, $options: 'i' } },{rating:Number(req.query.rt)}]});
                        res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                   
                    }
                   
                }else if(req.query.rt=='ALL'){
                    if(req.query.menuname==''){
                        console.log('bbbbw')
                        var users = await restaurantModel.find({ locationName: { $regex: searchquery, $options: 'i' } });
                        res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                     
                        } else{
                            console.log('aaaaaaaaallllllllllla')
                    var users = await restaurantModel.find({$and:[{ locationName: { $regex: searchquery, $options: 'i' } },{ menuList: { $elemMatch: { menuname: {$regex:req.query.menuname.toString(),$options:'i' }} } }]})
                    //.sort({'menuList.cost':-1});
                    res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                    
    
                        }
                    
                }
                else{
                    console.log('bbbbw')
                    var users = await restaurantModel.find({ locationName: { $regex: searchquery, $options: 'i' } });
                    res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
                 
                }
                // var users = await restaurantModel.find({ locationName: { $regex: searchquery, $options: 'i' } });
                // res.status(200).json({ status: 200, data: users, message: "Succesfully Users searched" });
            }
        }
        else {
            console.log('ggggggggggggggg', req.query.lat, searchquery)
            var rating;
    if(req.query.rt=='ALL'){
        rating=req.query.rt
    }else{
        rating=Number(req.query.rt)
    }
           var obj={
            lat:req.query.lat, 
            lng:req.query.lng, 
            locationname:searchquery,
            rating:rating,
            menuname:''
           }  
            searchvaluebycord(obj, function (err, response) {
                if (err) {
                    res.status(400).json({ status: 400, message: err });

                } else {
                    res.status(200).json({ status: 200, data: response, message: "Succesfully Users searched" });

                }
            })
        }


    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
}

function getdata() {
    async.eachSeries(arrayList, function (file, outercb) {
        if (file) {
            console.log('fileee', file.Rid)
            restaurantModel.find({ Rid: file.Rid }, function (err, resp) {
                if (err) {
                    outercb()
                } else {
                    var duplicatedata = resp;
                    if (duplicatedata.length != 0) {
                        console.log('data already present')
                        outercb();
                    } else {
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
    }, function (ree, ree) {
        console.log(ree)
    })
}


//Run this function only once to  dumy restaurant data
// to store int database collection
//and commit function once executed
// getdata();




function storedatabycoordinates() {
    async.eachSeries(arrayList, function (file, outercb) {
        if (file) {
            console.log('fileee', file.Rid)
            restaurantModel.find({ Rid: file.Rid }, function (err, resp) {
                if (err) {
                    outercb()
                } else {
                    var duplicatedata = resp;
                    if (duplicatedata.length != 0) {
                        console.log('data already present')
                        outercb();
                    } else {
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

    }, function (re, re) {
        console.log('ccc', re)
    })
}
// storedatabycoordinates()

exports.getlocationbycoodinates = async function (req, res, next) {
    console.log("re", req.params)
    var lat = Number(req.params.lat);
    var lng = Number(req.params.lng);
    // var coordinates=[19.019552, 72.8382497]
    // var coordinates=[lat,lng]
    // console.log('gg',coordinates)
    var rating;
    if(req.params.rt=='ALL'){
        rating=req.params.rt
    }else{
        rating=Number(req.params.rt)
    }
    var data={
        lat :Number(req.params.lat),
        lng :Number(req.params.lng),
        locationname:req.params.locationName,
        rating:rating,
        menuname:req.params.maneuname
    }
    if (req.params.locationName == 'ALL') {
        getAll(data,function(err,response){
            if (err) {
                res.status(400).json({ status: 400, message: err });

            } else {
                res.status(200).json({ status: 200, data: response, message: "Succesfully Users searched" });

            }
        })
    } else {

        getlocationresult(data, function (err, response) {
            if (err) {
                res.status(400).json({ status: 400, message: err });

            } else {
                res.status(200).json({ status: 200, data: response, message: "Succesfully Users searched" });

            }
        })
      
    }
}


// storedatabycoordinates();





// const mongoUrl='mongodb+srv://sohamdb:soham123@electioncluster.u8osy.mongodb.net/restaurantdb';
// function getconnecttomd(){
//     MongoClient.connect(mongoUrl,function(err,db){
//         if(err) throw err;
//         var dbo=db.db('restaurant');
//         console.log('dbo',dbo)
//         dbo.collection('newdata').createIndex({ "location" : "2dsphere" } );
//     })
// }
// getconnecttomd();


function searchvaluebycord(data, cb) {

    var locationname=data.locationname;
    if (locationname == 'ALL') {
        getAll(data,function(err,resp){
            if(err){
                cb(err,null)
            }else{
                cb(null,resp)
            }
        })
        
    } else {
        console.log('uuuuuuuuuuuu')
        
        
            getlocationresult(data, function (err, result) {
                if (err) {
                    cb(err, null)
                }
                else {
                    cb(null, result)
                }
            })
       
       
    }
}

function getAll(data,cb){
    console.log('data',data)
    if(data.rating=='ALL'){
        console.log('kkkkllllllllll')
    restaurantModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(data.lat), Number(data.lng)],

                },
                distanceField: "dist.calculated",
                includeLocs: "dist.location",
                //  maxDistance: 2000000,
                // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                // maxDistance: 200 * 1000,  // 200 km
                spherical: true

            }
        }, { $sort: { "dist.calculated": 1 } }
    ], (err, data) => {
        if (err) {
            cb(err, null)
        } else {
            cb(null, data)
        }
    })
}else{
 if(data.locationname=='ALL'){
    restaurantModel.find({$and:[{rating:Number(data.rating)}]}, function(err,res)
    { 
        if(err) {
        cb(err, null)
    } else {
        cb(null, res)
    }
})
 }else{
    console.log('kkkkkkkkkk')
    restaurantModel.find({$and:[{rating:Number(data.rating)},{locationName:data.locationname}]}, function(err,res)
    { 
        if(err) {
        cb(err, null)
    } else {
        console.log('kkkkkkkkkk')
        cb(null, res)
    }
})
 }
   

}
}
function getlocationresult(data, cb) {
    var lat=data.lat; 
    var lng=data.lng; 
    var locationname=data.locationname;
    var rating=data.rating;
    var menuname=data.menuname;
    console.log('lllll',data)
    if(rating=='ALL' ){
        if(menuname==''){
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{locationName:locationname.toString()}]  }
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
         if(menuname=='undefined'){
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{locationName:locationname.toString()}]  }
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
        console.log('allllllll')
        if(menuname!='' && menuname!=undefined){
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{locationName:locationname.toString()},{ menuList: { $elemMatch: { menuname: {$regex:menuname.toString(),$options:'i' }} } }]  }
                   
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
       
    } 
    else if(rating!='ALL'){
        console.log('alrr')
        if(menuname==''){
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{rating:Number(rating)},{locationName:locationname.toString()}]  }
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
         if(menuname=='undefined'){
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{rating:Number(rating)},{locationName:locationname.toString()}]  }
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
        else{
            restaurantModel.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [Number(lat), Number(lng)],
        
                        },
                        distanceField: "dist.calculated",
                        includeLocs: "dist.location",
                        //  maxDistance: 2000000,
                        // distanceMultiplier: 1 / 1000,  // divide by 1000 to covert meters to kilometers
                        // maxDistance: 200 * 1000,  // 200 km
                        spherical: true,
                        // query:{$in:[{rating:Number(rating)},{locationName:locationname.toString()}]}
        
                    }
                },
                 {
                    $match: {$and:[{rating:Number(rating)},{locationName:locationname.toString()},{ menuList: { $elemMatch: { menuname: {$regex:menuname.toString(),$options:'i' }} } }]  }
                   
                },
        
                { $sort: { "dist.calculated": 1 } }
            ], (err, res) => {
                if (err) {
                    cb(err, null)
                    // next(err);
                    // return;
                } else {
                    cb(null, res)
                }
            })
        }
        
    }
    
    }

exports.getratbylatlng = async function (req, res, next) {
    console.log('kkk',req.param)
    if(req.params.rt=='ALL'){
        rating=req.params.rt
    }else{
        rating=Number(req.params.rt)
    }
     var obj={
        lat:req.params.lat, 
        lng:req.params.lng, 
        locationname:req.params.locationName,
        rating:rating,
        menuname:req.params.menuname

       } 
       searchvaluebycord(obj, function (err, response) {
        if (err) {
            res.status(400).json({ status: 400, message: err });

        } else {
            res.status(200).json({ status: 200, data: response, message: "Succesfully Users searched" });

        }
    })
}
exports.getratorbylocationname = async function (req, res, next) {
    console.log('reqq',req.query)
    var objs={
        locationname:req.query.locationName,
        rating:Number(req.query.rt)
       } 
       console.log('ll',objs)
       getAll(objs, function (err, response) {
        if (err) {
            res.status(400).json({ status: 400, message: err });

        } else {
            res.status(200).json({ status: 200, data: response, message: "Succesfully Users searched" });

        }
    })
}



