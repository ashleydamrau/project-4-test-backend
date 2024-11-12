import bcrypt from 'bcrypt';

const plainPassword = 'password123';  // Your original password
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) throw err;
  console.log('Hashed Password:', hashedPassword);
});

