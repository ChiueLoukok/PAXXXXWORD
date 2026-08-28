const gameBoard = document.querySelector(".game-board");
const secretColumn = document.querySelector(".secret-column");
const symbolButtons = document.querySelectorAll(".color-picker button");
const verifyButton = document.querySelector("#verify-button");
const secretSlots = document.querySelectorAll(".secret-slot");
const gameMessage = document.querySelector("#game-message");
const difficultyButtons =
    document.querySelectorAll(".difficulty");
const newGameButton =
    document.querySelector("#new-game-button");
const settingsButton =
    document.querySelector("#settings-button");

const settingsPanel =
    document.querySelector("#settings-panel");

const closeSettingsButton =
    document.querySelector("#close-settings");
const colorSettings =
    document.querySelectorAll(".color-setting");

const symbolSettings =
    document.querySelectorAll(".symbol-setting");

const textSizeButtons =
    document.querySelectorAll(".text-size-option");
const endScreen =
    document.querySelector("#end-screen");

const endTitle =
    document.querySelector("#end-title");

const endDetail =
    document.querySelector("#end-detail");

const playAgainButton =
    document.querySelector("#play-again-button");
playAgainButton.addEventListener("click", () => {
    resetGame();
});


let attempts;
let attemptCount = 4;


function createAttempts(count) {
    for (let i = 0; i < count; i++) {
        const attempt = document.createElement("div");
        attempt.classList.add("attempt");

        const number = String(i + 1).padStart(2, "0");

        attempt.innerHTML = `
            <h2>${number}</h2>

            <div class="hints">
                <span>·</span>
                <span>·</span>
                <span>·</span>
                <span>·</span>
            </div>

            <div class="slots">
                <button class="slot"></button>
                <button class="slot"></button>
                <button class="slot"></button>
                <button class="slot"></button>
            </div>
        `;


        gameBoard.insertBefore(
            attempt,
            secretColumn
        );
    }


    attempts = document.querySelectorAll(".attempt");
}

function resetGame() {

    // 删除旧的尝试列
    document.querySelectorAll(".attempt").forEach(attempt => {
        attempt.remove();
    });

    // 恢复基本状态
    currentAttempt = 0;
    selectedSlot = null;
    gameEnded = false;
    manualSelection = false;

    // 清空提示文字
    gameMessage.textContent = "";

    // 隐藏上一局的结束界面
    endScreen.classList.add("hidden");

    endTitle.textContent = "";
    endDetail.textContent = "";

    // 恢复 Secret
    secretSlots.forEach(slot => {

        slot.textContent = "×";

        slot.classList.remove(
            "alpha",
            "beta",
            "mu",
            "pi",
            "phi",
            "omega"
        );
    });

    // 创建新密码
    generateSecretCode();

    // 根据当前难度重新生成棋盘
    createAttempts(attemptCount);

    // 初始化棋盘
    updateBoardState();
    activateCurrentSlots();
}







const symbols = [
    "alpha",
    "beta",
    "mu",
    "pi",
    "phi",
    "omega"
];

const symbolText = {
    alpha: "α",
    beta: "β",
    mu: "μ",
    pi: "π",
    phi: "φ",
    omega: "ω"
};

symbolSettings.forEach(input => {

    input.addEventListener("input", () => {

        const symbolName = input.dataset.symbol;
        const newSymbol = input.value;

        if (newSymbol === "") {
            return;
        }


        // 更新显示符号记录
        symbolText[symbolName] = newSymbol;


        // 更新底部选择按钮
        const pickerButton =
            document.querySelector(
                `.color-picker .${symbolName}`
            );

        if (pickerButton) {
            pickerButton.textContent = newSymbol;
        }


        // 更新棋盘中已经存在的同类符号
        document
            .querySelectorAll(`.slot.${symbolName}`)
            .forEach(slot => {

                slot.textContent = newSymbol;

            });


        // 更新已经揭晓的 Secret
        document
            .querySelectorAll(`.secret-slot.${symbolName}`)
            .forEach(slot => {

                slot.textContent = newSymbol;

            });

    });

});


let currentAttempt = 0;
let selectedSlot = null;
let gameEnded = false;
let manualSelection = false;


/* 默认设置 */
const defaultSettings = {
    colors: {
        alpha: "#f3620f",
        beta: "#ffc20a",
        mu: "#67944b",
        pi: "#078d8c",
        phi: "#dfd1b7",
        omega: "#da0d1e"
    },

    symbols: {
        alpha: "α",
        beta: "β",
        mu: "μ",
        pi: "π",
        phi: "φ",
        omega: "ω"
    },

    textSize: "medium",

    attempts: 4
};

