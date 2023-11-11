
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
// writerBox.onload = playAudio(backgroundAudio, true);
window.addEventListener('DOMContentLoaded', playAudio(backgroundAudio, true), false);

// main options when play {a game racer typing}
let content = currentPara.split(' '); // split all context to words separate by (space)
let char_num = 0; // the character number [index]
let para_char_num = 0; // the total character numbers of paragraph as [index] {access on all chars in para}
let timeout_game = 1.3; // timeout of the game is 1.3 minute [to get millisecond: minutes * 60 * 1000]
let words_done = 0; // number of words done correctly

let spaceKey = false;
let delKey = false;

// ======================== work on ========================
textBackWriter.addEventListener('click', ()=> inputUser.focus());

// check key pressed
inputUser.addEventListener('keydown', (e)=> {
    if(e.keyCode == 32) {
        spaceKey = true;
        delKey = false;
    }
    else if(e.keyCode == 8) {
        delKey = true;
        spaceKey = false;
    }
    else {
        spaceKey = false;
        delKey = false;
    }
})

inputUser.addEventListener('input', (e)=> {
    // add audio sound press key
    let pressKeyAud = new Audio('./assets/sound/click.wav');

    let input_char_index = e.target.value.length;
    // for space key [change all game
    if(spaceKey) { // if pressed space >> 32
        if(!input_char_index) { // if value empty '' {do nothing
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            playAudio(pressKeyAud, false);
        } else { // else
            if(e.target.value.trim() != content[words_done]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                if(!hasClass(e.target, 'error')) clickError(e.target, 'error');
                if(!delKey) letterActive(para_char_num, 'error');
            } else { // else {the space key is true then continue
                if(!delKey) letterActive(para_char_num, 'done');
                words_done++;
                para_char_num++;
                e.target.value = '';
                char_num = input_char_index;
                playAudio(pressKeyAud, false);
            }
        }
        console.log('space')
    } else if(delKey) { // if delete key pressed {go back chars}
        if(input_char_index < 0) { // if input.value not= empty {do nothing}
            if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
            false;
        } else { // else
            // go back by classes
            letterBack(para_char_num /*this current char_index*/, para_char_num - 1 /*this old char_index*/);
            // if input.value[char before last] not= space {-para_char}
            if(e.target.value[input_char_index - 1] != '&nbsp') {
                para_char_num--;
                console.log('whitespace here')
            }
            // remove {error input} if input true or input empty
            if(content[words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
            // play sound
            playAudio(pressKeyAud, false);
            console.log('deleted key with value', para_char_num - 1)
        }
        console.log('del')
    } else { // else {that meaning normal key pressed
        if(e.target.value[input_char_index -1] == content[words_done][input_char_index -1]) { // if value[charIndex] == content[textIndex][charIndex] [[[content[words_done].includes(e.target.value)]]]
            letterActive(para_char_num, 'done');
            playAudio(pressKeyAud, false);
        } else { // else
            clickError(e.target, 'error');
        }
        console.log('normal')
        // then whatever go next
        char_num = input_char_index;
        para_char_num++;
    }

    console.log(para_char_num + ': para_char_num |', char_num + ': char_num |', words_done + ': words_done |', input_char_index + ': input_char_index;');
})


// ==================== Active functions ====================
function clickError(el, className) {
    addClass(el, className);
    let pressKeyAud = new Audio('./assets/sound/err_click.mp3');
    playAudio(pressKeyAud, false);
}

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
    // console.log(para_letters[char_index]);
}
function letterBack(currChar_index, toChar_index) {
    if(currChar_index < 0 || toChar_index < 0) return;
    removeClass(para_letters[currChar_index], 'letter-active') // remove currentChar active
    if(hasClass(para_letters[toChar_index], 'done')) { // if toChar done
        removeClass(para_letters[toChar_index], 'done') // remove toChar done
        addClass(para_letters[toChar_index], 'letter-active') // add toChar active
        if(para_letters[currChar_index + 1]) if(hasClass(para_letters[currChar_index + 1], 'letter-active')) removeClass(para_letters[currChar_index + 1], 'letter-active')
    } else if (para_letters[toChar_index], 'error') { // if toChar error
        removeClass(para_letters[toChar_index], 'error') // remove toChar error
        addClass(para_letters[toChar_index], 'letter-active') // add toChar active
        if(para_letters[currChar_index + 1]) if(hasClass(para_letters[currChar_index + 1], 'letter-active')) removeClass(para_letters[currChar_index + 1], 'letter-active')
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

var containsWhitespace = function(str){
	return /\s/g.test(str);
};

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