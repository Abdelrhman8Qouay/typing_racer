
// ======================== get data ========================
import paras from './data.json' assert {type: 'json'};

// ======================== get audios ========================

// ======================== all variables ========================
// main vars
const app = document.querySelector('.app'),
// changer container {before ready}
changerContainer = document.querySelector('.changerContainer'),
btnStart = document.getElementById('btnStart'),
// game vars {game begin}
writerBox = document.querySelector('.writerBox'),
backgroundAudio = document.getElementById('bgAudio'),
textBackWriter = document.querySelector('.writerBox .back'),
inputUser = document.querySelector('.writerBox .front-user');

// ======================== Before Ready ========================

// ======================== Game Begin ========================
// get random content from data
let currentPara = paras[Math.floor(Math.random() * paras.length)].para;
// add data of content to ready play
textBackWriter.innerHTML = '';
for(let i = 0; i < currentPara.length; i++) {
    if(i == 0) {
        textBackWriter.innerHTML += `<span class="letter letter-active" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
    } else {
        textBackWriter.innerHTML += `<span class="letter" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
    }
}
const para_letters = document.querySelectorAll('.writerBox .back .letter');

// play background audio
writerBox.onload = playAudio(backgroundAudio, true);

// main options when play {a game racer typing}
let content = currentPara.split(' '); // split all context to words separate by (space)
let text_num = 0; // the text number [index]
let char_num = 0; // the character number [index]
let para_char_num = 0; // the total character numbers of paragraph as [index] {access on all chars in para}
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

    // add audio sound press key
    let pressKeyAud = new Audio('./assets/sound/click.wav');
    playAudio(pressKeyAud, false);

    let old_char_num = char_num;
    let input_char_index = e.target.value.length - 1;
    // for space key [change all game
    if(spaceKey) { // if pressed space >> 32
        if(!e.target.value) { // if value empty '' {do nothing
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
        } else { // else
            if(hasClass(e.target, 'error')) { // if contains (error class) {do nothing
                false;
            }else { // else {to continue typing racer with new word
                if(e.target.value.trim() != content[text_num]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                    if(!hasClass(e.target, 'error')) addClass(e.target, 'error');
                    if(!(old_char_num > input_char_index)) letterActive(char_num, 'error');
                } else { // else {the space key is true then continue
                    if(!(old_char_num > input_char_index)) letterActive(char_num, 'done');
                    text_num++;
                    e.target.value = '';
                    char_num = input_char_index;
                }
            }
        }
    }else { // else {for normal work
        if(e.target.value[char_num] == content[text_num][char_num] && content[text_num].includes(e.target.value)) { // if value[charIndex] == content[textIndex][charIndex]
            if(e.target.classList.contains('error')) e.target.classList.remove('error');
            console.log('if char corr')
            if(!(old_char_num > input_char_index)) letterActive(char_num, 'done');
        } else { // else
            e.target.classList.add('error');
            console.log('if char err')
            if(!(old_char_num > input_char_index)) letterActive(char_num, 'error');
        }
        char_num = input_char_index;
        para_char_num++;
    }

    // when delete chars
    if(old_char_num > input_char_index) letterBack(old_char_num, input_char_index);
})

// console.log(para_letters)

// ==================== Active functions ====================
function letterActive(char_index, char_status) {
    if(char_index < 0) return;
    if(char_status == 'done') {
        addClass(para_letters[char_index], 'done')
        removeClass(para_letters[char_index], 'letter-active')
        if(para_letters[char_index + 1]) addClass(para_letters[char_index + 1], 'letter-active');
    } else if(char_status == 'error') {
        addClass(para_letters[char_index], 'error')
        removeClass(para_letters[char_index], 'letter-active')
        if(para_letters[char_index + 1]) addClass(para_letters[char_index + 1], 'letter-active');
    }
    console.log(para_letters[char_index]);
}
function letterBack(currChar_index, toChar_index) {
    if(currChar_index < 0 || toChar_index < 0) return;
    removeClass(para_letters[currChar_index], 'letter-active')
    if(hasClass(para_letters[toChar_index], 'done')) {
        removeClass(para_letters[currChar_index], 'done')
        addClass(para_letters[currChar_index], 'letter-active')
    } else if (para_letters[toChar_index], 'error') {
        removeClass(para_letters[currChar_index], 'error')
        addClass(para_letters[currChar_index], 'letter-active')
    }
}

function playAudio(aud, audioLoop) {
    if(audioLoop) {
        aud.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    aud.volume = '0.6';
    aud.preload = 'none';
    aud.play();
}

function hasClass(el, className)
{
    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className)
{
    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className)
{
    if (el.classList)
        el.classList.remove(className)
    else if (hasClass(el, className))
    {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(reg, ' ');
    }
}