/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady()
{
	// Cordova is now initialized. Have fun!

	console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
	console.log(navigator.vibrate);
	// document.getElementById('deviceready').classList.add('ready');
}

// Get the DOM elements
const pointsElements = document.querySelectorAll(".pointsValue");
const roundElements = document.querySelectorAll(".roundValue");
const timerElements = document.querySelectorAll(".timerValue");
const gameOverText = document.getElementById("gameover-msg");
const timer = document.querySelectorAll(".timer");
const roundContainer = document.querySelectorAll(".round");
const pointsContainer = document.querySelectorAll(".points");

// CONTAINERS
const homeContainer = document.getElementById("home-container");
const difficultiesContainer = document.getElementById("difficulties-container");
const instructionContainer = document.getElementById(
	"instruction-main-container"
);
const easyContainer = document.getElementById("easy-container");
const intermediateContainer = document.getElementById("intermediate-container");
const hardContainer = document.getElementById("hard-container");
const gameOverContainer = document.getElementById("gameover-container-bg");

// BUTTONS
const playButton = document.getElementById("play-button");
const backButton = document.querySelector(".back-button");
const instructionButton = document.getElementById("instruction-button");
const easyButton = document.getElementById("easy-button");
const intermediateButton = document.getElementById("intermediate-button");
const hardButton = document.getElementById("hard-button");
const playAgainButton = document.getElementById("play-again-button");
const homeButton = document.getElementById("home-button");
const hintButtons = document.querySelectorAll(".hint-button");
const revealButtons = document.querySelectorAll(".reveal-button");
const freezeButtons = document.querySelectorAll(".freeze-button");

// GLOBAL VARIABLES
let isEasyClicked = false;
let isIntermediateClicked = false;
let isHardClicked = false;
let points = 10;
let round = 1;
let timeLeft;
let totalGameTime = 0;
let roundTime = 0;
let roundTimes = []; // Array to store round information
let timerInterval;
let currentDifficulty;

//SHOWS DIFFICULTY SECTION, HIDES HOME SECTION
playButton.addEventListener("click", function ()
{
	homeContainer.style.display = "none";
	difficultiesContainer.style.display = "flex";
});

// SHOWS HOME SECTION, HIDES DIFFICULTY SECTION
backButton.addEventListener("click", () =>
{
	homeContainer.style.display = "flex";
	difficultiesContainer.style.display = "none";
});

//SHOWS HOW TO SECTION, HIDES HOME SECTION
instructionButton.addEventListener("click", function ()
{
	instructionContainer.style.display = "block";
	homeContainer.style.display = "none";
});

// SHOWS EASY CONTAINER, HIDES DIFFICULTY CONTAINER
easyButton.addEventListener("click", function ()
{
	currentDifficulty = "easy";
	isEasyClicked = true;
	easyContainer.style.display = "flex";
	difficultiesContainer.style.display = "none";
	round = 1;
	updateTimer(60);
	gameStarted();
	goToEasyRound(round);
});

// SHOWS INTERMEDIATE CONTAINER, HIDES DIFFICULTY CONTAINER
intermediateButton.addEventListener("click", function ()
{
	currentDifficulty = "intermediate";
	isIntermediateClicked = true;
	intermediateContainer.style.display = "flex";
	difficultiesContainer.style.display = "none";
	round = 1;
	updateTimer(90);
	gameStarted();
	goToIntermediateRound(round);
});

// SHOWS HARD CONTAINER, HIDES DIFFICULTY CONTAINER
hardButton.addEventListener("click", function ()
{
	currentDifficulty = "hard";
	isHardClicked = true;
	hardContainer.style.display = "flex";
	difficultiesContainer.style.display = "none";
	round = 1;
	updateTimer(120);
	gameStarted();
	goToHardRound(round);
});

// PLAY AGAIN
playAgainButton.addEventListener("click", function ()
{
	round = 1;
	updateRound(1);

	// clear easyRandomSignsUsed
	signsUsed.splice(0);

	if (isEasyClicked)
	{
		easyCardContainer.innerHTML = "";
		goToEasyRound(round);
	} else if (isIntermediateClicked)
	{
		intermediateCardContainer.innerHTML = "";
		goToIntermediateRound(round);
	} else if (isHardClicked)
	{
		hardCardContainer.innerHTML = "";
		goToHardRound(round);
	}

	gameOverContainer.style.display = "none";
});

// BACK TO HOME, HIDES THE GAME
homeButton.addEventListener("click", function ()
{
	round = 1;
	updateRound(1);

	// clear easyRandomSignsUsed
	signsUsed.splice(0);

	isEasyClicked = false;
	isIntermediateClicked = false;
	isHardClicked = false;

	easyContainer.style.display = "none";
	intermediateContainer.style.display = "none";
	hardContainer.style.display = "none";
	homeContainer.style.display = "flex";
	gameOverContainer.style.display = "none";
});

