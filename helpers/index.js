const Joi = require("@hapi/joi")

module.exports.validateParam = function (schema, name){
     return function (req, res, next){
          //console.log("req.params", req.params)
          //console.log("schema...", schema)
          const validatorResult = schema.validate({param : req.params[name]})  
          console.log("result ", validatorResult)

          if(validatorResult.error){
               //code 400 for validate
               return res.status(400).json(validatorResult.error)
          }else{
               if(!req.value) req.value = {}
               if(!req.value["params"]) req.value.params = {}

               req.value.params[name] = req.params[name]
               console.log("req.value.params", req.value.params)
               next()
          }
     }
}

module.exports.schemas = {
     idSchema : Joi.object().keys({
          //validate id with regex
          param : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
     })
}