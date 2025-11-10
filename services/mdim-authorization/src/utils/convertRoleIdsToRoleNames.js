import Role from "../models/rolesModel.js";

const convertUserObject = async (user) => {
  const roles = await Role.find({ _id: { $in: user.roles } });

  // Map the resulting role documents to an array of their names
  const roleNames = roles.map((role) => role.roleName);

  // Convert Mongoose document to plain object
  const userObject = user.toObject();

  // Replace role IDs with role names
  userObject.roles = roleNames;

  return userObject;
};

export default convertUserObject;
