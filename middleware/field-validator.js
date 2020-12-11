const { response } = require('express');
const { validationResult } = require('express-validator');
const { check } = require('express-validator');

const validateFields = (req, res = response, next) => {

    //error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            succes: false,
            errors: errors.mapped()
        });
    };

    next();
}

const userRules = [
    check('name', 'Name required.').not().isEmpty(),
    check('email', 'email required.').isEmail().not().isEmpty(),
    check('password', 'Password must be longer than 6 characters.').isLength({ min: 6 }),
    validateFields
];


module.exports = {
    validateFields,
    userRules
};