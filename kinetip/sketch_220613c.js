/* jshint esversion: 8 */

// UI ELEMENTS
let drawMode = true;
let value = 0;
let slots = [];
let keys = [];
let menuContainer;
let canvasContainer;
let processLetter;
let menuButton;
let gigantLetter;
let handlee;
let inter;
let kinetip;
let arrow;
let bottomMessage;
let confirmImage;
let helpScreen;
let winScreen;
let loseScreen;
let rejectImage;
let resumeGameButton;
let newGameButton;
let changeHandButton;
let cursor;
let eraser;
let click;
let pencil;
let handOk;
let handCancel;
let processTextTitle;
let processTextSubtitle;
let processErrorText;
let processingText;
let closingButton;
let dominantHand = "Right";
let nonDominantHand = "Left";
let menuBottomElement;

// GAME CONFIGURATION
const characters = "abcdefghijklmnopqrstuvwxy";
const charactersWhiteList =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const numberOfLetters = 5;
const numberOfAttempts = 6;
const wordsPath = "filtered_words.csv";

// USEFUL FLAGS
let currentAttempt = 1;
let inGame = false;
let wordTable;
let wordList = [];
let wordToGuess;
let wordToCheck;
let usedWords = [];
let win = false;
let lose = false;
let currentWordRow = [];
let currentWord = Array(numberOfLetters).fill("");
let currentMode = Array(numberOfLetters).fill("empty");
let currentKeyMode = Array(characters.length).fill("empty");
let allSlotsMode = Array(numberOfLetters * numberOfAttempts).fill("empty");
let allLetters = Array(numberOfLetters * numberOfAttempts).fill("");
let currentLetterWord = 0;
let hasCheckedLetter = false;
let hasCheckedWord = false;
let hasFinishedGame = false;
let guessedLetter = [];
let letterToShow = "";
let selectedMenuButton = false;
let selectedHelpButton = false;
let openWindow = false;
let goodLuck = "Good luck with your next guess!"// Held og lykke med dit næste gæt";
let keepTrying = "Keep trying!";//"Kom igen!";
let niceTry = "Good guess! Try with a new word"; //Godt forsøgt! Prøv med et nyt ord";
let randomSentences = [
  niceTry,
  keepTrying,
  goodLuck,
"",
  "You have already guessed this word",
];
let systemRecognice = "We have recognized this letter:" //Vi har genkendt dette bogstav:";
let isThisLetter = "Does it match the letter you drew?"; //Svarer det til bogstavet du skrev?";
let oops = "Oops... We can't recognise the letter. Draw it again!"; //"Ups… Dette bogstav kunne ikke genkendes. Prøv at tegn det igen!";
let loading = "Recognising letter..." ; //Genkender bogstav…";
let randW = 3;
let processing = false;

// CURSOR
let xp = 0;
let yp = 0;
let hx;
let hy;
let hands;

// HAND MODE
let mode;

// CANVAS
let drawCanvas;

// TESSERACT
let tesseractWorker;

// REQUESTS
// var url_string; = window.location.href; //window.location.href
// var url; = new URL(window.location.href);
// var token; = url.searchParams.get("token");
// console.log(token);

function startGame() {
  // Get random word
  for (let w = 0; w < wordTable.getRowCount(); w++) {
    wordList.push(wordTable.getRow(w).arr[0]);
  }

  let rand = Math.floor(Math.random() * (wordTable.getRowCount() + 1));
  wordToGuess = wordTable.getString(rand, 0).toUpperCase();
  console.log(wordToGuess);
  dominantHand = "Right";
  nonDominantHand = "Left";
}

function endGame() {
  var finalMessage = "";

  // Stop timer
  if (win == true) {
    finalMessage =
      "Congratulations! you guessed the word.\nTotal attempts:" +
      String(numberOfAttempts);
  } else {
    lose = true;
    finalMessage = "The word was " + wordToGuess + ". Better luck next time!";
  }
  finalMessage += "\nDo you want to guess another word?";
  console.log(finalMessage);
}

