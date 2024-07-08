

class Game {

    constructor(paragraphs, timeout = 140, ) {
        this.paras = paragraphs;
        this.const_time = timeout;
        this.game_timeout = timeout;
        this.random_para = Math.floor(Math.random() * this.paras.length); // random number with length of paragraphs exists
        this.current_para = this.paras[this.random_para]; // get random content from data
        this.current_para_content = this.paras[this.random_para].para; // get the content of para


        // main options when play {typing racer game}
        this.content = this.current_para.para.split(' '); // split all context to words separate by (space)
        this.char_num = 0; // the character number [index]
        this.para_char_num = 0; // the total character numbers of paragraph as [index] {access on all chars in para}
        this.words_done = 0; // number of words done correctly


        this.event_key = {code: '' /*Example: KeyE or KeyE the same */, key: '' /*Example: e or E */};
        this.added_char = true;
    }


    // Functions USED ---------------
    // set interval to check timeout of game
    timeOutCheck() {
        var game_stop = setInterval(()=> {
            this.game_timeout--;
            UI.changeGameTime(this.game_timeout)
            if(this.game_timeout <= 0) {
                clearInterval(game_stop);
                return this.endGame();
            }
        }, 1000);
    }

    startGame() {
        // remove readyBox & add gameBox
        removeClass(gameBox, 'hide');
        addClass(readyBox, 'hide');
    
        // put the background of each para
        changerContainer.style.background = `url(${this.current_para.background}) no-repeat`;
        changerContainer.style.backgroundSize = 'cover';
        changerContainer.style.backgroundPosition = 'center';
    
        // open the animate for parent then close it
        // addClass(changerContainer, 'animate');
        // setTimeout(()=> removeClass(changerContainer, 'animate'), 700);
    
        // play background audio
        backgroundAudio.src = this.current_para.audio;
        playAudio(backgroundAudio, true);
        
        // check timeout every second (when start the game)
        this.timeOutCheck();
    }

    endGame() {
        // remove gameBox & add readyBox
        removeClass(readyBox, 'hide');
        addClass(gameBox, 'hide');
    
        changerContainer.style.background = '#fff';
    
        //open the animate for parent then close it
        // addClass(changerContainer, 'animate');
        // setTimeout(()=> removeClass(changerContainer, 'animate'), 700);
    
        // put the result of the last game
        time_game_done.innerText = this.const_time - this.game_timeout; // total seconds of game - at game time done
        gameTimeNow.innerText = this.game_timeout;
        words_num.innerText = this.words_done;
        chars_num.innerText = this.para_char_num;
    
        // pause background audio
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0; // Reset the audio to the start

        // removeEventListener for the elements
        textBackWriter.removeEventListener('click', ()=> focusInput(inputUser));
        inputUser.removeEventListener('keydown', (e)=> keyActivated(e, newGame));
        inputUser.removeEventListener('input', (e)=> typing(e, newGame));
    
        // return game as a default again 
        inputUser.value = '';
        textBackWriter.innerHTML = '';
        
        if(hasClass(inputUser, 'error')) removeClass(inputUser, 'error');

        return new Game(this.paras, this.const_time);
    }

    // Activate animations for the paragraph ---------------
    static letterActive(char_index, char_status) {
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

    static letterBack(currChar_index, toChar_index) {
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

    // visible keyboard (active animation) functions ---------------
    static clickError(el = null, className = null, audOnly = false) {
        if(!audOnly && el && className) addClass(el, className);
        let pressKeyAud = new Audio('./assets/sound/err_click.wav');
        playAudio(pressKeyAud, false);
    }
    
    static keyActive(char_index, char_status = null) {
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
    
}

class UI {

    constructor() {}

    static changeGameTime(timeout = 140) {
        gameTimeNow.innerText = timeout;
    }

    static addParagraph() {
        textBackWriter.innerHTML = '';
        for(let i = 0; i < currentPara.length; i++) {
            if(i == 0) {
                textBackWriter.innerHTML += `<span class="letter letter-active start_char" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
                keyActive(i); // to add the first char active on keyboard
            } else {
                textBackWriter.innerHTML += `<span class="letter" data-char="${currentPara[i]}">${currentPara[i]}</span>`;
            }
        }
    }

}