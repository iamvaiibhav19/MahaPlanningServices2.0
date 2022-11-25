const User = require("../models/UserModel");
const sendToken = require("../utils/jwtToken");

// register a user -- PUBLIC
exports.registerAdmin = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// register a coordinator -- make role coordinator --
exports.assignRole = async (req, res, next) => {
  try {
    const { email, role, name } = req.body;

    //check if email exists in db
    const user1 = await User.findOne({
      email,
    });

    if (user1) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }

    // create user with role coordinator
    const user = await User.create({
      email,
      role,
      name,
    });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// login coordinator with only email
exports.loginCoordinator = async (req, res, next) => {
  try {
    const { email } = req.body;

    //checks if email with role coordinator exists in db and dont check for password
    const user = await User.findOne({
      email,
      role: "coordinator",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// login user -- PUBLIC
exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is entered by user
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter email and password",
    });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//assign logout -- PUBLIC
exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
};

//get currently logged in user details -- PRIVATE
exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
};

//get all coordinators -- ADMIN
exports.getCoordinators = async (req, res, next) => {
  const coordinators = await User.find({ role: "coordinator" });

  res.status(200).json({
    success: true,
    coordinators,
  });
};

//delete coordinator -- ADMIN
exports.deleteCoordinator = async (req, res, next) => {
  const coordinator = await User.findById(req.params.id);

  if (!coordinator) {
    return res.status(404).json({
      success: false,
      message: "Coordinator not found",
    });
  }

  await coordinator.remove();

  res.status(200).json({
    success: true,
    message: "Coordinator is deleted",
  });
};

//get single coordinator -- ADMIN
exports.getSingleCoordinator = async (req, res, next) => {
  const coordinator = await User.findById(req.params.id);

  if (!coordinator) {
    return res.status(404).json({
      success: false,
      message: "Coordinator not found",
    });
  }

  res.status(200).json({
    success: true,
    coordinator,
  });
};

//update coordinator -- ADMIN
exports.updateCoordinator = async (req, res, next) => {
  const { name, email, role } = req.body;

  const coordinator = await User.findById(req.params.id);

  if (!coordinator) {
    return res.status(404).json({
      success: false,
      message: "Coordinator not found",
    });
  }

  coordinator.name = name;
  coordinator.email = email;
  coordinator.role = role;

  await coordinator.save();

  res.status(200).json({
    success: true,
    message: "Coordinator is updated",
  });
};

//delete single coordinator -- ADMIN
exports.deleteCoordinator = async (req, res, next) => {
  const coordinator = await User.findById(req.params.id);

  if (!coordinator) {
    return res.status(404).json({
      success: false,
      message: "Coordinator not found",
    });
  }

  await coordinator.remove();

  res.status(200).json({
    success: true,
    message: "Coordinator is deleted",
  });
};
