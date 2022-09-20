import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { insertWaitingQuery, readWaitingQuery, deleteWaitingQuery, updateWaitingQuery } from './match/database.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) //config cors so that front-end can use
app.options('*', cors())

const httpServer = createServer(app);
const io = new Server(httpServer, {cors: {
    origin: "*",
  }},);

//Configure public folder
var clientDir = path.join(__dirname, 'public');
app.use('/', express.static(clientDir));

//Send static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//GET request
app.get('/waiting/:difficulty/', async function (req, res) {
    var difficulty = req.params.difficulty;
    const waitingUsers = await readWaitingQuery(difficulty);
    if (waitingUsers == null) {
        res.status(404);
        res.send("Resource not found");
    } else {
        res.status(200);
        res.send(waitingUsers);
    }
})

//POST request
app.post('/waiting/:uuid/:difficulty/', async function (req, res) {
    var uuid = req.params.uuid;
    var difficulty = req.params.difficulty;
    if (uuid == null || difficulty == null) {
        res.send(404);
        return;
    }
    const waitee = await insertWaitingQuery(uuid, difficulty);
    if (waitee != null) {
        res.status(200);
        res.send(waitee);
    } else {
        res.status(204);
        res.send(waitee);
    }
})

//PUT request
app.put('/waiting/:uuid/:difficulty/', async function (req, res){
    var uuid = req.params.uuid;
    var difficulty = req.params.difficulty;
    if (uuid == null || difficulty == null) {
        res.send(404);
        return;
    }
    const waitee = await updateWaitingQuery(uuid, difficulty);
    if (waitee != null) {
        res.status(200);
        res.send(waitee);
    } else {
        res.status(204);
        res.send(waitee);
    }
})

//DELETE request
app.delete('/waiting/:uuid', async function (req, res) {
    var uuid = req.params.uuid;
    if (uuid == null) {
        res.send(404);
        return;
    } 
    const waitee = await deleteWaitingQuery(uuid);
    if (waitee != null) {
        res.status(200);
        res.send(waitee);
    } else {
        res.status(404);
        res.send(waitee);
    }
})

//Start listening on port 3000
httpServer.listen(3000, () => {
    console.log('listening on *:3000');
});