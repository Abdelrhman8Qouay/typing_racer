

class Game {

    // options to control the shape of the game
    static pass_click = './assets/sound/click.mp3';
    static err_click = './assets/sound/err_click.wav';
    static #total_times_played = 0;

    constructor(paragraphs, timeout = 140) {
        Game.#total_times_played++;
        this.paras = paragraphs;
        this.const_time = timeout;
        this.game_timeout = timeout;
        this.random_para = Math.floor(Math.random() * this.paras.length); // random number with length of paragraphs exists
        this.current_para = this.paras[this.random_para]; // get random content from data
        this.current_para_content = this.paras[this.random_para].para; // get the content of para


        // main options when play {typing racer game}
        this.content = this.current_para.para.split(' '); // split all context to words separate by (space)
        this.para_char_num = 0; // the total character numbers of paragraph as [index] {access on all chars in para}
        this.total_chars_typed = 0; // total characters typed {not include spaces}
        this.correct_chars = 0; // correct characters typed
        this.words_done = 0; // number of words done correctly

        this.event_key = {code: '' /*Example: KeyE or KeyE the same */, key: '' /*Example: e or E */};
        this.added_char = true;

        // this finally get result
        this.wpm= 0; // words per minute // Math.round( wordsWrote / minutesTimeout )
        this.accuracy= 0;
    }


    // Functions USED ---------------
    // set interval to check timeout of game (if end the timeout >> endGame)
    checkGameTime() {
        var game_stop = setInterval(()=> {
            // info changed
            this.game_timeout--;
            gameLiveTime.innerText = this.game_timeout + ' Seconds';
            wpmLiveTime.innerText = this.#wpmCalc();

            // if the time is 0 >>> endGame
            if(this.game_timeout <= 0) {
                clearInterval(game_stop);
                return this.endGame();
            }
        }, 1000);
    }

