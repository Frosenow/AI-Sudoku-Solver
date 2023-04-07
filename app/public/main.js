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
    const aspectRatio = imgObj.naturalWidth / imgObj.naturalHeight;
    const canvasWidth = canvas.width;
    const canvasHeight = canvasWidth / aspectRatio;
    canvas.height = canvasHeight;

    // Draw image on website using canvas
    ctx.drawImage(imgObj, 0, 0, canvasWidth, canvasHeight);

    // Convert to Uint8ClampedArray and send to server
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

    const metadata = {
      width: imageData.width,
      height: imageData.height,
    };

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("data", new Blob([imageData.data.buffer]));
    // Send encoded image to server
    fetch("/uploads", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        // Handle response
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
