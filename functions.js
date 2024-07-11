


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

function pauseEle(ele) {
    ele.pause();
    ele.currentTime = 0; // Reset the audio to the start
}


function isSpaceChar(str) {
    return / [^ ]*$/.test(str);
}

function capitalizeFirstChar(str) {
    if (str.length === 0) {
      return str; // Return empty string if input is empty
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasClass(el, className) {
    // if(!el) return false;

    if (el.classList)
        return el.classList.contains(className);
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}

function addClass(el, className) {
    // if(!el) return false;

    if (el.classList)
        el.classList.add(className)
    else if (!hasClass(el, className))
        el.className += " " + className;
}

function removeClass(el, className) {
    // if(!el) return false;

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
