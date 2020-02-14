exports.userSerialize = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  location: user.location,
  type: user.userType,
  organizerName: user.organizerName,
  address: user.address,
  phoneNumber: user.phoneNumber
})
