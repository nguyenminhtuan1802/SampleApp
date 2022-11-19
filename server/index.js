import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import amqp from 'amqplib';

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

import dotenv from 'dotenv'
dotenv.config();

const app = express();

app.use(bodyParser.json({limit : "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit : "30mb", extended: true}));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

// const connection = await amqp.connect('amqp://localhost');
//     .then(function(conn) {    
//     conn.createChannel().then(function(ch) {
//         var q = 'task_queue';
    
//         var ok = ch.assertQueue(q, {durable: false});
    
//         ok.then(function(_qok) {
//             export ch;
//         // NB: `sentToQueue` and `publish` both return a boolean
//         // indicating whether it's OK to send again straight away, or
//         // (when `false`) that you should wait for the event `'drain'`
//         // to fire before writing again. We're just doing the one write,
//         // so we'll ignore it.
//         var msg = ["First.", "Second..", "Third...", "Fourth....", "Fifth....."];
//         for (let i = 0; i < msg.length; i++) {
//             ch.sendToQueue(q, Buffer.from(msg[i]), {deliveryMode: true});
//             console.log(" [x] Sent '%s'", msg[i]);            
//         }
//         console.log("channel closing")
//         return ch.close();
//         });
//     })//.finally(function() { console.log("connection closing"); conn.close(); });
// }).catch(console.warn);

// (async () => {
//     export const channel = await (await amqp.connect('amqp://localhost')).createChannel(); 
//     var q = 'task_queue';
//     await channel.assertQueue(q, {durable: false});
// })();

export const messageChannel = await (await amqp.connect('amqp://localhost')).createChannel(); 
var q = 'task_queue';
await messageChannel.assertQueue(q, {durable: false});
