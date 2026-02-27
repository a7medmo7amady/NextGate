const sendVerificationEmail = async (email, code) => {
  console.log(`\n[DEV] Verification code for ${email}: ${code}\n`);
};

module.exports = { sendVerificationEmail };