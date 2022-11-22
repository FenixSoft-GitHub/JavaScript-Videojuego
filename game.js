const $ = (selector) => document.querySelector(selector);

const canvas = $('#game');
const game = canvas.getContext('2d');
const btnUp = $('#up');
const btnLeft = $('#left');
const btnRight = $('#right');
const btnDown = $('#down');
const btnReset = $('#reset');
const spanLives = $('#lives');
const spanTime = $('#time');
const spanRecord = $('#record');
const pResult = $('#result');

let elementsSize;
let canvasSize;
let timeStar;
let timePlayer;
let timeInterval;
let level = 0;
let lives = 3;

const playerPos = {
    x: undefined,
    y: undefined,
};

const giftPos = {
    x: undefined,
    y: undefined,
};

let enemyPos = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
    canvasSize =
        window.innerHeight > window.innerWidth ? window.innerWidth * 0.7 : window.innerHeight * 0.7;
    canvasSize = Number(canvasSize.toFixed(0));
    canvas.setAttribute("width", canvasSize);
    canvas.setAttribute("height", canvasSize);
    elementsSize = Number((canvasSize / 10).toFixed(0));

    playerPos.x = undefined;
    playerPos.y = undefined;

    startGame();
}

function startGame() {
    // console.log({canvasSize,elementsSize});
    game.font = `${elementsSize}px Verdana`;
    game.textAlign = "end";

    const mapRows = maps[level];

    if (!mapRows) {
        gameWin();
        return;
    }

    if (!timeStar) {
        timeStar = Date.now();
        timeInterval = setInterval(showTimes, 100)
        showRecord();
    }

    const mapRowCols = mapRows.map(row => row.split(''));
    showLives();

    // console.log({mapRows, mapRowCols});

    enemyPos = [];
    game.clearRect(0, 0, canvasSize, canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPos.x && !playerPos.y) {
                    playerPos.x = posX;
                    playerPos.y = posY;
                }
            } else if (col == 'I') {
                giftPos.x = posX;
                giftPos.y = posY;
            } else if (col == 'X') {
                enemyPos.push({
                    x: posX,
                    y: posY,
                })
            };

            game.fillText(emoji, posX, posY);
        });
    });

    movePlayer();
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame();
};

function levelFail() {
    console.log('Fallaste');
    lives--;

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStar = undefined;
    }

    playerPos.x = undefined;
    playerPos.y = undefined;
    startGame();
}


function gameWin() {
    console.log('Terminaste el juego !!!');
    clearInterval(timeInterval);

    const recordTimes = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStar;

    if (recordTimes) {
        if (recordTimes >= playerTime) {
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML = 'LO LOGRASTE, SUPERASTE EL RECORD, 💎💎💎';
        } else {
            pResult.innerHTML = 'Lo siento no superaste el RECORD, 😲';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
    }
};

function showLives() {
    spanLives.innerHTML = emojis["HEART"].repeat(lives);
}

function showTimes() {
    spanTime.innerHTML = formatTime(Date.now() - timeStar);
}

function showRecord() {
    spanRecord.innerHTML = formatTime(localStorage.getItem('record_time'));
};

function formatTime(ms) {
    const cs = parseInt(ms / 10) % 100
    const seg = parseInt(ms / 1000) % 60
    const min = parseInt(ms / 60000) % 60
    const hr = parseInt(ms / 3600000) % 24
    const csStr = `${cs}`.padStart(2, "0")
    const segStr = `${seg}`.padStart(2, "0")
    const minStr = `${min}`.padStart(2, "0")
    const hrStr = `${hr}`.padStart(2, "0")
    return `${hrStr}:${minStr}:${segStr}:${csStr}`
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);
btnReset.addEventListener('click', resetGame);

function movePlayer() {
    const giftCollisionX = playerPos.x == giftPos.x;
    const giftCollisionY = playerPos.y == giftPos.y;
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin();
    };

    const enemyCollision = enemyPos.find(enemy => {
        const enemyCollisionX = enemy.x == playerPos.x;
        const enemyCollisionY = enemy.y == playerPos.y;
        return enemyCollisionX && enemyCollisionY;
    });

    if (enemyCollision) {
        levelFail();
    };

    game.fillText(emojis['PLAYER'], playerPos.x, playerPos.y);
}

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
};

function moveUp() {
    console.log('Me quiero mover hacia arriba');
    if (playerPos.y < elementsSize + 2) {
        console.log('Out');
    } else {
        playerPos.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Me quiero mover hacia la izquierda');
    if (playerPos.x < elementsSize + 2) {
        console.log('Out');
    } else {
        playerPos.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    console.log('Me quiero mover hacia la Derecha');
    if ((playerPos.x + elementsSize) > canvasSize + 2) {
        console.log('Out');
    } else {
        playerPos.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log('Me quiero mover hacia abajo');
    if ((playerPos.y + elementsSize) > canvasSize + 2) {
        console.log('Out');
    } else {
        playerPos.y += elementsSize;
        startGame();
    }
}

function resetGame() {
    location.reload();
}





    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col + 10, elementsSize * row);
    //     }
    // }

    // const map = maps[2];
    //   const mapRows = map.trim().split('\n');
    //   const mapRowsCol = mapRows.map(row => row.trim().split(''));

    //   for (let i = 1; i <= 10; i++) {
    //     for (let j = 1; j <=10; j++) {
    //         game.fillText(emojis[mapRowsCol[i - 1][j - 1]], (elementsSize * j), elementsSize * i);
    //     }
    //   }



// function startGame() {
//     /* === Métodos del canvas === */
//     game.fillRect(0, 0, 100, 100); /* Lugar donde inicia el trazo. */
//     game.clearRect(0, 0, 50, 50); /*  Sirve como borrador para alguna parte del canvas. */
//     game.font = "25px Verdana"; /* Tamaño que tendrá el texto del fillText y tipo de fuente.*/
//     game.fillStyle = "Purple"; /* Nos permite añadir estilos CSS al fillText.*/
//     game.textAlign = "end"; /* Posición del texto, donde comienza o donde termina respecto a la posición X y Y. */
//     game.fillText("Uriel", 70, 70); /* Nos permite insertar texto dentro del canvas.*/

// }

