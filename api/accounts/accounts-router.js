const router = require('express').Router()
const Accounts = require('./accounts-model')
const {checkAccountId, checkAccountNameUnique, checkAccountPayload } = require("./accounts-middleware")

router.get('/', (req, res, next) => {
  Accounts.getAll()
    .then(accounts => res.status(200).json(accounts))
    .catch(err => next(err))
})

router.get('/:id', checkAccountId, (req, res, next) => {
  Accounts.getById(req.params.id)
    .then(account => res.status(200).json(account))
    .catch(err => next(err))
})

router.post('/', checkAccountPayload, checkAccountNameUnique,  (req, res, next) => {
  Accounts.create({name: req.body.name.trim(), budget: req.body.budget.trim()})
    .then(newAccount => res.status(201).json(newAccount))
    .catch(err => next(err))

})

router.put('/:id', checkAccountId, checkAccountPayload, (req, res, next) => {
  Accounts.updateById(req.params.id, {name: req.body.name.trim(), budget: req.body.budget.trim()})
    .then(updatedAcc => res.status(200).json(updatedAcc))
    .catch(err => next(err))
});

router.delete('/:id', checkAccountId, (req, res, next) => {
  Accounts.deleteById(req.params.id)
    .then(account => res.status(200).json(account))
    .catch(err => next(err))
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({message: `${err.message}`})
  next()
})

module.exports = router;
