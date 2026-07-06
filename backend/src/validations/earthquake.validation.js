import { body } from 'express-validator';
export const createEarthquakeValidation = [
  body('latitude')
    .notEmpty()
    .withMessage('Latitude metric is strictly required.')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Geographic coordinate constraint: Latitude must exist between -90 and 90 degrees.'),
  body('longitude')
    .notEmpty()
    .withMessage('Longitude metric is strictly required.')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Geographic coordinate constraint: Longitude must exist between -180 and 180 degrees.'),
  body('depth')
    .notEmpty()
    .withMessage('Depth parameter (km) is mandatory.')
    .isNumeric()
    .withMessage('Depth must map to a numeric floating or scalar integer value.'),
  body('magnitude')
    .notEmpty()
    .withMessage('Richter scale magnitude parameter required.')
    .isNumeric()
    .withMessage('Magnitude must map to a valid numerical digit value.'),
  body('place')
    .trim()
    .notEmpty()
    .withMessage('Place string descriptor is mandatory for local index identification.'),
];
export const updateEarthquakeValidation = [
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude parameter out of bounded ranges.'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude parameter out of bounded ranges.'),
  body('depth')
    .optional()
    .isNumeric()
    .withMessage('Depth updates must be scalar numeric strings/digits.'),
  body('magnitude')
    .optional()
    .isNumeric()
    .withMessage('Magnitude updates must be valid scalar numerical values.'),
];
