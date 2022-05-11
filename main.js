"use strict";

function init() {
    var BOX_SIZE;
    var rowStart = 0;
    var colStart = 0;
    var colEnd = 0;
    var rowEnd;
    var missingDigitLocation = new Array(2);
    var doubleDigitLocation = new Array(2);
    var getFirst = false;
    var rowsOrCols = true;
    var digit = 1;
    var numsArr;

    startActivity();

    function fillNums() {
        const value = Number(document.getElementById("BOX_SIZE").value);
        if (value > 5) {
            alert("number should be between 2-5");
            throw new Error();
        }
        if (value == 5) {
            document.getElementById("container").style.width = "100vh";
            document.getElementById("container").style.height = "90vh";
        } else {
            document.getElementById("container").style.width = "80vh";
            document.getElementById("container").style.height = "70vh";
        }
        BOX_SIZE = value ? value : 3;
        rowEnd = BOX_SIZE;

        numsArr = new Array(BOX_SIZE * BOX_SIZE);
        for (let rows = 0; rows < numsArr.length; rows++) {
            numsArr[rows] = new Array(BOX_SIZE * BOX_SIZE);
        }

        const square = new Array(BOX_SIZE * BOX_SIZE);
        for (let sqrIdx = 0; sqrIdx < BOX_SIZE * BOX_SIZE; sqrIdx++) {
            square[sqrIdx] = sqrIdx + 1;
        }

        let row = 0, col = 0, sqrIdx = 0, colEnd = BOX_SIZE - 1;

        for (let numOfBoxes = 0; numOfBoxes < numsArr.length; numOfBoxes++) {
            shuffle(square);
            for (let rows = row; rows < row + BOX_SIZE; rows++) {
                numsArr[rows][col] = square[sqrIdx++];
                if (rows == row + (BOX_SIZE - 1) && col < colEnd) {
                    rows = row - 1;
                    col++;
                }
            }
            if (row == numsArr.length - BOX_SIZE &&
                col < numsArr.length - 1) {
                col++;
                row = 0;
                sqrIdx = 0;
                colEnd += BOX_SIZE;
                continue;
            }
            col -= BOX_SIZE - 1;
            row += BOX_SIZE;
            sqrIdx = 0;
        }
    }

    function shuffle(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
    }

    function startActivity() {
        fillNums();

        for (let counter = 0; counter < BOX_SIZE; counter++) {
            digit = 1;
            colStart = 0;
            colEnd = BOX_SIZE * BOX_SIZE;
            makeMoves();
            rowStart += BOX_SIZE;
            rowEnd += BOX_SIZE;
        }

        rowsOrCols = false;
        colStart = 0;
        colEnd = BOX_SIZE;
        for (let counter2 = 0; counter2 < BOX_SIZE; counter2++) {
            digit = 1;
            rowStart = 0;
            rowEnd = BOX_SIZE * BOX_SIZE;
            makeMoves();
            colStart += BOX_SIZE;
            colEnd += BOX_SIZE;
        }

        createDiv();
        drawFrame();
        hideElements();
    }

    function makeMoves() {
        const rowsAndCols = BOX_SIZE * BOX_SIZE + 1;

        while (digit < rowsAndCols) {
            let last = [-1, -1];
            let beenInside = false;
            doubleDigitLocation = checkForDouble();
            while (doubleDigitLocation[0] != -1) {
                if (equels(doubleDigitLocation, last)) {
                    getFirst = true;
                    doubleDigitLocation = checkForDouble();
                    getFirst = false;
                }
                beenInside = true;
                last = doubleDigitLocation;
                missingDigitLocation = checkMissingDigit();
                replace();
                doubleDigitLocation = checkForDouble();
            }
            if (beenInside) {
                digit = 1;
                continue;
            }
            digit++;
        }
    }

    function checkForDouble() {
        let res = [-1, -1];
        let subArr = new Array(BOX_SIZE);
        if (rowsOrCols) {
            for (let i = rowStart; i < rowEnd; i++) {
                subArr = numsArr[i];
                const a = subArr.indexOf(digit)
                const b = subArr.lastIndexOf(digit)
                if (a != b && b != -1) {
                    return getFirst ? [i, a] : [i, b]
                }
            }
        } else {
            let j;
            for (j = colStart; j < colEnd; j++) {
                for (let i = 0; i < numsArr.length; i++) {
                    subArr[i] = numsArr[i][j];
                }
                const a = subArr.indexOf(digit)
                const b = subArr.lastIndexOf(digit)
                if (a != b && b != -1) {
                    return getFirst ? [a, j] : [b, j]
                }
            }
        }
        return res;
    }

    function checkMissingDigit() {
        var res = [-1, -1];
        let j;
        let subArr = new Array(BOX_SIZE);
        if (rowsOrCols) {
            for (let i = rowStart; i < rowEnd; i++) {
                subArr = numsArr[i];
                if (subArr.indexOf(digit) == -1) {
                    return [i, i]
                }
            }
        } else {
            let i;
            for (j = colStart; j < colEnd; j++) {
                for (i = 0; i < numsArr.length; i++) {
                    subArr[i] = numsArr[i][j];
                }
                if (subArr.indexOf(digit) == -1) {
                    return [j, j]
                }
            }
        }
        return res;
    }

    function replace() {
        let temp = numsArr[doubleDigitLocation[0]][doubleDigitLocation[1]];
        if (rowsOrCols) {
            numsArr[doubleDigitLocation[0]][doubleDigitLocation[1]] =
                numsArr[missingDigitLocation[0]][doubleDigitLocation[1]];
            numsArr[missingDigitLocation[0]][doubleDigitLocation[1]] = temp;
        } else {
            numsArr[doubleDigitLocation[0]][doubleDigitLocation[1]] =
                numsArr[doubleDigitLocation[0]][missingDigitLocation[1]];
            numsArr[doubleDigitLocation[0]][missingDigitLocation[1]] = temp;
        }
        digit = numsArr[doubleDigitLocation[0]][doubleDigitLocation[1]];
    }

    function equels(a, b) {
        if (a[0] != b[0] || a[1] != b[1]) {
            return false;
        }
        return true;
    }

    function createDiv() {
        const container = document.getElementById("container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for (let i = 0; i < BOX_SIZE * BOX_SIZE; i++) {
            const box = document.createElement("div");
            box.className = "box";
            container.appendChild(box);
        }

        var boxes = document.getElementsByClassName("box");
        let j = 0, jEnd = BOX_SIZE, i = 0, iEnd = BOX_SIZE;

        for (var k = 0; k < BOX_SIZE * BOX_SIZE; k++) {
            if (k % BOX_SIZE == 0 && k != 0) {
                i += BOX_SIZE;
                iEnd += BOX_SIZE;
                jEnd = BOX_SIZE;
                j = 0;
            }
            for (i; i < iEnd; i++) {
                for (j; j < jEnd; j++) {
                    const squre = document.createElement("div");
                    squre.classList.add("squre");
                    squre.style.fontSize = "20px";
                    squre.onclick = function () { colorSqure(this) };
                    squre.innerText = numsArr[i][j];
                    boxes[k].appendChild(squre);
                }
                j -= BOX_SIZE;
            }
            i -= BOX_SIZE;
            jEnd += BOX_SIZE;
            j += BOX_SIZE;
        }
    }

    function drawFrame() {
        let fr = "1fr ".repeat(BOX_SIZE);

        container.style.gridTemplateColumns = fr;
        container.style.gridTemplateRows = fr;

        const boxes = document.getElementsByClassName("box");

        for (let i = 0; i < boxes.length; i++) {
            boxes[i].style.gridTemplateColumns = fr;
            boxes[i].style.gridTemplateRows = fr;
        }
    }

    function hideElements() {
        const squres = document.getElementsByClassName("squre");
        for (let i = 0; i < squres.length / 2; i++) {
            squres[Math.floor(Math.random() * squres.length)].setAttribute("style", "font-size: 0")
        }
    }
}

