

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

        // this finally get result
        this.time_to_minute= 0; // seconds(timeout) / 60
        this.wpm= 0; // words per minute // Math.round( wordsWrote / minutesTimeout )
        this.accuracy= 0;
    }


    // Functions USED ---------------
    // set interval to check timeout of game (if end the timeout go endGame)
    checkGameTime() {
        var game_stop = setInterval(()=> {
            this.game_timeout--;
            UI.changeGameTime(this.game_timeout)
            if(this.game_timeout <= 0) {
                clearInterval(game_stop);
                return this.endGame();
            }
        }, 1000);
    }

    // start the game after create the class
    startGame() {
        // first add the paragraph
        UI.addParagraph(this);

        // get the letters as variables
        para_letters = document.querySelectorAll('.writerBox .back .letter');
    
        // put the background of each para
        changerContainer.style.background = `url(${this.current_para.background}) no-repeat`;
        changerContainer.style.backgroundSize = 'cover';
        changerContainer.style.backgroundPosition = 'center';
        
        // play background audio
        backgroundAudio.src = this.current_para.audio;
        playAudio(backgroundAudio, true);
        
        // open the animate for parent then close it
        // addClass(changerContainer, 'animate');
        // setTimeout(()=> removeClass(changerContainer, 'animate'), 700);
        
        // check timeout every second (when start the game)
        this.checkGameTime();

        // remove boardBox & add gameBox
        UI.showBoard(false);
    }

    // ending the game anyway
    endGame() {
        // first removeEventListener for the elements (will not work if these elements is not exists in the DOM {so we do if first})
        textBackWriter.removeEventListener('click', ()=> UI.focusInput(inputUser));
        inputUser.removeEventListener('keydown', (e)=> this.keyActivated(e));
        inputUser.removeEventListener('input', (e)=> this.typing(e));

        // put the result of the last game
        time_game_done.innerText = this.const_time - this.game_timeout; // total seconds of game - at game time done
        gameTimeNow.innerText = this.game_timeout;
        words_num.innerText = this.words_done;
        chars_num.innerText = this.para_char_num;

        // remove gameBox & add boardBox
        UI.showBoard(true);
    
        changerContainer.style.background = '#fff';
    
        //open the animate for parent then close it
        // addClass(changerContainer, 'animate');
        // setTimeout(()=> removeClass(changerContainer, 'animate'), 700);
    
        // pause background audio
        pauseEle(backgroundAudio);
    
        // return game as a default again 
        UI.defaultGameInfo();
    }

    // get the activated key as info(code >> 32, key >> KeyQ)
    keyActivated(e) {
        this.event_key.code = e.code; this.event_key.key = e.key;
    }
    
    // this process while typing in the game
    typing(e) {
        // audio when click
        const pressKeyAud = new Audio('./assets/sound/click.mp3');
    
        console.log(para_letters[this.para_char_num]);
        // if this char is first (add start_char) else (remove start_char)
        this.para_char_num > 0 ? removeClass(para_letters[this.para_char_num], 'start_char') : addClass(para_letters[this.para_char_num], 'start_char');
    
        // the default variables when click (then use it)
        let input_char_index = e.target.value.length;
        this.added_char = isSpaceChar(e.target.value[input_char_index-1]);
        
        // ----------- Process this key -----------
        if(this.event_key.code == 'Space') { // if pressed space >> 32
            if(!input_char_index) { // if value empty '' {do nothing
                if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
                e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                console.log('space for empty input')
            } else { // else
                if(e.target.value.trim() != this.content[this.words_done]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                    Game.clickError(e.target, null, true);
                    e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                    // if(para_letters[this.para_char_num]) { // if exists {check last char}
                    //     if(hasClass(para_letters[this.para_char_num], 'error')) { // if char last is error then {delete the new space}
                    //         e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                    //     } else { // else {add the error class then go next}
                    //         letterActive(this.para_char_num, 'error', this);
                    //     }
                    // }
                } else { // else {the space key is true then continue
                    this.words_done++; // add words done
                    removeClass(para_letters[this.para_char_num], 'letter-active'); // remove active for space char
                    this.para_char_num++; // from space char to first char in new word
                    addClass(para_letters[this.para_char_num], 'letter-active'); // add active for new char
                    Game.activeKeyboardKey(this.para_char_num, this); // add active for new char on keyboard
                    e.target.value = '';
                    this.char_num = input_char_index; // make char_num length is 0
                    playAudio(pressKeyAud, false);
    
                    if(!this.current_para_content[this.para_char_num] && !isSpaceChar(this.current_para_content[this.para_char_num])) this.endGame();
                    console.log('done space added new word')
                }
            }
            console.log('space')
        } else if(this.event_key.code == 'Backspace') { // if delete key pressed {go back chars}
            if(input_char_index < 0) { // if input.value = empty {do nothing}
                if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
                false;
            } else if(input_char_index == 0) {
                Game.letterBack(this.para_char_num, this.para_char_num - 1, this);
                if(!isSpaceChar(this.content[this.words_done][input_char_index - 1])) {
                    this.para_char_num--;
                }
                if(this.content[this.words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
                playAudio(pressKeyAud, false);
            } else { // else
                // go back by classes
                Game.letterBack(this.para_char_num /*this current char_index*/, this.para_char_num - 1 /*this old char_index*/, this);
                // if added char is not space at here then>> && this char of this word not space {that meaning you kill the game when break done word}
                if(!isSpaceChar(this.content[this.words_done][input_char_index - 1])) {
                    this.para_char_num--;
                }
                // remove {error input} if input true or input empty
                if(this.content[this.words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
                // play sound
                playAudio(pressKeyAud, false);
            }
            console.log('del', this.added_char)
        } else { // else {that meaning normal key pressed
            if(e.target.value[input_char_index -1] == this.content[this.words_done][input_char_index -1] && this.content[this.words_done][input_char_index -1].includes(e.target.value[input_char_index -1])) { // if value[inputCharIndex] == content[wordIndex][inputCharIndex]
                Game.letterActive(this.para_char_num, 'done', this);
                playAudio(pressKeyAud, false);
                this.para_char_num++; // then go next
                if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
                if(!this.current_para_content[this.para_char_num] && this.current_para_content[this.para_char_num] != '&nbsp') this.endGame();
            } else { // else {that is meaning this char is not correct}
                if(para_letters[this.para_char_num - 1]) { // if before last exists>>
                    if(hasClass(para_letters[this.para_char_num - 1], 'error')) { // if before last has error>>
                        Game.clickError(null, null, true); //open audio error only
                        e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                    } else {
                        Game.clickError(e.target, 'error');
                        Game.letterActive(this.para_char_num, 'error', this); // make error on this char
                        this.para_char_num++; // then go next
                    }
                } else { // else {go next whatever}
                    Game.clickError(e.target, 'error');
                    Game.letterActive(this.para_char_num, 'error', this); // make error on this char
                    this.para_char_num++; // then go next
                }
            }
            // then whatever go next
            this.char_num = input_char_index;
            console.log('normal')
        }
    
    
        console.log(this.para_char_num + ': para_char_num |', this.char_num + ': char_num |', this.words_done + ': words_done |', input_char_index + ': input_char_index;');
    }

    // Activate animations for the paragraph ---------------
    // activate the letter in the paragraph
    static letterActive(char_index, char_status, gameObj) {
        if(char_index < 0) return;
        if(char_status == 'done') {
            addClass(para_letters[char_index], 'done')
            removeClass(para_letters[char_index], 'letter-active')
            if(para_letters[char_index + 1]) {
                addClass(para_letters[char_index + 1], 'letter-active');
                Game.activeKeyboardKey(char_index + 1, gameObj);
            }
        } else if(char_status == 'error') {
            addClass(para_letters[char_index], 'error')
            removeClass(para_letters[char_index], 'letter-active')
            if(para_letters[char_index + 1]) {
                addClass(para_letters[char_index + 1], 'letter-active');
                Game.activeKeyboardKey(char_index + 1, gameObj);
            }
        }
    }

    // (remove the activation from the current key) (add the activation to the previous key): 1 1 0 >> 1 0 0
    static letterBack(currChar_index, toChar_index, gameObj) {
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
        Game.activeKeyboardKey(toChar_index, gameObj);
    }

    // visible keyboard (active animation) functions ---------------
    static clickError(el = null, className = null, audOnly = false) {
        if(!audOnly && el && className) addClass(el, className);
        let pressKeyAud = new Audio('./assets/sound/err_click.wav');
        playAudio(pressKeyAud, false);
    }
    
    // activate the keys of (keyboard animation interface)
    static activeKeyboardKey(char_index, gameObj) {
        
        // remove the active class from the keys (on keyboard animation)
        var activeKeyElements = document.querySelectorAll('.keyboard .keyboard-row .keyboard-key.key.is-active');
        activeKeyElements.forEach(el=> removeClass(el, 'is-active'));
        
        // get the current key element
        let charCode = gameObj.current_para_content[char_index].charCodeAt(0);
        var currKeyElement = document.querySelector(`.keyboard .keyboard-row .keyboard-key.key.key-${charCode}`);
        
        if(currKeyElement) {
            // if child 2 exists or make it child 1 again
            var child2 = currKeyElement.children[1] ? currKeyElement.children[1] : currKeyElement.children[0]; // if child1 = curr lower char or child2

            // if currKeyEle.child0 == paraChar.toUpper || child2 == paraChar.toUpper >> (activate the current key element)
            if(currKeyElement.children[0].innerText == gameObj.current_para_content[char_index].toUpperCase() || child2.innerText == gameObj.current_para_content[char_index].toUpperCase()) {
                addClass(currKeyElement, 'is-active');
            }  else if(gameObj.current_para_content[char_index] == '&nbsp' || !gameObj.current_para_content[char_index]) { // if this char is space >>
                if(currKeyElement.dataset['char'] == 'Space') addClass(currKeyElement, 'is-active');
            }

            // check if this key is (upper or special) character -> (activate the [shiftLeft or shiftRight] with the current char)
            if(/[A-Z]/.test(gameObj.current_para_content[char_index]) || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(gameObj.current_para_content[char_index])) { // if this char is: uppercase or special char >>>
                // get the hand of currentKeyElement and make the first is upper
                let side = capitalizeFirstChar(currKeyElement.dataset['hand']);
                var shiftKey = document.querySelector(`.keyboard .keyboard-row .keyboard-key.key[data-char="Shift${side}"]`);
                addClass(shiftKey, 'is-active');
            }
        }
    }
    
}

class UI {

    constructor() {}

    static changeGameTime(timeout = 140) {
        gameTimeNow.innerText = timeout;
    }

    static addParagraph(gameObj) {
        // empty paragraph interface >>> then >>>
        textBackWriter.innerHTML = '';

        // the first char added
        textBackWriter.innerHTML += `<span class="letter letter-active start_char" data-char="${gameObj.current_para_content[0]}">${gameObj.current_para_content[0]}</span>`;
        Game.activeKeyboardKey(0, gameObj);

        // iterate for all chars
        for(let i = 1; i < gameObj.current_para_content.length; i++) {
            textBackWriter.innerHTML += `<span class="letter" data-char="${gameObj.current_para_content[i]}">${gameObj.current_para_content[i]}</span>`;
        }
    }


    static focusInput(eleInput) {
        eleInput.focus();
    }

    static defaultGameInfo() {
        inputUser.value = '';
        textBackWriter.innerHTML = '';
        if(hasClass(inputUser, 'error')) removeClass(inputUser, 'error');
    }

    static showBoard(board) {
        if(board) {
            addClass(gameBox, 'hide');
            removeClass(boardBox, 'hide');
        } else {
            addClass(boardBox, 'hide');
            removeClass(gameBox, 'hide');
        }
    }
}