// UPDATE THE POINTS DISPLAY
function updatePoints(value)
{
	points = value;

	setTimeout(() =>
	{
		pointsContainer.forEach(function (pointsContainerElement)
		{
			// Back to 0
			pointsContainerElement.style.transition = "background-color 0.5s";
			pointsContainerElement.style.backgroundColor = "";
		});
	}, 2500);

	pointsContainer.forEach(function (pointsContainerElement)
	{
		// Change timer background color to orange
		pointsContainerElement.style.transition = "background-color 0.5s";
		pointsContainerElement.style.backgroundColor = "orange";
	});

	pointsElements.forEach(function (pointsElement)
	{
		pointsElement.textContent = points;
	});
}

updatePoints(points);

// UPDATE THE ROUND DISPLAY
function updateRound(value)
{
	round = value;

	roundContainer.forEach(function (roundContainerElement)
	{
		var fadeDuration = 1000; // Duration of each fade in milliseconds

		function fadeIn()
		{
			var opacity = 0;
			var interval = setInterval(function ()
			{
				opacity += 0.1;
				roundContainerElement.style.opacity = opacity;
				if (opacity >= 1)
				{
					clearInterval(interval);
				}
			}, fadeDuration / 10);
		}

		fadeIn(); // Start the fade-in effect
	});

	roundElements.forEach(function (roundElement)
	{
		roundElement.textContent = round;
	});
}

