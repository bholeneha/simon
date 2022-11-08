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
const messageEl = document.getElementById('messages')

/*----- event listeners -----*/
playBtn.addEventListener('click', playSimon)
messageEl.textContent = "Click Simon to Play!"


/*----- functions -----*/
function playSimon(){
    console.log('click')

    playBtn.disabled = true
    
    level = 0
    levelEl.textContent = `Level : ${level}`

    score = 0
    scoreEl.textContent = `Score : ${score}`

    simon.playOrder = [];
    player.playOrder = [];

    console.log('play Simon was run')
    simonsTurn()
}

function simonsTurn(){

    messageEl.textContent = "Simon turn. Watch and remember the order."

    console.log(`Simon plays out his array`)
    //Adding next color to Simon's array
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])

    //Animating Simon's array
    playAnimation(simon.playOrder, 0)

    //Setting players array to empty  
    player.playOrder = []

    setTimeout(playersTurn, simon.playOrder.length*1200)
}

function playersTurn(){

    messageEl.innerHTML = "Your turn. Click the colors to copy Simon. <br> (You have 5 seconds to respond)"

    hasClicked = false;

    //Event Listener is added so user can play their turn
    simonEl.addEventListener('click', checkClick)
    
    //User gets 5 seconds to click or game over
    let timer = setTimeout(function(){
        if(hasClicked==true){
            simonEl.removeEventListener('click', checkClick)
        } else {
            gameOver();
        }
    }, 5000)
}



function checkClick(e) {
    if(e.target.classList.contains('color-button')){
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
}

function levelUp(){
    // if(hasWon){
        messageEl.textContent = "Woohoo. Great job!"
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
    

    console.log(`Game over started running`)

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
    

    //Play Button Reset
    playBtn.disabled = false;
    console.log(`game over stopped running`)

    setTimeout(function(){
        messageEl.textContent = "Click Simon to Play!"
    }, 1500)
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
          }, 700)
          
          i++
        }
      , 1000)
}

//Animation for Level Up 
function levelUpAnimation() {
    i = 0
    let animate = setInterval(function(){
        

        //Exit cb after 3 intervals
        if (i===3) {
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
    let animateGameOver = setInterval(function(){
       

        //Exit cb after 3 intervals
        if (i>=3) {
            clearInterval(animateGameOver)
        }

        messageEl.textContent = "Uh oh. Game over. Restarting..."
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