import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name parameter must not be empty.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name length must remain between 2 and 50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email parameter must not be empty.')
    .isEmail()
    .withMessage('Please specify a properly formatted email address string.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password parameter must not be empty.')
    .isLength({ min: 6 })
    .withMessage('Security constraint: Password must consist of at least 6 characters.'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email field required to authorize session access.')
    .isEmail()
    .withMessage('Valid email structure required.'),
  body('password')
    .notEmpty()
    .withMessage('Password parameter verification mandatory.'),
];
