const User = require("../models/User")

//Callback ==> c1
/*
module.exports.index = function(req,res,next){
     User.find({}, (err,users) =>{
          if(err) next(err)
          return res.status(200).json({users})
     })
}
*/

//Promise way ==> c2
/**
 * module.exports.index = function (req,res,next){
     User.find({}).then(users => {
          return res.status(200).json({users})
     }).catch(err => next(err))
}
 **/

/**
 * module.exports.addUser = function (req, res, next){
     console.log("req.body content", req.body)

     //Create Object model
     const newUser = new User(req.body)
     console.log("newUser", newUser)
     newUser.save().then(user => {
          return res.status(201).json({user})
     }).catch(err => next(err))
}
 */

//async & await ==> c3
module.exports.index = async function (req, res, next){

     const users = await User.find({})
     //throw new Error('Test Error with express-promise-router')
     return res.status(200).json({users})

}

module.exports.addUser = async function (req, res, next){
  
     const newUser = new User(req.body)
     await newUser.save()
     return res.status(201).json({user:newUser})
  
}

module.exports.getUser = async function (req, res, next){

     const {userId} = req.params
     
     const user = await User.findById(userId)
     return res.status(200).json({user})
}

module.exports.replaceUser = async function (req, res, next){
     const {userId} = req.params

     const newUser = req.body

     const result = await User.findByIdAndUpdate(userId, newUser)
     return res.status(200).json({success: true})
}

module.exports.updateUser = async function (req, res, next){
     const {userId} = req.params

     const newUser = req.body

     const result = await User.findByIdAndUpdate(userId, newUser)
     return res.status(200).json({success: true})
}