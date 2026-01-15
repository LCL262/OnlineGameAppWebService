const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express App
const app = express();
//helps app to read json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Start the server
app.listen(port, () => {console.log('Listening on port: ', port);});

//Example route: get all cards
app.get('/allgames', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM games');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for all games'});
    }
});

app.post('/addgame', async (req, res) => {
    const { gamename, gamepic } = req.body;

    if (!gamename || !gamepic) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO games (gamename, gamepic) VALUES (?, ?)',
            [gamename, gamepic]
        );
        await connection.end();
        res.json({ message: 'Game added' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding game' });
    }
});


app.post('/updategame/:id', async (req, res) => {
    const { id } = req.params;
    const { gamename, gamepic } = req.body;

    if (!gamename || !gamepic) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'UPDATE games SET gamename = ?, gamepic = ? WHERE id = ?',
            [gamename, gamepic, id]
        );

        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating game' });
    }
});



app.post('/deletegame/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM games WHERE id = ?',
            [id]
        );

        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.json({ message: 'Game deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting game' });
    }
});





