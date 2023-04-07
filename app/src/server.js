const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const { convertToGrayscale } = require("../dist/greyscale");

// Default setup
const app = express();
app.use(express.static("./public"));
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));

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
app.post("/uploads", (req, res) => {
  const image = req.body;
  // If no image submitted, exit
  if (!image) return res.sendStatus(400);

  // Image processing algorithms
  convertToGrayscale(image.baseString);

  // // Move the image to  upload folder
  // // image.mv(__dirname + '/upload/' + image.name);
  // res.sendStatus(200);
});
