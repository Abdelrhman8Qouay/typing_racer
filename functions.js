


// ==================== Active functions ====================

function playAudio(aud, audioLoop) {
    // Remove any existing 'ended' event listeners to prevent multiple loops
    aud.removeEventListener('ended', onAudioEnded);
    
    if (audioLoop) {
        aud.addEventListener('ended', onAudioEnded);
    }

    aud.volume = 0.4;
    aud.preload = 'auto'; // Preload the audio

    aud.play().catch(error => {
        aud.pause();
        aud.play();
    });
}

function onAudioEnded() {
    this.currentTime = 0;
    this.play().catch(error => {
        console.error('Looped audio playback failed:', error);
    });
}


function isSpaceChar(str) {
    return / [^ ]*$/.test(str);
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


async function fetchData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the JSON file:', error);
    }
}


// active functions use even listen

function focusInput(eleInput) {
    eleInput.focus();
}

function keyActivated(e, gameObj) {
    gameObj.event_key.code = e.code; gameObj.event_key.key = e.key;
}

function typing(e, gameObj) {
    // add audio sound press key
    let pressKeyAud = new Audio('./assets/sound/click.mp3');

    gameObj.para_char_num > 0 ? removeClass(para_letters[gameObj.para_char_num], 'start_char') : addClass(para_letters[gameObj.para_char_num], 'start_char');

    let input_char_index = e.target.value.length;
    gameObj.added_char = isSpaceChar(e.target.value[input_char_index-1]);
    
    // for space key [change all game
    if(gameObj.event_key.code == 'Space') { // if pressed space >> 32
        if(!input_char_index) { // if value empty '' {do nothing
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
            console.log('space for empty input')
        } else { // else
            if(e.target.value.trim() != gameObj.content[gameObj.words_done]) { // if input(trim >> removed spaces) != content[textIndex] {then make an error
                Game.clickError(e.target, null, true);
                e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                // if(para_letters[gameObj.para_char_num]) { // if exists {check last char}
                //     if(hasClass(para_letters[gameObj.para_char_num], 'error')) { // if char last is error then {delete the new space}
                //         e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                //     } else { // else {add the error class then go next}
                //         letterActive(gameObj.para_char_num, 'error');
                //     }
                // }
            } else { // else {the space key is true then continue
                gameObj.words_done++; // add words done
                removeClass(para_letters[gameObj.para_char_num], 'letter-active'); // remove active for space char
                gameObj.para_char_num++; // from space char to first char in new word
                addClass(para_letters[gameObj.para_char_num], 'letter-active'); // add active for new char
                Game.keyActive(gameObj.para_char_num); // add active for new char on keyboard
                e.target.value = '';
                gameObj.char_num = input_char_index; // make char_num length is 0
                playAudio(pressKeyAud, false);

                if(!gameObj.current_para_content[gameObj.para_char_num] && !isSpaceChar(gameObj.current_para_content[gameObj.para_char_num])) gameObj.endGame();
                console.log('done space added new word')
            }
        }
        console.log('space')
    } else if(gameObj.event_key.code == 'Backspace') { // if delete key pressed {go back chars}
        if(input_char_index < 0) { // if input.value = empty {do nothing}
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            false;
        } else if(input_char_index == 0) {
            Game.letterBack(gameObj.para_char_num, gameObj.para_char_num - 1);
            if(!isSpaceChar(gameObj.content[gameObj.words_done][input_char_index - 1])) {
                gameObj.para_char_num--;
            }
            if(gameObj.content[gameObj.words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
            playAudio(pressKeyAud, false);
        } else { // else
            // go back by classes
            Game.letterBack(gameObj.para_char_num /*this current char_index*/, gameObj.para_char_num - 1 /*this old char_index*/);
            // if added char is not space at here then>> && this char of this word not space {that meaning you kill the game when break done word}
            if(!isSpaceChar(gameObj.content[gameObj.words_done][input_char_index - 1])) {
                gameObj.para_char_num--;
            }
            // remove {error input} if input true or input empty
            if(gameObj.content[gameObj.words_done].includes(e.target.value) || !e.target.value) if(!hasClass(e.target, 'error')) removeClass(e.target, 'error');
            // play sound
            playAudio(pressKeyAud, false);
        }
        console.log('del', gameObj.added_char)
    } else { // else {that meaning normal key pressed
        if(e.target.value[input_char_index -1] == gameObj.content[gameObj.words_done][input_char_index -1] && gameObj.content[gameObj.words_done][input_char_index -1].includes(e.target.value[input_char_index -1])) { // if value[inputCharIndex] == content[wordIndex][inputCharIndex]
            Game.letterActive(gameObj.para_char_num, 'done');
            playAudio(pressKeyAud, false);
            gameObj.para_char_num++; // then go next
            if(hasClass(e.target, 'error')) removeClass(e.target, 'error');
            if(!gameObj.current_para_content[gameObj.para_char_num] && gameObj.current_para_content[gameObj.para_char_num] != '&nbsp') gameObj.endGame();
        } else { // else {that is meaning this char is not correct}
            if(para_letters[gameObj.para_char_num - 1]) { // if before last exists>>
                if(hasClass(para_letters[gameObj.para_char_num - 1], 'error')) { // if before last has error>>
                    Game.clickError(null, null, true); //open audio error only
                    e.target.value = e.target.value.slice(0, input_char_index - 1); // stop add new char for {input type}
                } else {
                    Game.clickError(e.target, 'error');
                    Game.letterActive(gameObj.para_char_num, 'error'); // make error on this char
                    gameObj.para_char_num++; // then go next
                }
            } else { // else {go next whatever}
                Game.clickError(e.target, 'error');
                Game.letterActive(gameObj.para_char_num, 'error'); // make error on this char
                gameObj.para_char_num++; // then go next
            }
        }
        // then whatever go next
        gameObj.char_num = input_char_index;
        console.log('normal')
    }


    console.log(gameObj.para_char_num + ': para_char_num |', gameObj.char_num + ': char_num |', gameObj.words_done + ': words_done |', input_char_index + ': input_char_index;');
}