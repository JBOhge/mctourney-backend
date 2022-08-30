const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowedFields) => {
  let filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredObj[el] = obj[el];
    }
  });

  return filteredObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: { users },
//   });
// });

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Use /signup instead.',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

//Do not Update Passwords with this
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getMe = (req, res, next) => {
  //req.user comes from the authentication middleware
  //we get the userId from req.user and put it in the params
  //so it works with the normal getOne factory function 
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating passwords. Please use /updatepassword',
        400
      )
    );
  }
  // 2) Filter unwanted field names
  const filteredBody = filterObj(req.body, 'playername', 'email');

  // 3) Update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: { user } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({ status: 'success' });
});
