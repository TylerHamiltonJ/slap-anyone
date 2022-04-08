const faceClicked = (e) => {
  const imgURL = e.srcElement.getAttribute("url");
  chosenFace = e.srcElement.getAttribute("fullName");
  loadImage(imgURL, (loadedFace) => {
    faceAssets.main = loadedFace;
    faceAssets.slapLeft = loadedFace;
    faceAssets.slapRight = loadedFace;
    document.querySelector("#face-selection").style.display = "none";
    windowResized();
    resetGame();
  });
};

const loadFaces = () => {
  const grid = document.querySelector("#face-selection .grid");
  const faces = [
    { name: "Chris Rock", url: "./assets/faces/chris.png", fullName: "Chris Rock" },
    { name: "Will Smith", url: "./assets/faces/will.png", fullName: "Will Smith" },
    { name: "Putin", url: "./assets/faces/putin.png", fullName: "Putin" },
    {
      name: "Trump",
      url: "./assets/faces/trump.png",
      fullName: "Donald Trump",
    },
    { name: "Biden", url: "./assets/faces/biden.png", fullName: "Joe Biden" },
    {
      name: "Boris",
      url: "./assets/faces/boris.png",
      fullName: "Boris Johnson",
    },
    {
      name: "Pedro",
      url: "./assets/faces/pedro.png",
      fullName: "Pedro Sánchez",
    },
    {
      name: "Bolsonaro",
      url: "./assets/faces/bolsonaro.png",
      fullName: "Bolsonaro",
    },
    {
      name: "Draghi",
      url: "./assets/faces/draghi.png",
      fullName: "Mario Draghi",
    },
    { name: "Modi", url: "./assets/faces/modi.png", fullName: "Modi" },
    {
      name: "Trudeau",
      url: "./assets/faces/trudeau.png",
      fullName: "Justin Trudeau",
    },
    { name: "Kanye", url: "./assets/faces/kanye.png", fullName: "Kanye West" },
    {
      name: "Chrome Kanye",
      url: "./assets/faces/chromekanye.png",
      fullName: "Kanye West",
    },
    {
      name: "Elon Musk",
      url: "./assets/faces/elon.png",
      fullName: "Elon Musk",
    },
    {
      name: "Kim Jong Un",
      url: "./assets/faces/kimjongun.png",
      fullName: "Kim Jong Un",
    },
    { name: "Macron", url: "./assets/faces/macron.png", fullName: "Macron" },
    {
      name: "Murdoch",
      url: "./assets/faces/murdoch.png",
      fullName: "Rupert Murdoch",
    },
    {
      name: "Piers Morgan",
      url: "./assets/faces/piers.png",
      fullName: "Piers Morgan",
    },
    {
      name: "Jake Paul",
      url: "./assets/faces/jakepaul.png",
      fullName: "Jake Paul",
    },
    {
      name: "Logan Paul",
      url: "./assets/faces/loganpaul.png",
      fullName: "Logan Paul",
    },
  ];

  const customUpload = document.createElement("div");
  customUpload.innerText = "Custom Upload";
  customUpload.style.backgroundImage = `url("./assets/upload-white.png")`;
  customUpload.onclick = function () {
    document.getElementById("upload").click();
    document.querySelector("#face-selection").style.display = "none";
  };
  grid.appendChild(customUpload);

  faces.forEach((e) => {
    const block = document.createElement("div");
    block.innerText = e.name;
    block.setAttribute("url", e.url);
    block.setAttribute("fullName", e.fullName);
    block.style.backgroundImage = `url("${e.url}")`;
    grid.appendChild(block);
    block.addEventListener("click", faceClicked);
  });
};
loadFaces();

const selectFace = () => {
  const faceSelection = document.querySelector("#face-selection");
  faceSelection.style.display = "block";
};
