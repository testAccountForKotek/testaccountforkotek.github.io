document.addEventListener('DOMContentLoaded', function () {

    let elements = {
        'h1': document.getElementsByTagName('h1').item(0),
        'leftCell': document.getElementsByClassName('leftCell').item(0),
        'rightCell': document.getElementsByClassName('rightCell').item(0),

        'monthBar': document.getElementById('monthBar'),
        'calendar': document.getElementById('calendar'),
        'currentMonthDay': document.getElementsByClassName('currentMonthDay'),

        'backButton': document.getElementsByClassName('buttonRight').item(0)
    }

    let valuesCSS = {
        'invisible': '0',
        'visible': '1',

        'sixGridRows': 'repeat(6, 1fr)',
        'standardBorder': '1px gray solid',

        'standardRadius': '10px',
        'red': 'rgba(255, 0, 0, 0.1)'
    }

    let transitionsDurations = {
        'pageAppear': 400,
        'cellAppear': 200,

        'pageDisappear': 300,
        'pageDisappearDelay': 100
    }

    const date = new Date();

    let currentDateVariables = {
        'day': date.getDay(),
        'month': date.getMonth(),
        'year': date.getFullYear(),

        'numberOfDaysInMonth': new Date(date.getFullYear(), date.getMonth(), 0).getDate()
    }

    let gridSize = 35;

    function yassifyDate(date) {
        const firstDoubleDigitNumber = 10;

        if (date < firstDoubleDigitNumber) {
            return '0' + date;
        } else {
            return date;
        }
    }

    function getNextMonthNumber() {
        const addToGetCurrentMonth = 2;
        const numberOfMonthsInTheYear = 11;

        if (currentDateVariables.month + addToGetCurrentMonth > numberOfMonthsInTheYear) {
            return 1;
        } else {
            return currentDateVariables.month + addToGetCurrentMonth;
        }
    }

    function setupDate() {
        elements.monthBar.innerText = yassifyDate(getNextMonthNumber()) + ' / ' + currentDateVariables.year;
    }

    function setupDays() {
        const firstMonthDayName = new Date(currentDateVariables.year, getNextMonthNumber(), 1).getDay();
        const sizeOfSmallerGrid = 34;
        let dayInMonthIndex = 1;

        if (firstMonthDayName + currentDateVariables.numberOfDaysInMonth > sizeOfSmallerGrid) {
            elements.calendar.style.gridTemplateRows = valuesCSS.sixGridRows;
            gridSize = 42;
        }

        for (let i = 0; i < gridSize; i++) {
            if (i >= firstMonthDayName && i <= currentDateVariables.numberOfDaysInMonth + firstMonthDayName) {
                elements.calendar.innerHTML += '<span class="day currentMonthDay" id="dayIndex' + i + '">' + dayInMonthIndex + '</span>';
                dayInMonthIndex++;
            } else {
                elements.calendar.innerHTML += '<span class="day" id="dayIndex' + i + '"></span>';
            }
        }

        addCalendarBorders();
        markSundays();
        addDaysListeners();
    }

    function addCalendarBorders() {
        const oneGridRow = 7;

        for (let i = 0; i < gridSize; i++) {
            if (i >= 0 && i < gridSize - oneGridRow) {
                document.getElementById('dayIndex' + i).style.borderBottom = valuesCSS.standardBorder;
            }
        }
        for (let i = 0; i < gridSize; i += oneGridRow) {
            for (let j = 0; j < oneGridRow - 1; j++) {
                document.getElementById('dayIndex' + (i + j)).style.borderRight = valuesCSS.standardBorder;
            }
        }
    }

    function markSundays() {
        for (let i = 6; i < gridSize; i += 7) {
            if (i === 6) {
                document.getElementById('dayIndex' + i).style.borderTopRightRadius = valuesCSS.standardRadius;
            } else if (i === gridSize - 1) {
                document.getElementById('dayIndex' + i).style.borderBottomRightRadius = valuesCSS.standardRadius;
            }
            document.getElementById('dayIndex' + i).style.backgroundColor = valuesCSS.red;
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
            elements.currentMonthDay.item(i).addEventListener('click', eve => sendMail(eve.target.innerText));
        }
    }

    function appear() {
        setupDate();
        setupDays();

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

    elements.backButton.addEventListener('click', function () {
        const indexAddress = 'https://testaccountforkotek.github.io/index.html';
        disappear(indexAddress);
    });

    setTimeout(appear, transitionsDurations.pageAppear);

    function getConfigFile() {
        // const fileAddress = 'https://drive.google.com/file/d/15USHSjPl2kOjUL7WReHgFiwFVEUXJtqo/view?usp=share_link';
        const fileAddress = 'https://pdfhost.io/v/t9pHOUjTO_Pusty';
        const requestInit = {
            'headers' : {
                'Access-Control-Allow-Origin' : '*',
                // 'Access-Control-Allow-Methods' : 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS',
                // 'Access-Control-Allow-Headers' : 'Origin, Content-Type, X-Auth-Token'
            },
            'mode' : 'cors',
            'method' : 'GET'
        };

        fetch(fileAddress, requestInit).then(data => console.log(data)).then(res => console.log(res)).catch(er => console.log(er));
    }

    getConfigFile();

    // async function readPDF() {
    //     // const fileAddress = 'https://drive.google.com/uc?id=15USHSjPl2kOjUL7WReHgFiwFVEUXJtqo';
    //     const fileAddress = 'https://drive.google.com/file/d/15USHSjPl2kOjUL7WReHgFiwFVEUXJtqo/view?usp=share_link';
    //     const reader = new FileReader();
    //     const file = await fetch(fileAddress).then(function (res) {
    //         return res.blob();
    //     });
    //     console.log(reader.readAsText(file));
    // }
    //
    // readPDF().then(r => console.log('yay'));

});
