document.addEventListener('DOMContentLoaded', () => {

    let elements = {
        h1: document.getElementsByTagName('h1').item(0),
        leftCell: document.getElementsByClassName('leftCell').item(0),
        rightCell: document.getElementsByClassName('rightCell').item(0),

        pictureCell: document.getElementsByClassName('pictureCell'),
        cellDescription: document.getElementsByClassName('cellDescription'),

        arrowUp: document.getElementById('arrowUp'),
        rowIndicator: document.getElementsByClassName('rowIndicator'),
        rowIndicatorFirstText: document.getElementById('rowIndicatorFirstText'),
        rowIndicatorFirstNumber: document.getElementById('rowIndicatorFirstNumber'),
        rowIndicatorSecondText: document.getElementById('rowIndicatorSecondText'),
        rowIndicatorSecondNumber: document.getElementById('rowIndicatorSecondNumber'),
        arrowDown: document.getElementById('arrowDown'),

        backButton: document.getElementsByClassName('buttonBright').item(2),
        closeButton: document.getElementsByClassName('buttonDark').item(2),

        grid1: document.getElementsByClassName('grid1').item(0),

        leftCell1: document.getElementsByClassName('leftCell1').item(0),
        rightCell1: document.getElementsByClassName('rightCell1').item(0),

        pictureSwipe: document.getElementsByClassName('pictureSwipe'),
        swipeContainer: document.getElementsByClassName('swipeContainer').item(0),
        swipeDescription: document.getElementsByTagName('span').item(4),

        arrowLeft: document.getElementById('arrowLeft'),
        arrowRight: document.getElementById('arrowRight')
    }

    let valuesCSS = {
        invisible: '0',
        visible: '1',

        blur: 'blur(10px)',
        noBlur: 'blur(0px)',

        makeItGrid: 'grid',
        makeItNothing: 'none',

        noPadding: '0',
        standardPadding: '30%',
        standardDescriptionPadding: '10%',
        noMargin: '0',
        standardVerticalMargin: '0.5%',
        noBorder: '0',
        standardBorder: '1px',
        noWidth: '0',

        standardSwipeWidth: '25%',
        leftSwipeMargins: 'auto 0 auto 2.5%',
        leftOrRightSwipeOpacity: '0.5',
        veryLeftMidSwipeMargins: 'auto 10% auto 37.5%',
        midSwipeMargins: 'auto 10% auto 10%',
        rightSwipeMargins: 'auto 0 auto 0',

        animationIndicatorMargin: '10%',
        animationDescriptionMargin: '20%',

        zBelow: '0',
        zAbove: '1'
    }

    let transitionsDurations = {
        pageAppear: 400,
        cellAppear: 200,
        pictureAppear: 100,

        pageDisappear: 300,
        pageDisappearDelay: 100,

        oneStepOfImageAnimation: 300,
        randomTimeoutToHelpCSS: 1,
        significantTimeoutToHelpCSS: 100,

        numberOfStepsInImageAnimation: 2
    }

    let imagesVerticalPositions = {
        currentNextAboveRow: null,
        currentAboveRow: null,
        currentTopRow: null,
        currentBelowRow: null,
        currentNextBelowRow: null
    }

    let imagesHorizontalPositions = {
        currentNextLeftSwipe: null,
        currentLeftSwipe: null,
        currentMidSwipe: null,
        currentRightSwipe: null,
        currentNextRightSwipe: null
    }

    let linkTable = new Array(15);
    let descriptionsTable = new Array(15);

    let currentTopPictureMobile = null;
    let currentTopIndex = 0;
    let currentMidIndex = 0;

    let previewOpened = false;

    function checkVisibility(elementIndex) {
        return document.getElementById('pictureCell' + elementIndex).style.opacity === valuesCSS.visible;
    }


    // Start page

    function appendPictures() {
        const pictureContainer = document.getElementsByClassName('pictureContainer').item(0);
        let rowIterator = -1;

        for (let i = 0; i < linkTable.length; i++) {
            if (i % 3 === 0) {
                rowIterator++;
            }

            pictureContainer.innerHTML += '<div class="pictureCell pictureRow' + rowIterator + '" id="pictureCell' + i + '"></div>';
            elements.swipeContainer.innerHTML += '<div class="pictureSwipe" id="pictureSwipe' + i + '"></div>';
        }
    }

    function transferDataToTable(configFile) {
        for (let i = 0; i < linkTable.length; i++) {
            const pictureIdXML = 'picture' + (i + 1);
            const currentLoopPicture = configFile.getElementsByTagName(pictureIdXML)[0];

            linkTable[i] = currentLoopPicture.childNodes[1].childNodes[0].nodeValue;

            currentLoopPicture.childNodes[3].childNodes[0] !== undefined ?
                descriptionsTable[i] = currentLoopPicture.childNodes[3].childNodes[0].nodeValue :
                descriptionsTable[i] = null;
        }

        appendPictures();
        addCellListeners();
        setRows();
        adjustRowIndicator();
        setTimeout(appear, transitionsDurations.pageAppear);
    }

    function checkIfScreenIsHorizontal() {
        return window.innerWidth / window.innerHeight > 1;
    }

    function setImageLinks() {
        for (let i = 0; i < linkTable.length; i++) {
            const desiredURL = 'url(' + linkTable[i].replace('file/d/', 'uc?id=').replace('/view?usp=share_link', '') + ')';

            document.getElementById('pictureCell' + i).style.backgroundImage = desiredURL;
            document.getElementById('pictureSwipe' + i).style.backgroundImage = desiredURL;
        }
    }

    let asyncIterator = 0;

    async function appearPicture() {
        await (setTimeout(async () => {
            elements.pictureCell.item(asyncIterator).style.opacity = valuesCSS.visible;

            if (asyncIterator < 5) {
                asyncIterator++;

                await appearPicture();
                if (asyncIterator === 4) {
                    setImageLinks();
                }
            }
        }, transitionsDurations.pictureAppear));
    }

    async function appear(fromCache = false) {
        let pageAppearTime = 1000;
        if (fromCache) {
            pageAppearTime = transitionsDurations.pageAppear;
        }

        elements.h1.style.opacity = valuesCSS.visible;
        elements.leftCell.style.opacity = valuesCSS.visible;

        await appearPicture();
        setTimeout(() => {
            elements.rightCell.style.opacity = valuesCSS.visible;
        }, pageAppearTime);
    }

    function addCellListeners() {
        for (let i = 0; i < elements.pictureCell.length; i++) {
            elements.pictureCell.item(i).addEventListener('click', (event => openPreview(event.target.parentElement.id)));
            addCellDescriptions(i);
        }
    }


    // Pictures description when preview is closed

    function validateDescription(iterator) {
        const description = descriptionsTable[iterator];

        return description ?? '';
    }

    function addCellDescriptions(iterator) {
        elements.pictureCell.item(iterator).innerHTML = '<span class="cellDescription">' + validateDescription(iterator) + '</span>';
        adjustCellDescription();
    }

    function updateCellDescription(index, maxNumberOfChars) {
        const cellDescription = elements.cellDescription.item(index);
        const currentDescription = validateDescription(index).trim();

        if (cellDescription !== null && cellDescription.innerText !== '') {
            if (currentDescription.length > maxNumberOfChars) {
                cellDescription.innerText = currentDescription.substring(0, maxNumberOfChars).trim() + '...';
            } else {
                cellDescription.innerText = currentDescription;
            }
        }
    }

    function adjustCellDescription() {
        const maxNumberOfChars = elements.pictureCell.item(0).offsetWidth / 10 - 2;

        for (let i = 0; i < elements.pictureCell.length - 1; i++) {
            updateCellDescription(i, maxNumberOfChars)
        }
    }


    // Animating and adjusting row indicators

    function animateRowIndicatorUp(index) {
        const rowIndicatorNumberStyle = elements.rowIndicator.item(index).style;
        const standardTransitions = 'var(--button-animation-time)';
        const newTransitions = '0ms';

        if (index === 1) {
            animateRowIndicatorUp(3);
        }

        setTimeout(() => {
            rowIndicatorNumberStyle.marginBottom = valuesCSS.animationIndicatorMargin;
            rowIndicatorNumberStyle.opacity = valuesCSS.invisible;

            setTimeout(() => {
                adjustRowIndicator();

                rowIndicatorNumberStyle.transitionDuration = newTransitions;
                rowIndicatorNumberStyle.marginTop = valuesCSS.animationIndicatorMargin;
                rowIndicatorNumberStyle.marginBottom = valuesCSS.noMargin;

                setTimeout(() => {
                    rowIndicatorNumberStyle.transitionDuration = standardTransitions;
                    rowIndicatorNumberStyle.marginTop = valuesCSS.noMargin;
                    rowIndicatorNumberStyle.opacity = valuesCSS.visible;
                }, transitionsDurations.significantTimeoutToHelpCSS);
            }, transitionsDurations.oneStepOfImageAnimation);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateRowIndicatorDown(index) {
        const rowIndicatorNumberStyle = elements.rowIndicator.item(index).style;
        const standardTransitions = 'var(--button-animation-time)';
        const newTransitions = '0ms';

        if (index === 1) {
            animateRowIndicatorDown(3);
        }

        setTimeout(() => {
            rowIndicatorNumberStyle.marginTop = valuesCSS.animationIndicatorMargin;
            rowIndicatorNumberStyle.opacity = valuesCSS.invisible;

            setTimeout(() => {
                adjustRowIndicator();

                rowIndicatorNumberStyle.transitionDuration = newTransitions;
                rowIndicatorNumberStyle.marginBottom = valuesCSS.animationIndicatorMargin;
                rowIndicatorNumberStyle.marginTop = valuesCSS.noMargin;

                setTimeout(() => {
                    rowIndicatorNumberStyle.transitionDuration = standardTransitions;
                    rowIndicatorNumberStyle.marginBottom = valuesCSS.noMargin;
                    rowIndicatorNumberStyle.opacity = valuesCSS.visible;
                }, transitionsDurations.significantTimeoutToHelpCSS);
            }, transitionsDurations.oneStepOfImageAnimation);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function adjustRowIndicator() {
        const indexHumanizer = 1;

        elements.rowIndicatorFirstNumber.innerText = (currentTopIndex + indexHumanizer).toString();
        elements.rowIndicatorSecondNumber.innerText = (currentTopIndex + indexHumanizer + 1).toString();
    }


    // Functions preventing user from breaking animations by unexpected amount of input

    let scrollingReady = true;
    let swipingReady = true;

    function verifyScrolling() {
        scrollingReady = false;

        setTimeout(() => {
            scrollingReady = true;
        }, transitionsDurations.oneStepOfImageAnimation * transitionsDurations.numberOfStepsInImageAnimation);
    }

    function verifySwiping() {
        let adjustedTimeout = transitionsDurations.oneStepOfImageAnimation * transitionsDurations.numberOfStepsInImageAnimation;
        swipingReady = false;

        if (currentMidIndex === 0 || currentMidIndex === elements.pictureSwipe.length - 1) {
            adjustedTimeout = transitionsDurations.oneStepOfImageAnimation;
        }

        setTimeout(() => {
            swipingReady = true;
        }, adjustedTimeout);
    }


    // Handling of user control

    function captureArrows(eventKey) {
        const numberOfPicturesInRow = 3;
        const midAndRightIndex = 2;

        if (scrollingReady && !previewOpened) {
            if (eventKey === 'ArrowUp' && currentTopIndex > 0) {
                scrollRowsDown();
                verifyScrolling();
            } else if (eventKey === 'ArrowDown' && currentTopIndex < elements.pictureCell.length / numberOfPicturesInRow - midAndRightIndex) {
                scrollRowsUp();
                verifyScrolling();
            }
        } else if (swipingReady && previewOpened) {
            if (eventKey === 'ArrowLeft' && currentMidIndex > 0) {
                swipePicturesRight();
                verifySwiping();
            } else if (eventKey === 'ArrowRight' && currentMidIndex < elements.pictureSwipe.length - 1) {
                swipePicturesLeft();
                verifySwiping();
            }
        }
    }

    function captureArrowsButtons(eventTarget) {
        const numberOfPicturesInRow = 3;
        const midAndRightIndex = 2;

        if (checkIfScreenIsHorizontal()) {
            if (scrollingReady && !previewOpened) {
                if (eventTarget === 'arrowUp' && currentTopIndex > 0) {
                    scrollRowsDown();
                    verifyScrolling();
                } else if (eventTarget === 'arrowDown' && currentTopIndex < elements.pictureCell.length / numberOfPicturesInRow - midAndRightIndex) {
                    scrollRowsUp();
                    verifyScrolling();
                }
            } else if (swipingReady && previewOpened) {
                if (eventTarget === 'arrowLeft' && currentMidIndex > 0) {
                    swipePicturesRight();
                    verifySwiping();
                } else if (eventTarget === 'arrowRight' && currentMidIndex < elements.pictureSwipe.length - 1) {
                    swipePicturesLeft();
                    verifySwiping();
                }
            }
        }
    }


    // Opening and closing preview

    function appearPreview() {
        elements.swipeContainer.style.opacity = valuesCSS.visible;
        elements.swipeDescription.style.opacity = valuesCSS.visible;

        setTimeout(() => {
            elements.leftCell1.style.opacity = valuesCSS.visible;
            elements.rightCell1.style.opacity = valuesCSS.visible;
        }, transitionsDurations.cellAppear);

        setSwipeDescription();
    }

    function disappearPreview() {
        elements.leftCell1.style.opacity = valuesCSS.invisible;
        elements.rightCell1.style.opacity = valuesCSS.invisible;

        setTimeout(() => {
            elements.swipeContainer.style.opacity = valuesCSS.invisible;
            elements.swipeDescription.style.opacity = valuesCSS.invisible;

            closePreview();
        }, transitionsDurations.cellAppear);
    }

    function openPreview(targetID) {
        if (checkIfScreenIsHorizontal()) {
            previewOpened = true;
            setSwipes();
            displayCorrectPicture(targetID);

            elements.h1.style.filter = valuesCSS.blur;
            elements.leftCell.style.filter = valuesCSS.blur;
            elements.rightCell.style.filter = valuesCSS.blur;
            elements.rightCell.style.opacity = valuesCSS.invisible;
            elements.grid1.style.display = valuesCSS.makeItGrid;
            setTimeout(() => {
                elements.grid1.style.opacity = valuesCSS.visible;
                setTimeout(appearPreview, transitionsDurations.pageAppear);
            }, transitionsDurations.randomTimeoutToHelpCSS);
        }
    }

    function closePreview() {
        elements.grid1.style.opacity = valuesCSS.invisible;
        elements.h1.style.filter = valuesCSS.noBlur;
        elements.leftCell.style.filter = valuesCSS.noBlur;
        elements.rightCell.style.filter = valuesCSS.noBlur;
        elements.rightCell.style.opacity = valuesCSS.visible;
        setTimeout(() => {
            elements.grid1.style.display = valuesCSS.makeItNothing;
            previewOpened = false;
        }, transitionsDurations.pageAppear);
    }


    // Indexing pictures

    function utilityAssistForAnimations() {
        disappearArrows();
        document.activeElement.blur();
    }

    function setRows() {
        imagesVerticalPositions.currentNextAboveRow = document.getElementsByClassName('pictureRow' + (currentTopIndex - 2).toString());
        imagesVerticalPositions.currentAboveRow = document.getElementsByClassName('pictureRow' + (currentTopIndex - 1).toString());
        imagesVerticalPositions.currentTopRow = document.getElementsByClassName('pictureRow' + currentTopIndex);
        imagesVerticalPositions.currentBelowRow = document.getElementsByClassName('pictureRow' + (currentTopIndex + 1).toString());
        imagesVerticalPositions.currentNextBelowRow = document.getElementsByClassName('pictureRow' + (currentTopIndex + 2).toString());

        utilityAssistForAnimations();
    }

    function setSwipes() {
        imagesHorizontalPositions.currentNextLeftSwipe = document.getElementById('pictureSwipe' + (currentMidIndex - 2).toString());
        imagesHorizontalPositions.currentLeftSwipe = document.getElementById('pictureSwipe' + (currentMidIndex - 1).toString());
        imagesHorizontalPositions.currentMidSwipe = document.getElementById('pictureSwipe' + currentMidIndex);
        imagesHorizontalPositions.currentRightSwipe = document.getElementById('pictureSwipe' + (currentMidIndex + 1).toString());
        imagesHorizontalPositions.currentNextRightSwipe = document.getElementById('pictureSwipe' + (currentMidIndex + 2).toString());

        utilityAssistForAnimations();
    }


    // Animations

    function animateTopRowUp(element) {
        const elementStyle = element.style;

        elementStyle.opacity = valuesCSS.invisible;
        setTimeout(() => {
            elementStyle.paddingTop = valuesCSS.noPadding;
            elementStyle.marginBottom = valuesCSS.noMargin;
            elementStyle.marginTop = valuesCSS.noMargin;
            elementStyle.borderWidth = valuesCSS.noBorder;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateBelowRowUp(element) {
        const elementStyle = element.style;

        setTimeout(() => {
            elementStyle.marginBottom = valuesCSS.standardVerticalMargin;
            elementStyle.marginTop = valuesCSS.noMargin;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateNextBelowRowUp(element) {
        const elementStyle = element.style;

        setTimeout(() => {
            elementStyle.paddingTop = valuesCSS.standardPadding;
            elementStyle.marginTop = valuesCSS.standardVerticalMargin;

            setTimeout(() => {
                elementStyle.opacity = valuesCSS.visible;
                elementStyle.borderWidth = valuesCSS.standardBorder;
            }, transitionsDurations.oneStepOfImageAnimation);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function scrollRowsUp() {
        const newTransitions = '300ms, 300ms, 300ms, 300ms, 300ms, 100ms';

        for (let i = 0; i < elements.pictureCell.length; i++) {
            elements.pictureCell.item(i).style.transitionDuration = newTransitions;
        }

        for (let i = 0; i < 3; i++) {
            animateTopRowUp(imagesVerticalPositions.currentTopRow.item(i));
            animateBelowRowUp(imagesVerticalPositions.currentBelowRow.item(i));
            animateNextBelowRowUp(imagesVerticalPositions.currentNextBelowRow.item(i));
            animateRowIndicatorUp(1);

            if (i === 2) {
                currentTopIndex++;
                setRows();
            }
        }
    }

    function animateBelowRowDown(element) {
        const elementStyle = element.style;

        elementStyle.opacity = valuesCSS.invisible;
        setTimeout(() => {
            elementStyle.paddingTop = valuesCSS.noPadding;
            elementStyle.marginTop = valuesCSS.noMargin;
            elementStyle.marginBottom = valuesCSS.noMargin;
            elementStyle.borderWidth = valuesCSS.noBorder;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateAboveRowDown(element) {
        const elementStyle = element.style;

        setTimeout(() => {
            elementStyle.paddingTop = valuesCSS.standardPadding;
            elementStyle.marginBottom = valuesCSS.standardVerticalMargin;
            setTimeout(() => {
                elementStyle.opacity = valuesCSS.visible;
                elementStyle.borderWidth = valuesCSS.standardBorder;
            }, transitionsDurations.oneStepOfImageAnimation);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateTopRowDown(element) {
        const elementStyle = element.style;

        setTimeout(() => {
            elementStyle.marginTop = valuesCSS.standardVerticalMargin;
            elementStyle.marginBottom = valuesCSS.noMargin;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function scrollRowsDown() {
        for (let i = 0; i < 3; i++) {
            animateBelowRowDown(imagesVerticalPositions.currentBelowRow.item(i));
            animateAboveRowDown(imagesVerticalPositions.currentAboveRow.item(i));
            animateTopRowDown(imagesVerticalPositions.currentTopRow.item(i));
            animateRowIndicatorDown(1);

            if (i === 2) {
                currentTopIndex--;
                setRows();
            }
        }
    }

    function disappearArrows() {
        const numberOfPicturesInRow = 3;
        const midAndRightIndex = 2;

        currentTopIndex === 0 ?
            elements.arrowUp.style.opacity = valuesCSS.invisible :
            elements.arrowUp.style.opacity = valuesCSS.visible;

        currentTopIndex === elements.pictureCell.length / numberOfPicturesInRow - midAndRightIndex ?
            elements.arrowDown.style.opacity = valuesCSS.invisible :
            elements.arrowDown.style.opacity = valuesCSS.visible;

        currentMidIndex > 0 ?
            elements.arrowLeft.style.opacity = valuesCSS.visible :
            elements.arrowLeft.style.opacity = valuesCSS.invisible;

        currentMidIndex < elements.pictureSwipe.length - 1 ?
            elements.arrowRight.style.opacity = valuesCSS.visible :
            elements.arrowRight.style.opacity = valuesCSS.invisible;
    }

    function displayCorrectPicture(targetID) {
        const desiredMidIndex = Number(targetID.match(/\d+/)[0]);

        for (let i = 0; i < elements.pictureSwipe.length; i++) {
            const veryCurrentSwipe = document.getElementById('pictureSwipe' + i);

            if (i < desiredMidIndex - 1 || i > desiredMidIndex + 1) {
                veryCurrentSwipe.style.width = valuesCSS.noWidth;
                veryCurrentSwipe.style.margin = valuesCSS.noMargin;
                veryCurrentSwipe.style.opacity = valuesCSS.invisible;
            } else if (i === desiredMidIndex - 1) {
                veryCurrentSwipe.style.width = valuesCSS.standardSwipeWidth;
                veryCurrentSwipe.style.margin = valuesCSS.leftSwipeMargins;
                veryCurrentSwipe.style.opacity = valuesCSS.leftOrRightSwipeOpacity;
            } else if (i === desiredMidIndex) {
                if (i === 0) {
                    veryCurrentSwipe.style.margin = valuesCSS.veryLeftMidSwipeMargins;
                } else {
                    veryCurrentSwipe.style.margin = valuesCSS.midSwipeMargins;
                }

                veryCurrentSwipe.style.width = valuesCSS.standardSwipeWidth;
                veryCurrentSwipe.style.opacity = valuesCSS.visible;
            } else if (i === desiredMidIndex + 1) {
                veryCurrentSwipe.style.width = valuesCSS.standardSwipeWidth;
                veryCurrentSwipe.style.margin = valuesCSS.rightSwipeMargins;
                veryCurrentSwipe.style.opacity = valuesCSS.leftOrRightSwipeOpacity;
            }
        }

        currentMidIndex = desiredMidIndex;
        setSwipes();
    }

    function animateSwipeDescriptionsLeft() {
        const swipeDescriptionStyle = elements.swipeDescription.style;
        const standardTransitions = 'var(--one-step-of-image-animation-time)';
        const newTransitions = '0ms';

        swipeDescriptionStyle.paddingLeft = valuesCSS.noPadding;
        swipeDescriptionStyle.paddingRight = valuesCSS.animationDescriptionMargin;
        swipeDescriptionStyle.opacity = valuesCSS.invisible;

        setTimeout(() => {
            setSwipeDescription();

            swipeDescriptionStyle.transitionDuration = newTransitions;
            swipeDescriptionStyle.paddingLeft = valuesCSS.animationDescriptionMargin;
            swipeDescriptionStyle.paddingRight = valuesCSS.noPadding;

            setTimeout(() => {
                swipeDescriptionStyle.transitionDuration = standardTransitions;
                swipeDescriptionStyle.paddingLeft = valuesCSS.standardDescriptionPadding;
                swipeDescriptionStyle.paddingRight = valuesCSS.standardDescriptionPadding;
                swipeDescriptionStyle.opacity = valuesCSS.visible;
            }, transitionsDurations.significantTimeoutToHelpCSS);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateSwipeDescriptionRight() {
        const swipeDescriptionStyle = elements.swipeDescription.style;
        const standardTransitions = 'var(--one-step-of-image-animation-time)';
        const newTransitions = '0ms';

        swipeDescriptionStyle.paddingLeft = valuesCSS.animationDescriptionMargin;
        swipeDescriptionStyle.paddingRight = valuesCSS.noPadding;
        swipeDescriptionStyle.opacity = valuesCSS.invisible;

        setTimeout(() => {
            setSwipeDescription();

            swipeDescriptionStyle.transitionDuration = newTransitions;
            swipeDescriptionStyle.paddingLeft = valuesCSS.noPadding;
            swipeDescriptionStyle.paddingRight = valuesCSS.animationDescriptionMargin;

            setTimeout(() => {
                swipeDescriptionStyle.transitionDuration = standardTransitions;
                swipeDescriptionStyle.paddingLeft = valuesCSS.standardDescriptionPadding;
                swipeDescriptionStyle.paddingRight = valuesCSS.standardDescriptionPadding;
                swipeDescriptionStyle.opacity = valuesCSS.visible;
            }, transitionsDurations.significantTimeoutToHelpCSS);
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function animateMobilePictureDescription() {
        const pictureDescription = elements.h1.style;

        pictureDescription.opacity = valuesCSS.invisible;
        setTimeout(() => {
            elements.h1.innerText = descriptionsTable[currentTopPictureMobile];

            pictureDescription.opacity = valuesCSS.visible;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function setSwipeDescription() {
        const maxDescriptionLength = 100;
        const currentDescription = validateDescription(currentMidIndex);
        const placeholderDescription = '';

        currentDescription.length < maxDescriptionLength ?
            elements.swipeDescription.innerText = currentDescription :
            elements.swipeDescription.innerText = placeholderDescription;
    }

    function animateLeftSwipeLeft(element) {
        const elementStyle = element.style;

        elementStyle.width = valuesCSS.noWidth;
        elementStyle.margin = valuesCSS.noMargin;
    }

    function animateMidSwipeLeft(element) {
        const elementStyle = element.style;

        elementStyle.margin = valuesCSS.leftSwipeMargins;
        elementStyle.opacity = valuesCSS.leftOrRightSwipeOpacity;
    }

    function animateRightSwipeLeft(element) {
        const elementStyle = element.style;

        elementStyle.margin = valuesCSS.midSwipeMargins;
        elementStyle.opacity = valuesCSS.visible;
    }

    function animateNextRightSwipeLeft(element) {
        const elementStyle = element.style;

        elementStyle.width = valuesCSS.standardSwipeWidth;
        setTimeout(() => {
            elementStyle.opacity = valuesCSS.leftOrRightSwipeOpacity;
            elementStyle.margin = valuesCSS.rightSwipeMargins;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function swipePicturesLeft() {
        let waitingVariableTime;

        if (currentMidIndex > 0) {
            imagesHorizontalPositions.currentLeftSwipe.style.opacity = valuesCSS.invisible;
            waitingVariableTime = 300;
        } else {
            waitingVariableTime = 0;
        }

        setTimeout(() => {
            const leftSwipeMidIndexCorrection = 1;
            animateSwipeDescriptionsLeft();

            if (!checkVisibility(currentMidIndex + leftSwipeMidIndexCorrection)) {
                scrollRowsUp();
            }

            if (currentMidIndex > 0) {
                animateLeftSwipeLeft(imagesHorizontalPositions.currentLeftSwipe);
            }

            animateMidSwipeLeft(imagesHorizontalPositions.currentMidSwipe);

            if (currentMidIndex < elements.pictureSwipe.length - 1) {
                animateRightSwipeLeft(imagesHorizontalPositions.currentRightSwipe);

                if (currentMidIndex < elements.pictureSwipe.length - 2) {
                    animateNextRightSwipeLeft(imagesHorizontalPositions.currentNextRightSwipe);
                }
            }

            currentMidIndex++;
            setSwipes();
        }, waitingVariableTime);
    }

    function animateRightSwipeRight(element) {
        const elementStyle = element.style;

        elementStyle.width = valuesCSS.noWidth;
        elementStyle.margin = valuesCSS.noMargin;
    }

    function animateMidSwipeRight(element) {
        const elementStyle = element.style;

        elementStyle.margin = valuesCSS.rightSwipeMargins;
        elementStyle.opacity = valuesCSS.leftOrRightSwipeOpacity;
    }

    function animateLeftSwipeRight(element, margin) {
        const elementStyle = element.style;

        elementStyle.margin = margin;
        elementStyle.opacity = valuesCSS.visible;
    }

    function animateNextLeftSwipeRight(element) {
        const elementStyle = element.style;

        elementStyle.width = valuesCSS.standardSwipeWidth;
        elementStyle.margin = valuesCSS.leftSwipeMargins;
        setTimeout(() => {
            elementStyle.opacity = valuesCSS.leftOrRightSwipeOpacity;
        }, transitionsDurations.oneStepOfImageAnimation);
    }

    function swipePicturesRight() {
        let waitingVariableTime;

        if (currentMidIndex < elements.pictureSwipe.length - 1) {
            imagesHorizontalPositions.currentRightSwipe.style.opacity = valuesCSS.invisible;
            waitingVariableTime = 300;
        } else {
            waitingVariableTime = 0;
        }

        setTimeout(() => {
            const rightSwipeMidIndexCorrection = -1;
            animateSwipeDescriptionRight();

            if (!checkVisibility(currentMidIndex + rightSwipeMidIndexCorrection)) {
                scrollRowsDown();
            }

            if (currentMidIndex < elements.pictureSwipe.length - 1) {
                animateRightSwipeRight(imagesHorizontalPositions.currentRightSwipe);
            }

            animateMidSwipeRight(imagesHorizontalPositions.currentMidSwipe);

            if (currentMidIndex > 1) {
                animateLeftSwipeRight(imagesHorizontalPositions.currentLeftSwipe, valuesCSS.midSwipeMargins);
                animateNextLeftSwipeRight(imagesHorizontalPositions.currentNextLeftSwipe);
            }

            if (currentMidIndex === 1) {
                animateLeftSwipeRight(imagesHorizontalPositions.currentLeftSwipe, valuesCSS.veryLeftMidSwipeMargins);
            }

            currentMidIndex--;
            setSwipes();
        }, waitingVariableTime);
    }


    // Closing page

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


    // Mobile view related

    function handleTransitionBetweenModes() {
        const picturesElements = elements.pictureCell;
        const standardH1Text = 'Tatuaże • linoryty • różności';
        const h1 = elements.h1;
        const numberOfPicturesInRow = 3;
        const pictureSelector = currentTopIndex * numberOfPicturesInRow;

        if (checkIfScreenIsHorizontal()) {
            h1.style.zIndex = valuesCSS.zBelow;
            h1.innerText = standardH1Text;
            for (let i = 0; i < picturesElements.length; i++) {
                if (i !== pictureSelector && i !== pictureSelector + 1 && i !== pictureSelector + 2
                    && i !== pictureSelector + 3 && i !== pictureSelector + 4 && i !== pictureSelector + 5) {
                    picturesElements.item(i).style.opacity = valuesCSS.invisible;
                }
            }
        } else {
            h1.style.zIndex = valuesCSS.zAbove;
            for (let i = 0; i < picturesElements.length; i++) {
                picturesElements.item(i).style.opacity = valuesCSS.visible;
            }
        }
    }

    function checkMobilePicturePosition() {
        if (!checkIfScreenIsHorizontal()) {
            for (let i = 0; i < elements.pictureCell.length; i++) {
                const picturePosition = elements.pictureCell.item(i).getBoundingClientRect().top + (elements.pictureCell.item(i).getBoundingClientRect().height / 2);
                const topMargin = window.innerHeight * 0.23;
                const bottomMargin = window.innerHeight * 0.7;

                if (picturePosition < bottomMargin && picturePosition > topMargin) {
                    if (i !== currentTopPictureMobile) {
                        currentTopPictureMobile = i;
                        animateMobilePictureDescription();
                    }
                }
            }
        }
    }


    // Event listeners

    window.addEventListener('resize', function () {
        adjustCellDescription();
        handleTransitionBetweenModes();
    });

    document.addEventListener('keydown', eve => captureArrows(eve.key));
    document.addEventListener('scroll', checkMobilePicturePosition);

    elements.arrowUp.addEventListener('click', eve => captureArrowsButtons(eve.target.id));
    elements.arrowDown.addEventListener('click', eve => captureArrowsButtons(eve.target.id));
    elements.arrowLeft.addEventListener('click', eve => captureArrowsButtons(eve.target.id));
    elements.arrowRight.addEventListener('click', eve => captureArrowsButtons(eve.target.id));

    elements.backButton.addEventListener('click', () => {
        const indexAddress = '../index.html';
        disappear(indexAddress);
    });

    elements.closeButton.addEventListener('click', disappearPreview);


    // XML related

    async function getConfigFile() {
        const fileAddress = 'https://testaccountforkotek.github.io/portfolio.xml';
        const requestInit = {
            'headers': {
                'accept': 'application/xml'
            },
            'mode': 'cors',
            'method': 'GET'
        };

        fetch(fileAddress, requestInit).then(res => parseConfigFile(res.text())).catch(er => console.log(er));
    }

    async function parseConfigFile(responseText) {
        const parser = new DOMParser();
        const responseSettled = await responseText;
        const expectedResponseType = 'application/xml';
        const configFile = parser.parseFromString(responseSettled, expectedResponseType);

        transferDataToTable(configFile);
    }

    getConfigFile();

    window.addEventListener('pageshow', eve => {
        if (eve.persisted) {
            appear(eve.persisted);
        }
    });

});