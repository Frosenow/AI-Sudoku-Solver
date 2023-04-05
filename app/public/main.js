const uploader = document.querySelector("#upload-btn");
const canvas = document.querySelector("#canvas");

const ctx = canvas.getContext("2d");

uploader.addEventListener("change", uploadImage);

function uploadImage() {
  const image = uploader.files[0];
  const imgObj = new Image();

  imgObj.src = URL.createObjectURL(image);
  imgObj.onload = () => {
    ctx.drawImage(imgObj, 0, 0);
    const dataURL = canvas.toDataURL();
    // send URL to server
    console.log(dataURL);
  };
}