    // return the time spent as seconds (with timeout of the game)
    #calcTimeSpent() {
        return this.const_time - this.game_timeout; // total seconds of game - at game time done
    }
    // return words per minute (wpm)
    #wpmCalc() {
        let words = this.para_char_num / 5, // use the standard definition that one word is equal to 5 characters
        time_to_minute = this.#calcTimeSpent() / 60; // convert seconds to minutes // seconds(timeout) / 60

        this.wpm= Math.round(words / time_to_minute); // words per minute // Math.round( wordsWrote / minutesTimeout )
        return this.wpm;
    }
    // accuracy calculation (return the percentage of the user typing accuracy)
    #accCalc() {
        let accuracy = (this.correct_chars / this.total_chars_typed) * 100;// (correctCharactersTyped / totalCharactersTyped) * 100;
        return Math.floor(accuracy);
    }

    // start the game after create the class
    startGame() {
        // first add the paragraph
        UI.addParagraph(this);
    
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
        paraContainerEle.removeEventListener('click', ()=> UI.focusInput(typeInput));
        typeInput.removeEventListener('keydown', (e)=> this.keyActivated(e));
        typeInput.removeEventListener('input', (e)=> this.typing(e));

        // put the result of the last game
        gameTimeEle.innerText = this.#calcTimeSpent();
        wpmEle.innerText = this.#wpmCalc(); 
        accuracyEle.innerText = this.#accCalc() + '%';
        wordsEle.innerText = this.words_done;
        charsEle.innerText = this.total_chars_typed;
        
        console.log("correct chars: "+ this.correct_chars)

        // remove gameBox & add boardBox
        UI.showBoard(true);
    
        changerContainer.style.background = '#fff';
    
        //open the animate for parent then close it
        // addClass(changerContainer, 'animate');
        // setTimeout(()=> removeClass(changerContainer, 'animate'), 700);
    
        // pause background audio
        pauseEle(backgroundAudio);
    
        // return game as a default again 
        UI.defaultGameInfo(this);
    }

    // get the activated key as info(code >> KeyQ, key >> q or Q)
    keyActivated(e) {
        this.event_key.code = e.code; this.event_key.key = e.key;
    }

    // ------------------ While Typing ------------------
    spacePressed(e, input_char_index, pressKeyAud) {
        if(!input_char_index) { // if input Empty >> stop add new char for {input writer}
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input writer}
        } else { // if input not Empty >>
            if(e.target.value.trim() != this.content[this.words_done]) { // if input.trim(remove spaces) not= content[wordsIndex] >>>
                Game.clickError(e.target, null, true); // make error for {input writer}
                e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input writer}
            } else { // if {input writer} == content[wordsIndex] >>> the space key is true then continue
                this.words_done++; // add words done
                removeClass(para_letters[this.para_char_num], 'letter-active'); // remove active for space char
                this.para_char_num++; // from space char to first char in new word
                addClass(para_letters[this.para_char_num], 'letter-active'); // add active for new char
                KeyboardI.activeKeyboardKey(this.para_char_num, this); // add active for new char on keyboard
                e.target.value = '';
                playAudio(pressKeyAud, false);

                // if ended the paragraph >> endGame
                if(!this.current_para_content[this.para_char_num] && !isSpaceChar(this.current_para_content[this.para_char_num])) {
                    this.endGame();
                }
            }
        }
    }
    backPressed(e, input_char_index, pressKeyAud) {
        if(input_char_index < 0) { // if {input writer} Empty >>> do nothing
            if(hasClass(e.target, 'error')) {
                removeClass(e.target, 'error');
            }
            false;
        } else if(input_char_index >= 0 && !isSpaceChar(this.content[this.words_done][input_char_index - 1])) { // if {input writer} has one or more char & if content[previousChar] is not space
            
            // if the previous letter hasClass done >> correct_chars--
            if(hasClass(para_letters[this.para_char_num - 1], 'done')) {
                this.correct_chars--;
            }

            // go back by classes
            Game.letterBack(this.para_char_num, this.para_char_num - 1, this);

            this.para_char_num--;
            this.total_chars_typed--;

            // remove {error input} if input true || input empty
            if(this.content[this.words_done].includes(e.target.value) || !e.target.value) {
                if(!hasClass(e.target, 'error')) {
                    removeClass(e.target, 'error');
                }
            }

            // play sound
            playAudio(pressKeyAud, false);
        } else { // else
            // go back by classes
            Game.letterBack(this.para_char_num /*this current char_index*/, this.para_char_num - 1 /*this old char_index*/, this);

            // remove {error input} if input true || input empty
            if(this.content[this.words_done].includes(e.target.value) || !e.target.value) {
                if(!hasClass(e.target, 'error')) {
                    removeClass(e.target, 'error');
                }
            }

            // play sound
            playAudio(pressKeyAud, false);
        }
    }
    normalPressed(e, input_char_index, pressKeyAud) {
        // if input[char] == content[char]
        if(e.target.value[input_char_index -1] == this.content[this.words_done][input_char_index -1] && this.content[this.words_done][input_char_index -1].includes(e.target.value[input_char_index -1])) {
            Game.letterActive(this.para_char_num, 'done', this);
            playAudio(pressKeyAud, false);
            this.para_char_num++; // then go next
            this.total_chars_typed++;
            this.correct_chars++;
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            if(!this.current_para_content[this.para_char_num] && this.current_para_content[this.para_char_num] != '&nbsp') this.endGame();
        } else { // else {that is meaning this char is not correct}
            if(para_letters[this.para_char_num - 1]) { // if the letter before last exists >>>
                if(hasClass(para_letters[this.para_char_num - 1], 'error')) { // if before last has error >>> stop add new char for {input type}
                    Game.clickError(null, null, true); //open audio error only
                    e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                } else { // else >>> make error on this char
                    Game.clickError(e.target, 'error');
                    Game.letterActive(this.para_char_num, 'error', this); // make error on this char
                    this.para_char_num++; // then go next
                    this.total_chars_typed++;
                }
            } else { // if before last is not exists >>> go next
                Game.clickError(e.target, 'error');
                Game.letterActive(this.para_char_num, 'error', this); // make error on this char
                this.para_char_num++; // then go next
            }
        }
    }
    
    // this process while typing in the game
    typing(e) {
        // audio when click
        const pressKeyAud = new Audio(Game.pass_click);
    
        // if this char is first (add start_char) else (remove start_char)
        this.para_char_num > 0 ? removeClass(para_letters[this.para_char_num], 'start_char') : addClass(para_letters[this.para_char_num], 'start_char');
    
        // the default variables when click (then use it)
        let input_char_index = e.target.value.length;
        this.added_char = isSpaceChar(e.target.value[input_char_index-1]);
        
        // Process this key
        if(this.event_key.code == 'Space') { // if pressed space
            this.spacePressed(e, input_char_index, pressKeyAud);
        } else if(this.event_key.code == 'Backspace') { // if delete key pressed (go back if not first char in a word)
            this.backPressed(e, input_char_index, pressKeyAud);
        } else { // else {that meaning normal key pressed
            this.normalPressed(e, input_char_index, pressKeyAud);
        }

        wpmLiveTime.innerText = this.#wpmCalc();
        accLiveTime.innerText = this.#accCalc() + '%';
    }

    // --------------- Activate animations for the paragraph ---------------
    // activate the letter in the paragraph
    static letterActive(char_index, char_status, gameObj) {
        if(char_index < 0) return;
        if(char_status == 'done') {
            addClass(para_letters[char_index], 'done')
            removeClass(para_letters[char_index], 'letter-active')
            if(para_letters[char_index + 1]) {
                addClass(para_letters[char_index + 1], 'letter-active');
                KeyboardI.activeKeyboardKey(char_index + 1, gameObj);
            }
        } else if(char_status == 'error') {
            addClass(para_letters[char_index], 'error')
            removeClass(para_letters[char_index], 'letter-active')
            if(para_letters[char_index + 1]) {
                addClass(para_letters[char_index + 1], 'letter-active');
                KeyboardI.activeKeyboardKey(char_index + 1, gameObj);
            }
        }
        UI.scrollToActiveLetter();
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
        KeyboardI.activeKeyboardKey(toChar_index, gameObj);
    }

    // --------------- visible keyboard (active animation) functions ---------------
    // (play the error audio sound) (if not audio only >> add the class) for error click press
    static clickError(el, className, audOnly = false) {
        if(!audOnly && el && className) addClass(el, className);
        let pressKeyAud = new Audio(Game.err_click);
        playAudio(pressKeyAud, false);
    }
    
}


