import express from "express";
import fs from "fs";
import * as canvas from "canvas";
import bodyParser from "body-parser";
import processor from "../dist/imageProcessing/imageProcessor.js";

// Default setup
const app = express();
app.use(express.static("./public"));
app.use(bodyParser.json({ limit: "20mb" }));

// Setting view rendering engine
app.set("view engine", "ejs");

// Set value of the PORT
const PORT = process.env.PORT || 8000;

// Set the server to listen on the PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// Routing to main site
app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Routing to about page
app.get("/about.ejs", (req, res) => {
  res.render("about.ejs");
});

// Handle the image upload
app.post("/uploads", async (req, res) => {
  // Deconstruct image data
  const { dataURL, width, height } = req.body;

  // load base64 image to canvas to get ImageData
  const img = await canvas.loadImage(dataURL);
  const canvasObj = canvas.createCanvas(width, height);
  const ctx = canvasObj.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, width, height);

  const imageObject = {
    data: imageData.data,
    width: width,
    height: height,
  };

  // Run image processing algorithms
  const sudokuBoxes = await processor(imageObject);
  res.json(sudokuBoxes);
});