function checkWord() {
  // For each element in current word, check and update current mode
  if (!usedWords.includes(wordToCheck.join(""))) {
    // ADD word to usedWords
    usedWords.push(wordToCheck.join(""));
    // CHECK letter by letter
    for (let col = 0; col < numberOfLetters; col++) {
      let index = characters.indexOf(wordToCheck[col].toLowerCase());

      if (wordToCheck[col] == wordToGuess[col]) {
        currentMode[col] = "correct";
        currentKeyMode[index] = "correct";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "correct";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] =
          wordToCheck[col];
      } else if (wordToGuess.includes(wordToCheck[col])) {
        currentMode[col] = "semi";
        currentKeyMode[index] = "semi";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "semi";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] =
          wordToCheck[col];
      } else {
        currentMode[col] = "error";
        currentKeyMode[index] = "error";
        allSlotsMode[(currentAttempt - 1) * numberOfLetters + col] = "error";
        allLetters[(currentAttempt - 1) * numberOfLetters + col] =
          wordToCheck[col];
      }
    }
    //Show message
    randW = Math.floor(Math.random() * (3 + 1));
  } else {
    randW = 4; // THE WORD HAS ALREADY BEEN USED
  }

  // SHOW WORDS
  for (let row = 0; row < numberOfAttempts; row++) {
    for (let col = 0; col < numberOfLetters; col++) {
      slots[row][col].show(
        allLetters[row * numberOfLetters + col],
        allSlotsMode[row * numberOfLetters + col]
      );
    }
  }

  if (wordToGuess == currentWord.join("")) {
    win = true;
    endGame();
  }
}

const s1 = (g) => {
  g.preload = () => {
    wordTable = g.loadTable(wordsPath);
    kinetip = g.loadImage("Kinetip.png");
    arrow = g.loadImage("arrow.png");
  };

  g.drawGrid = () => {
    g.noStroke();
    g.fill(128);

    // SHOW WORDS
    for (let row = 0; row < numberOfAttempts; row++) {
      for (let col = 0; col < numberOfLetters; col++) {
        slots[row][col].show(
          allLetters[row * numberOfLetters + col],
          allSlotsMode[row * numberOfLetters + col]
        );
      }
    }

    // SHOW KEYBOARD
    for (let letter = 0; letter < characters.length; letter++) {
      keys[letter].show(currentKeyMode[letter]);
    }

    bottomMessage.show(randomSentences[randW]);

    //Show arrow
    g.image(
      arrow,
      (canvasWidth / 2.5) * 2,
      (document.documentElement.clientHeight / 10) * 8.3
    );

    // SHOW LOGO
    //g.imageMode(g.CENTER);
    g.image(
      kinetip,
      canvasWidth / 2.5 +
        (document.getElementById("canvas_grid").offsetWidth / 15) * 1.2,
      document.documentElement.clientHeight / 18
    );
  };
  g.setup = () => {
    keys = [];
    slots = [];

    canvasWidth = document.getElementById("canvas_grid").offsetWidth;
    canvasHeight = document.documentElement.clientHeight;
    g.createCanvas(canvasWidth, canvasHeight);
    g.background(250);

    // DEFINE WORD CELLS
    size = document.getElementById("canvas_grid").offsetWidth / 15;
    for (let row = 0; row < numberOfAttempts; row++) {
      slots.push([]);
      y = row * (size + size / 4) + canvasHeight / 5;
      for (let col = 0; col < numberOfLetters; col++) {
        x = canvasWidth / 2.5 + col * 1.2 * size;
        slots[row].push(new Slot(x, y, size, row, col, g));
      }
    }

    keySize = document.getElementById("canvas_grid").offsetWidth / 26;

    //  DEFINE KEYBOARD (IN 3 COLUMNS)
    for (let i = 0; i < 10; i++) {
      letter = characters.charAt(i);
      x = 1 * (keySize + keySize / 4) + canvasWidth / 10;
      y = canvasHeight / 4 + i * (keySize + keySize / 5);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }
    for (let i = 10; i < 20; i++) {
      letter = characters.charAt(i);
      x = 2 * (keySize + keySize / 4) + canvasWidth / 10;
      y = canvasHeight / 4 + (i - 10) * (keySize + keySize / 5);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }
    for (let i = 20; i <= characters.length; i++) {
      letter = characters.charAt(i);
      x = 3 * (keySize + keySize / 4) + canvasWidth / 10;
      y = canvasHeight / 4 + (i - 20) * (keySize + keySize / 5);
      keys.push(new Key(x, y, letter, keySize, keySize, g));
    }

    bottomMessage = new Text(
      "",
      canvasWidth / 2.5,
      (document.documentElement.clientHeight / 10) * 9,
      25,
      "black",
      "-",
      g
    );

    g.drawGrid();

    if (inGame == false) {
      inGame = true;
      startGame();
    }
  };

  g.draw = () => {
    g.setup();
  };
};

let gridP5 = new p5(s1, "canvas_grid");