// User Interface
class UI {
    constructor() {
        this.Keyboard = new KeyboardI();
    }

    static addParagraph(gameObj) {
        // empty paragraph interface >>> then >>>
        paraContainerEle.innerHTML = '';

        // the first char added
        paraContainerEle.innerHTML += `<span class="letter letter-active start_char" data-char="${gameObj.current_para_content[0]}">${gameObj.current_para_content[0]}</span>`;
        KeyboardI.activeKeyboardKey(0, gameObj);

        // iterate for all chars
        for(let i = 1; i < gameObj.current_para_content.length; i++) {
            paraContainerEle.innerHTML += `<span class="letter" data-char="${gameObj.current_para_content[i]}">${gameObj.current_para_content[i]}</span>`;
        }

        // get the letters as variables
        para_letters = document.querySelectorAll('.game_box .writerBox .para_container .letter');
    }


    // --------------- Input Process ---------------
    // focus the input
    static focusInput(eleInput) {
        eleInput.focus();
    }
    // scroll the container to active letter
    static scrollToActiveLetter() {
        const activeLetter = paraContainerEle.querySelector('.letter-active');
        console.log('scroll here')
        
        if (activeLetter) {
            // Calculate the position to scroll to
            const containerRect = paraContainerEle.getBoundingClientRect();
            const activeLetterRect = activeLetter.getBoundingClientRect();
    
            // Calculate the horizontal scroll position to center the active letter
            const scrollLeft = activeLetterRect.left - containerRect.left + paraContainerEle.scrollLeft - (containerRect.width / 2) + (activeLetterRect.width / 2);
            
            // Smoothly scroll the container to the calculated position
            paraContainerEle.scrollTo({
                left: scrollLeft,
                behavior: 'smooth',
            });
        }
    }

    // --------------- More Rest ---------------
    // return the game information to default again
    static defaultGameInfo(gameObj) {
        typeInput.value = '';
        paraContainerEle.innerHTML = '';
        gameLiveTime.innerText = gameObj.const_time;
        if(hasClass(typeInput, 'error')) removeClass(typeInput, 'error');
    }

    // true(appear >> board, hide >> game) false(appear >> game, hide >> board)
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



// Keyboard Interface
class KeyboardI {

