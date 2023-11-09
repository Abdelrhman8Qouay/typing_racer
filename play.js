
// ======================== get Data ========================
import paras from './data.json' assert {type: 'json'};

// ======================== all variables ========================
const writerBox = document.querySelector('.writerBox'),
textBackWriter = document.querySelector('.writerBox .back'),
inputUser = document.querySelector('.writerBox .front-user');

// get random content from data
let currentPara = paras[Math.floor(Math.random() * paras.length)];
// add data of content to ready play
textBackWriter.innerHTML = '';
for(let i = 0; i < currentPara.length; i++) {
    textBackWriter.innerHTML += `<span class="letter letter-active">${currentPara[i]}</span>`;
}

// main options when play {a game racer typing}
let content = currentPara.split(' '); // split all context to words separate by (space)
let text_num = 0; // the text number [index]
let char_num = 0; // the character number [index]
let timeout_game = 1.3; // timeout of the game is 1.3 minute [to get millisecond: minutes * 60 * 1000]
let words_done = 0; // number of words done correctly

let spaceKey = false;

// ======================== work on ========================
textBackWriter.addEventListener('click', ()=> inputUser.focus());

// check key pressed
inputUser.addEventListener('keypress', (e)=> {
    if(e.keyCode == 32) spaceKey = true;
    else spaceKey = false;
})

inputUser.addEventListener('input', (e)=> {
    // for space key [change all game
    if(spaceKey) { // if pressed space >> 32
        if(!e.target.value) { // if value empty '' {do nothing
            e.target.value = '';
        } else { // else
            if(e.target.classList.contains('error')) { // if contains (error class) {do nothing
                false;
            }else { // else {to continue typing racer with new word
                if(e.target.value.trim() != content[text_num]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                    if(!e.target.classList.contains('error')) e.target.classList.add('error');
                } else { // else {the space key is true then continue
                    text_num++;
                    e.target.value = '';
                    char_num = e.target.value.length;
                }
            }
        }
    }else { // else {for normal work
        if(e.target.value[char_num] == content[text_num][char_num] && content[text_num].includes(e.target.value)) { // if value[charIndex] == content[textIndex][charIndex]
            if(e.target.classList.contains('error')) e.target.classList.remove('error');
            console.log('if char corr')
        } else { // else
            e.target.classList.add('error');
            console.log('if char err')
        }
        char_num = e.target.value.length;
    }
})