function updateTimer(value)
{
	timeLeft = value.toFixed(2);

	const minutes = Math.floor(timeLeft / 60); // CALCULATE MINUTES
	const seconds = Math.floor(timeLeft % 60); // CALCULATE SECONDS
	const milliseconds = Math.floor((timeLeft % 1) * 100); // CALCULATE MILLISECONDS

	// Format the minutes, seconds, and milliseconds with leading zeros if necessary
	const formattedMinutes = String(minutes).padStart(1, "0");
	const formattedSeconds = String(seconds).padStart(2, "0");
	const formattedMilliseconds = String(milliseconds).padStart(2, "0");

	timerElements.forEach(function (timerElement)
	{
		timerElement.textContent = `${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
	});

	if (timeLeft <= 0.00)
	{
		console.log("Game over");
		gameOverText.innerHTML = "TIME IS LEFT - GAME OVER";
		gameOverContainer.style.display = "flex";
		clearInterval(timerInterval);
		gameEndedIncomplete();
	}
}

function startTimer()
{
	timerInterval = setInterval(() =>
	{
		timeLeft -= 0.01; // Subtract 0.01 instead of 1 to account for the 10-millisecond interval
		totalGameTime += 0.01; // Increment by 0.01 instead of 1 to account for the 10-millisecond interval
		roundTime += 0.01; // Increment by 0.01 instead of 1 to account for the 10-millisecond interval
		console.log("TOTAL GAME TIME: ", totalGameTime.toFixed(2));
		updateTimer(timeLeft);
	}, 10); // Set the interval to 10 milliseconds
}

const enableButtons = function (buttons)
{
	buttons.forEach(function (button)
	{
		button.disabled = false;
	});
};

const disableButtons = function (buttons)
{
	buttons.forEach(function (button)
	{
		button.disabled = true;
	});
};

if (points >= 2)
{
	enableButtons(hintButtons);
	enableButtons(freezeButtons);
	if (points >= 3)
	{
		enableButtons(revealButtons);
	} else
	{
		disableButtons(revealButtons);
	}
} else
{
	disableButtons(hintButtons);
	disableButtons(revealButtons);
	disableButtons(freezeButtons);
}

hintButtons.forEach(function (hintButton)
{
	// Add event listener to the hintButton
	hintButton.addEventListener("click", function ()
	{
		if (points >= 2)
		{
			points -= 2;
			updatePoints(points);

			hintButton.setAttribute("disabled", "true"); // Disable the button

			if (flippedCards.length < 2 && isEasyClicked)
			{
				var unflippedCards = easyContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var randomIndex = Math.floor(
						Math.random() * easyRandomSignToGuess.length
					);
					var correctCard = Array.from(unflippedCards).find(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return cardId == easyRandomSignToGuess[randomIndex].id;
					});

					if (correctCard)
					{
						correctCard.classList.add("flipped");
						setTimeout(function ()
						{
							correctCard.classList.remove("flipped");
						}, 2500);
					}
				}
			} else if (flippedCards.length < 3 && isIntermediateClicked)
			{
				var unflippedCards = intermediateContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var randomIndex = Math.floor(
						Math.random() * intermediateRandomSignToGuess.length
					);
					var correctCard = Array.from(unflippedCards).find(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return cardId == intermediateRandomSignToGuess[randomIndex].id;
					});

					if (correctCard)
					{
						correctCard.classList.add("flipped");
						setTimeout(function ()
						{
							correctCard.classList.remove("flipped");
						}, 2500);
					}
				}
			} else if (flippedCards.length < 4 && isHardClicked)
			{
				var unflippedCards = hardContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var randomIndex = Math.floor(
						Math.random() * hardRandomSignToGuess.length
					);
					var correctCard = Array.from(unflippedCards).find(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return cardId == hardRandomSignToGuess[randomIndex].id;
					});

					if (correctCard)
					{
						correctCard.classList.add("flipped");
						setTimeout(function ()
						{
							correctCard.classList.remove("flipped");
						}, 2500);
					}
				}
			}

			setTimeout(function ()
			{
				hintButton.removeAttribute("disabled"); // Enable the button after 2500ms
			}, 2500);
		} else
		{
			navigator.vibrate(500);
		}
	});
});

revealButtons.forEach(function (revealButton)
{
	// Add event listener to the revealButtons
	revealButton.addEventListener("click", function ()
	{
		if (points >= 3)
		{
			points -= 2;
			updatePoints(points);

			revealButton.setAttribute("disabled", "true");

			if (flippedCards.length < 2 && isEasyClicked)
			{
				var unflippedCards = easyContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var correctCards = Array.from(unflippedCards).filter(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return (
							cardId == easyRandomSignToGuess[0].id ||
							cardId == easyRandomSignToGuess[1].id
						);
					});

					if (correctCards.length > 0)
					{
						correctCards.forEach(function (card)
						{
							card.classList.add("flipped");
							setTimeout(function ()
							{
								card.classList.remove("flipped");
							}, 2500);
						});
					}
				}
			} else if (flippedCards.length < 3 && isIntermediateClicked)
			{
				var unflippedCards = intermediateContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var correctCards = Array.from(unflippedCards).filter(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return (
							cardId == intermediateRandomSignToGuess[0].id ||
							cardId == intermediateRandomSignToGuess[1].id ||
							cardId == intermediateRandomSignToGuess[2].id
						);
					});

					if (correctCards.length > 0)
					{
						correctCards.forEach(function (card)
						{
							card.classList.add("flipped");
							setTimeout(function ()
							{
								card.classList.remove("flipped");
							}, 2500);
						});
					}
				}
			} else if (flippedCards.length < 4 && isHardClicked)
			{
				var unflippedCards = hardContainer.querySelectorAll(
					".flip-card:not(.flipped)"
				);

				if (unflippedCards.length > 0)
				{
					var correctCards = Array.from(unflippedCards).filter(function (card)
					{
						var cardId = card.querySelector(".flip-card-back").dataset.id;
						return (
							cardId == hardRandomSignToGuess[0].id ||
							cardId == hardRandomSignToGuess[1].id ||
							cardId == hardRandomSignToGuess[2].id ||
							cardId == hardRandomSignToGuess[3].id
						);
					});

					console.log(correctCards);

					if (correctCards.length > 0)
					{
						correctCards.forEach(function (card)
						{
							card.classList.add("flipped");
							setTimeout(function ()
							{
								card.classList.remove("flipped");
							}, 2500);
						});
					}
				}
			}

			setTimeout(function ()
			{
				revealButton.removeAttribute("disabled"); // Enable the button after 2500ms
			}, 2500);
		} else
		{
			navigator.vibrate(500);
		}
	});
});

freezeButtons.forEach(function (freezeButton)
{
	freezeButton.addEventListener("click", function ()
	{
		if (points >= 2)
		{
			points -= 2;
			updatePoints(points);

			freezeButton.setAttribute("disabled", "true");

			clearInterval(timerInterval);
			setTimeout(() =>
			{
				timer.forEach(function (timerElement)
				{
					// Back to 0
					timerElement.style.transition = "background-color 0.5s";
					timerElement.style.backgroundColor = "";
				});
				startTimer();
			}, 4000);

			timer.forEach(function (timerElement)
			{
				// Change timer background color to orange
				timerElement.style.transition = "background-color 0.5s";
				timerElement.style.backgroundColor = "orange";
			});
		} else
		{
			navigator.vibrate(500);
		}

		setTimeout(function ()
		{
			freezeButton.removeAttribute("disabled"); // Enable the button after 2500ms
		}, 2500);
	});
});

let easySigns;
let intermediateSigns;
let hardSigns;
let getRandomSign;

// GAME LOGIC
function fetchSigns()
{
	fetch("js/data/signs.json") // Replace with the actual URL of the signs.json file
		.then((response) =>
		{
			if (response.ok)
			{
				return response.json();
			} else
			{
				throw new Error("Failed to fetch signs.json");
			}
		})
		.then((signsData) =>
		{
			console.log(signsData);

			// EASY DIFFICULTY - GENERATES WORDS TO GUESS
			easySigns = [
				// Magandang Umaga, Lolo
				[signsData[17], signsData[13]],
				// Naiintindihan, Sign Language
				[signsData[19], signsData[28]],
				// Hello, Kumusta
				[signsData[8], signsData[11]],
				// You're welcome, Lola
				[signsData[31], signsData[12]],
			];

			// INTERMEDIATE DIFFICULTY
			intermediateSigns = [
				// natutuhan ngayong_araw paaralan
				[signsData[20], signsData[21], signsData[23]],
				// magandang_gabi hapunan bahay
				[signsData[14], signsData[7], signsData[2]],
				// excuse_me magandang_hapon oras
				[signsData[5], signsData[15], signsData[22]],
				// magandang_tanghali pangalan ikaw
				[signsData[16], signsData[25], signsData[9]],
			];

			// HARD DIFFICULTY
			hardSigns = [
				// ako almusal bahay bukas
				[signsData[0], signsData[1], signsData[2], signsData[3]],
				// excuse me pakiusap tulong emergency
				[signsData[5], signsData[24], signsData[30], signsData[4]],
				// mamaya inom gamot trabaho
				[signsData[18], signsData[10], signsData[6], signsData[29]],
				// patawad salamat lolo lola
				[signsData[26], signsData[27], signsData[13], signsData[12]],
			];

			getRandomSign = function ()
			{
				const randomIndex = Math.floor(Math.random() * signsData.length);
				return signsData[randomIndex];
			};
		})
		.catch((error) =>
		{
			// Handle the error
			console.error(error);
		});
}

// ------------ EASY ROUND ------------

let easyPhraseContainer;
let easyRandomizer;
let easyRandomSignToGuess;
let availableIndices;
let easyRandomizer2;
let easyRandomSignNotToGuess;
let signsOnEasyCards;
let h3EasyElement;
let easyCardContainer;
let flippedCards;
let signsUsed = [];
let fastestRound;
let bestSentence;

function goToEasyRound(round)
{
	console.log(`Entering Round ${round}...`);

	roundTime = 0;
	if (round === 1)
	{
		// Start the timer only at the beginning of the game
		timeLeft = 60;
		totalGameTime = 0;
		roundTimes = []; // Clear the round times array
		startTimer();
	}

	easyPhraseContainer = document.getElementById("easy-phrase");

	// Card Randomizer
	var result = cardRandomizer(
		round,
		easySigns,
		signsUsed,
		easyRandomSignToGuess,
		easyRandomSignNotToGuess
	);

	easyRandomSignToGuess = result.signsToGuess;
	easyRandomSignNotToGuess = result.signsNotToGuess;
	signsOnEasyCards = result.signsOnCards;

	// Fisher-Yates shuffle algorithm
	shuffleAlgorithm(signsOnEasyCards);

	console.log("SIGNS ON EASY CARDS:", signsOnEasyCards);

	// GENERATES THE RANDOM SIGNS ON HTML
	easyPhraseContainer.innerHTML = "";
	for (var i = 0; i < easyRandomSignToGuess.length; i++)
	{
		h3EasyElement = document.createElement("h3");
		h3EasyElement.textContent = easyRandomSignToGuess[i]["sign-name"];
		easyPhraseContainer.appendChild(h3EasyElement);
	}

	// GENERATES EASY CARD CONTAINER
	easyCardContainer = document.getElementById("easy-card-container");
	easyCardContainer.innerHTML = ""; // Clear the container

	flippedCards = [];

	// Row Count
	for (var j = 0; j < 2; j++)
	{
		var cardRow = document.createElement("div");
		cardRow.className = "card-row";

		// Design of each card in the row
		for (var i = 0; i < 2; i++)
		{
			var flipCard = document.createElement("div");
			flipCard.className = "flip-card";

			var flipCardInner = document.createElement("div");
			flipCardInner.className = "flip-card-inner";

			var flipCardFront = document.createElement("div");
			flipCardFront.className = "flip-card-front";

			var flipCardBack = document.createElement("div");
			flipCardBack.className = "flip-card-back";
			flipCardBack.dataset.id = signsOnEasyCards[i + j * 2]["id"];

			flipCardBack.style.backgroundImage =
				"url('" + signsOnEasyCards[i + j * 2]["video"] + "')";

			flipCardInner.appendChild(flipCardFront);
			flipCardInner.appendChild(flipCardBack);

			flipCard.appendChild(flipCardInner);

			cardRow.appendChild(flipCard);

			// Add event listener to each flip card
			flipCard.addEventListener("click", function ()
			{
				console.log(flipCard);
				if (flippedCards.length < 2 && !this.classList.contains("flipped"))
				{
					this.classList.toggle("flipped");
					if (this.classList.contains("flipped"))
					{
						flippedCards.push(this);
					} else
					{
						var index = flippedCards.indexOf(this);
						flippedCards.splice(index, 1);
					}

					if (flippedCards.length === 2)
					{
						var firstCardId =
							flippedCards[0].querySelector(".flip-card-back").dataset.id;
						var secondCardId =
							flippedCards[1].querySelector(".flip-card-back").dataset.id;

						if (
							firstCardId == easyRandomSignToGuess[0].id &&
							secondCardId == easyRandomSignToGuess[1].id
						)
						{
							console.log("Correct");
							round++;
							const roundInfo = {
								sign1: easyRandomSignToGuess[0]["sign-name"],
								sign2: easyRandomSignToGuess[1]["sign-name"],
								time: roundTime.toFixed(2), // May 2.5 something difference ito due to card staying animation when guessing
							};
							roundTimes.push(roundInfo);
							console.log("ROUND INFO:", roundInfo);
							if (round <= 4)
							{
								points++;
								updatePoints(points);
								console.log(points);

								updateRound(round);
								setTimeout(function ()
								{
									goToEasyRound(round);
								}, 2500);
							} else if (round > 4)
							{
								points++;
								updatePoints(points);
								console.log(points);

								// clear easyRandomSignsUsed
								signsUsed.splice(0);

								// Check if the player finished all rounds
								console.log("------------- FINISHED -------------");
								console.log("Round Times:", roundTimes);

								// Find the fastest time taken
								const fastestTime = Math.min(
									...roundTimes.map((info) => info.time)
								);
								console.log("Fastest Time:", fastestTime);

								// Find the round with the fastest time
								fastestRound = roundTimes.find(
									(info) => info.time == fastestTime
								);
								console.log("Fastest Round:", fastestRound);
								bestSentence = fastestRound.sign1 + " " + fastestRound.sign2;
								console.log(bestSentence);

								console.log("------------- FINISHED -------------");
								displayScore.textContent = timeLeft;
								displaySentence.textContent = bestSentence;

								gameOverText.innerHTML = "Congratulations!";
								gameOverContainer.style.display = "flex";
								clearInterval(timerInterval);
								gameEndedComplete();
							} else
							{
								console.log(
									"---------------GAME OVER (OUT OF TIME)---------------"
								);
								gameOverText.innerHTML = "GAME OVER";
								gameOverContainer.style.display = "flex";
							}
						} else
						{
							console.log("Wrong");
							navigator.vibrate(500);
							setTimeout(function ()
							{
								flippedCards.forEach(function (card)
								{
									card.classList.remove("flipped");
								});
								flippedCards = [];
							}, 2500);
						}
					}
				}
			});
		}

		easyCardContainer.appendChild(cardRow);
	}
}

// ------------ INTERMEDIATE ROUND ------------

let intermediatePhraseContainer;
let intermediateRandomizer;
let intermediateRandomSignToGuess;
let intermediateRandomizer2;
let intermediateRandomSignNotToGuess;
let signsOnIntermediateCards;
let h3IntermediateElement;
let intermediateCardContainer;
let intermediateRandomSignsUsed = [];

function goToIntermediateRound(round)
{
	console.log(`Entering Intermediate Round ${round}...`);

	roundTime = 0;
	if (round === 1)
	{
		// Start the timer only at the beginning of the game
		timeLeft = 90;
		totalGameTime = 0;
		roundTimes = []; // Clear the round times array
		startTimer();
	}

	intermediatePhraseContainer = document.getElementById("intermediate-phrase");

	// Card Randomizer
	var result = cardRandomizer(
		round,
		intermediateSigns,
		signsUsed,
		intermediateRandomSignToGuess,
		intermediateRandomSignNotToGuess
	);

	intermediateRandomSignToGuess = result.signsToGuess;
	intermediateRandomSignNotToGuess = result.signsNotToGuess;
	signsOnIntermediateCards = result.signsOnCards;

	// Fisher-Yates shuffle algorithm
	shuffleAlgorithm(signsOnIntermediateCards);

	console.log("signsOnIntermediateCards:", signsOnIntermediateCards);

	// GENERATES THE RANDOM SIGNS ON HTML
	intermediatePhraseContainer.innerHTML = "";
	for (var i = 0; i < intermediateRandomSignToGuess.length; i++)
	{
		h3IntermediateElement = document.createElement("h3");
		h3IntermediateElement.textContent =
			intermediateRandomSignToGuess[i]["sign-name"];
		intermediatePhraseContainer.appendChild(h3IntermediateElement);
	}

	// GENERATES EASY CARD CONTAINER
	intermediateCardContainer = document.getElementById(
		"intermediate-card-container"
	);
	intermediateCardContainer.innerHTML = ""; // Clear the container

	flippedCards = [];

	// Row Count
	for (var j = 0; j < 3; j++)
	{
		var cardRow = document.createElement("div");
		cardRow.className = "card-row";

		// Design of each card in the row
		for (var i = 0; i < 2; i++)
		{
			var flipCard = document.createElement("div");
			flipCard.className = "flip-card";

			var flipCardInner = document.createElement("div");
			flipCardInner.className = "flip-card-inner";

			var flipCardFront = document.createElement("div");
			flipCardFront.className = "flip-card-front";

			var flipCardBack = document.createElement("div");
			flipCardBack.className = "flip-card-back";
			flipCardBack.dataset.id = signsOnIntermediateCards[i + j * 2]["id"];

			flipCardBack.style.backgroundImage =
				"url('" + signsOnIntermediateCards[i + j * 2]["video"] + "')";

			flipCardInner.appendChild(flipCardFront);
			flipCardInner.appendChild(flipCardBack);

			flipCard.appendChild(flipCardInner);

			cardRow.appendChild(flipCard);

			// Add event listener to each flip card
			flipCard.addEventListener("click", function ()
			{
				if (flippedCards.length < 3 && !this.classList.contains("flipped"))
				{
					this.classList.toggle("flipped");
					if (this.classList.contains("flipped"))
					{
						flippedCards.push(this);
					} else
					{
						var index = flippedCards.indexOf(this);
						flippedCards.splice(index, 1);
					}

					if (flippedCards.length === 3)
					{
						var firstCardId =
							flippedCards[0].querySelector(".flip-card-back").dataset.id;
						var secondCardId =
							flippedCards[1].querySelector(".flip-card-back").dataset.id;
						var thirdCardId =
							flippedCards[2].querySelector(".flip-card-back").dataset.id;

						if (
							firstCardId == intermediateRandomSignToGuess[0].id &&
							secondCardId == intermediateRandomSignToGuess[1].id &&
							thirdCardId == intermediateRandomSignToGuess[2].id
						)
						{
							console.log("Correct");
							round++;
							const roundInfo = {
								sign1: intermediateRandomSignToGuess[0]["sign-name"],
								sign2: intermediateRandomSignToGuess[1]["sign-name"],
								sign3: intermediateRandomSignToGuess[2]["sign-name"],
								time: roundTime.toFixed(2), // May 2.5 something difference ito due to card staying animation when guessing
							};
							roundTimes.push(roundInfo);
							console.log("ROUND INFO:", roundInfo);
							if (round <= 4)
							{
								points += 2;
								updatePoints(points);
								console.log(points);

								updateRound(round);
								setTimeout(function ()
								{
									goToIntermediateRound(round);
								}, 2500);
							} else if (round > 4)
							{
								points += 2;
								updatePoints(points);
								console.log(points);

								// clear easyRandomSignsUsed
								intermediateRandomSignsUsed.splice(0);

								// Check if the player finished all rounds
								console.log("------------- FINISHED -------------");
								console.log("Round Times:", roundTimes);

								// Find the fastest time taken
								const fastestTime = Math.min(
									...roundTimes.map((info) => info.time)
								);
								console.log("Fastest Time:", fastestTime);

								// Find the round with the fastest time
								fastestRound = roundTimes.find(
									(info) => info.time == fastestTime
								);
								console.log("Fastest Round:", fastestRound);
								bestSentence = fastestRound.sign1 + " " + fastestRound.sign2 + " " + fastestRound.sign3;
								console.log(bestSentence);

								console.log("------------- FINISHED -------------");
								displayScore.textContent = timeLeft;
								displaySentence.textContent = bestSentence;

								gameOverText.innerHTML = "CONGRATULATIONS!";
								gameOverContainer.style.display = "flex";
								clearInterval(timerInterval);
								gameEndedComplete();
							} else
							{
								console.log(
									"---------------GAME OVER (OUT OF TIME)---------------"
								);
								gameOverText.innerHTML = "GAME OVER";
								gameOverContainer.style.display = "flex";
							}
						} else
						{
							console.log("Wrong");
							navigator.vibrate(500);
							setTimeout(function ()
							{
								flippedCards.forEach(function (card)
								{
									card.classList.remove("flipped");
								});
								flippedCards = [];
							}, 2500);
						}
					}
				}
			});
		}

		intermediateCardContainer.appendChild(cardRow);
	}
}

// ------------ HARD ROUND ------------

let hardPhraseContainer;
let hardRandomizer;
let hardRandomSignToGuess;
let hardRandomizer2;
let hardRandomSignNotToGuess;
let signsOnHardCards;
let h3hardElement;
let hardCardContainer;
let hardRandomSignsUsed = [];

function goToHardRound(round)
{
	console.log(`Entering Hard Round ${round}...`);

	roundTime = 0;
	if (round === 1)
	{
		// Start the timer only at the beginning of the game
		timeLeft = 120;
		totalGameTime = 0;
		roundTimes = []; // Clear the round times array
		startTimer();
	}

	hardPhraseContainer = document.getElementById("hard-phrase");

	// Card Randomizer
	var result = cardRandomizer(
		round,
		hardSigns,
		signsUsed,
		hardRandomSignToGuess,
		hardRandomSignNotToGuess
	);

	hardRandomSignToGuess = result.signsToGuess;
	hardRandomSignNotToGuess = result.signsNotToGuess;
	signsOnHardCards = result.signsOnCards;

	// This adds an extra card because the cards to guess in Hard mode is 9.
	let existingIds = signsOnHardCards.map((sign) => sign.id);

	do
	{
		randomSign = getRandomSign();
	} while (existingIds.includes(randomSign.id));

	signsOnHardCards.push(randomSign);

	// Fisher-Yates shuffle algorithm
	shuffleAlgorithm(signsOnHardCards);

	console.log("signsOnHardCards:", signsOnHardCards);

	// GENERATES THE RANDOM SIGNS ON HTML
	hardPhraseContainer.innerHTML = "";
	for (var i = 0; i < hardRandomSignToGuess.length; i++)
	{
		h3hardElement = document.createElement("h3");
		h3hardElement.textContent = hardRandomSignToGuess[i]["sign-name"];
		hardPhraseContainer.appendChild(h3hardElement);
	}

	// GENERATES EASY CARD CONTAINER
	hardCardContainer = document.getElementById("hard-card-container");
	hardCardContainer.innerHTML = ""; // Clear the container

	flippedCards = [];

	// Row Count
	for (var j = 0; j < 3; j++)
	{
		var cardRow = document.createElement("div");
		cardRow.className = "card-row";

		// Design of each card in the row
		for (var i = 0; i < 3; i++)
		{
			var flipCard = document.createElement("div");
			flipCard.className = "flip-card";

			var flipCardInner = document.createElement("div");
			flipCardInner.className = "flip-card-inner";

			var flipCardFront = document.createElement("div");
			flipCardFront.className = "flip-card-front";

			var flipCardBack = document.createElement("div");
			flipCardBack.className = "flip-card-back";
			flipCardBack.dataset.id = signsOnHardCards[i + j * 3]["id"];

			flipCardBack.style.backgroundImage =
				"url('" + signsOnHardCards[i + j * 3]["video"] + "')";

			flipCardInner.appendChild(flipCardFront);
			flipCardInner.appendChild(flipCardBack);

			flipCard.appendChild(flipCardInner);

			cardRow.appendChild(flipCard);

			// Add event listener to each flip card
			flipCard.addEventListener("click", function ()
			{
				if (flippedCards.length < 4 && !this.classList.contains("flipped"))
				{
					this.classList.toggle("flipped");
					if (this.classList.contains("flipped"))
					{
						flippedCards.push(this);
					} else
					{
						var index = flippedCards.indexOf(this);
						flippedCards.splice(index, 1);
					}

					if (flippedCards.length === 4)
					{
						var firstCardId =
							flippedCards[0].querySelector(".flip-card-back").dataset.id;
						var secondCardId =
							flippedCards[1].querySelector(".flip-card-back").dataset.id;
						var thirdCardId =
							flippedCards[2].querySelector(".flip-card-back").dataset.id;
						var fourthCardId =
							flippedCards[3].querySelector(".flip-card-back").dataset.id;

						if (
							firstCardId == hardRandomSignToGuess[0].id &&
							secondCardId == hardRandomSignToGuess[1].id &&
							thirdCardId == hardRandomSignToGuess[2].id &&
							fourthCardId == hardRandomSignToGuess[3].id
						)
						{
							console.log("Correct");
							round++;
							const roundInfo = {
								sign1: hardRandomSignToGuess[0]["sign-name"],
								sign2: hardRandomSignToGuess[1]["sign-name"],
								sign3: hardRandomSignToGuess[2]["sign-name"],
								sign4: hardRandomSignToGuess[3]["sign-name"],
								time: roundTime.toFixed(2), // May 2.5 something difference ito due to card staying animation when guessing
							};
							roundTimes.push(roundInfo);
							console.log("ROUND INFO:", roundInfo);
							if (round <= 4)
							{
								points += 3;
								updatePoints(points);
								console.log(points);

								updateRound(round);
								setTimeout(function ()
								{
									goToHardRound(round);
								}, 2500);
							} else if (round > 4)
							{
								points += 3;
								updatePoints(points);
								console.log(points);

								// clear easyRandomSignsUsed
								hardRandomSignsUsed.splice(0);

								// Check if the player finished all rounds
								console.log("------------- FINISHED -------------");
								console.log("Round Times:", roundTimes);

								// Find the fastest time taken
								const fastestTime = Math.min(
									...roundTimes.map((info) => info.time)
								);
								console.log("Fastest Time:", fastestTime);

								// Find the round with the fastest time
								fastestRound = roundTimes.find(
									(info) => info.time == fastestTime
								);
								console.log("Fastest Round:", fastestRound);
								bestSentence = fastestRound.sign1 + " " + fastestRound.sign2 + " " + fastestRound.sign3 + " " + fastestRound.sign4;
								console.log(bestSentence);

								console.log("------------- FINISHED -------------");
								displayScore.textContent = timeLeft;
								displaySentence.textContent = bestSentence;

								gameOverText.innerHTML = "CONGRATULATIONS!";
								gameOverContainer.style.display = "flex";
								clearInterval(timerInterval);
								gameEndedComplete();
							} else
							{
								console.log(
									"---------------GAME OVER (OUT OF TIME)---------------"
								);
								gameOverText.innerHTML = "GAME OVER";
								gameOverContainer.style.display = "flex";
							}
						} else
						{
							console.log("Wrong");
							navigator.vibrate(500);
							setTimeout(function ()
							{
								flippedCards.forEach(function (card)
								{
									card.classList.remove("flipped");
								});
								flippedCards = [];
							}, 2500);
						}
					}
				}
			});
		}

		hardCardContainer.appendChild(cardRow);
	}
}

fetchSigns();

// Fisher-Yates shuffle algorithm
function shuffleAlgorithm(cards)
{
	for (var i = cards.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		[cards[i], cards[j]] = [cards[j], cards[i]];
	}
}

// Randomizer
function cardRandomizer(round, signs, signsUsed, signToGuess, signNotToGuess)
{
	if (round > 1)
	{
		// Generate a new easyRandomSignToGuess that is not repeated
		var newRandomizer;
		do
		{
			newRandomizer = Math.floor(Math.random() * signs.length);
			console.log("newRandomizer: ", newRandomizer);
			console.log("signsUsed: ", signsUsed);
			console.log(
				"signsUsed.includes(newRandomizer): ",
				signsUsed.includes(newRandomizer)
			);
		} while (signsUsed.includes(newRandomizer));

		signsUsed.push(newRandomizer);

		signToGuess = signs[newRandomizer];
		console.log("SIGN TO GUESS:", signToGuess);
	} else
	{
		// RANDOMIZER - SIGNS TO GUESS
		easyRandomizer = Math.floor(Math.random() * signs.length);
		signsUsed.push(easyRandomizer);

		signToGuess = signs[easyRandomizer];
		console.log("signToGuess", signToGuess);
	}

	// RANDOMIZER - SIGNS NOT TO GUESS
	availableIndices = Array.from(Array(signs.length).keys());
	availableIndices.splice(easyRandomizer, 1);

	// RANDOMIZER FOR SIGNS THAT ARE NOT TO GUESS
	do
	{
		easyRandomizer2 =
			availableIndices[Math.floor(Math.random() * availableIndices.length)];
	} while (
		easyRandomizer2 === easyRandomizer ||
		signs[easyRandomizer2] === signToGuess
	);

	signNotToGuess = signs[easyRandomizer2];
	console.log("signNotToGuess: ", signNotToGuess);

	var signsOnCards = [...signToGuess, ...signNotToGuess];

	return {
		signsToGuess: signToGuess,
		signsNotToGuess: signNotToGuess,
		signsOnCards: signsOnCards,
	};
}

// Get all the how-to step containers
const instructionContainers = document.querySelectorAll(
	".instruction-container"
);
const previousButtons = document.querySelectorAll(".previous-button");
const nextButtons = document.querySelectorAll(".next-button");

var currentStep = 0;

// Function to show the current step
function showStep(stepIndex)
{
	// Hide all the step containers
	instructionContainers.forEach((container) =>
	{
		container.classList.remove("active");
	});

	// Show the current step container
	instructionContainers[stepIndex].classList.add("active");

	// Disable/enable previous and next buttons based on the current step
	if (stepIndex === 0)
	{
		previousButtons.forEach((button) =>
		{
			button.disabled = true;
		});
	} else
	{
		previousButtons.forEach((button) =>
		{
			button.disabled = false;
		});
	}

	if (stepIndex === instructionContainers.length - 1)
	{
		nextButtons.forEach((button) =>
		{
			button.disabled = true;
		});
	} else
	{
		nextButtons.forEach((button) =>
		{
			button.disabled = false;
		});
	}
}

// Show the initial step
showStep(currentStep);

// Event listeners for the previous buttons
previousButtons.forEach((button) =>
{
	button.addEventListener("click", () =>
	{
		if (currentStep > 0)
		{
			currentStep--;
			showStep(currentStep);
		}
	});
});

// Event listeners for the next buttons
nextButtons.forEach((button) =>
{
	button.addEventListener("click", () =>
	{
		if (currentStep < instructionContainers.length - 1)
		{
			currentStep++;
			showStep(currentStep);
		}
	});
});

const homeButtons = document.querySelectorAll(".home-button");

homeButtons.forEach(function (homeButton)
{
	homeButton.addEventListener("click", function ()
	{
		instructionContainer.style.display = "none";
		homeContainer.style.display = "flex";
	});
});
