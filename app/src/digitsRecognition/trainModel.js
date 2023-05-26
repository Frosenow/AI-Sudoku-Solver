const tf = require("@tensorflow/tfjs");
const tfvis = require("@tensorflow/tfjs-vis");

const mnist = tf.data.mnist;
const data = mnist.load();
const trainData = data.train;
const testData = data.test;
