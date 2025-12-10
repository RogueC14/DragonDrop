let newX = 0, newY = 0;
let startX = 0, startY = 0;

let noMoveBubble = 0;

// Falling Dragon Interval
let DropDragon = null;
// Falling Dragon Rotation
let RotDragon = 0;

// Prevent Dragging Unless On Dragon
let DragTheDragon = false;

// Prevention Of Repeating Same Dragon
let AncientDragon = 0;

const Dragon = document.getElementById("dragon");
const Bubble = document.getElementById("bubble");
const Platform = document.getElementById("platform");

const ContainTheChaos = document.getElementById("cont");
const BoxDragon = Dragon.getBoundingClientRect();
const Box = ContainTheChaos.getBoundingClientRect();
const Noises = [new Audio("assets/R2D2Scream.mp3"), new Audio("assets/MarioScream.mp3"), new Audio("assets/LinkScream.mp3")];
let newNoise = 0;
let oldNoise = 0;
let noise = null;

let dragonZoom = 20;
let crawl = 8;
const Zoom = document.getElementById("zoomButton");
Zoom.onclick = () => {
    dragonZoom += 20;
    crawl += 8;
    if (dragonZoom > 60) {
        dragonZoom = 20;
        crawl = 8;
    }
    Zoom.textContent = `Dragon Speed:${dragonZoom}x`;
}
const Instructions = document.getElementById("instructions");
const ToggleButton = document.getElementById("instToggle");
ToggleButton.onclick = () => {
    Instructions.classList.toggle("show");
};

window.onload = () => genDragon();

ContainTheChaos.addEventListener("click", function (e) {
    console.log(e.clientX);
    console.log(Bubble.offsetLeft);
});

// Contain Speech Bubble
function updateBubbleX() {
    const dragonCenter = Dragon.offsetLeft + Dragon.offsetWidth / 2;

    // clamp bubble X
    const minX = 0;
    const maxX = window.innerWidth - Bubble.offsetWidth;

    const clampedX = Math.max(minX, Math.min(dragonCenter, maxX));

    Bubble.style.left = clampedX + "px";
}


