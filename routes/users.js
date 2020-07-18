const router = require('express').Router()
const ctrl = require('../controllers')

// PATH = /api/v1/user

router.get('/:id', ctrl.users.show)

module.exports = router