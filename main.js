const byPassMinify = `// Hello there fellow nerd. Couldn't help sneaking a peak at the code huh?
// This project was pulled together VERY quickly, so please don't judge!
// There's some odd code choices here, but if it works, it works.
// I'll be working on cleaning it and publicly releasing soon.
// In the meantime, feel free to email info@punch-putin.com with ideas, questions, suggestions or bugs!`;

function preventBehavior(e) {
  e.preventDefault();
}

document.addEventListener("touchmove", preventBehavior, {
  passive: false,
});
function Face() {
  this.graphics = {
    loadedFace: faceAssets.main,
    face: faceAssets.main,
    slapLeft: faceAssets.slapLeft,
    slapRight: faceAssets.slapRight,
  };
  this.iWidth = 253;
  this.iHeight = 306;
  this.ratio = 2.5;
  this.padding = 30 / this.ratio;
  this.width = this.iWidth / this.ratio;
  this.height = this.iHeight / this.ratio;
  this.gravity = 0.2;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.ypos = height / 2 - this.height;
  this.xpos = W - this.width - 20;
  this.collision = false;

  this.show = function () {
    image(
      this.graphics.loadedFace,
      this.xpos,
      this.ypos,
      this.width,
      this.height
    );
    noFill();
    noStroke();
    rect(this.xpos, this.ypos, 100, 100);
  };

  this.update = function () {
    this.minY = this.height / 2;
    this.maxY = height - this.height / 2;
    // calculate gravity

    this.velocity_y = this.velocity_y + this.gravity;
    this.ypos = this.ypos + this.velocity_y;

    // calculate side movement

    this.xpos = this.xpos + this.velocity_x;
    this.velocity_x = this.velocity_x * 0.99;
  };
}

function Hand() {
  this.iHeight = 120;
  this.iWidth = 120;
  this.ratio = 1.2;
  this.height = this.iHeight / this.ratio;
  this.width = this.iWidth / this.ratio;
  this.v_speed = 0;
  this.gravity = 0.5;
  this.ypos = height / 2 - 100;
  this.xpos = 10;
  this.drag = false;
  this.v_speed_x = 0;
  this.isFish = false;
  this.angle = 0;
  const getHandImg = () => {
    if (startScreen === 1) {
      return handstart;
    }
    if (Math.random() < 0.0001 || secretCounter >= 16) {
      this.isFish = true;
      return fishHand;
    }
    if (Math.random() < 0.004) {
      return Math.random() > 0.5 ? rarehand1 : rarehand2;
    }
    return handstart;
  };
  this.img = getHandImg();
  this.startImg = this.img;
  this.onBall = function (x, y) {
    return (
      x >= this.xpos &&
      x <= this.xpos + this.width &&
      y >= this.ypos &&
      y <= this.ypos + this.height
    );
  };

  this.startDrag = function () {
    this.img = this.startImg;
    this.drag = true;
    this.mousex = mouseX;
    this.mousey = mouseY;
  };

  this.endDrag = function () {
    this.img = this.startImg;
    this.drag = false;
  };

  this.update = function () {
    this.minY = this.height / 2;
    this.maxY = height - this.height / 2;

    if (this.drag) {
      this.xpos = mouseX - this.width / 2;
      this.ypos = mouseY - this.height / 2;
      this.v_speed_x = this.v_speed_x / 2 + (mouseX - this.mousex);
      this.v_speed = this.v_speed / 2 + (mouseY - this.mousey);
      this.mousex = mouseX;
      this.mousey = mouseY;
    } else {
      if (Math.abs(this.v_speed_x) > 1) {
        this.xpos += this.v_speed_x * 0.5;
        this.v_speed_x = this.v_speed_x * 0.5;
      }
      if (Math.abs(this.v_speed) > 1) {
        this.ypos += this.v_speed * 0.5;
        this.v_speed = this.v_speed * 0.5;
      }
    }

    this.angle = this.v_speed_x;
  };

  this.show = function () {
    rotate_and_draw_image(
      this.img,
      this.xpos,
      this.ypos,
      this.width,
      this.height,
      this.angle
    );
    noFill();
    noStroke();
    rect(this.xpos, this.ypos, 100, 100);
  };
}

var face;
var hand;

let isAprilFools = false;
let disableAprilFools = false;
let uiError = false;
let metric = true;
let startScreen = 0;
let container = document.getElementById("container");
let W = container.getBoundingClientRect().width;
let H = container.getBoundingClientRect().height;
let secretCounter = 0;
let faceAssets = {};

function removeStartScreen() {
  let socials = document.getElementById("socials");
  let donation = document.getElementById("donation");
  socials.style.fontSize = "1.05rem";
  donation.style.fontSize = "1.05rem";
  startScreen = 0;
  // if (isAprilFools) {
  //   document.getElementById("april-fools").classList.toggle("banner-drop-in");
  // }
}

