
// ======================== get data ========================
import paras from './data.json' assert {type: 'json'};

// ======================== get audios ========================

// ======================== all variables ========================
// main vars
const app = document.querySelector('.app'),
// changer container {before ready}
changerContainer = document.querySelector('.changerContainer'),
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

// ======================== Before Ready ========================
let random_num_paras = Math.floor(Math.random() * paras.length); // random number with length of paragraphs exists
let game_timeout = 140;
gameTimeNow.innerText = game_timeout;

let currentPara = paras[random_num_paras].para; // get random content from data
btnStart.onclick = () => letsStart(); // when click let's begin the game

// ======================== Game Begin ========================
// add data of content to ready play
textBackWriter.innerHTML = '';
for(let i = 0; i < currentPara.length; i++) {
    if(i == 0) {
        textBackWriter.innerHTML += `<span class="letter letter-active" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
        keyActive(i); // to add the first char active on keyboard
    } else {
        textBackWriter.innerHTML += `<span class="letter" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
    }
}
const para_letters = document.querySelectorAll('.writerBox .back .letter');


// main options when play {a game racer typing}
let content = currentPara.split(' '); // split all context to words separate by (space)
let char_num = 0; // the character number [index]
let para_char_num = 0; // the total character numbers of paragraph as [index] {access on all chars in para}
let words_done = 0; // number of words done correctly

let event_key = {code: '' /*Example: KeyE or KeyE the same */, key: '' /*Example: e or E */};

// ======================== work on ========================
textBackWriter.addEventListener('click', ()=> inputUser.focus());

// check key pressed
inputUser.addEventListener('keydown', (e)=> {
    event_key.code = e.code; event_key.key = e.key;
})