/* 保存设置函数 */
function saveSettings() {

    const settings = {
        colors: {},
        symbols: {},
        textSize: "medium",
        attempts: attemptCount
    };


    colorSettings.forEach(input => {
        settings.colors[input.dataset.symbol] = input.value;
    });


    symbolSettings.forEach(input => {
        settings.symbols[input.dataset.symbol] = input.value;
    });


    const activeTextSize =
        document.querySelector(".text-size-option.active");

    if (activeTextSize) {
        settings.textSize = activeTextSize.dataset.size;
    }


    localStorage.setItem(
        "cipherFourSettings",
        JSON.stringify(settings)
    );
}



/* 读取设置 */
function loadSettings() {

    const savedSettings =
        localStorage.getItem("cipherFourSettings");


    const settings =
        savedSettings
            ? JSON.parse(savedSettings)
            : defaultSettings;


    // --------------------------
    // 恢复颜色
    // --------------------------

    colorSettings.forEach(input => {

        const symbolName = input.dataset.symbol;

        const color =
            settings.colors[symbolName]
            || defaultSettings.colors[symbolName];

        input.value = color;

        document.documentElement.style.setProperty(
            `--${symbolName}-color`,
            color
        );

    });


    // --------------------------
    // 恢复符号
    // --------------------------

    symbolSettings.forEach(input => {

        const symbolName = input.dataset.symbol;

        const symbol =
            settings.symbols[symbolName]
            || defaultSettings.symbols[symbolName];

        input.value = symbol;

        symbolText[symbolName] = symbol;


        const pickerButton =
            document.querySelector(
                `.color-picker .${symbolName}`
            );

        if (pickerButton) {
            pickerButton.textContent = symbol;
        }

    });


    // --------------------------
    // 恢复字号
    // --------------------------

    const textSize =
        settings.textSize
        || defaultSettings.textSize;

    document.body.classList.remove(
        "text-small",
        "text-medium",
        "text-large"
    );

    document.body.classList.add(
        `text-${textSize}`
    );


    textSizeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.size === textSize
        );

    });


    // --------------------------
    // 恢复难度
    // --------------------------

    attemptCount =
        settings.attempts
        || defaultSettings.attempts;


    difficultyButtons.forEach(button => {

        button.classList.toggle(
            "active",
            Number(button.dataset.attempts) === attemptCount
        );

    });

}



// ------------------------------
// 生成隐藏答案
// ------------------------------

let secretCode = [];


function generateSecretCode() {

    secretCode = [];

    for (let i = 0; i < 4; i++) {

        const randomIndex =
            Math.floor(Math.random() * symbols.length);

        secretCode.push(symbols[randomIndex]);
    }



// 暂时可以打开这一行查看答案
   //console.log(secretCode);


}

// ------------------------------
// 获取当前列的四个格子
// ------------------------------

function getCurrentSlots() {
    return attempts[currentAttempt].querySelectorAll(".slot");
}


// ------------------------------
// 更新哪些列可以操作
// ------------------------------

function updateBoardState() {

    attempts.forEach((attempt, index) => {

        const slots = attempt.querySelectorAll(".slot");


        // 已经完成的列
        // 游戏结束时，最后正在进行的那一列也算 completed
        if (
            index < currentAttempt ||
            (gameEnded && index === currentAttempt)
        ) {

            attempt.classList.add("completed");
            attempt.classList.remove("active");
            attempt.classList.remove("locked");

            slots.forEach(slot => {
                slot.disabled = true;
            });

        }


        // 当前正在进行的列
        else if (
            index === currentAttempt &&
            !gameEnded
        ) {

            attempt.classList.add("active");
            attempt.classList.remove("completed");
            attempt.classList.remove("locked");

            slots.forEach(slot => {
                slot.disabled = false;
            });

        }


        // 未来还未使用的列
        else {

            attempt.classList.add("locked");
            attempt.classList.remove("active");
            attempt.classList.remove("completed");

            slots.forEach(slot => {
                slot.disabled = true;
            });

        }

    });

}

// ------------------------------
// 激活当前列
// ------------------------------