function mousePressed() {
  if (startScreen === 1) {
    removeStartScreen();
  }

  if (hand.onBall(mouseX, mouseY)) hand.startDrag();
}

function touchStarted() {
  if (startScreen === 1) {
    removeStartScreen();
    window.navigator.getUserMedia = (...args) =>
      window.navigator.mediaDevices.getUserMedia(...args);
    userStartAudio();
  }
  userStartAudio();
  if (hand.onBall(mouseX, mouseY)) hand.startDrag();
}

function mouseReleased() {
  if (
    !(
      hand.xpos < face.xpos + face.height &&
      hand.xpos + hand.height > face.xpos &&
      hand.ypos < face.ypos + face.height &&
      hand.height + hand.ypos > face.ypos
    )
  ) {
  }
  if (hand.xpos < 0 || hand.xpos > W || hand.ypos < 0 || hand.ypos > H) {
    hand = new Hand();
  }
  hand.endDrag();
}
function preload() {
  gameFont = loadFont("./assets/Molot.otf");
  slapsfx0 = loadSound("./assets/slap_str0.mp3");
  slapsfx1 = loadSound("./assets/slap_str1.mp3");
  slapsfx2 = loadSound("./assets/slap_str2.mp3");
  slapsfx3 = loadSound("./assets/slap_str3.mp3");
  slapsfx4 = loadSound("./assets/slap_str4.mp3");
  slapsfx5 = loadSound("./assets/slap_str5.mp3");
  slapsfxfish = loadSound("./assets/slap_fish.mp3");
  ready = createAudio("./assets/ready.wav");
  jiggy = loadSound("./assets/jiggy.mp3");
  loadingBuffer = loadImage("./assets/loading-buffering.gif");
  // Putin Faces
  faceAssets = {
    main: loadImage("assets/putin.png"),
    slapLeft: loadImage("assets/putin_slap_l.png"),
    slapRight: loadImage("assets/putin_slap_r.png"),
  };
  // Hands
  handstart = loadImage("assets/hand2.png");
  rarehand1 = loadImage("assets/rarehand1.png");
  rarehand2 = loadImage("assets/rarehand2.png");
  fishHand = loadImage("assets/fish.png");
  fishHandMove = loadImage("assets/fish2.png");
}

