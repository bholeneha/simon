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
messageEl.innerHTML = "Click <strong>Simon</strong> to Play!"


/*----- functions -----*/
function playSimon(){

    //Play button disabled
    playBtn.disabled = true

    //Initializing level, score, array
    level = 0
    levelEl.textContent = `Level : ${level}`
    score = 0
    scoreEl.textContent = `Score : ${score}`
    simon.playOrder = [];
    player.playOrder = [];

    //Starting Simons Turn
    simonsTurn()
}

function simonsTurn(){

    //Message to user to wait for Simon to finish
    messageEl.innerHTML = "<strong>Simon turn!</strong> <br><br> Wait, watch and remember the order."

    //Adding next color to Simon's array
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])
    console.log(simon.playOrder)

    //Animating Simon's array
    playAnimation(simon.playOrder, 0)

    //Setting players array to empty  
    player.playOrder = []

    //Triggering players turn after certain time 
    setTimeout(playersTurn, simon.playOrder.length*1200)
}

function playersTurn(){

    //Message to user to respond
    messageEl.innerHTML = "<strong> Your turn! </strong> <br><br> Click the colors to copy Simon. <br>(You have 5 seconds to respond)"

    //Flag to see if user has clicked 
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

    //Check to see if user clicked the right child elements 
    if(e.target.classList.contains('color-button')){

        //Saving the target and its index in a variable 
        let colorClicked = e.target
        let idx = player.playOrder.push(colorClicked.id)-1
        
        //Animating the target clicked
        colorClicked.classList.add('playing')
            // End animation for the div
            setTimeout( function(){
                e.target.classList.remove('playing')
            }, 500)
        
        //Flag for user response set to true
        hasClicked = true;
       
        //Check if click matches simon's array
        if (player.playOrder[idx] === simon.playOrder[idx]){
            
            //Check if its the last element in the array
            if(player.playOrder.length === simon.playOrder.length){

                //LEVEL UP
                levelUp()

            } else {

                //Return to Players Turn for next click
                playersTurn()
            }
        
        //If incorrect click, then GAME OVER
        } else {

            //Game Over
            gameOver()
        }
    }
}

function levelUp(){

    //Message to the user for correct response and level up
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
}

function gameOver(){

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
    
    //Play Button Reset
    playBtn.disabled = false;

    //After a sec and and a half, initialize user message to original 
    setTimeout(function(){
        messageEl.innerHTML = "Click <strong>Simon</strong> to Play!"
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

          //Grab the corresponding div to animate
          let divToAnimate = document.getElementById(cellColor)
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
      , 700)
}

//Animation for Level Up 
function levelUpAnimation() {
    i = 0
    let animate = setInterval(function(){
        

        //Exit cb after 3 intervals
        if (i===3) {
            clearInterval(animate)
        }

        //Animation of the color buttons 
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
        if (i>=5) {
            clearInterval(animateGameOver)
        }

        //Message to user for game over while game over animation
        messageEl.innerHTML = "Uh oh. <strong>GAME OVER.</strong> <br><br> Restarting..."

        //Animation of the color buttons
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