    static charToKeyCodeMap = {
        'a': 'KeyA',
        'b': 'KeyB',
        'c': 'KeyC',
        'd': 'KeyD',
        'e': 'KeyE',
        'f': 'KeyF',
        'g': 'KeyG',
        'h': 'KeyH',
        'i': 'KeyI',
        'j': 'KeyJ',
        'k': 'KeyK',
        'l': 'KeyL',
        'm': 'KeyM',
        'n': 'KeyN',
        'o': 'KeyO',
        'p': 'KeyP',
        'q': 'KeyQ',
        'r': 'KeyR',
        's': 'KeyS',
        't': 'KeyT',
        'u': 'KeyU',
        'v': 'KeyV',
        'w': 'KeyW',
        'x': 'KeyX',
        'y': 'KeyY',
        'z': 'KeyZ',
        'A': 'KeyA',
        'B': 'KeyB',
        'C': 'KeyC',
        'D': 'KeyD',
        'E': 'KeyE',
        'F': 'KeyF',
        'G': 'KeyG',
        'H': 'KeyH',
        'I': 'KeyI',
        'J': 'KeyJ',
        'K': 'KeyK',
        'L': 'KeyL',
        'M': 'KeyM',
        'N': 'KeyN',
        'O': 'KeyO',
        'P': 'KeyP',
        'Q': 'KeyQ',
        'R': 'KeyR',
        'S': 'KeyS',
        'T': 'KeyT',
        'U': 'KeyU',
        'V': 'KeyV',
        'W': 'KeyW',
        'X': 'KeyX',
        'Y': 'KeyY',
        'Z': 'KeyZ',
        '0': 'Digit0',
        '1': 'Digit1',
        '2': 'Digit2',
        '3': 'Digit3',
        '4': 'Digit4',
        '5': 'Digit5',
        '6': 'Digit6',
        '7': 'Digit7',
        '8': 'Digit8',
        '9': 'Digit9',
        ' ': 'Space',
        '!': 'Digit1',
        '@': 'Digit2',
        '#': 'Digit3',
        '$': 'Digit4',
        '%': 'Digit5',
        '^': 'Digit6',
        '&': 'Digit7',
        '*': 'Digit8',
        '(': 'Digit9',
        ')': 'Digit0',
        '-': 'Minus',
        '_': 'Minus',
        '=': 'Equal',
        '+': 'Equal',
        '[': 'BracketLeft',
        '{': 'BracketLeft',
        ']': 'BracketRight',
        '}': 'BracketRight',
        '\\': 'Backslash',
        '|': 'Backslash',
        ';': 'Semicolon',
        ':': 'Semicolon',
        "'": 'Quote',
        '"': 'Quote',
        ',': 'Comma',
        '<': 'Comma',
        '.': 'Period',
        '>': 'Period',
        '/': 'Slash',
        '?': 'Slash',
        '`': 'Backquote',
        '~': 'Backquote',
        'ArrowUp': 'ArrowUp',
        'ArrowDown': 'ArrowDown',
        'ArrowLeft': 'ArrowLeft',
        'ArrowRight': 'ArrowRight',
        'Enter': 'Enter',
        'Tab': 'Tab',
        'Backspace': 'Backspace',
        'Delete': 'Delete',
        'Home': 'Home',
        'End': 'End',
        'PageUp': 'PageUp',
        'PageDown': 'PageDown',
        'Escape': 'Escape',
        'Insert': 'Insert',
        'CapsLock': 'CapsLock',
        'Control': 'Control',
        'Shift': 'Shift',
        'Alt': 'Alt',
        'Meta': 'Meta',
        'ContextMenu': 'ContextMenu',
        'NumLock': 'NumLock',
        'ScrollLock': 'ScrollLock',
        'Pause': 'Pause',
        'PrintScreen': 'PrintScreen',
        'F1': 'F1',
        'F2': 'F2',
        'F3': 'F3',
        'F4': 'F4',
        'F5': 'F5',
        'F6': 'F6',
        'F7': 'F7',
        'F8': 'F8',
        'F9': 'F9',
        'F10': 'F10',
        'F11': 'F11',
        'F12': 'F12',
        // Add more keys if needed
    };

    constructor() {}

    // activate the keys of (keyboard animation interface)
    static activeKeyboardKey(char_index, gameObj) {
        
        // remove the active class from the keys (on keyboard animation)
        KeyboardI.removeActiveKeys();
        
        // get the current key element
        var currKeyElement=
        document.querySelector(`.keyboard .keyboard-row .keyboard-key.key[data-char="${KeyboardI.getKeyCode(gameObj.current_para_content[char_index])}"]`);
        
        if(currKeyElement) {
            // add (is-active) to the currentKeyElement
            addClass(currKeyElement, 'is-active');

            // check if this key is (upper or special) character -> (activate the [shiftLeft or shiftRight] with the current char)
            if(
                (/[A-Z]/.test(gameObj.current_para_content[char_index]) || /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(gameObj.current_para_content[char_index]))
                && 
                currKeyElement.dataset['char'] != 'Space'
            ) { // if this char is: uppercase or special char >>>
                // get the hand of currentKeyElement and make the first is upper
                let side = capitalizeFirstChar(currKeyElement.dataset['hand']);
                var shiftKey = document.querySelector(`.keyboard .keyboard-row .keyboard-key.key[data-char="Shift${side}"]`);
                addClass(shiftKey, 'is-active');
            }
        }
    }

    // get the key code {1 >> Digit1, ! >> Digit1}
    static getKeyCode(char) {
        return KeyboardI.charToKeyCodeMap[char] || null;
    }

    // get the child that is available or null in {key element}
    static getKeyChild(keyEle, childIndex = 1) {
        if(!keyEle) return null;
        let availableChild = keyEle.children[childIndex] || keyEle.children[1] || keyEle.children[0] || null;
        return availableChild;
    }

    static removeActiveKeys() {
        var activeKeyElements = document.querySelectorAll('.keyboard .keyboard-row .keyboard-key.key.is-active');
        activeKeyElements.forEach(el=> removeClass(el, 'is-active'));
    }

}