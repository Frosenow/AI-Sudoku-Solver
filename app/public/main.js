const uploader = document.querySelector("#upload-btn");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

uploader.addEventListener("change", uploadImage);

function uploadImage() {
  const image = uploader.files[0];
  const imgObj = new Image();

  imgObj.src = URL.createObjectURL(image);
  imgObj.onload = async () => {
    // Get image size
    canvas.width = imgObj.naturalWidth;
    canvas.height = imgObj.naturalHeight;

    // Draw image on website using canvas
    ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");

    // Send encoded image to server
    fetch("/uploads", {
      method: "POST",
      body: JSON.stringify({
        dataURL: dataURL,
        width: canvas.width,
        height: canvas.height,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // Handle response
        return response.blob();
      })
      .catch((error) => {
        console.error(error);
      });
  };
}