const s2 = (d) => {
  d.preload = () => {
    handlee = d.loadFont("Handlee-Regular.ttf");
    inter = d.loadFont("Inter.ttf");
  };

  d.drawDots = () => {
    var screenH = document.documentElement.clientHeight;
    var screenW = document.getElementById("canvas_draw").offsetWidth;

    var r = 2;
    var cw = 30;
    var ch = 30;
    d.strokeWeight(2);
    d.stroke(0);
    d.fill(0);
    for (var x = 20; x < screenW; x += cw) {
      for (var y = 20; y < screenH; y += ch) {
        d.point(x - r / 2, y - r / 2);
      }
    }
  };

  // CHECK FINGERS FOR MODE (NOTE THE Y IS INVERSED)
  d.fingersUp = (landmarks) => {
    if (
      landmarks[0][4].y < landmarks[0][2].y &&
      landmarks[0][8].y < landmarks[0][6].y &&
      landmarks[0][12].y < landmarks[0][10].y &&
      landmarks[0][16].y < landmarks[0][14].y &&
      landmarks[0][20].y < landmarks[0][18].y
    ) {
      return "move";
    } else if (
      landmarks[0][8].y < landmarks[0][6].y &&
      landmarks[0][7].y < landmarks[0][12].y &&
      landmarks[0][7].y < landmarks[0][16].y &&
      landmarks[0][7].y < landmarks[0][20].y
    ) {
      return "draw";
    } else if (
      landmarks[0][4].y < landmarks[0][2].y &&
      landmarks[0][3].y < landmarks[0][8].y &&
      landmarks[0][3].y < landmarks[0][12].y &&
      landmarks[0][3].y < landmarks[0][16].y &&
      landmarks[0][3].y < landmarks[0][20].y
    ) {
      return "confirm";
    } else if (
      landmarks[0][4].y > landmarks[0][2].y &&
      landmarks[0][3].y > landmarks[0][8].y &&
      landmarks[0][3].y > landmarks[0][12].y &&
      landmarks[0][3].y > landmarks[0][16].y &&
      landmarks[0][3].y > landmarks[0][20].y
    ) {
      return "cancel";
    } else if (
      landmarks[0][8].y > landmarks[0][6].y &&
      landmarks[0][12].y > landmarks[0][10].y &&
      landmarks[0][16].y > landmarks[0][14].y &&
      landmarks[0][20].y > landmarks[0][18].y
    ) {
      return "click";
    } else {
      return "unknown";
    }
  };

  // "VIRTUAL HAND MOUSE" FUNCTION
  d.onResults = (results) => {
    let canvasWidth = document.getElementById("canvas_grid").offsetWidth;

    handInUse = "";
    if (results.multiHandedness) {
      for (const hand of results.multiHandedness) {
        if (hand.label == "Right") {
          handInUse = "Left";
        } else {
          handInUse = "Right";
        }
      }
    }
    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        mode = d.fingersUp(results.multiHandLandmarks);
        hx =
          document.getElementById("canvas_draw").offsetWidth -
          results.multiHandLandmarks[0][8].x *
            document.getElementById("canvas_draw").offsetWidth;
        hy =
          results.multiHandLandmarks[0][8].y *
          document.documentElement.clientHeight;

        console.log(handInUse, mode);

        // FOR EACH OF THE BUTTONS/ ELEMENTS WE CHECK IF WE ARE IN AND IN WHICH MODE
        // IF SOMETHING IS HIDEN< THEN YOU SHOULD NOT BE ABLE TO INTERACT

        if (processLetter.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              if (hasCheckedLetter == false) {
                // HIDE EVERYTHING TO PROCESS
                processLetter.hide();
                helpButton.hide();
                menuButton.hide();
                navigateButton.hide();
                //navigateBackButton.hide();

                for (let col = 0; col < numberOfLetters; col++) {
                  currentWordRow[col].hide();
                }

                // DRAW DOTS AGAIN
                d.drawDots();

                // PREPROCESS IMAGE
                drawP5.filter(d.DILATE);
                drawP5.filter(d.DILATE);
                drawP5.filter(d.DILATE);
                drawP5.filter(d.THRESHOLD);
                processing = true;
                Tesseract.recognize(drawP5.drawingContext.canvas, {
                  lang: "eng",
                  tessedit_pageseg_mode: "10",
                  tessedit_char_whitelist: charactersWhiteList,
                })

                  .catch((err) => {
                    console.error(err);
                  })
                  .then((result) => {
                    processing = false;

                    // Get Confidence score
                    console.log(result);
                    confidence = result.confidence;

                    letterToShow = result.text[0];

                    if (charactersWhiteList.includes(letterToShow)) {
                      processing = false;
                      // DEFINE SUBMIT LETTER EVENT
                      hasCheckedLetter = true;
                      d.background(255);
                      d.drawDots();
                      // SHOW THE GIGANT LETTER
                      letterToShow = letterToShow.toUpperCase();
                      gigantLetter.show(letterToShow);

                      processTextTitle.show(systemRecognice);
                      processTextSubtitle.show(isThisLetter);
                    } else {
                      processing = false;

                      // SHOW MESSAGE SAYING AN ERROR HAPPENED
                      //processErrorText.show(oops);

                      // ACT AS IF THEY REJECTED THE LETTER

                      // CLEAN SCREEN
                      d.background(255);
                      d.drawDots();

                      // SHOW EVERYTHING AGAIN
                      processLetter.show();
                      //deleteLetterButton.show();
                      helpButton.show();
                      menuButton.show();
                      navigateButton.show();

                      // PAINT THE LAST LETTER AFTER PAINTING
                      for (let col = 0; col < numberOfLetters; col++) {
                        currentWordRow[col].show(
                          currentWord[col],
                          currentMode[col]
                        );
                      }

                      // MAKE SURE IT DOESN'T SEND IT AGAIN
                      hasCheckedLetter = false;
                    }
                  });
              }
            }
            xp = hx;
            yp = hy;
          }
        } else if (helpButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              selectedHelpButton = true;
              // HIDE EVERYTHING, SHOW TUTORIAL
              processLetter.hide();
              //deleteLetterButton.hide();
              helpButton.hide();
              menuButton.hide();
              navigateButton.hide();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].hide();
              }

              d.background(255);

              // SHOW TUTORIAL
            }
            xp = hx;
            yp = hy;
          }
        } else if (closingButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              selectedHelpButton = false;
              selectedMenuButton = false;

              // HIDE EVERYTHING
              closingButton.hide();

              // SHOW MENU
              menuContainer.hide();
              newGameButton.hide();
              resumeGameButton.hide();
              changeHandButton.hide();
              menuBottomElement.show("");
              menuBottomElement.hide();

              // SHOW EVERYTHING AGAIN

              d.background(255);
              d.drawDots();
              menuButton.show();
              processLetter.show();
              helpButton.show();
              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }
            }
            xp = hx;
            yp = hy;
          }
        } else if (resumeGameButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              // HIDE EVERYTHING
              selectedMenuButton = false;
              closingButton.hide();

              // SHOW MENU
              menuContainer.hide();
              newGameButton.hide();
              resumeGameButton.hide();
              changeHandButton.hide();

              // SHOW EVERYTHING AGAIN
              d.background(255);
              d.drawDots();
              menuButton.show();
              processLetter.show();
              helpButton.show();
              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }
            }
            xp = hx;
            yp = hy;
          }
        } else if (changeHandButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              console.log(dominantHand);

              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }

              if (dominantHand == "Right") {
                dominantHand = "Left";
                nonDominantHand = "Right";
                menuContainer.show();
                menuBottomElement.show("Left-handed");
              } else if (dominantHand == "Left") {
                dominantHand = "Right";
                nonDominantHand = "Left";
                menuContainer.show();

                menuBottomElement.show("Right-handed");
              }

              newGameButton.show("menuButton");
              resumeGameButton.show("menuButton");
              changeHandButton.show("menuButton");

              // Hide whatever
            }
            xp = hx;
            yp = hy;
          }
        } else if (newGameButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              // HIDE EVERYTHING
              closingButton.hide();

              startGame();

              // SHOW MENU
              menuContainer.hide();
              newGameButton.hide();
              resumeGameButton.hide();
              changeHandButton.hide();

              // SHOW EVERYTHING AGAIN

              d.background(255);
              d.drawDots();
              menuButton.show();
              processLetter.show();
              helpButton.show();
              navigateButton.show();

              currentWordRow = [];
              currentWord = Array(numberOfLetters).fill("");
              currentMode = Array(numberOfLetters).fill("empty");
              currentLetterWord = 0;
              currentAttempt = 0;
              win = false;
              lose = false;

              size = document.getElementById("canvas_draw").offsetWidth / 20;
              y = document.documentElement.clientHeight - 2 * size;
              for (let col = 0; col < numberOfLetters; col++) {
                x =
                  (document.getElementById("canvas_draw").offsetWidth + 150) /
                    2 -
                  (numberOfLetters / 2) * 1.2 * size +
                  col * 1.2 * size;
                currentWordRow.push(new Slot(x, y, size, 0, col, d));
              }

              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }
              // Hide whatever
            }
            xp = hx;
            yp = hy;
          }
        } else if (menuButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "click") {
              selectedMenuButton = true;
              // HIDE EVERYTHING
              menuButton.hide();
              processLetter.hide();
              helpButton.hide();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].hide();
              }

              d.background(255);
              d.drawDots();

              // SHOW MENU
              navigateButton.show();

              menuContainer.show();

              newGameButton.show("menuButton");
              resumeGameButton.show("menuButton");
              changeHandButton.show("menuButton");
              if (dominantHand == "Left") {
                menuBottomElement.show("Left-handed");
              } else if (dominantHand == "Right") {
                menuBottomElement.show("Right-handed");
              }

              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }
              // } else {
              //   selectedMenuButton = false;
              //   // SHOW EVERYTHING AGAIN
              //   d.background(255);
              //   d.drawDots();
              //   menuButton.show();
              //   processLetter.show();
              //   // deleteLetterButton.show();
              //   helpButton.show();
              //   navigateButton.show();
              //   for (let col = 0; col < numberOfLetters; col++) {
              //     currentWordRow[col].show(currentWord[col], currentMode[col]);
              //   }
              // }
            }
            xp = hx;
            yp = hy;
          }
        } else if (navigateButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "move" || mode == "click") {
              console.log("Navigate");
              // SHOW OTHER SCREEN

              navigateButton.hide();
              helpButton.hide();
              d.toggle();
              navigateBackButton.show();
            }
            xp = hx;
            yp = hy;
          }
        } else if (navigateBackButton.contains(hx, hy)) {
          if (handInUse == dominantHand) {
            if (mode == "move" || mode == "click") {
              console.log("Navigate back");
              // SHOW OTHER SCREEN
              d.toggle();
              navigateBackButton.hide();
              // Paint all the screen again
              d.background(255);
              d.drawDots();
              menuButton.show();
              processLetter.show();
              helpButton.show();
              navigateButton.show();
              for (let col = 0; col < numberOfLetters; col++) {
                currentWordRow[col].show(currentWord[col], currentMode[col]);
              }
            }
            xp = hx;
            yp = hy;
          }
        } else if (handInUse == dominantHand) {
          if (
            mode == "draw" &&
            !openWindow &&
            !selectedHelpButton &&
            !selectedMenuButton
          ) {
            // DRAWING MODE
            if (xp == 0 && yp == 0) {
              xp = hx;
              yp = hy;
            } else {
              // Check distance
              if (Math.hypot(xp - hx, yp - hy) < 100) {
                d.stroke(0, 101, 152);
                d.strokeWeight(30);
                d.line(xp, yp, hx, hy);
              }
              xp = hx;
              yp = hy;
            }
          }
        } else if (handInUse == nonDominantHand) {
          // Avoid mistakes
          if (
            mode != "confirm" &&
            mode != "cancel" &&
            mode != "move" &&
            !openWindow &&
            !selectedHelpButton &&
            !selectedMenuButton
          ) {
            mode = "delete";
            // DELETE MODE

            // CHECK IF IS NOT DELETING AN ELEMENT
            if (
              processLetter.contains(hx, hy) ||
              helpButton.contains(hx, hy) ||
              menuButton.contains(hx, hy) ||
              navigateButton.contains(hx, hy) ||
              navigateBackButton.contains(hx, hy)
            ) {
            } else {
              if (selectedHelpButton == false && selectedMenuButton == false) {
                d.stroke(255);
                d.strokeWeight(100);

                if (xp == 0 && yp == 0) {
                  xp = hx;
                  yp = hy;
                }

                d.line(xp, yp, hx, hy);

                xp = hx;
                yp = hy;

                // PAINT THE GRID AFTER DELETING
                d.drawDots();
                menuButton.show();
                processLetter.show();
                helpButton.show();
                navigateButton.show();

                for (let col = 0; col < numberOfLetters; col++) {
                  currentWordRow[col].show(currentWord[col], currentMode[col]);
                }
              }
            }
          }
        }

        if (mode == "confirm") {
          // Check what was the event to confirm

          if (hasFinishedGame == true) {
            startGame();

            // SHOW MENU
            menuContainer.hide();
            newGameButton.hide();
            resumeGameButton.hide();
            changeHandButton.hide();

            // SHOW EVERYTHING AGAIN

            d.background(255);
            d.drawDots();
            menuButton.show();
            processLetter.show();
            helpButton.show();
            navigateButton.show();

            currentWordRow = [];
            currentWord = Array(numberOfLetters).fill("");
            currentMode = Array(numberOfLetters).fill("empty");
            currentLetterWord = 0;
            currentAttempt = 0;
            win = false;
            lose = false;

            size = document.getElementById("canvas_draw").offsetWidth / 20;
            y = document.documentElement.clientHeight - 2 * size;
            for (let col = 0; col < numberOfLetters; col++) {
              x =
                (document.getElementById("canvas_draw").offsetWidth + 150) / 2 -
                (numberOfLetters / 2) * 1.2 * size +
                col * 1.2 * size;
              currentWordRow.push(new Slot(x, y, size, 0, col, d));
            }

            for (let col = 0; col < numberOfLetters; col++) {
              currentWordRow[col].show(currentWord[col], currentMode[col]);
            }
          }
          // if submit letter event
          else if (hasCheckedLetter == true) {
            // IF THEY ACCEPT THE LETTER
            gigantLetter.hide();

            // CLEAN SCREEN
            d.background(255);
            d.drawDots();

            currentWord[currentLetterWord] = letterToShow;
            currentMode[currentLetterWord] = "empty";
            currentLetterWord++;
            currentMode[currentLetterWord] = "current";

            if (currentLetterWord == numberOfLetters) {
              hasCheckedWord = true;
            }

            // SHOW EVERYTHING AGAIN
            processLetter.show();
            helpButton.show();
            menuButton.show();
            navigateButton.show();

            // MOVE POINTER TO CENTER TO MAKE SURE IT DOESNT SEND AGAIN
            hx = document.getElementById("canvas_draw").offsetWidth / 2;
            hy = document.documentElement.clientHeight;

            // MAKE SURE IT DOESN'T SEND IT AGAIN
            hasCheckedLetter = false;

            // PAINT THE LAST LETTER AFTER PAINTING
            for (let col = 0; col < numberOfLetters; col++) {
              currentWordRow[col].show(currentWord[col], currentMode[col]);
            }
          } else if (hasCheckedWord == true) {
            hasCheckedWord = false;
            // IF THEY ACCEPT THE WORD
            // SUBMIT
            // show other screen,
            d.toggle();

            navigateButton.hide();
            navigateBackButton.show();
            // call check word,
            console.log(currentWord);
            wordToCheck = [...currentWord];
            checkWord();
            currentAttempt++;

            if (currentAttempt > numberOfAttempts) {
              endGame();
            }

            currentWordRow = [];
            currentWord = Array(numberOfLetters).fill("");
            currentMode = Array(numberOfLetters).fill("empty");
            currentLetterWord = 0;

            // DEFINE AGAIN THE CURRENT WORD BOX
            size = document.getElementById("canvas_draw").offsetWidth / 20;
            y = document.documentElement.clientHeight - 2 * size;
            for (let col = 0; col < numberOfLetters; col++) {
              x =
                (document.getElementById("canvas_draw").offsetWidth + 150) / 2 -
                (numberOfLetters / 2) * 1.2 * size +
                col * 1.2 * size;
              currentWordRow.push(new Slot(x, y, size, 0, col, d));
            }
          }
          xp = hx;
          yp = hy;
        }
        if (mode == "cancel") {
          // Check what was the event to cancel

          if (hasFinishedGame == true) {
          } else if (hasCheckedLetter == true) {
            // IF THEY REJECT THE LETTER
            gigantLetter.hide();

            // CLEAN SCREEN
            d.background(255);
            d.drawDots();

            // SHOW EVERYTHING AGAIN
            processLetter.show();
            helpButton.show();
            menuButton.show();
            navigateButton.show();

            // MOVE POINTER TO CENTER TO MAKE SURE IT DOESN'T SEND IT AGAIN
            hx = document.getElementById("canvas_draw").offsetWidth / 2;
            hy = document.documentElement.clientHeight;

            // MAKE SURE IT DOESN'T SEND IT AGAIN
            hasCheckedLetter = false;

            // PAINT THE LAST LETTER AFTER PAINTING
            for (let col = 0; col < numberOfLetters; col++) {
              currentWordRow[col].show(currentWord[col], currentMode[col]);
            }
          } else if (hasCheckedWord == true) {
            // IF THEY REJECT THE WORD
            hasCheckedWord = false;

            //offer to select letter to change
            currentWordRow = [];
            currentWord = Array(numberOfLetters).fill("");
            currentMode = Array(numberOfLetters).fill("empty");
            currentLetterWord = 0;

            // DEFINE AGAIN THE CURRENT WORD BOX
            size = document.getElementById("canvas_draw").offsetWidth / 20;
            y = document.documentElement.clientHeight - 2 * size;
            for (let col = 0; col < numberOfLetters; col++) {
              x =
                (document.getElementById("canvas_draw").offsetWidth + 150) / 2 -
                (numberOfLetters / 2) * 1.2 * size +
                col * 1.2 * size;
              currentWordRow.push(new Slot(x, y, size, 0, col, d));
            }
          }
          xp = hx;
          yp = hy;
        }
      }
    }
  };

  d.setup = () => {
    d.pixelDensity(3.0);
    drawCanvas = d.createCanvas(
      document.getElementById("canvas_draw").offsetWidth,
      document.documentElement.clientHeight
    );

    d.background(255);

    currentWord = [];

    // DEFINE THE BUTTONS
    processLetter = new Button(
      "Process\nletter",
      document.getElementById("canvas_draw").offsetWidth - 150,
      document.documentElement.clientHeight - 150,
      200,
      28,
      "green",
      "green",
      255,
      "br",
      d
    );
    menuButton = new Button(
      "Menu",
      document.getElementById("canvas_draw").offsetWidth - 150,
      150,
      200,
      28,
      [230, 242, 248],
      [230, 242, 248],
      [0, 101, 152],
      "tr",
      d
    );
    helpButton = new Button(
      "Help",
      300,
      document.documentElement.clientHeight - 150,
      200,
      50,
      [230, 242, 248],
      [230, 242, 248],
      [0, 101, 152],
      "tl",
      d
    );

    closingButton = new Button(
      "X",
      300,
      150,
      100,
      100,
      [230, 242, 248],
      [230, 242, 248],
      [0, 101, 152],
      "tl",
      d
    );

    navigateButton = new Toggle(
      ">>",
      0,
      0,
      document.getElementById("canvas_draw").offsetWidth / 10,
      document.documentElement.clientHeight,
      60,
      [102, 177, 214],
      [102, 177, 214],
      "white",
      "l",
      d
    );
    navigateBackButton = new Toggle(
      "<<",
      document.getElementById("canvas_draw").offsetWidth -
        document.getElementById("canvas_draw").offsetWidth / 3,
      0,
      document.getElementById("canvas_draw").offsetWidth / 10,
      document.documentElement.clientHeight,
      60,
      [102, 177, 214],
      [102, 177, 214],
      "white",
      "r",
      d
    );

    menuContainer = new Container(
      350,
      175,
      document.getElementById("canvas_draw").offsetWidth / 1.5,
      document.getElementById("canvas_draw").offsetWidth / 4,
      [250, 250, 250],
      [0, 101, 152],
      d
    );

    menuOptionSize = document.getElementById("canvas_draw").offsetWidth / 8;
    menuBottomElement = new Text(
      "Dominant hand: " + dominantHand,
      375 + 3 * menuOptionSize + menuOptionSize / 2 + 100,
      450,
      40,
      [(0, 101, 152)],
      "",
      d
    );

    resumeGameButton = new Key(
      375 + menuOptionSize / 2,
      250,
      "Resume\ngame",
      menuOptionSize,
      menuOptionSize,
      d
    );
    newGameButton = new Key(
      375 + 2 * menuOptionSize,
      250,

      "New\ngame",
      menuOptionSize,
      menuOptionSize,
      d
    );
    changeHandButton = new Key(
      375 + 3 * menuOptionSize + menuOptionSize / 2,
      250,
      "Swich\nhand",
      menuOptionSize,
      menuOptionSize,
      d
    );

    gigantLetter = new Text(
      letterToShow,
      document.getElementById("canvas_draw").offsetWidth / 2,
      (document.documentElement.clientHeight / 5) * 3,
      400,
      0,
      "-",
      d
    );

    processTextTitle = new Text(
      systemRecognice,
      document.getElementById("canvas_image").offsetWidth / 2,
      document.documentElement.clientHeight / 8,
      40,
      0,
      "-",
      d
    );
    processTextSubtitle = new Text(
      isThisLetter,
      document.getElementById("canvas_image").offsetWidth / 2,
      document.documentElement.clientHeight / 4,
      30,
      0,
      "-",
      d
    );
    processErrorText = new Text(
      oops,
      document.getElementById("canvas_image").offsetWidth / 2,
      document.documentElement.clientHeight / 2,
      30,
      0,
      "-",
      d
    );
    processingText = new Text(
      loading,
      document.getElementById("canvas_image").offsetWidth / 2,
      (document.documentElement.clientHeight / 5) * 4,
      30,
      0,
      "-",
      d
    );

    // DEFINE THE CURRENT WORD BOX
    size = document.getElementById("canvas_draw").offsetWidth / 20;
    y = document.documentElement.clientHeight - 2 * size;
    for (let col = 0; col < numberOfLetters; col++) {
      x =
        (document.getElementById("canvas_draw").offsetWidth + 150) / 2 -
        (numberOfLetters / 2) * 1.2 * size +
        col * 1.2 * size;
      currentWordRow.push(new Slot(x, y, size, 0, col, d));
    }

    // PAINT THE GRID
    d.drawDots();

    // GET VIDEO INPUT
    videoElement = document.getElementsByClassName("input_video")[0];

    // CONFIG OF HAND MODEL
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75,
    });

    // GET HAND LANDMARKS
    //hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({
          image: videoElement,
        });
      },
      width: 1280,
      height: 720,
    });

    camera.start();
  };

  d.draw = () => {
    d.noLoop();

    hands.onResults(d.onResults);
    // PAINT THE BUTTONS AFTER PAINTING
    processLetter.show();
    menuButton.show();
    helpButton.show();
    navigateButton.show();

    // PAINT THE LAST WORD AFTER PAINTING
    for (let col = 0; col < numberOfLetters; col++) {
      if (currentLetterWord == col) {
        currentMode[col] = "current";
      }
      currentWordRow[col].show(currentWord[col], currentMode[col]);
    }
  };

  d.toggle = () => {
    if (drawMode == true) {
      document.getElementById("canvas_grid").classList.toggle("toggle");
      openWindow = !openWindow;
    }
  };
};
let drawP5 = new p5(s2, "canvas_draw");

