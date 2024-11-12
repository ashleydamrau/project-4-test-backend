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


router.post('/signup', async (req, res) => {
    const { username, password } = req.body;


    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }


    connection.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            console.error('Error during query execution:', err);
            return res.status(500).json({ error: 'Internal server error while checking username' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

  
        try {
            const hashedPassword = await bcrypt.hash(password, 10); 

            connection.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hashedPassword],
                (err, results) => {
                    if (err) {
                        console.error('Error during query execution:', err);
                        return res.status(500).json({ error: 'Internal server error while inserting user' });
                    }


                    res.status(200).json({ message: 'User registered successfully', user: { username } });
                }
            );
        } catch (err) {
            console.error('Error during password hashing:', err);
            return res.status(500).json({ error: 'Error during password hashing' });
        }
    });
});

export default router;
