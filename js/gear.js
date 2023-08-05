document.addEventListener('DOMContentLoaded', function () {

    let elements = {
        h1 : document.getElementsByTagName('h1').item(0),
        leftCell : document.getElementsByClassName('leftCell').item(0),
        rightCell : document.getElementsByClassName('rightCell').item(0),

        machineSound: document.getElementById('machineSound'),

        soundButton: document.getElementById('soundButton'),
        backButton: document.getElementById('backButton')
    }

    let valuesCSS = {
        invisible : '0',
        visible : '1'
    }

    let transitionsDurations = {
        pageAppear : 400,
        cellAppear : 200,

        pageDisappear : 300,
        pageDisappearDelay : 100
    }

    elements.machineSound.loop = true;

    function appear() {
        elements.h1.style.opacity = valuesCSS.visible;
        elements.leftCell.style.opacity = valuesCSS.visible;
        setTimeout(function () {
            elements.rightCell.style.opacity = valuesCSS.visible;
        }, transitionsDurations.cellAppear);
    }

    function relocate(address) {
        setTimeout(function () {
            location.href = address;
        }, transitionsDurations.pageDisappear);
    }

    function disappear(address) {
        elements.rightCell.style.opacity = valuesCSS.invisible;
        setTimeout(function () {
            elements.h1.style.opacity = valuesCSS.invisible;
            elements.leftCell.style.opacity = valuesCSS.invisible;

            relocate(address);
        }, transitionsDurations.pageDisappearDelay);
    }

    function loopAudioSmoothly() {
        const audio = elements.machineSound;
        const buffer = 0.44;

        if (audio.currentTime > audio.duration - buffer) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    elements.soundButton.addEventListener('click', function () {
        const audio = elements.machineSound;

        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    elements.machineSound.addEventListener('timeupdate', loopAudioSmoothly);

    elements.backButton.addEventListener('click', function () {
        const indexAddress = 'prepare.html';
        disappear(indexAddress);
    });

    setTimeout(appear, transitionsDurations.pageAppear);

});