const s3 = (p) => {
  p.setup = () => {
    p.createCanvas(
      document.getElementById("canvas_pointer").offsetWidth,
      document.documentElement.clientHeight
    );
    p.noStroke();
    cursor = p.loadImage("openhand.png");
    eraser = p.loadImage("eraser1.png");
    click = p.loadImage("closedhand.png");
    pencil = p.loadImage("pencil.png");
    handOk = p.loadImage("handUp.png");
    handCancel = p.loadImage("handDown.png");
  };

  p.draw = () => {
    p.clear();
    p.fill(0);

    switch (mode) {
      case "draw": {
        p.image(pencil, hx, hy - 100, 100, 100);
        break;
      }
      case "delete": {
        p.image(eraser, hx - 50, hy - 50, 100, 100);
        break;
      }
      case "move": {
        p.image(cursor, hx, hy, 100, 100);
        break;
      }
      case "click": {
        p.image(click, hx, hy, 100, 100);
        break;
      }
      case "confirm": {
        p.image(handOk, hx, hy, 100, 100);
        break;
      }
      case "cancel": {
        p.image(handCancel, hx, hy, 100, 100);
        break;
      }
      default: {
        p.ellipse(hx, hy, 33, 33);
        break;
      }
    }
  };
};

let pointerP5 = new p5(s3, "canvas_pointer");

