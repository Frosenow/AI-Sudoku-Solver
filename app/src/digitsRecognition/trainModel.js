import * as tf from "@tensorflow/tfjs";
import mnist from "mnist";

const set = mnist.set(8000, 2000);

const trainData = set.training;
const testData = set.test;

console.log(trainData);
