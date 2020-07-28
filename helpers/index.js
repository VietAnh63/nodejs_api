const Joi = require("@hapi/joi")


//validate Params
module.exports.validateParam = function (schema, name){
     return function (req, res, next){

          const validatorResult = schema.validate({param : req.params[name]})  
          //console.log("result ", validatorResult)

          if(validatorResult.error){
               //code 400 for validate
               return res.status(400).json(validatorResult.error)
          }else{
  
               if(!req.value) req.value = {}

               if(!req.value["params"]) req.value.params = {}
               
               req.value.params[name] = req.params[name]

               next()
          }
     }
}

//validate Body
module.exports.validateBody = function (schema){
     return function (req, res, next){
          const validatorResult = schema.validate(req.body)
          if(validatorResult.error){
               return res.status(400).json(validatorResult.error)
          }else{

               if(!req.value) req.value = {}

               req.value.body = validatorResult.value

               next()
          }
     }
}

//Rule
module.exports.schemas = {
     idSchema : Joi.object().keys({
          //validate id with regex
          param : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
     }),
     userSchema : Joi.object().keys({
          firstName : Joi.string().min(2).required(),
          lastName : Joi.string().min(2).required(),
          email : Joi.string().email().required()
     }),
     userUpadateSchema : Joi.object().keys({
          firstName : Joi.string().min(2),
          lastName : Joi.string().min(2),
          email : Joi.string().email()
     }),
     deckSchema : Joi.object().keys({
          name : Joi.string().min(6).required(),
          description : Joi.string().min(10).required()
     }),
     newDeckSchema : Joi.object().keys({
          name : Joi.string().min(6).required(),
          description : Joi.string().min(10).required(),
          owner : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
     }),
     deckUpdateSchema : Joi.object().keys({
          name : Joi.string().min(6),
          description : Joi.string().min(10),
          owner : Joi.string().regex(/^[0-9a-fA-F]{24}$/)
     }),
}