const s4 = (i) => {
  i.preload = () => {
    confirmImage = i.loadImage("Thumbs-upEng.png");
    rejectImage = i.loadImage("Thumbs-downEng.png");
    helpScreen = i.loadImage("HelpScreenEng.png");
    winScreen = i.loadImage("winGameEng.png");
    loseScreen = i.loadImage("loseGameEng.png");
  };

  i.setup = () => {
    i.createCanvas(
      document.getElementById("canvas_image").offsetWidth,
      document.documentElement.clientHeight
    );
    i.noStroke();
    closingButton = new Button(
      "X",
      300,
      150,
      100,
      100,
      [230, 242, 248],
      [230, 242, 248],
      [0, 101, 152],
      "tl",
      i
    );
  };

  i.draw = () => {
    if (selectedHelpButton) {
      i.imageMode(i.CENTER);
      i.image(
        helpScreen,
        document.getElementById("canvas_image").offsetWidth / 2,
        document.documentElement.clientHeight / 2,
        document.getElementById("canvas_image").offsetWidth * 0.6,
        document.documentElement.clientHeight * 0.6
      );

      closingButton.show();
    } else if (selectedMenuButton) {
      closingButton.show();
    } else if (hasCheckedLetter == true) {
      if (charactersWhiteList.includes(letterToShow)) {
        i.image(
          rejectImage,
          document.getElementById("canvas_image").offsetWidth / 14,
          (document.documentElement.clientHeight / 3) * 1.5,
          250,
          250
        );
        i.image(
          confirmImage,
          (document.getElementById("canvas_image").offsetWidth / 20) * 14,
          (document.documentElement.clientHeight / 3) * 1.5,
          250,
          250
        );
      } else {
        processErrorText.show(oops);
      }
    } else if (processing) {
      processingText.show(loading);
    } else if (win) {
      i.imageMode(i.CENTER);
      i.image(
        winScreen,
        document.getElementById("canvas_image").offsetWidth / 2,
        document.documentElement.clientHeight / 2,
        document.getElementById("canvas_image").offsetWidth * 0.6,
        document.documentElement.clientHeight * 0.6
      );
      hasFinishedGame = true;
    } else if (lose) {
      i.imageMode(i.CENTER);
      i.image(
        loseScreen,
        document.getElementById("canvas_image").offsetWidth / 2,
        document.documentElement.clientHeight / 2,
        document.getElementById("canvas_image").offsetWidth * 0.6,
        document.documentElement.clientHeight * 0.6
      );
      hasFinishedGame = true;
    } else {
      processErrorText.show(" ");
      i.clear();
      i.fill(0);
    }
  };
};

let imagesP5 = new p5(s4, "canvas_image");
