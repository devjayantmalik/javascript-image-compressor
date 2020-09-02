const MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

document.addEventListener("DOMContentLoaded", () => {
  const source = document.querySelector("#source");

  source.onchange = async () => {
    // get the selected image
    let file = source.files[0];

    // check for valid file type
    if (MIME_TYPES.indexOf(file.type) === -1) {
      alert("Invalid File type selected.");
      return;
    }

    // load the image and convert it to valid url
    file = await loadImage(file);

    // get image by url
    const img = await getImageByUrl(file);

    // compress the image and get a url to converted image
    const convertedUrl = await compress(img, null, null, 0.8, MIME_TYPES[0]);

    // download the image
    downloadImage(convertedUrl, "download.jpeg");
  };
});

/*
 * @param url: url of the image
 * @return img: new Image() instance
 */

const getImageByUrl = (url) => {
  return new Promise((resolve) => {
    // create new instance
    const img = new Image();

    // resolve the promise, when image loaded
    img.onload = () => {
      return resolve(img);
    };

    // set the image source
    img.src = url;
  });
};

/*
 * @param file: file to be read, e.g: document.querySelector('#element').files[0]
 * returns url: url to the read file
 */
const loadImage = (file) => {
  return new Promise((resolve) => {
    // instiantiate file reader
    const reader = new FileReader();

    // read the file
    reader.readAsArrayBuffer(file);
    reader.addEventListener("loadend", (e) => {
      const blob = new Blob([e.target.result]);
      const url = window.URL.createObjectURL(blob);
      return resolve(url);
    });
  });
};

/*
 * @param url: url to download
 * @param filename: filename to show for download
 * @returns void
 */
const downloadImage = (url, filename) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download_file";
  link.click();
};

/*
 * @param img: html img element to use for compression, e.g <img src="" /> or new Image()
 * @param width: width of the output image
 * @param height: height of the output image
 * @param compression: compression rate, e.g: 0.7, 0.1 etc. Value must be between 0 and 1.
 * @param output: output mime type, e.g: image/jpeg, image/png
 * @return
 */

function compress(img, width = 0, height = 0, compression, outputMimeType) {
  return new Promise((resolve) => {
    // create html canvas to draw image
    const canvas = document.createElement("canvas");

    // set the canvas width and height
    canvas.width = !!width ? width : img.naturalWidth;
    canvas.height = !!height ? height : img.naturalHeight;

    // draw image on 2d context of canvas
    if (width && height)
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    else canvas.getContext("2d").drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => resolve(window.URL.createObjectURL(blob)),
      outputMimeType,
      compression
    );
  });
}
