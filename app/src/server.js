const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const { convertToGrayscale } = require("../dist/greyscale");

// Default setup
const app = express();
app.use(express.static("./public"));
app.use(bodyParser.json({ limit: "20mb" }));

// Middleware to handle files uploads using Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
app.post("/uploads", upload.single("data"), (req, res) => {
  const metadata = JSON.parse(req.body.metadata);
  // Converting buffer to Uint8ClampedArray
  const imageData = new Uint8ClampedArray(req.file.buffer);
  // If no image submitted, exit
  if (!req.file) return res.sendStatus(400);

  const imageObject = {
    data: imageData,
    width: metadata.width,
    height: metadata.height,
  };

  // Image processing algorithms
  convertToGrayscale(imageObject);
  // res.sendStatus(200);
});