function activateCurrentSlots() {

    const currentSlots = getCurrentSlots();

    currentSlots.forEach(slot => {

        slot.onclick = () => {

            if (gameEnded) {
                return;
            }

            currentSlots.forEach(s => {
                s.classList.remove("selected");
            });

            selectedSlot = slot;

            selectedSlot.classList.add("selected");

            // 玩家主动点击了格子
            // 从现在开始进入手动修改模式
            manualSelection = true;
        };

    });


    // 每进入一个新的 Attempt
    // 自动回到连续输入模式
    manualSelection = false;

    currentSlots.forEach(slot => {
        slot.classList.remove("selected");
    });

    selectedSlot = currentSlots[0];
    selectedSlot.classList.add("selected");
}


// ------------------------------
// 点击下面的颜色 / 符号
// ------------------------------

symbolButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (!selectedSlot || gameEnded) {
            return;
        }

        const currentSlots = getCurrentSlots();

        const symbolClass = button.className;
        const symbol = button.textContent;


        // 清除当前格子原本的颜色
        selectedSlot.classList.remove(
            "alpha",
            "beta",
            "mu",
            "pi",
            "phi",
            "omega"
        );


        // 填入新的颜色和符号
        selectedSlot.classList.add(symbolClass);
        selectedSlot.textContent = symbol;


        // 如果玩家没有手动选择格子
        // 才自动移动到下一格
        if (!manualSelection) {

            const currentIndex =
                Array.from(currentSlots).indexOf(selectedSlot);

            if (currentIndex < currentSlots.length - 1) {

                selectedSlot.classList.remove("selected");

                selectedSlot = currentSlots[currentIndex + 1];

                selectedSlot.classList.add("selected");
            }

        }

    });

});


// ------------------------------
// 读取玩家这一列的答案
// ------------------------------

function getGuess() {

    const currentSlots = getCurrentSlots();
    const guess = [];

    currentSlots.forEach(slot => {

        const symbol = symbols.find(symbolName =>
            slot.classList.contains(symbolName)
        );

        guess.push(symbol);
    });

    return guess;
}


// ------------------------------
// 比较玩家答案与 Secret
// ------------------------------

function checkGuess(guess) {

    let exact = 0;
    let misplaced = 0;

    const remainingSecret = [];
    const remainingGuess = [];


    // 先找 ◆
    for (let i = 0; i < 4; i++) {

        if (guess[i] === secretCode[i]) {

            exact++;

        } else {

            remainingSecret.push(secretCode[i]);
            remainingGuess.push(guess[i]);
        }
    }


    // 再找 ◇
    remainingGuess.forEach(symbol => {

        const index = remainingSecret.indexOf(symbol);

        if (index !== -1) {

            misplaced++;

            remainingSecret.splice(index, 1);
        }
    });


    return {
        exact: exact,
        misplaced: misplaced
    };
}


// ------------------------------
// 显示 ◆ ◇ 提示
// ------------------------------

function showHints(exact, misplaced) {

    const hintLights =
        attempts[currentAttempt].querySelectorAll(".hints span");

    const results = [];

    for (let i = 0; i < exact; i++) {
        results.push("◆");
    }

    for (let i = 0; i < misplaced; i++) {
        results.push("◇");
    }

    while (results.length < 4) {
        results.push("·");
    }


    hintLights.forEach((light, index) => {
        light.textContent = results[index];
    });
}


// ------------------------------
// 揭晓 Secret
// ------------------------------

function revealSecret() {

    secretSlots.forEach((slot, index) => {

        const symbol = secretCode[index];

        slot.textContent = symbolText[symbol];

        slot.classList.add(symbol);
    });
}


// ------------------------------

// 结算撒花动画

// ------------------------------

