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
    canvas.width = imgObj.naturalWidth;
    canvas.height = imgObj.naturalHeight;

    // Draw image on website using canvas
    ctx.drawImage(imgObj, 0, 0);

    // Encode image to Base64
    const dataURL = canvas.toDataURL();

    // Send encoded image to server
    console.log(dataURL);
  };
}
