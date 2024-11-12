import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';

const router = express.Router();


const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',  
  database: 'loginDB',
});


router.post('/', async (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];


    try {
      const match = await bcrypt.compare(password, user.password); 
      if (match) {

        res.json({ message: 'Login successful', user: { username: user.username } });
      } else {

        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error comparing passwords:', err);
      return res.status(500).json({ message: 'Error processing login' });
    }
  });
});

export default router;