inputUser.addEventListener('input', (e)=> {
    // add audio sound press key
    let pressKeyAud = new Audio('./assets/sound/click.wav');

    let input_char_index = e.target.value.length;
    // for space key [change all game
    if(event_key.code == 'Space') { // if pressed space >> 32
        if(!input_char_index) { // if value empty '' {do nothing
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            playAudio(pressKeyAud, false);
        } else { // else
            if(e.target.value.trim() != content[words_done]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                if(!hasClass(e.target, 'error')) clickError(e.target, 'error');
                letterActive(para_char_num, 'error');
            } else { // else {the space key is true then continue
                words_done++; // add words done
                removeClass(para_letters[para_char_num], 'letter-active'); // remove active for space char
                para_char_num++; // from space char to first char in new word
                addClass(para_letters[para_char_num], 'letter-active'); // add active for new char
                keyActive(para_char_num); // add active for new char on keyboard
                e.target.value = '';
                char_num = input_char_index; // make char_num length is 0
                playAudio(pressKeyAud, false);

                if(!currentPara[para_char_num] && currentPara[para_char_num] != '&nbsp') endGame();
            }
        }
        console.log('space')
    } else if(event_key.code == 'Backspace') { // if delete key pressed {go back chars}
        if(!input_char_index) { // if input.value = empty {do nothing}
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            false;
        } else { // else
            // go back by classes
            letterBack(para_char_num /*this current char_index*/, para_char_num - 1 /*this old char_index*/);
            // if input.value[char before last] not= space {-para_char} && this char of this word not space {that meaning you kill the game when break done word}
            if(e.target.value[input_char_index - 1] != '&nbsp' && content[words_done][input_char_index - 1] != '&nbsp' ) {
                para_char_num--;
            }
            // remove {error input} if input true or input empty
            if(content[words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
            // play sound
            playAudio(pressKeyAud, false);
        }
        console.log('del')
    } else { // else {that meaning normal key pressed
        if(e.target.value[input_char_index -1] == content[words_done][input_char_index -1] && content[words_done][input_char_index -1].includes(e.target.value[input_char_index -1])) { // if value[inputCharIndex] == content[wordIndex][inputCharIndex]
            letterActive(para_char_num, 'done');
            playAudio(pressKeyAud, false);
            para_char_num++; // then go next
            if(!currentPara[para_char_num] && currentPara[para_char_num] != '&nbsp') endGame();
        } else { // else {that is meaning this char is not correct}
            if(para_letters[para_char_num - 1]) { // if before last exists>>
                if(hasClass(para_letters[para_char_num - 1], 'error')) { // if before last has error>>
                    clickError(null, null, true); //open audio error only
                    e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                } else {
                    clickError(e.target, 'error');
                    letterActive(para_char_num, 'error'); // make error on this char
                    para_char_num++; // then go next
                }
            } else { // else {go next whatever}
                clickError(e.target, 'error');
                letterActive(para_char_num, 'error'); // make error on this char
                para_char_num++; // then go next
            }
        }
        // then whatever go next
        char_num = input_char_index;
        console.log('normal')
    }


    console.log(para_char_num + ': para_char_num |', char_num + ': char_num |', words_done + ': words_done |', input_char_index + ': input_char_index;');
})




// ==================== Active functions ====================
function clickError(el = null, className = null, audOnly = false) {
    if(!audOnly && el && className) addClass(el, className);
    let pressKeyAud = new Audio('./assets/sound/err_click.mp3');
    playAudio(pressKeyAud, false);
}

function keyActive(char_index, char_status = null) {
    // active the current char on keyboard
    all_keyboard_keys.forEach(key=> {
        // remove all activity keys {then >> make specific active key}
        removeClass(key, 'is-active');

        var child2 = key.children[1] ? key.children[1] : key.children[0]; // if child 2 exists or make it child 1 again
        if(key.children[0].innerText == currentPara[char_index].toUpperCase() || child2.innerText == currentPara[char_index].toUpperCase()) { // if child1 = curr lower char or child2 then>>
            // to active the specific key
            addClass(key, 'is-active');

            if(/[A-Z]/.test(currentPara[char_index]) || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(currentPara[char_index])) { // if this char is: uppercase or special char >>>
                all_keyboard_keys.forEach(keyNest=> { // add the active for shift key {to make user active upper for this char}
                    // search for this shift right or left key
                    // depends on the hand of key will active the correct key
                    if(keyNest.dataset.char == 'ShiftLeft' && key.dataset.hand == 'left') {
                        addClass(keyNest, 'is-active');
                        console.log('shiftLeft')
                    } else if(keyNest.dataset.char == 'ShiftRight' && key.dataset.hand == 'right') {
                        addClass(keyNest, 'is-active');
                    }
                })
                console.log('is upper or spe')
            }
            console.log('is found' +  currentPara[char_index])
        } else if(currentPara[char_index] == '&nbsp' || !currentPara[char_index]) { // if this char is space then>>
            if(key.dataset.char == 'Space') addClass(key, 'is-active');
            console.log('is space')
        }
    })
}

function letterActive(char_index, char_status) {
    if(char_index < 0) return;
    if(char_status == 'done') {
        addClass(para_letters[char_index], 'done')
        removeClass(para_letters[char_index], 'letter-active')
        if(para_letters[char_index + 1]) {
            addClass(para_letters[char_index + 1], 'letter-active');
            keyActive(char_index + 1, char_status);
        }
    } else if(char_status == 'error') {
        addClass(para_letters[char_index], 'error')
        removeClass(para_letters[char_index], 'letter-active')
        if(para_letters[char_index + 1]) {
            addClass(para_letters[char_index + 1], 'letter-active');
            keyActive(char_index + 1, char_status);
        }
    }
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
    keyActive(toChar_index);
}

function playAudio(aud, audioLoop) {
    if(audioLoop) {
        aud.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    aud.volume = '0.4';
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


// =============== depend on this ====================
function letsStart() {
    removeClass(gameBox, 'hide');
    addClass(readyBox, 'hide');

    //put the background of each para
    changerContainer.style.background = `url(${paras[random_num_paras].background}) no-repeat`;
    changerContainer.style.backgroundSize = 'cover';
    changerContainer.style.backgroundPosition = 'center';

    //open the animate for parent then close it
    addClass(changerContainer, 'animate');
    setTimeout(()=> removeClass(changerContainer, 'animate'), 700);

    // play background audio
    backgroundAudio.src = paras[random_num_paras].audio;
    playAudio(backgroundAudio, true)

    var game_stop = setInterval(()=> {
        game_timeout--;
        gameTimeNow.innerText = game_timeout;
        if(game_timeout <= 0) {
            clearInterval(game_stop);
            endGame();
        }
    }, 1000)
}

function endGame() {
    removeClass(readyBox, 'hide');
    addClass(gameBox, 'hide');

    changerContainer.style.background = '#fff';

    //open the animate for parent then close it
    addClass(changerContainer, 'animate');
    setTimeout(()=> removeClass(changerContainer, 'animate'), 700);

    // put the result of the last game
    gameTimeNow.innerText = game_timeout;
    words_num.innerText = words_done;
    chars_num.innerText = para_char_num;

    // pause background audio
    backgroundAudio.pause();

    // return game as a default again
    random_num_paras = Math.floor(Math.random() * paras.length);
    currentPara = paras[random_num_paras].para;
    content = currentPara.split(' ');
    game_timeout = 140;
    char_num = 0;
    words_done = 0;
    para_char_num= 0;

    textBackWriter.innerHTML = '';
    for(let i = 0; i < currentPara.length; i++) {
        if(i == 0) {
            textBackWriter.innerHTML += `<span class="letter letter-active" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
            keyActive(i); // to add the first char active on keyboard
        } else {
            textBackWriter.innerHTML += `<span class="letter" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
        }
    }
    para_letters = document.querySelectorAll('.writerBox .back .letter');

}