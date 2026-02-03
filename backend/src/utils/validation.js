import Joi from 'joi';

const passwordSchema = Joi.string()
  .min(8)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
    'string.min': 'Password must be at least 8 characters'
  });

export const studentRegistrationSchema = Joi.object({
  fullName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  rollNumber: Joi.string().required().trim(),
  department: Joi.string().required(),
  year: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

export const facultyRegistrationSchema = Joi.object({
  fullName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  employeeId: Joi.string().required().trim(),
  department: Joi.string().required(),
  designation: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  password: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().trim(),
  password: Joi.string().required()
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().trim()
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    
    if (error) {
      const messages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error',
        errors: messages 
      });
    }

    req.validatedData = value;
    next();
  };
};
