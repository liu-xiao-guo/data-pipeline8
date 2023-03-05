// import { Kafka, logLevel } from "kafkajs";
const { Kafka } = require('kafkajs');
const logLevel = require("kafkajs");

// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require('uuid');

console.log(uuidv4());

const kafka = new Kafka({
  clientId: "random-producer",
  brokers: ["localhost:9092"],
  connectionTimeout: 3000,
});

var randomstring = require("randomstring");
var randomMobile = require("random-mobile");
const producer = kafka.producer({});
const topic = "kafka_logstash";

const produce = async () => {
  await producer.connect();
  let i = 0;

  setInterval(async () => {
    var event = {};
    try {
      event = {
        globalId: uuidv4(),
        event: "USER-CREATED",
        data: {
          id: uuidv4(),
          firstName: randomstring.generate(8),
          lastName: randomstring.generate(6),
          country: "China",
          email: randomstring.generate(10) + "@gmail.com",
          phoneNumber: randomMobile(),
          city: "Hyderabad",
          createdAt: new Date(),
        },
      };

      await producer.send({
        topic,
        acks: 1,
        messages: [
          {
            value: JSON.stringify(event),
          },
        ],
      });

      // if the message is written successfully, log it and increment `i`
      console.log("writes: ", event);
      i++;

    } catch (err) {
      console.error("could not write message " + err);
    }
  }, 5000);
};

produce().catch(console.log)