const Joi = require('joi')

 
const driverValidationSchema = Joi.object({
  driverName: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(128).required(),
  mobileNumber: Joi.number()
    .min(10)
    .required()
    .messages({ 'string.pattern.base': 'Mobile number must be 10 to 15 digits' }),
  carModel: Joi.string().min(2).max(50).required(),
  rcBookNumber: Joi.string().alphanum().min(5).max(20).required(),
  isActive: Joi.string().default('active'),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
});

const driverLoginSchema = Joi.object({
  password: Joi.string().min(6).max(128).required(),
  mobileNumber: Joi.number()
    .min(10)
    .required()
    .messages({ 'string.pattern.base': 'Mobile number must be 6 to 15 digits' }),
});

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  driverValidationSchema,
  driverLoginSchema,
  validateRequest,
};
