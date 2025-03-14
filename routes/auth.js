/**
 * /api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post('/',
    [
        check('password', 'Password is required').isLength({ min: 6 }),
        check('email', 'Email is required').isEmail(),
        validateFields
    ], 
    login);
router.post(
    '/new', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('password', 'Password is required').isLength({ min: 6 }),
        check('email', 'Email is required').isEmail(),
        validateFields
    ],
    createUser
);
router.post('/renew', validateJWT, renewToken);

module.exports = router;