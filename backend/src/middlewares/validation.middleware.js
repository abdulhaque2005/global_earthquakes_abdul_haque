import { validationResult } from 'express-validator';
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      error: extractedErrors.join(', '),
      details: errors.array(),
    });
  }
  next();
};
export default validate;