function launchCelebration(attemptIndex) {

    const winningAttempt = attempts[attemptIndex];

    const attemptTitle =
        winningAttempt.querySelector("h2");

    const rect =
        attemptTitle.getBoundingClientRect();

    const startX =
        rect.left + rect.width / 2;

    const startY =
        rect.top + rect.height / 2;


    for (let i = 0; i < 50; i++) {

    const symbolName =
        symbols[
            Math.floor(
                Math.random() * symbols.length
            )
        ];

    const piece =
        document.createElement("div");

    piece.classList.add(
        "symbol-confetti",
        symbolName
    );

    piece.textContent =
        symbolText[symbolName];


    document.body.appendChild(piece);


    // 初始位置
    let x = startX;
    let y = startY;


    // 随机水平速度
    const velocityX =
        Math.random() * 3 - 1.5;


    // 随机向上喷射速度
    let velocityY =
        -(Math.random() * 1.5 + 2.5);


    // 重力
    const gravity = 0.1;


    // 随机旋转
    let rotation =
        Math.random() * 360;

    const rotationSpeed =
        Math.random() * 4 - 2;


    // 随机延迟出现
    const delay =
        Math.random() * 300;


    setTimeout(() => {

        function animatePiece() {

            // 更新速度
            velocityY += gravity;

            // 更新位置
            x += velocityX;
            y += velocityY;

            // 更新旋转
            rotation += rotationSpeed;


            piece.style.left =
                `${x}px`;

            piece.style.top =
                `${y}px`;

            piece.style.transform =
                `rotate(${rotation}deg)`;


            // 飞出屏幕后删除
            if (
                y < window.innerHeight + 50 &&
                x > -50 &&
                x < window.innerWidth + 50
            ) {

                requestAnimationFrame(
                    animatePiece
                );

            } else {

                piece.remove();

            }

        }


        animatePiece();

    }, delay);
}
}




// ------------------------------
// VERIFY
// ------------------------------

verifyButton.addEventListener("click", () => {

    if (gameEnded) {
        return;
    }


    const guess = getGuess();


    // 没填满四格
    if (guess.includes(undefined)) {

        gameMessage.textContent = "Please fill all four slots.";

        return;
    }

    gameMessage.textContent = "";
    const result = checkGuess(guess);

    showHints(
        result.exact,
        result.misplaced
    );


    // --------------------------
    // 猜中了
    // --------------------------

    if (result.exact === 4) {

        gameEnded = true;

        selectedSlot = null;

        revealSecret();
        updateBoardState();

        endScreen.classList.remove("hidden");

	endTitle.textContent = "ACCESS GRANTED";

	if (currentAttempt === 0) {

    	    endDetail.textContent = "FIRST TRY";

	} else {

    	    endDetail.textContent =
        	`${currentAttempt + 1} ATTEMPTS`;

	}

    // 等页面重新排版以后，

    // 再从真正的获胜列位置启动动画

    requestAnimationFrame(() => {

        launchCelebration(currentAttempt);

    });

    return;
}


    // --------------------------
    // 四次全部失败
    // --------------------------

    if (currentAttempt === attempts.length - 1) {

        gameEnded = true;

        selectedSlot = null;

        revealSecret();
        updateBoardState();

        endScreen.classList.remove("hidden");

	endTitle.textContent = "ACCESS DENIED";

	endDetail.textContent =
    	    "PASSWORD REVEALED";

        return;
    }


    // --------------------------
    // 进入下一轮
    // --------------------------

    const oldSlots = getCurrentSlots();

    oldSlots.forEach(slot => {
        slot.classList.remove("selected");
    });

    selectedSlot = null;

    currentAttempt++;

    updateBoardState();
    activateCurrentSlots();
});







// ------------------------------
// New Game
// ------------------------------

if (newGameButton) {

    newGameButton.addEventListener("click", () => {
        resetGame();
    });

}




// ------------------------------
// Settings
// ------------------------------


/* 设置面板开关 */
settingsButton.addEventListener("click", () => {
    settingsPanel.classList.remove("hidden");
});


closeSettingsButton.addEventListener("click", () => {
    settingsPanel.classList.add("hidden");
});

settingsPanel.addEventListener("click", event => {

    if (event.target === settingsPanel) {
        settingsPanel.classList.add("hidden");
    }

});


/* 颜色设置 */
colorSettings.forEach(input => {

    input.addEventListener("input", () => {

        const symbolName = input.dataset.symbol;
        const newColor = input.value;

        document.documentElement.style.setProperty(
            `--${symbolName}-color`,
            newColor
        );
	saveSettings();

    });

});


/* 字号设置 */

textSizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        const size = button.dataset.size;


        // 移除旧字号模式
        document.body.classList.remove(
            "text-small",
            "text-medium",
            "text-large"
        );


        // 加入新字号模式
        document.body.classList.add(
            `text-${size}`
        );


        // 更新按钮状态
        textSizeButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
    });
    saveSettings();

});


/* 难度选择 */

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        attemptCount =
            Number(button.dataset.attempts);

        difficultyButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

	saveSettings();

        resetGame();

	settingsPanel.classList.add("hidden");
    });

});

// ------------------------------
// 游戏开始
// ------------------------------

loadSettings();
resetGame();