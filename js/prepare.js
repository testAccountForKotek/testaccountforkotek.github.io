document.addEventListener('DOMContentLoaded', function () {

    let elements = {
        h1: document.getElementsByTagName('h1').item(0),
        leftUpperCell: document.getElementsByClassName('leftUpperCell').item(0),
        middleUpperCell: document.getElementsByClassName('middleUpperCell').item(0),
        leftBottomCell: document.getElementsByClassName('leftBottomCell').item(0),
        middleBottomCell: document.getElementsByClassName('middleBottomCell').item(0),
        rightCell: document.getElementsByClassName('rightCell').item(0),

        grid: document.getElementsByClassName('grid').item(0),
        body: document.body,

        seeTheGearButton: document.getElementsByClassName('buttonRight').item(0),
        backButton: document.getElementsByClassName('buttonRight').item(1)
    }

    let valuesCSS = {
        invisible: '0',
        visible: '1'
    }

    let transitionsDurations = {
        pageAppear: 400,
        backgroundTransition: 300,
        cellAppear: 200,

        pageDisappear: 300,
        pageDisappearDelay: 100
    }

    function appear() {
        elements.h1.style.opacity = valuesCSS.visible;
        elements.leftUpperCell.style.opacity = valuesCSS.visible;
        elements.middleUpperCell.style.opacity = valuesCSS.visible;
        elements.leftBottomCell.style.opacity = valuesCSS.visible;
        elements.middleBottomCell.style.opacity = valuesCSS.visible;
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
            elements.leftUpperCell.style.opacity = valuesCSS.invisible;
            elements.middleUpperCell.style.opacity = valuesCSS.invisible;
            elements.leftBottomCell.style.opacity = valuesCSS.invisible;
            elements.middleBottomCell.style.opacity = valuesCSS.invisible;

            relocate(address);
        }, transitionsDurations.pageDisappearDelay);
    }

    elements.seeTheGearButton.addEventListener('click', function () {
        const gearAddress = 'gear.html';
        disappear(gearAddress);
    });

    elements.backButton.addEventListener('click', function () {
        const index2Address = '../index.html';
        disappear(index2Address);
    });

    setTimeout(appear, transitionsDurations.pageAppear);

});