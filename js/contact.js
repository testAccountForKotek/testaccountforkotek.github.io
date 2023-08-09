document.addEventListener('DOMContentLoaded', () => {

    let elements = {
        h1 : document.getElementsByTagName('h1').item(0),
        leftCell : document.getElementsByClassName('leftCell').item(0),
        rightCell : document.getElementsByClassName('rightCell').item(0),

        backButton : document.getElementsByClassName('buttonRight').item(0)
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

    function appear() {
        elements.h1.style.opacity = valuesCSS.visible;
        elements.leftCell.style.opacity = valuesCSS.visible;
        setTimeout(() => {
            elements.rightCell.style.opacity = valuesCSS.visible;
        }, transitionsDurations.cellAppear);
    }

    function relocate(address) {
        setTimeout(() => {
            location.href = address;
        }, transitionsDurations.pageDisappear);
    }

    function disappear(address) {
        elements.rightCell.style.opacity = valuesCSS.invisible;
        setTimeout(() => {
            elements.h1.style.opacity = valuesCSS.invisible;
            elements.leftCell.style.opacity = valuesCSS.invisible;

            relocate(address);
        }, transitionsDurations.pageDisappearDelay);
    }

    elements.backButton.addEventListener('click', () => {
        const indexAddress = '../index.html';
        disappear(indexAddress);
    });

    setTimeout(appear, transitionsDurations.pageAppear);

    window.addEventListener('pageshow', eve => {
        if (eve.persisted) {
            setTimeout(appear, transitionsDurations.pageAppear);
        }
    });

});