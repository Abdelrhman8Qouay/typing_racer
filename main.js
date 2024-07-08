

// ======================== all variables ========================
// main vars
const app = document.querySelector('.app'),
// changer container {before ready}
changerContainer = document.querySelector('.changerContainer'),
time_game_done = document.getElementById('time_game_done'),
readyBox = document.querySelector('.ready_box'),
btnStart = document.getElementById('btnStart'),
words_num = document.getElementById('words_num'),
chars_num = document.getElementById('chars_num'),
// game vars {game begin}
gameBox = document.querySelector('.game_box'),
writerBox = document.querySelector('.writerBox'),
backgroundAudio = document.getElementById('bgAudio'),
textBackWriter = document.querySelector('.writerBox .back'),
gameTimeNow = document.querySelector('.writerBox .game_time'),
inputUser = document.querySelector('.writerBox .front-user'),
// keyboard vars
all_keyboard_keys = document.querySelectorAll('.keyboard .keyboard-row .keyboard-key.key');

let para_letters = [];
var newGame = {};



// ======================== DOM Content Loaded ========================
document.addEventListener('DOMContentLoaded', async ()=>{
    // ======================== Before Ready ========================
    fetchData('./assets/data/context.json')
    .then(paragraphs => {
        // when click let's begin the game
        btnStart.onclick = () => {

            // Create new Game
            createGame(paragraphs, 3);

            // Start the game
            newGame.startGame();

            // ============== Game Started ==============
            // get the letters as variables
            para_letters = document.querySelectorAll('.writerBox .back .letter');

            console.log(newGame.current_para);
            // // main options when play {a game racer typing}  >>>> (was here before create the class of game)

            // when click on textBack
            textBackWriter.addEventListener('click', ()=> focusInput(inputUser));

            // check key pressed
            inputUser.addEventListener('keydown', (e)=> keyActivated(e, newGame))

            // the process of type game
            inputUser.addEventListener('input', (e)=> typing(e, newGame))

        };

    }).catch(error => console.error('Error fetching JSON:', error));
})

function createGame(paras, game_timeout) {
    newGame = new Game(paras, game_timeout);
} 