const modifyEmail = (user) => {
  if (user.email) {
    user.email = user.email.toLowerCase();
  }
}

module.exports = modifyEmail;