function PerchTheDragon() {
    const Plat = Platform.getBoundingClientRect();
    const Boxxy = ContainTheChaos.getBoundingClientRect();
    const Righty = Plat.left - Boxxy.left + (Plat.width / 2) - (Dragon.offsetWidth / 2);
    const Topy = Plat.top - Boxxy.top - Dragon.offsetHeight;

    Dragon.style.left = Righty + "px";
    Dragon.style.top = Topy + "px";
    Bubble.style.top = (Topy - 40) + "px";
    updateBubbleX();


}
// Randomize Dragon Image
function genDragon() {
    if (DropDragon) {
        clearInterval(DropDragon);
        DropDragon = null;
    }
    const Dragons = ["assets/dragon1.svg", "assets/dragon2.svg", "assets/dragon3.svg", "assets/dragon4.svg", "assets/dragon5.svg", "assets/dragon6.svg"];
    const ChosenDragon = Math.floor(Math.random() * Dragons.length);
    if (AncientDragon == ChosenDragon) {
        genDragon();
    }
    console.log(ChosenDragon);
    Dragon.style.backgroundImage = `url(${Dragons[ChosenDragon]})`;
    Dragon.style.backgroundSize = "contain";
    Dragon.style.backgroundRepeat = "no-repeat";
    Dragon.style.backgroundPosition = "center center";
    AncientDragon = ChosenDragon;
    getNoise();
    PerchTheDragon();

}
function getNoise() {
    newNoise = Math.floor(Math.random() * Noises.length);
    if (oldNoise == newNoise) {
        getNoise();
    }
    noise = Noises[newNoise];
    oldNoise = newNoise;


}
// Actual Dropping of Dragons
Dragon.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
function dropDragon() {
    const cont = ContainTheChaos;
    const dragon = Dragon;

    const contHeight = cont.offsetHeight;
    const dragonHeight = dragon.offsetHeight;

    let y = dragon.offsetTop;


    noise.currentTime = 0;
    noise.playbackRate = dragonZoom / 20;
    noise.play();
    // FALLING
    const fall = setInterval(() => {
        y += dragonZoom;


        // reached bottom
        if (y > contHeight - dragonHeight) {
            y = contHeight - dragonHeight;
            dragon.style.top = y + "px";
            dragon.style.transform = 'rotate(0deg)';
            clearInterval(fall);
            if (noise) {
                noise.pause();
                noise.currentTime = 0;
            }

            // start sliding left
            slideDragonLeft();
        } else {

            dragon.style.top = y + "px";
            if (dragonZoom == 20) {
                dragon.style.transform += 'rotate(10deg)';
            }
            else if (dragonZoom == 40) {
                dragon.style.transform += 'rotate(30deg)';
            }
            else {
                dragon.style.transform += 'rotate(50deg)';
            }
        }

        // keep bubble attached
        updateBubbleX();
    }, 50);
}
function slideDragonLeft() {
    const dragon = Dragon;
    const BubbleBox = Bubble.getBoundingClientRect();
    let x = dragon.offsetLeft;
    Bubble.style.opacity = 0;
    noMoveBubble = parseFloat(Bubble.style.left);
    const DaWords = ["Never Again...", "AGAINNN!", "That was rude.", "I'm telling Mama", "...", "That hurt my tail..."];
    const Speech = Math.floor(Math.random() * DaWords.length);
    const slide = setInterval(() => {
        Bubble.textContent = `${DaWords[Speech]}`;
        Bubble.style.opacity = 1;
        x -= crawl;
        dragon.style.left = x + "px";

        // fully off-screen
        if (x <= -dragon.offsetWidth) {
            clearInterval(slide);
            Bubble.style.opacity = 0;
            resetPos();
        }
        // bubble follows
        console.log("Speech:", Speech)
        console.log("BubbleBox:", BubbleBox.left);
        console.log("Bubble Widht:", Bubble.offsetWidth);
        console.log("Bubble:", Bubble.offsetLeft);
        console.log("Box Offert", Box.offsetLeft);
        console.log(Box.left);
        Bubble.style.top = (dragon.offsetTop - 40) + "px";
        Bubble.style.left = Box.offsetWidth;
    }, 30);
}

function mouseDown(e) {
    DragTheDragon = true;
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener("mousemove", mouseMove);
}
function mouseMove(e) {
    if (!DragTheDragon) return;
    const ConstDrag = ContainTheChaos.getBoundingClientRect();
    const Drags = Dragon.getBoundingClientRect();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let lefty = Dragon.offsetLeft + dx;
    let topy = Dragon.offsetTop + dy;
    // Sidey Sidey
    if (Drags.left + dx > ConstDrag.left && Drags.right + dx < ConstDrag.right) {
        Dragon.style.left = lefty + "px";
    }
    //Uppy
    if (Drags.top + dy > ConstDrag.top) {
        Dragon.style.top = topy + "px";
    }
    startX = e.clientX;
    startY = e.clientY;
    Bubble.style.top = (Dragon.offsetTop - 40) + "px";
    updateBubbleX();
}

function mouseUp(e) {
    if (!DragTheDragon) return;
    DragTheDragon = false;
    // Speech Bubble Appear
    const DaWords = ["AHHH!", "NOT AGAINNN!", "WHEEE!", "SAVE MEEEE!", "FALLINGGGG!", "THIS ISN'T FLYING!"];
    const Speech = Math.floor(Math.random() * DaWords.length);
    Bubble.textContent = `${DaWords[Speech]}`;
    Bubble.style.opacity = 1;
    document.removeEventListener("mousemove", mouseMove);
    dropDragon();
}

// Resetty Spegetti (Reset Position)
function resetPos() {
    Bubble.style.opacity = 0;
    Dragon.style.transform = 'rotate(0deg)';
    RotDragon = 0;
    genDragon();
}