var chosenSqure;
function colorSqure(div) {
    clearAll();
    if (!(div.getAttribute("style") == "font-size: 0")) {
        var squres = document.getElementsByClassName("squre");
        for (let i = 0; i < squres.length; i++) {
            if (squres[i].innerText == div.innerText &&
                squres[i].getAttribute("style") != "font-size: 0") {
                squres[i].classList.add("faint-color");
            }
        }
    }
    chosenSqure = div;
    div.id = "change-color";
}

function clearAll() {
    var squres = document.getElementsByClassName("squre");
    for (let i = 0; i < squres.length; i++) {
        squres[i].classList.remove("faint-color");
        squres[i].id = "";
    }
}

function showAllElements() {
    var squres = document.getElementsByClassName("squre");
    for (let i = 0; i < squres.length; i++) {
        squres[i].setAttribute("style", "font-size: 20px");
    }

}

function makePlay() {
    if (document.getElementById("number-input").value == chosenSqure.innerText) {
        chosenSqure.setAttribute("style", "font-size: 20px");
        colorSqure(chosenSqure);
    }
    clearInput();
}

function writeInput(button) {
    var inputBox = document.getElementById("number-input");
    if (inputBox.getAttribute("value") == 0) {
        inputBox.setAttribute("value", button.innerText);
    } else {
        inputBox.setAttribute("value", inputBox.value + button.innerText);
    }
}

function deleteInput() {
    var inputBox = document.getElementById("number-input");
    inputBox.setAttribute("value", Math.floor(inputBox.value / 10));
}

function clearInput() {
    var inputBox = document.getElementById("number-input");
    inputBox.setAttribute("value", 0);
}