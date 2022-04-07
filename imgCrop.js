const MODEL_URL = "./scripts/weights";

function prepareFrame(url) {
  var ifrm = document.createElement("iframe");
  ifrm.setAttribute("id", "createGraphic");
  if (W <= 500) {
    ifrm.style.width = "100vw";
    ifrm.height = "100%";
    ifrm.style.top = "0";
    ifrm.style.left = "0";
    ifrm.style.zIndex = 10;
    ifrm.style.transform = "translate(0,0)";
  } else {
    ifrm.width = W;
    ifrm.style.zIndex = 10;
    ifrm.style.top = "50%";
    ifrm.style.left = "50%";
    ifrm.height = H;
    ifrm.style.transform = "translate(-50%, -50%)";
  }
  ifrm.style.border = "0";
  ifrm.style.position = "absolute";
  ifrm.setAttribute("src", url);

  document.body.appendChild(ifrm);
  return ifrm;
}

async function fileToGrid() {
  const selectedFile = document.getElementById("imageUpload");
  const myImageFile = selectedFile.files[0];
  let urlOfImageFile = URL.createObjectURL(myImageFile);
  const imgContainer = document.getElementById("picture");
  const loadedImage = loadImage(urlOfImageFile);
  imageObject.url = loadImage(urlOfImageFile);
  imgContainer.src = urlOfImageFile;

  backgroundRemoval(loadedImage);
  //   const input = document.getElementById("picture");

  //   console.log("Attempting face api");
  //   let fullFaceDescriptions = await faceapi
  //     .detectSingleFace(input)
  //     .withFaceLandmarks();

  //   extractFaceFromBox(input, fullFaceDescriptions.box);
  //   console.log(fullFaceDescriptions);
  //   console.log(fullFaceDescriptions.landmarks.getJawOutline());
  //   imageObject.sx = fullFaceDescriptions.alignedRect.box.x;
  //   imageObject.sy = fullFaceDescriptions.alignedRect.box.y;
  //   imageObject.width = fullFaceDescriptions.detection.imageWidth;
  //   imageObject.height = fullFaceDescriptions.detection.imageHeight;
  //   imageObject.sw = fullFaceDescriptions.alignedRect.box.width;
  //   imageObject.sh = fullFaceDescriptions.alignedRect.box.height;
  //   imageObject.path = [
  //     ...fullFaceDescriptions.landmarks.getJawOutline(),
  //     ...fullFaceDescriptions.landmarks.getRightEyeBrow().reverse(),
  //     ...fullFaceDescriptions.landmarks.getLeftEyeBrow().reverse(),
  //   ];
  //   imageObject.cropped = true;
  //   console.log({ imageObject });
}

function getCanvasBlob(canvas) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}

async function compositeFrame(canvas, backgroundDarkeningMask, original) {
  return new Promise(async (resolve, reject) => {
    canvas.width = backgroundDarkeningMask.width;
    canvas.height = backgroundDarkeningMask.height;
    if (!backgroundDarkeningMask) return;
    // grab canvas holding the bg image
    var ctx = canvas.getContext("2d");
    // composite the segmentation mask on top
    ctx.globalCompositeOperation = "destination-over";
    ctx.putImageData(backgroundDarkeningMask, 0, 0);
    // composite the video frame
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(
      original,
      0,
      0,
      backgroundDarkeningMask.width,
      backgroundDarkeningMask.height
    );
    const newImgURL = await getCanvasBlob(canvas);
    return resolve(newImgURL);
  });
}

// FACE API STUFF
const backgroundRemoval = async (uploadedImg, canvas) => {
  const imgContainer = new Image();
  imgContainer.src = uploadedImg;
  const net = await bodyPix.load({
    architecture: "MobileNetV1",
    outputStride: 16,
    multiplier: 0.75,
    quantBytes: 2,
  });
  const segmentation = await net.segmentPerson(imgContainer, {
    internalResolution: "full",
    segmentationThreshold: 0.7,
    scoreTreshold: 0.35,
    maxDetections: 1000,
  });
  const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
  const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
  const backgroundDarkeningMask = bodyPix.toMask(
    segmentation,
    foregroundColor,
    backgroundColor,
    false
  );
  const croppedImg = await compositeFrame(
    canvas,
    backgroundDarkeningMask,
    imgContainer
  );
  return croppedImg;
};
