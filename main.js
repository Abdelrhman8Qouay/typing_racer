

// ======================== all variables ========================
// main vars (exists always)
const app = document.querySelector('.app'),
changerContainer = document.querySelector('.changerContainer'),

// ------- {before ready} -------
// vars
boardBox = document.querySelector('.board_box'),
btnStart = document.getElementById('btnStart'),
// Info
gameTimeEle = document.getElementById('time_game_done'),
wordsEle = document.getElementById('words_num'),
charsEle = document.getElementById('chars_num'),
wpmEle = document.getElementById('wpm'),
accuracyEle = document.getElementById('accuracy'),

// ------- {game begin} -------
// vars
gameBox = document.querySelector('.game_box'),
writerBox = document.querySelector('.game_box .writerBox'),
backgroundAudio = document.getElementById('bgAudio'),
paraContainerEle = document.querySelector('.game_box .writerBox .para_container'),
typeInput = document.querySelector('.game_box .writerBox #userInput'),
// Game Info
gameLiveTime = document.querySelector('.game_box .writerBox .game_time'),
wpmLiveTime = document.getElementById('wpmLive'),
accLiveTime = document.getElementById('accuracyLive'),

// ------- keyboard vars -------
all_keyboard_keys = document.querySelectorAll('.keyboard .keyboard-row .keyboard-key.key');
var para_letters = [];



var gameObj = {};
// ======================== DOM Content Loaded ========================
document.addEventListener('DOMContentLoaded', async ()=>{
    // ======================== Before Ready ========================
    fetchData('./assets/data/context.json')
    .then(paragraphs => {
        // when click let's begin the game
        btnStart.onclick = () => start(paragraphs, 150);

    }).catch(error => console.error('Error fetching JSON: ', error));
})



function start(paragraphs, game_timeout) {
    // Create new Game
    gameObj = new Game(paragraphs, game_timeout);

    // Start the game
    gameObj.startGame();
    
    console.log(gameObj.current_para);
    // // main options when play {a game racer typing}  >>>> (was here before create the class of game)
    
    // ============== Game Started ==============
    // focus the input when begin & when click on textBack
    UI.focusInput(typeInput);
    paraContainerEle.addEventListener('click', ()=> UI.focusInput(typeInput));

    // check key pressed
    typeInput.addEventListener('keydown', (e)=> gameObj.keyActivated(e))

    // the process of type game
    typeInput.addEventListener('input', (e)=> gameObj.typing(e))
} 