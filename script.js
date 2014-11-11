/*
 * 三目並べ
 * 算法（アルゴリズム）：ミニマックス法
 */
$(function () {

    var squares = [], 
        SIZE = 3,
        EMPTY = "&nbsp;",
        moves,
        turn = "X",
        matrix = [
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ],
        matrixTurn = -1,
        usersTurn = true,
        status = 0,

    /*
     * matrixで○と×の盤面を記憶
     * ○:-1 と ×:1
     * 勝つ条件：下記の合計は３になったら、勝利になります。
     *     　　　3            3
     *        　\           /
     *          0 |  0 |  0  = 3
     *       -----+----+-----
     *          0 |  0 |  0  = 3
     *       -----+-----+-----
     *          0 |  0 |  0  = 3
     *       =================
     *          3    3    3
     *
     */

    /*
     * 盤面の初期
     */
    startNewGame = function () {
        turn = "X";
        moves = 0;
        squares.forEach(function (square) {square.html(EMPTY);});
        matrix = [
            [0,0,0],
            [0,0,0],
            [0,0,0],
        ];
        matrixTurn = -1;
        usersTurn = true;
        status = 1;
    },

    /*
     * 勝利条件を判断
     */
    win = function (x, y) {
        if (Math.abs(matrix[x][0] + matrix[x][1] + matrix[x][2]) == 3) {
            return true;
        }
        if (Math.abs(matrix[0][y] + matrix[1][y] + matrix[2][y]) == 3) {
            return true;
        }
        if (Math.abs(matrix[0][0] + matrix[1][1] + matrix[2][2]) == 3) {
            return true;
        }
        if (Math.abs(matrix[2][0] + matrix[1][1] + matrix[0][2]) == 3) {
            return true;
        }
        return false;
    },

    /*
     * 自分にとって良い指し手
     */
    best = function() {
        var x, y, bx, by, bv = 0;
        for (x = 0; x < SIZE; x++) {
            for (y = 0; y < SIZE; y++) { 
                if (matrix[x][y] == 0) {
                    matrix[x][y] = 1;
                    moves++;
                    if (win(x,y)) {
                        moves --;
                        matrix[x][y] = 0;
                        return {'x':x, 'y':y, 'v': 1000};
                    } else if (moves >= SIZE * SIZE) {
                        moves --;
                        matrix[x][y] = 0;
                        return {'x':x, 'y':y, 'v': 0};                        
                    } else {
                        var v = worst().v;
                        moves --;
                        matrix[x][y] = 0;
                        if (bx == null || v >= bv) {
                            bx = x;
                            by = y;
                            bv = v;
                        }
                    }
                }
            }
        }
        return {'x':bx, 'y':by, 'v': bv}; 
    },

    /*
     * 自分に取って最悪の指し手
     */
    worst = function() {
        var x, y, bx, by, bv = 0;
        for (x = 0; x < SIZE; x++) {
            for (y = 0; y < SIZE; y++) { 
                if (matrix[x][y] == 0) {
                    matrix[x][y] = -1;
                    moves++;
                    if (win(x,y)) {
                        moves --;
                        matrix[x][y] = 0;
                        return {'x':x, 'y':y, 'v': -1000};
                    } else if (moves >= SIZE * SIZE) {
                        moves --;
                        matrix[x][y] = 0;
                        return {'x':x, 'y':y, 'v': 0};                        
                    } else {
                        var v = best().v;
                        moves --;
                        matrix[x][y] = 0;
                        if (bx == null || v <= bv) {
                            bx = x;
                            by = y;
                            bv = v;
                        }
                    }
                }
            }
        }
        return {'x':bx, 'y':by, 'v': bv}; 
    },

    /*
     * パソコンの番
     */
    think = function() {
        var b = best(), x = b.x, y = b.y;
        if (b.x == null) {
            return false;
        }
        $('table tr').eq(y).children('td').eq(x).click();
    },

    /*
     * クリックイベントの処理
     */
    set = function () {
        
        // 空白をクリックする判定
        if ($(this).html() !== EMPTY) {
            return;
        }

        // クリック座標を取得
        var x, y;
        x = $(this).index();
        y = $(this).parent('tr').index();
        
        // メッセージ
        var message = $('#message');
            
        // 終了
        if (status === 2) {
            return false;
        } else {
            message.html("対戦中!");
            console.log('playing');
        }
        
        // ○や×を入れる
        $(this).html(turn);

        // 勝負判定の配列を更新
        matrix[x][y] = matrixTurn;
        moves++;

        //　結果を判定
        if (win(x, y)) {
            message.html(turn + " 勝った!");
            status = 2;
            console.log('win');
        } else if (moves >= SIZE * SIZE) {
            message.html("引き分け!");
            status = 2;
            console.log('fair');
        } else {
            turn = turn === "X" ? "O" : "X";
            matrixTurn = matrixTurn === -1 ? 1 : -1;
            usersTurn = usersTurn === true ? false : true;
            if (usersTurn === false) {
                think();
            }
        }
    },

    /*
     * ゲームの初期
     */
    play = function () {
        var board = $("<table border=1 cellspacing=0>"), indicator = 1;
        for (var i = 0; i < SIZE; i += 1) {
            var row = $("<tr>");
            board.append(row);
            for (var j = 0; j < SIZE; j += 1) {
                var cell = $("<td height=50 width=50 align=center valign=center></td>");
                cell.click(set);
                row.append(cell);
                squares.push(cell);
            }
        }

        var button = $("<div><button>New Game</button></div>");
        button.click(startNewGame);

        var message = $('<div id="message"></div>');

        // 盤面のHTMLを追加
        $(document.getElementById("tictactoe") || document.body).append(board).append(message).append(button);
        startNewGame();
    };

    play();
});

