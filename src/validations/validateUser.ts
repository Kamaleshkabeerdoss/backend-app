// validations/validateUser.ts
import * as yup from 'yup';

export const registerValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required and only contains alphabets'),
  email: yup.string().email('Enter a valid email address').required('email is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'Only users aged 18 or above can register')
    .required('Age is required'),
  // age: yup.number().positive().integer().required('Age is required'),
  mobileNumber: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required(),
  address: yup.string().required('Address is required'),
  gender: yup.string().oneOf(['Male', 'Female']).required('Gender is required'),
  dateOfBirth: yup
    .string()
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/, 'Invalid date of birth')
    .required('DOB is required'),
  role: yup.string().required('Role is required'),
});

export const loginValidationSchema = yup.object().shape({
  name: yup.string().required('Username (name) is required'),
  password: yup.string().required('Password is required'),
});