function setup() {
  var cnv = createCanvas(W, H);
  cnv.parent("container");
  cnv.style("z-index", "0");
  cnv.style("position", "absolute");
  cnv.style("left", "50%");
  cnv.style("top", "50%");
  cnv.style("transform", "translate(-50%, -50%)");
  const speedUnits = metric ? "km/h" : "mph";
  let twitter = document.getElementById("twitter");
  let facebook = document.getElementById("facebook");

  let speed = 0;
  twitter.href = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fpunch-putin.com&text=I%20punched%20Putin%20${speed}${speedUnits}%21&hashtags=PunchPutin`;
  facebook.href = `http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpunch-putin.com&quote=I%20punched%20Putin%20${speed}${speedUnits}%21`;
  ready.volume(0.4);
  ready.play();
  hand = new Hand();
  face = new Face();
  if (W <= 500) {
    startScreen = 1;
  }
}
function initScreen() {
  background(250, 250, 250);
  // fill('rgba(250,250,250,0.7)');
  textAlign(CENTER);
  image(hand.img, W / 2 - 100, H / 2 - 100, 200, 200);
  fill("#005BBB");
  textSize(W / 15);
  textFont(gameFont);
  text("How fast can you punch", W / 2, H / 2 - 200);
  textAlign(CENTER, CENTER);

  textSize(W / 9);
  text("PUTIN?", W / 2, H / 2 - 150);

  textSize(W / 15);
  text("Tap to start.", W / 2, H / 2 + 150);
}
function resetGame() {
  let socials = document.getElementById("socials");
  socials.style.fontSize = "1.05rem";
  ready.play();
  // button.remove();
  hand = new Hand();
  face = new Face();
  score.style.transition = ".2s";
  score.style.fontSize = "50px";
  score.style.color = "rgba(0, 0, 0, 0.5)";
  score.innerHTML = `0${metric ? "km/h" : "mph"}`;
}

function rotate_and_draw_image(
  imgURL,
  img_x,
  img_y,
  img_width,
  img_height,
  img_angle
) {
  imageMode(CENTER);
  translate(img_x + img_width / 2, img_y + img_width / 2);
  rotate((PI / 180) * img_angle);
  image(imgURL, 0, 0, img_width, img_height);
  rotate((-PI / 180) * img_angle);
  translate(-(img_x + img_width / 2), -(img_y + img_width / 2));
  imageMode(CORNER);
}

function draw() {
  try {
    checkMutations();
  } catch (err) {
    if (!uiError) {
      console.log("Error with UI", err);
      uiError = true;
    }
  }
  clear();

  hand.update();
  hand.show();
  face.show();
  if (startScreen === 1) {
    let socials = document.getElementById("socials");
    let donation = document.getElementById("donation");
    socials.style.fontSize = "0rem";
    donation.style.fontSize = "0rem";
    initScreen();
  }
  if (
    ((hand.xpos < face.xpos + face.height + face.padding &&
      hand.xpos + hand.height - face.padding > face.xpos &&
      hand.ypos < face.ypos + face.height &&
      hand.height + hand.ypos > face.ypos) ||
      hand.xpos > W) &&
    face.collision === false
  ) {
    face.velocity_x = hand.v_speed_x * 0.1;
    face.velocity_y = hand.v_speed * 0.1;
    face.collision = true;
    const velocity = Math.sqrt(
      Math.pow(face.velocity_y, 2) + Math.pow(face.velocity_x, 2)
    );
    const speedFloat = (W < 900 ? velocity * 1.1 : velocity * 0.4) * 1.728;

    let totalHits = parseInt(localStorage.getItem("totalHits")) || 0;
    let maxSpeed = parseInt(localStorage.getItem("maxSpeed")) || 0;
    let record = speedFloat > maxSpeed ? speedFloat : maxSpeed;

    totalHits += 1;
    localStorage.setItem("totalHits", totalHits);
    localStorage.setItem("maxSpeed", record);
    const speed = metric
      ? Math.floor(speedFloat)
      : Math.floor(speedFloat / 1.609);
    const speedUnits = metric ? "km/h" : "mph";
    score.innerHTML = `${speed}${speedUnits}`;

    let twitter = document.getElementById("twitter");
    let facebook = document.getElementById("facebook");
    twitter.href = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fpunch-putin.com&text=I%20punched%20Putin%20${speed}${speedUnits}%21&hashtags=PunchPutin`;
    facebook.href = `http://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpunch-putin.com&quote=I%20punched%20Putin%20${speed}${speedUnits}%21`;
    jiggy.stop();

    score.style.transition = ".2s";

    if (hand.isFish) {
      slapsfxfish.play();
    }
    face.graphics.loadedFace =
      hand.v_speed_x < 0 ? face.graphics.slapLeft : face.graphics.slapRight;
    let socials = document.getElementById("socials");
    if (speedFloat >= 50) {
      socials.style.fontSize = "1.2rem";
      slapsfx5.play();
      jiggy.play();
      score.style.fontSize = "80px";
      score.style.color = "#22e51d";
    } else if (speedFloat > 40) {
      slapsfx4.play();
      score.style.fontSize = "70px";
      score.style.color = "#005BBB";
    } else if (speedFloat > 30) {
      slapsfx3.play();
      score.style.fontSize = "60px";
      score.style.color = "#005BBB";
    } else if (speedFloat > 20) {
      slapsfx2.play();
      score.style.fontSize = "50px";
      score.style.color = "#005BBB";
    } else if (speedFloat > 10) {
      slapsfx2.play();
      score.style.fontSize = "40px";
      score.style.color = "#005BBB";
    } else if (speedFloat > 5) {
      slapsfx1.play();
      score.style.fontSize = "30px";
      score.style.color = "#005BBB";
    } else {
      slapsfx0.play();
      score.style.fontSize = "20px";
      score.style.color = "#005BBB";
    }
    setTimeout(function () {
      resetGame();
    }, 2000);
  }
  if (face.collision === true) {
    face.update();
  }
}
function swapUnit() {
  secretCounter += 1;
  if (secretCounter === 16) {
    slapsfxfish.play();
    resetGame();
  }
  if (metric === true) {
    metric = false;
    document.getElementById("units").innerText = "PUNCH IN KPH.";
  } else {
    metric = true;
    document.getElementById("units").innerText = "PUNCH IN MPH 🇺🇸";
  }
  score.innerHTML = `0${metric ? "km/h" : "mph"}`;
}

function toggleAprilFools() {
  disableAprilFools = !disableAprilFools;
  document.getElementById("april-fools").classList.toggle("banner-drop-in");
  resetGame();
}

function windowResized() {
  W = container.getBoundingClientRect().width;
  H = container.getBoundingClientRect().height;
  resizeCanvas(W, H);

  hand = new Hand();
  face = new Face();
}

document.getElementById("upload").onchange = async function () {
  async function handleLoad() {
    const composingCanvas =
      iframe.contentWindow.document.getElementById("composingCanvas");
    const croppedface = await polygonCrop(urlOfImageFile, composingCanvas);
    const loadedFace = loadImage(croppedface);

    faceAssets.main = loadedFace;
    faceAssets.slapLeft = loadedFace;
    faceAssets.slapRight = loadedFace;

    windowResized();
    resetGame();
    iframe.remove();
  }

  const myImageFile = this.files[0];
  let urlOfImageFile = URL.createObjectURL(myImageFile);
  faceAssets.main = loadingBuffer;
  // prepareFrame("./remove");
  prepareFrame("./canvas");
  const iframe = document.getElementById("createGraphic");
  iframe.addEventListener("load", handleLoad, true);
};
