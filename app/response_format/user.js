exports.userSerialize = (user) => ({
  name: user.name,
  email: user.email,
  location: user.location,
  type: user.userType,
})
