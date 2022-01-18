const Accounts = require("./accounts-model")

exports.checkAccountPayload = (req, res, next) => {
  if(typeof req.body.name === "undefined" || typeof req.body.budget === "undefined"){
    next({status: 400, message: "name and budget are required"})
  }  else if (parseInt(req.body.budget === NaN)){
    next({status: 400, message: "budget of account must be a number"})
  } else if (req.body.name.trim().length < 3 || req.body.name.trim().length > 100) {
    next({status: 400, message: "name of account must be between 3 and 100"})
  }else if (req.body.budget < 0 || req.body.budget > 1000000){
    next({status: 400, message: "budget of account is too large or too small"})
  } else{
    next()
  }
}

exports.checkAccountNameUnique = (req, res, next) => {
  Accounts.getAll()
    .then(accounts => {
      const count = accounts.filter(account => account.name === req.body.name.trim())
      if(count.length > 0){
        next({status: 400, message: "that name is taken"})
      } else {
        next()
      }
    })
}
exports.checkAccountId = (req, res, next) => {
  Accounts.getById(req.params.id)
    .then(account => {
      if (!account){
        next({status: 404, message: "account not found"})
      }
      else{
        next()
      }
    })
    .catch(err => next({status:500, message:"server could not retrieve account"}))
}
