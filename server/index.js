import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import amqp from 'amqplib';
import redis from 'redis';

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

// Initialize a noti client that send noti to message queue hosted by local RabbitMQ server
export const messageChannel = await (await amqp.connect('amqp://localhost')).createChannel(); 
var q = 'task_queue';
await messageChannel.assertQueue(q, {durable: false});

// Initialize a redis client that cache search query results hosted by local Redis server
export const redisClient = redis.createClient();
redisClient.on("error", (error) => console.error(`Error : ${error}`));
await redisClient.connect();