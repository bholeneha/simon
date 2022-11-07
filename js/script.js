console.log('connected!')

/*----- constants -----*/
const colorCells = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'yellow'
}

/*----- app's state (variables) -----*/

const simon = {
    playOrder: [],
}

const player = {
    playOrder: [],
    highScore: null
}

let level, score, hasClicked;

/*----- cached element references -----*/
const simonEl = document.getElementById('simon')
const playBtn = document.getElementById('play')
const levelEl = document.getElementById('level')
const scoreEl = document.getElementById('score')
const colorDivs = document.querySelectorAll('.color-button')

/*----- event listeners -----*/
playBtn.addEventListener('click', playSimon)

/*----- functions -----*/
function playSimon(){

    playBtn.childNodes.forEach(child => {child.classList.add('disabled'); console.log(child.classList)})
    playBtn.disabled = true
    
    level = 0
    levelEl.textContent = `Level : ${level}`

    score = 0
    scoreEl.textContent = `Score : ${score}`


    simon.playOrder = [];
    player.playOrder = [];

    // console.log('play simon func is working')

    simonsTurn()
}

function simonsTurn(){

    //Setting players array to empty  
    player.playOrder = []

    //Adding next color to Simon's array
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])

    //Animating Simon's array
    playAnimation(simon.playOrder, 0)

    player.playOrder= [];
    setTimeout(playersTurn, simon.playOrder.length*800)
}

function playersTurn(){
    hasClicked = false;

    //Event Listener is added so user can play their turn
    simonEl.addEventListener('click', checkClick)
    
    if(hasClicked==true){simonEl.removeEventListener('click', checkClick)}

    //User gets 5 seconds to click or game over
    if(hasClicked = false){
        setTimeout(gameOver, 5000)
    }
}



function checkClick(e) {
    console.log(`Check click started running`)
    let colorClicked = e.target
    let idx = player.playOrder.push(colorClicked.id)-1
    console.log(`This is where ${colorClicked.id} was added to:`)
    console.log(player.playOrder)
    console.log(`at ${(idx)}`)
    colorClicked.classList.add('playing')
        // End animation for the div
        setTimeout( function(){
            e.target.classList.remove('playing')
        }, 500)
    
    hasClicked = true;
    console.log(player.playOrder[idx])
    console.log(simon.playOrder[idx])

    if (player.playOrder[idx] === simon.playOrder[idx]){
        if(player.playOrder.length === simon.playOrder.length){
            console.log(`Level up from checkClick if`)
            levelUp()
        } else {
            console.log(`Re playersTurn from checkClick if`)
            playersTurn()
        }
    } else {
        console.log(`Game Over from checkClick if`)
        gameOver()
    }
    console.log(`Check click stopped running`)
}

function levelUp(){
    // if(hasWon){
        //WIN INDICATOR ANIMATION
        levelUpAnimation()

        //Update Level, Score
        level++
        levelEl.textContent = `Level : ${level}`
        score+=10
        scoreEl.textContent = `Score : ${score}`
        
        //Back to Simons Turn
        setTimeout (simonsTurn, 2000)
    // } 
}

function gameOver() {

    //LOSE INDICATOR ANIMATION
    gameOverAnimation()

    //RESET LEVEL AND SCORE 
    level = 0;
    levelEl.textContent = ``
    score = 0;
    scoreEl.textContent = ``
    
    //Empty Simons Array and Players Array 
    simon.playOrder = [];
    player.playOrder = [];
    console.log(`GAME OVER`);
    playBtn.disabled = false;

}

/*----- All Animation Functions Go Here -----*/

//Animation for Simon's turn
function playAnimation(arr, i){
    let animate = setInterval(
        function(){

        //Exit cb function if index is undefined 
          if (i==arr.length-1) {
            clearInterval(animate)
          }

          let cellColor = arr[i] 
          console.log(cellColor)

          //Grab the corresponding div to animate
          let divToAnimate = document.getElementById(cellColor)
          console.log(divToAnimate)
          divToAnimate.style.backgroundColor = cellColor

          //Start animation for the color button
          divToAnimate.classList.add('playing')
          //Play audio for the button
          
          //End animation for the color button
          setTimeout( function(){
            divToAnimate.classList.remove('playing')
          }, 500)
          
          i++
        }
      , 700)
}

//Animation for Level Up 
function levelUpAnimation() {
    i = 0
    let animate = setInterval( function(){
        

        //Exit cb after 3 intervals
        if (i==3) {
            clearInterval(animate)
        }

        console.log(`level up animation ran`)
        colorDivs.forEach((div) => {
            //Start animation for the color button
            div.classList.add('playing')
            //Play audio for the button
            
            //End animation for the color button
            setTimeout(function(){
            div.classList.remove('playing')
            }, 100)
        })
        i++;
    }, 200
)}

//Animation for Game Over
function gameOverAnimation(){
    i = 0

    let animateGameOver = setInterval( function(){
       

        //Exit cb after 3 intervals
        if (i==3) {
            clearInterval(animateGameOver)
        }

        console.log('game over animation ran')
        colorDivs.forEach((div) => {
            //Start animation for the color button
            div.classList.add('gameover')
            //Play audio for the button
            
            //End animation for the color button
            setTimeout(function(){
            div.classList.remove('gameover')
            }, 100)
        })
        i++;
    }, 200
)}