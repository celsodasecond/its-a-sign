const gameoverButton = document.getElementById('gameover-button');
const sendScoreButton = document.getElementById('send-highscore-button');
const refreshScoreButton = document.getElementById('refresh-leaderboard-button');

const gameoverContainer = document.getElementById('gameover-container-bg');
const currentPositionGroup = document.getElementById('current-position-group');
const highscoreForm = document.getElementById("send-highscore-form");
const leaderboadCon = document.getElementById("leaderboard-container");

const usernameText = document.getElementById("username-text");
const difficultyText = document.getElementById("difficulty-text");
const scoreText = document.getElementById("score-text");
const sentenceText = document.getElementById("sentence-text");

const firstUsernameText = document.getElementById("first-place-username");
const firstScoreText = document.getElementById("first-place-score");
const firstSentenceText = document.getElementById("first-place-sentence");
const firstAvatar = document.getElementById("first-place-avatar");

const secondUsernameText = document.getElementById("second-place-username");
const secondScoreText = document.getElementById("second-place-score");
const secondSentenceText = document.getElementById("second-place-sentence");
const secondAvatar = document.getElementById("second-place-avatar");

const thirdUsernameText = document.getElementById("third-place-username");
const thirdScoreText = document.getElementById("third-place-score");
const thirdSentenceText = document.getElementById("third-place-sentence");
const thirdAvatar = document.getElementById("third-place-avatar");

const currentUsernameText = document.getElementById("current-place-username");
const currentScoreText = document.getElementById("current-place-score");
const currentSentenceText = document.getElementById("current-place-sentence");
const currentPositionText = document.getElementById("current-position");
const currentAvatar = document.getElementById("current-place-avatar");

const difficultyDropdown = document.getElementById("difficulty-dropdown");

const loadingAnimationLeaderBoardRefresh =
    document.getElementById("loading-animation-leaderboard-refresh");
const loadingAnimationLeaderBoardSend =
    document.getElementById("loading-animation-leaderboard-send");


let isGameOverOn = false;

// Test Case
let user_id_test = 41;
let difficulty_test = 'easy';
let score_test = 3.23;
let sentence_test = "ano ikaw tao ba";

// Add event listener to the form submission
highscoreForm.addEventListener("submit", submitHighscore);

refreshScoreButton.addEventListener('click', function ()
{
    event.preventDefault();

    refreshScoreButton.style.display = "none";
    loadingAnimationLeaderBoardRefresh.style.display = "inline-block";

    const formData = new FormData(highscoreForm);

    formData.append('user_id', user_id_test);
    formData.append('difficulty', difficultyDropdown.value);

    let success = false;
    let dataLB = null;

    // Make a POST request with the form data
    fetch('https://itsasign.000webhostapp.com/API/retrieveLeaderboard.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data =>
        {
            dataLB = data;

            resetLeaderboards();
            leaderboadCon.style.display = "inline-block";

            firstUsernameText.textContent = dataLB[0].username;
            firstScoreText.textContent = dataLB[0].score;
            firstSentenceText.textContent = dataLB[0].sentence;
            firstAvatar.setAttribute('src', "avatars/" + dataLB[0].avatar_id + ".png");

            secondUsernameText.textContent = dataLB[1].username;
            secondScoreText.textContent = dataLB[1].score;
            secondSentenceText.textContent = dataLB[1].sentence;
            secondAvatar.setAttribute('src', "avatars/" + dataLB[1].avatar_id + ".png");

            thirdUsernameText.textContent = dataLB[2].username;
            thirdScoreText.textContent = dataLB[2].score;
            thirdSentenceText.textContent = dataLB[2].sentence;
            thirdAvatar.setAttribute('src', "avatars/" + dataLB[2].avatar_id + ".png");

            currentPositionGroup.style.display = "none";

            if (dataLB[3] == null) return;
            if (parseInt(dataLB[3].position) < 4) return;
            currentPositionGroup.style.display = "flex";

            currentPositionText.textContent = dataLB[3].position;
            currentUsernameText.textContent = dataLB[3].username;
            currentScoreText.textContent = dataLB[3].score;
            currentSentenceText.textContent = dataLB[3].sentence;
            currentAvatar.setAttribute('src', "avatars/" + dataLB[3].avatar_id + ".png");

        })
        .catch(error =>
        {
            console.log("Something went wrong. Please try again.", error);
        })
        .finally(() =>
        {
            refreshScoreButton.style.display = "inline-block";
            loadingAnimationLeaderBoardRefresh.style.display = "none";
        });
});

gameoverButton.addEventListener('click', () =>
{
    isGameOverOn = !isGameOverOn;
    if (isGameOverOn)
    {
        gameoverContainer.style.display = "flex";
        gameIsOver();
    } else
    {
        gameoverContainer.style.display = "none";
    }
});

function gameIsOver()
{
    usernameText.textContent = user_id_test;
    difficultyText.textContent = difficulty_test;
    scoreText.textContent = score_test;
    sentenceText.textContent = sentence_test;
}


function submitHighscore(event)
{
    event.preventDefault();

    sendScoreButton.style.display = "none";
    loadingAnimationLeaderBoardSend.style.display = "inline-block";

    const formData = new FormData(highscoreForm);

    formData.append('user_id', user_id_test);
    formData.append('difficulty', difficulty_test);
    formData.append('score', score_test);
    formData.append('word', sentence_test);

    // Make a POST request with the form data
    fetch('https://itsasign.000webhostapp.com/API/addScore.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data =>
        {
            if (data == "score added")
                console.log("score added");
            else console.log(data);
        })
        .catch(error =>
        {
            console.log("Something went wrong. Please try again.");
        })
        .finally(() =>
        {
            sendScoreButton.style.display = "inline-block";
            loadingAnimationLeaderBoardSend.style.display = "none";
        });
}

function resetLeaderboards()
{
    firstUsernameText.textContent = "";
    firstScoreText.textContent = "";
    firstSentenceText.textContent = "";
    firstAvatar.setAttribute('src', "avatars/1.png");

    secondUsernameText.textContent = "";
    secondScoreText.textContent = "";
    firstAvatar.setAttribute('src', "avatars/1.png");

    thirdUsernameText.textContent = "";
    thirdScoreText.textContent = "";
    firstAvatar.setAttribute('src', "avatars/1.png");
}