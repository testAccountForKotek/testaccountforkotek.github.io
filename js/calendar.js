document.addEventListener('DOMContentLoaded', () => {

    let elements = {
        h1: document.getElementsByTagName('h1').item(0),
        leftCell: document.getElementsByClassName('leftCell').item(0),
        rightCell: document.getElementsByClassName('rightCell').item(0),

        monthBar: document.getElementById('monthBar'),
        calendar: document.getElementById('calendar'),
        currentMonthDay: document.getElementsByClassName('currentMonthDay'),

        backButton: document.getElementsByClassName('buttonRight').item(0)
    }

    let valuesCSS = {
        invisible: '0',
        visible: '1',

        sixGridRows: 'repeat(6, 1fr)',
        standardBorder: '1px gray solid',

        standardRadius: '10px',
        mobileRadius: '1.5vh',
        red: 'rgba(255, 0, 0, 0.1)',

        unavailableDayBackground: 'black',
        mobileFontSize: '1.5vw'
    }

    let transitionsDurations = {
        pageAppear: 400,
        cellAppear: 200,

        pageDisappear: 300,
        pageDisappearDelay: 100
    }

    const date = new Date();

    let currentDateVariables = {
        month: date.getMonth() + 1,
        year: date.getFullYear(),

        numberOfDaysInMonth: new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate()
    }

    const dayMonthStartsWith = new Date(currentDateVariables.year, currentDateVariables.month, 0).getDay();

    let gridSize = 35;

    const mediaQuery = window.matchMedia('(min-aspect-ratio: 1001 / 1000)');

    function checkIfScreenIsHorizontal() {
        return mediaQuery.matches;
    }

    function handleScreenChanges() {
        roundDaysCorners();
    }

    function yassifyDate(date) {
        const firstDoubleDigitNumber = 10;

        return date < firstDoubleDigitNumber ? '0' + date : date;
    }

    function getNextMonthNumber() {
        const addToGetNextMonth = 1;
        const numberOfMonthsInTheYear = 11;

        return currentDateVariables.month + addToGetNextMonth > numberOfMonthsInTheYear ?
            1 :
            currentDateVariables.month + addToGetNextMonth;
    }

    function setupDate() {
        if (getNextMonthNumber() === 1) {
            currentDateVariables.year += 1;
        }
        elements.monthBar.innerText = yassifyDate(getNextMonthNumber()) + ' / ' + currentDateVariables.year;
    }

    function setupDays() {
        const sizeOfSmallerGrid = 35;
        let dayInMonthIndex = 1;

        if (dayMonthStartsWith + currentDateVariables.numberOfDaysInMonth > sizeOfSmallerGrid) {
            elements.calendar.style.gridTemplateRows = valuesCSS.sixGridRows;
            gridSize = 42;
        }

        for (let i = 0; i < gridSize; i++) {
            if (i >= dayMonthStartsWith && i < currentDateVariables.numberOfDaysInMonth + dayMonthStartsWith) {
                elements.calendar.innerHTML += '<span class="day currentMonthDay" id="day' + i + '">' + dayInMonthIndex + '</span>';
                dayInMonthIndex++;
            } else {
                elements.calendar.innerHTML += '<span class="day" id="day' + i + '"></span>';
            }
        }

        addCalendarBorders();
        markSundays();
        roundDaysCorners();
        addDaysListeners();
    }

    function addCalendarBorders() {
        const oneGridRow = 7;

        for (let i = 0; i < gridSize; i++) {
            if (i >= 0 && i < gridSize - oneGridRow) {
                document.getElementById('day' + i).style.borderBottom = valuesCSS.standardBorder;
            }
        }
        for (let i = 0; i < gridSize; i += oneGridRow) {
            for (let j = 0; j < oneGridRow - 1; j++) {
                document.getElementById('day' + (i + j)).style.borderRight = valuesCSS.standardBorder;
            }
        }
    }

    function roundDaysCorners() {
        let dayRadius;

        checkIfScreenIsHorizontal() ? dayRadius = valuesCSS.standardRadius : dayRadius = valuesCSS.mobileRadius;

        document.getElementById('day0').style.borderTopLeftRadius = dayRadius;
        document.getElementById('day6').style.borderTopRightRadius = dayRadius;

        if (gridSize === 35) {
            document.getElementById('day28').style.borderBottomLeftRadius = dayRadius;
            document.getElementById('day34').style.borderBottomRightRadius = dayRadius;
        } else {
            document.getElementById('day35').style.borderBottomLeftRadius = dayRadius;
            document.getElementById('day41').style.borderBottomRightRadius = dayRadius;
        }
    }

    function markSundays() {
        const numberOfDaysInCalendarRow = 7;

        for (let i = numberOfDaysInCalendarRow - 1; i < gridSize; i += numberOfDaysInCalendarRow) {
            document.getElementById('day' + i).style.backgroundColor = valuesCSS.red;
        }

        getConfigFile();
    }

    function verifyWhetherToSendMail(targetText) {
        const busyDayTextValue = 'Busy';
        const vacationDayTextValue = 'Vacation';

        if (targetText === busyDayTextValue) {
            showPopup(busyDayTextValue);
        } else if (targetText === vacationDayTextValue) {
            showPopup(vacationDayTextValue);
        } else {
            sendMail(targetText);
        }
    }

    function showPopup(textValue) {
        const busyDayTextValue = 'Busy';
        const vacationDayTextValue = 'Vacation';
        const busyMessage = 'I\'m busy at this day. Please choose another one';
        const vacationMessage = 'I\'m on vacation at this day. Please choose another one';

        if (textValue === busyDayTextValue) {
            window.alert(busyMessage);
        } else if (textValue === vacationDayTextValue) {
            window.alert(vacationMessage);
        }
    }

    function sendMail(targetText) {
        const dayNumber = targetText;
        const emailAddress = 'amoredisperatottt@gmail.com';
        const emailSubject = 'Tattoo appointment';
        const emailBody =
            '*ENGLISH BELOW*'
            + '%0D%0A' + '%0D%0A' +
            'Hej chciał*bym zapytać o Twoją dyspozycyjność ' + yassifyDate(dayNumber) + ' / ' +
            yassifyDate(getNextMonthNumber()) + ' / ' + currentDateVariables.year + ' (dd / mm / rrrr)'
            + '%0D%0A' + '%0D%0A' +
            'Przybliżony rozmiar tatuażu: [  ]' + '%0D%0A' +
            'W jakim miejscu ma być wykonany: [  ]' + '%0D%0A' +
            'Czy to jeden z moich wzorów: [  ]'
            + '%0D%0A' + '%0D%0A' +
            'Hey id like to ask about Your availability at ' + yassifyDate(dayNumber) + ' / ' +
            yassifyDate(getNextMonthNumber()) + ' / ' + currentDateVariables.year + ' (dd / mm / yyyy)'
            + '%0D%0A' + '%0D%0A' +
            'Approximate tattoo size: [  ]' + '%0D%0A' +
            'Spot it will be placed at: [  ]' + '%0D%0A' +
            'Is it one of my projects: [  ]';

        window.open('mailto:' + emailAddress + '?subject=' + emailSubject + '&body=' + emailBody);
    }

    function addDaysListeners() {
        for (let i = 0; i < elements.currentMonthDay.length; i++) {
            elements.currentMonthDay.item(i).addEventListener('click', eve => verifyWhetherToSendMail(eve.target.innerText));
        }
    }

    function colorDaysInCalendar(configFile) {
        const maxNumberOfDaysInMonth = 31;
        const currentMonthDayClass = 'currentMonthDay';
        const busyDayTagValue = 'Busy';
        const vacationDayTagValue = 'Vacation';

        for (let i = 0; i < maxNumberOfDaysInMonth; i++) {
            const dayId = 'day' + (i + dayMonthStartsWith);
            const dayIdXML = 'day' + (i + 1);
            const currentDayElement = document.getElementById(dayId);

            if (currentDayElement.classList.contains(currentMonthDayClass)) {
                if (configFile.getElementsByTagName(dayIdXML)[0].childNodes[0].nodeValue === busyDayTagValue) {
                    currentDayElement.style.backgroundColor = valuesCSS.unavailableDayBackground;
                    currentDayElement.innerText = busyDayTagValue;
                } else if (configFile.getElementsByTagName(dayIdXML)[0].childNodes[0].nodeValue === vacationDayTagValue) {
                    currentDayElement.style.backgroundColor = valuesCSS.unavailableDayBackground;
                    currentDayElement.style.fontSize = valuesCSS.mobileFontSize;
                    currentDayElement.innerText = vacationDayTagValue;
                }
            }
        }
    }

    function setup() {
        setupDate();
        setupDays();
        appear();
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

    mediaQuery.addEventListener('change', eve => handleScreenChanges(eve.matches))

    elements.backButton.addEventListener('click', () => {
        const indexAddress = '../index.html';
        disappear(indexAddress);
    });

    async function getConfigFile() {
        const fileAddress = 'https://testaccountforkotek.github.io/calendar.xml';
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

        colorDaysInCalendar(configFile);
    }

    setTimeout(setup, transitionsDurations.pageAppear);

    window.addEventListener('pageshow', eve => {
        if (eve.persisted) {
            setTimeout(appear, transitionsDurations.pageAppear);
        }
    });

});