#!/usr/bin/env node

import amqp from 'amqplib';

amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('task_queue', {durable: false});

    ok = ok.then(function() { ch.prefetch(1); });
    ok = ok.then(function() {
      ch.consume('task_queue', doWork, {noAck: false});
      console.log(" [*] Waiting for messages. To exit press CTRL+C");
    });
    return ok;

    function doWork(msg) {
      var body = msg.content.toString();
      console.log(" [x] Received '%s'", body);
      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, 5 * 1000);
    }
  });
}).catch(console.warn);