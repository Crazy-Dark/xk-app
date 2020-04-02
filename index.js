let grade = ["春眠不觉晓", "处处闻亭鸟", "夜来风雨声","夜来风雨声"];
let curNum = 0;
/**
 * 游戏配置
 */
let game = {
    cardWidth: 80,
    cardHeight: 100,
    row: 3,
    col: 3,
    jqGame: $(`#game`),
    bgImg: '',
    text: "春眠不觉晓",
    createCards: function () {
        $(`<div class="cards"></div>`).appendTo(game.jqGame);
    }
}
game.textArr = game.text.split('');
game.textLen = game.textArr.length;
game.cardNum = game.row * game.col;
console.log(game.textArr)



/**
 * 创建卡片对象的构造函数
 * @param {*} text 
 */
function Card(text, index) {
    this.width = game.cardWidth;
    this.height = game.cardHeight;
    this.text = text;
    this.jqCard = $(`
    <div class="card">
        <img src="./images/bg.jpg" alt=""  data-id="${text}">
        <div class="word">${typeof text == "number" ? game.textArr[text - 1] : ''}</div>
    </div>
    `);
    $(`.cards`).append(this.jqCard)

    this.show = function () {
        console.log('显示内容')
    }
}

let data_1 = [];
/**
 * 游戏初始化
 */
function init() {
    // 1. 创建卡片容器
    game.createCards();
    createBtn() //创建游戏结束时的按钮和next的按钮
    // 2. 创建每个卡片
    let newList = createNewCardList(game.textArr); // 创建一个有空白并且打乱顺序的数组
    newList.forEach(function (e, index) {
        new Card(e, index);
    })

    // 3. 事件处理函数
    // bindEvent(); // 绑定事件为了让用户在展示的时候不能点击，在动态后绑定事件


    /**
     * 得到一个打乱顺序并带有空白区域的数组
     * @param {*} 文字数组
     */
    function createNewCardList(data) {
        // 插入空白文字
        for (var i = 0; i < game.cardNum; i++) {
            if (i >= game.textLen) {
                data_1.push(" ");
            } else {
                data_1.push(i + 1);
            }
        }
        // 打乱数组顺序
        data_1.sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        })
        console.log(data_1)
        return data_1;
    }

    function createBtn() {
        $(`<div class="btn over">游戏结束</div>`).hide().appendTo($(`#game .mark`));
        $(`<div class="btn next">下一关</div>`).hide().appendTo($(`#game .mark`));
    }
}


function gameStart(data) {
    clickWord = 1;
    data_1 = [],
    game.textArr = data.split('');
    // 给开始按钮注册事件
    $(`.btn`).on("click", function () {
        $(`.mark`).addClass('display');
        init();
        showText();
    })
}

function gameOver() {
    $(`.mark`).removeClass('display');
    $(`.mark .start`).hide();
    $(`.mark .next`).hide();
    $(`.mark .over`).show().on('click', function () {
        $(`#game`).html(`
        <div class="mark">
            <div class="btn start">开始游戏</div>
        </div> 
        `)
        curNum = 0;
        gameStart(grade[curNum])
    });
    console.log(`游戏失败`);

}

function gameStop() {

}

/**
 * 给卡片容器绑定绑定事件，利用冒泡的方式作用到卡片上
 */
function bindEvent() {
    $(`.cards`).on('click', function (e) {
        if (e.target.tagName == "IMG") {
            // 将图片隐藏
            $(e.target).hide();
            // 判断是否点击到文字
            console.log($(e.target).attr('data-id'))
            if ($(e.target).attr('data-id')) {
                isSame($(e.target).attr('data-id'))
            } else {
                gameOver();
            }
        }
    })
}

/**
 * 动态显示文字
 * @param {*} data 
 */
function showText() {
    let i = 1;
    // 显示第一个文字
    $(`[data-id="${i}"]`).hide();
    let timer = setInterval(function () {
        $(`[data-id="${i}"]`).show();
        i++;
        $(`[data-id="${i}"]`).hide();
        // 判断是否显示完毕清除定时器
        if (i > game.textLen) {
            clearInterval(timer);
            bindEvent();
        }
    }, 1000)
}

let clickWord = 1;
/**
 * 判断点击的内容是否按顺序点击
 * @param {String} 点击的具体文字
 */
function isSame(str) {
    if (str == clickWord) {
        $(`[data-id="${str}"]`).hide();
        game.textLen == str ? pass() : clickWord++;
    } else {
        gameOver();
    }
}

function pass() {
    $(`.mark`).removeClass('display');
    $(`.mark .start`).hide();
    $(`.mark .over`).hide();
    $(`.mark .next`).show().on('click', function () {
        $(`#game`).html(`
        <div class="mark">
            <div class="btn start">开始游戏</div>
        </div> 
        `)
        if(curNum < grade.length) {
            curNum++
            gameStart(grade[curNum])
        }

    });
    console.log('恭喜过关')
}

gameStart(game.text);