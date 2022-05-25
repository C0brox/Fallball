const $game = $('#game')
const $player = $('#player')
const $button = $('#menu-button')
const $menu = $('#menu')
const $menuTitle = $('#menu-title')
const $score = $('#score-header')
const $highscore = $('#highscore-header')

let playerVel = 0
let leftDown = false
let rightDown = false
let counter = 0
let score = 0
let highscore = (localStorage.getItem('local-highscore')) ? localStorage.getItem('local-highscore') : 0
let currentBlocks = []
let scrollSpeed = 0
let playerMoveSpeed = 3


//menu functionality
$button.on('click', () => {
    counter = 0
    score = 0
    currentBlocks = []
    $('.block').remove()
    $('.hole').remove()    
    $player.css('top', '500px')
    $menu.css('display', 'none')
    scrollSpeed = 1
})
if (highscore > 0) {
    $highscore.text(`Highcore: ${highscore}`)
    $highscore.css('display', 'block')
}

//player controls
$(document).on('keydown', (e) => {
    if (e.key === 'ArrowLeft' && leftDown === false) {
        leftDown = true
        if (rightDown === true && leftDown === true) {
            clearInterval(moveInterval);
            return;
        }
        moveInterval = setInterval(moveLeft, 1)
    }
    if (e.key === 'ArrowRight' && rightDown === false) {
        rightDown = true
        if (rightDown === true && leftDown === true) {
            clearInterval(moveInterval);
            return;
        }
        moveInterval = setInterval(moveRight, 1)
    }
})
$(document).on('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        leftDown = false
        clearInterval(moveInterval);
        if (rightDown === true) {
            moveInterval = setInterval(moveRight, 1)
        }
    }
    if (e.key === 'ArrowRight') {
        rightDown = false
        clearInterval(moveInterval);
        if (leftDown === true) {
            moveInterval = setInterval(moveLeft, 1)
        }
    }
})
function moveLeft() {
    if (parseInt($player.css('left')) > 0) {
        const newLeft = parseInt($player.css('left')) - playerMoveSpeed + 'px'
        $player.css('left', newLeft)
    }
}
function moveRight() {
    if (parseInt($player.css('left')) < 560) {
        const newLeft = parseInt($player.css('left')) + playerMoveSpeed + 'px'
        $player.css('left', newLeft)
    }
}

creatBlockInterval = setInterval(() => {
    const $blockLast = $('#block' + (counter - 1))
    const $holeLast = $('#hole' + (counter - 1))
    const $blockLastTop = ($blockLast.length > 0) ? parseInt($blockLast.css('top')) : -50
    const $holeLastTop = ($holeLast.length > 0) ? parseInt($holeLast.css('top')) : -50
    //platform creation
    if ($blockLastTop < 700) {
        const $block = $('<div class="block"></div>')
        const $hole = $('<div class="hole"></div>')
        $game.append($block, $hole)
        $block.attr('id', 'block' + counter)
        $hole.attr('id', 'hole' + counter)
        $block.css('top', $blockLastTop + 100 + 'px')
        $hole.css('top', $holeLastTop + 100 + 'px')
        const randLeft = Math.random() * 500 + 'px'
        $hole.css('left', randLeft)
        const randColor = Math.floor(Math.random() * 5)
        $block.addClass('color' + randColor)
        currentBlocks.push(counter)
        counter++
        score = counter - 8
        if (score > 0) {
            $player.text(score)
        }
        if (score % 10 === 0 && score >= 10) {
            scrollSpeed = scrollSpeed + 0.1
        }
    }
    //platform movement & removal
    let playerTop = parseInt($player.css('top'))
    let playerLeft = parseInt($player.css('left'))
    let drop = 1
    for (let i = 0; i < currentBlocks.length; i++) {
        let $iblock = $('#block' + currentBlocks[i])
        let $ihole = $('#hole' + currentBlocks[i])
        let iblockTop = parseInt($iblock.css('top'))
        let iholeLeft = parseInt($ihole.css('left'))
        $iblock.css('top', iblockTop - scrollSpeed + 'px')
        $ihole.css('top', iblockTop - scrollSpeed + 'px')
        if (iblockTop < -60) {
            $iblock.remove()
            $ihole.remove()
        }
        //player collisions
        if (iblockTop <= playerTop + 40 && iblockTop > playerTop) {
            if (playerLeft < iholeLeft || playerLeft > iholeLeft + 65) {
                if (iblockTop < playerTop + 40) {
                    drop = -1
                } else {
                    drop = 0
                }
            } else {
                drop = 1
            }
        }
    }
    //game over detection
    if (playerTop < -40) {
        scrollSpeed = 0
        $score.text(`Score: ${score}`)
        $score.css('display', 'block')
        if (score > highscore) {
            highscore = score
            localStorage.setItem('local-highscore', highscore)
        }
        $highscore.text(`Highcore: ${highscore}`)
        $highscore.css('display', 'block')
        $menuTitle.text('GAME OVER')
        $menuTitle.css('color', '#931a1e')
        $button.text('restart')
        $menu.css('display', 'block')
    }

    //player vertical movement
    if (playerTop > 760) {
        drop = 0
    }
    if (drop === 1) {
        if (playerVel > -10) {
            playerVel = playerVel - 0.5
        }
    }
    if (drop === 0) {
        playerVel = scrollSpeed
    }
    if (drop === -1) {
        playerVel = scrollSpeed + 1
    }
    $player.css('top', playerTop - playerVel + 'px');

    $('#datadisplay').text(scrollSpeed)
},1)