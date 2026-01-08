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

app.get('/addgame', (req, res) => {
    res.send(`
        <h1>Add Game</h1>
        <form action="/addgame/submit" method="get">
            <label>Game Name:</label><br/>
            <input type="text" name="gamename" required /><br/><br/>

            <label>Game Image URL:</label><br/>
            <input type="text" name="gamepic" required /><br/><br/>

            <button type="submit">Add Game</button>
        </form>
    `);
});

app.get('/addgame/submit', async (req, res) => {
    const { gamename, gamepic } = req.query;

    try {
        const connection = await mysql.createConnection(dbConfig);

        await connection.execute(
            'INSERT INTO games (gamename, gamepic) VALUES (?, ?)',
            [gamename, gamepic]
        );

        await connection.end();

        res.send('Game added successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding game');
    }
});

app.get('/updategame/:id', async (req, res) => {
    const { id } = req.params;

    res.send(`
        <h1>Update Game</h1>
        <form action="/updategame/${id}/submit" method="get">
            <label>Game Name:</label><br/>
            <input type="text" name="gamename" required /><br/><br/>

            <label>Game Image URL:</label><br/>
            <input type="text" name="gamepic" required /><br/><br/>

            <button type="submit">Update Game</button>
        </form>
    `);
});


app.get('/updategame/:id/submit', async (req, res) => {
    const { id } = req.params;
    const { gamename, gamepic } = req.query;

    if (!gamename || !gamepic) {
        return res.status(400).send('All fields are required');
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'UPDATE games SET gamename = ?, gamepic = ? WHERE id = ?',
            [gamename, gamepic, id]
        );

        await connection.end();

        if (result.affectedRows === 0) {
            return res.send('Game not found');
        }

        res.send('Game updated successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating game');
    }
});

app.get('/deletegame/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'DELETE FROM games WHERE id = ?',
            [id]
        );

        await connection.end();

        if (result.affectedRows === 0) {
            return res.send('Game not found');
        }

        res.send('Game deleted successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting game');
    }
});


