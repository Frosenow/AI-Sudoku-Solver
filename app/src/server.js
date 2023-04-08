const express = require("express");
const fs = require("fs");
const canvas = require("canvas");
const bodyParser = require("body-parser");
const { convertToGrayscale } = require("../dist/greyscale");
const { boxBlur } = require("../dist/boxblur");

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

// Handle the image upload
app.post("/uploads", async (req, res) => {
  // If no image submitted, exit
  // if (!req.file) return res.sendStatus(400);

  const { dataURL, width, height } = req.body;

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

  // Image processing algorithms
  async function Process() {
    const grayscaleImg = await convertToGrayscale(imageObject);
    const bluerd = boxBlur(grayscaleImg, 10);
  }
  Process();

  // res.sendStatus(200);
});
