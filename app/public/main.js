const uploader = document.querySelector("#upload-btn");
const canvas = document.querySelector("#canvas");

const ctx = canvas.getContext("2d");

uploader.addEventListener("change", uploadImage);

function uploadImage() {
  const image = uploader.files[0];
  const imgObj = new Image();

  imgObj.src = URL.createObjectURL(image);
  imgObj.onload = () => {
    // Set canvas to image image width and size
    // TODO: Calculate ratio to scale image
    // Because now image size is to big
    const aspectRatio = imgObj.naturalWidth / imgObj.naturalHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvasWidth / aspectRatio;
    canvas.height = canvasHeight;

    // Draw image on website using canvas
    ctx.drawImage(imgObj, 0, 0, canvasWidth, canvasHeight);

    // Encode image to Base64
    const Base64Image = canvas.toDataURL();

    // Send encoded image to server
    fetch("/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: Base64Image }),
    })
      .then((response) => {
        // Handle response
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
