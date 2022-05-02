'use strict'
function init() {
    var digit = 1;
    var BOX_SIZE;
    var doubleDigitLocation = new Array(2);
    var missingDigitLocation = new Array(2);
    var getFirst = false;
    var rowStart = 0;
    var colStart = 0;
    var colEnd = 0;
    var rowEnd;
    var rowsOrCols = true;

    startActivity();

    var nums;
    function fillNums() {
        const size = document.getElementById("BOX_SIZE").value;
        console.log(size);
        BOX_SIZE = size ? size : 3;
        digit = 1;
        rowEnd = BOX_SIZE;

        nums = new Array(BOX_SIZE * BOX_SIZE);
        for (let i = 0; i < nums.length; i++) {
            nums[i] = new Array(BOX_SIZE * BOX_SIZE);
        }

        let square = new Array(BOX_SIZE * BOX_SIZE);
        for (let i = 0; i < BOX_SIZE * BOX_SIZE; i++) {
            square[i] = i + 1;
        }

        let row = 0;
        let col = 0;
        let sqr = 0;
        let colEnd = (BOX_SIZE - 1);

        for (let index = 0; index < nums.length; index++) {
            shuffle(square)
            for (let rows = row; rows < (row + BOX_SIZE); rows++) {
                nums[rows][col] = square[sqr++];
                if (rows == row + (BOX_SIZE - 1) && col < colEnd) {
                    rows = row - 1;
                    col++;
                }
            }
            if (row == nums.length - BOX_SIZE && col < nums.length - 1) {
                col++;
                row = 0;
                sqr = 0;
                colEnd += BOX_SIZE;
                continue;
            }
            col -= (BOX_SIZE - 1);
            row += BOX_SIZE;
            sqr = 0;
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
    }

    function makeMoves() {
        let rowsAndCols = BOX_SIZE * BOX_SIZE + 1;

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
                last = doubleDigitLocation;
                beenInside = true;
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
        let temp = [-1, -1];
        let j;
        if (rowsOrCols) {
            for (let i = rowStart; i < rowEnd; i++) {
                let counter = 0;
                for (j = colStart; j < colEnd; j++) {
                    if (nums[i][j] == digit) {
                        counter++;
                        if (getFirst && counter < 2) {
                            temp[0] = i;
                            temp[1] = j;
                        }
                    }
                    if (counter == 2 && !getFirst) {
                        res[0] = i;
                        res[1] = j;
                        break;
                    } else if (counter == 2) {
                        res[0] = temp[0];
                        res[1] = temp[1];
                        break;
                    }
                }
                if (counter == 2) {
                    break;
                }
            }
        } else {
            for (j = colStart; j < colEnd; j++) {
                let counter = 0;
                for (let i = rowStart; i < rowEnd; i++) {
                    if (nums[i][j] == digit) {
                        counter++;
                        if (getFirst && counter < 2) {
                            temp[0] = i;
                            temp[1] = j;
                        }
                    }
                    if (counter == 2 && !getFirst) {
                        res[0] = i;
                        res[1] = j;
                        break;
                    } else if (counter == 2) {
                        res[0] = temp[0];
                        res[1] = temp[1];
                        break;
                    }
                }
                if (counter == 2) {
                    break;
                }
            }
        }
        return res;
    }

    function checkMissingDigit() {
        var res = [-1, -1];
        let j;
        if (rowsOrCols) {
            for (let i = rowStart; i < rowEnd; i++) {
                let isFound = false;
                for (j = colStart; j < colEnd; j++) {
                    if (nums[i][j] == digit) {
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    res[0] = i;
                    res[1] = j;
                }
            }
        } else {
            let i;
            for (j = colStart; j < colEnd; j++) {
                let isFound = false;
                for (i = rowStart; i < rowEnd; i++) {
                    if (nums[i][j] == digit) {
                        isFound = true;
                        break;
                    }
                }
                if (!isFound) {
                    res[0] = i;
                    res[1] = j;
                    break;
                }
            }
        }
        return res;
    }
    function replace() {
        let temp = nums[doubleDigitLocation[0]][doubleDigitLocation[1]];
        if (rowsOrCols) {
            nums[doubleDigitLocation[0]][doubleDigitLocation[1]] = nums[missingDigitLocation[0]][doubleDigitLocation[1]];
            nums[missingDigitLocation[0]][doubleDigitLocation[1]] = temp;
        } else {
            nums[doubleDigitLocation[0]][doubleDigitLocation[1]] = nums[doubleDigitLocation[0]][missingDigitLocation[1]];
            nums[doubleDigitLocation[0]][missingDigitLocation[1]] = temp;
        }
        digit = nums[doubleDigitLocation[0]][doubleDigitLocation[1]];
    }
    function equels(a, b) {
        if (a[0] != b[0] || a[1] != b[1]) {
            return false;
        }
        return true;
    }

    function createDiv() {
        let container = document.getElementById("container");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for (let i = 0; i < BOX_SIZE * BOX_SIZE; i++) {
            let box = document.createElement("div");
            box.id = "box";
            box.className = "box";
            container.appendChild(box);
        }

        var boxes = document.getElementsByClassName("box");
        var j = 0;
        var jEnd = BOX_SIZE;
        var i = 0;
        var iEnd = BOX_SIZE;
        for (var k = 0; k < BOX_SIZE * BOX_SIZE; k++) {
            if (k % BOX_SIZE == 0 && k != 0) {
                i += BOX_SIZE;
                iEnd += BOX_SIZE;
                jEnd = BOX_SIZE;
                j = 0;
            }
            for (i; i < iEnd; i++) {
                for (j; j < jEnd; j++) {
                    let squre = document.createElement("div");
                    squre.id = "squre";
                    squre.innerText = nums[i][j];
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
        let container = document.getElementById("container");
        let fr = ""
        for (let i = 0; i < BOX_SIZE; i++) {
            fr += "1fr "
        }
        container.style.gridTemplateColumns = fr;
        container.style.gridTemplateRows = fr;

        let boxes = document.getElementsByClassName("box");
        fr = ""
        for (let i = 0; i < BOX_SIZE; i++) {
            fr += "1fr "
        }
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].style.gridTemplateColumns = fr;
            boxes[i].style.gridTemplateRows = fr;
        }
    }
}