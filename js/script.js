console.log('connected!')

/*----- constants -----*/
const colorCells = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'yellow'
}

const simon = {
    playOrder: [],
}

const player = {
    name: "",
    playOrder: [],
    highScore: null
}

//Number of high scores to display
const numOfHighScores = 5;

//Using nullish coalescing operator to return an empty array if highScoreData doesnt exist in local storage
const highScores = JSON.parse(localStorage.getItem("highScoreData")) ?? [];

console.log(highScores)

/*----- app's state (variables) -----*/
let level, score, hasClicked;

/*----- cached element references -----*/

//Heading
const headingEl = document.getElementById('heading')

//Divs
const simonEl = document.getElementById('simon')
const enterEl = document.getElementById('enter-screen')
const highscoresEl = document.getElementById('highscores')

//Buttons
const playBtn = document.getElementById('play')
const enterBtn = document.getElementById('enter')

//Stats Elements
const statsEl = document.getElementById('stats')
const levelEl = document.getElementById('level')
const scoreEl = document.getElementById('score')

//Simon Divs
const colorDivs = document.querySelectorAll('.color-button')
const messageEl = document.getElementById('messages')


/*----- Enter Screen State -----*/
enterEl.prepend(headingEl)


/*----- Enter Screen Event Listeners -----*/
enterBtn.addEventListener('click', enterPlayScreen)


/*----- Enter Screen Functions -----*/
function enterPlayScreen(e){

    //Header element moves to top
    enterEl.removeChild(headingEl)
    document.querySelector('body').prepend(headingEl)
    headingEl.style.gridArea = 'header'


    //Hide and show relevant elements
    enterEl.classList.add('hidden')

    statsEl.classList.remove('hidden')
    messageEl.classList.remove('hidden')
    simonEl.classList.remove('hidden')

    player.name = document.getElementById('name').value
}


/*----- Play Screen Event Listeners -----*/
playBtn.addEventListener('click', playSimon)
messageEl.innerHTML = "Click <h2>Simon</h2> to Play!"

/*----- Play Screen Functions -----*/
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
    messageEl.innerHTML = "<h2>Simon's turn!</h2> <br><br> Wait, watch and remember the order."

    //Adding next color to Simon's array
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])
    console.log(simon.playOrder)

    //Animating Simon's array
    playAnimation(simon.playOrder, 0)

    //Setting players array to empty  
    player.playOrder = []

    //Triggering players turn after certain time 
    setTimeout(playersTurn, simon.playOrder.length*1000)
}

function playersTurn(){

    //Message to user to respond
    messageEl.innerHTML = "<h2>Your turn! </h2> <br><br> Click the colors to copy Simon. <br><br>(You have 5 seconds to respond)"

    //Flag to see if user has clicked 
    hasClicked = false;

    //Event Listener is added so user can play their turn
    simonEl.addEventListener('click', checkClick)
    
    //User gets 5 seconds to click or game over
    let timer = setTimeout(function(){
        if(hasClicked==true){
            simonEl.removeEventListener('click', checkClick)
        } else {
            simonEl.removeEventListener('click', checkClick)
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
                simonEl.removeEventListener('click', checkClick)
                levelUp()
            
            } else {

                //Return to Players Turn for next click
                simonEl.removeEventListener('click', checkClick)
                playersTurn()
            }
        
        //If incorrect click, then GAME OVER
        } else {

            //Game Over
            gameOver()
            simonEl.removeEventListener('click', checkClick)
        }
    }
}

function levelUp(){

    //Message to the user for correct response and level up
    messageEl.innerHTML = "<h2>Correct!</h2><br><br> Great job!"

    //WIN INDICATOR ANIMATION
    gameEventAnimation('playing')

    //Update Level, Score
    level++
    levelEl.textContent = `Level : ${level}`
    score+=10
    scoreEl.textContent = `Score : ${score}`
    
    //Back to Simons Turn
    setTimeout (simonsTurn, 2000)
}

function gameOver(){

    //Saving score as high score or the current player
    if (player.highScore<score || player.highScore == null){
        player.highScore = score
    }
    
    //Checking High Score 
    let newHighScore = {name:player.name, highScore:player.highScore}
    checkHighScore(newHighScore, highScores)

    //LOSE INDICATOR ANIMATION
    gameEventAnimation('gameover')

    //RESET LEVEL AND SCORE 
    level = 0;
    levelEl.textContent = ``
    score = 0;
    scoreEl.textContent = ``

    
    //Empty Simons Array and Players Array 
    simon.playOrder = [];
    player.playOrder = [];

    //After a few seconds, display highscores screen
    setTimeout(function(){
        //Hide and show relevant elements
        enterEl.classList.add('hidden')
        statsEl.classList.add('hidden')
        messageEl.classList.add('hidden')
        simonEl.classList.add('hidden')

        highscoresEl.classList.remove('hidden')
    }, 2000)

    
    //After a sec and and a half, initialize user message to original 
    setTimeout(function(){
        //Play Button Reset
        playBtn.disabled = false;
        //Reset User Message 
        messageEl.innerHTML = "Click <h2>Simon</h2> to Play!"
    }, 3000)
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
          }, 500)
          
          i++
        }
      , 700)
}

//Animation for Level Up 
function gameEventAnimation(gameEvent) {
    i = 0
    let animate = setInterval(function(){
        
        //Exit cb after 3 intervals
        if (i===3) {
            clearInterval(animate)
        }
        
        //If gameEvent is game over, display message 
        if (gameEvent ==="gameover"){
            // Message to user for game over while game over animation
            messageEl.innerHTML = "Uh oh. <h2>GAME OVER.</h2> <br><br> Restarting..." 
        }

        //Animation of the color buttons 
        colorDivs.forEach((div) => {
            //Start animation for the color button
            div.classList.add(`${gameEvent}`)
            //Play audio for the button
            
            //End animation for the color button
            setTimeout(function(){
            div.classList.remove(`${gameEvent}`)
            }, 100)
        })
        i++;
    }, 200
)}

/*----- High Score Related -----*/

function checkHighScore(newScore, highScoreList){
    
    //Using the Elvis operator and nullish operator to get the lowest score. 
    //If undefined, set to zero
    const lowestScore = highScores[numOfHighScores-1]?.score ?? 0;

    if (newScore.highScore>lowestScore){
        saveHighScore(newScore, highScoreList);
        showHighScores(); 
    }
}

function saveHighScore(score, scoreList){

    //ADD to the list
    scoreList.push(score);

    //SORT the list
    scoreList.sort((a,b) => b.highScore - a.highScore);

    //Select new list 
    scoreList.splice(numOfHighScores)

    //Save to Local Storage
    localStorage.setItem('highScoresData', JSON.stringify(scoreList));

    console.log(`printing the ${scoreList}`)
}

function showHighScores(){
    const highScoresDisplay = document.createElement('ul')

    highScores.forEach(score => {
        const liEl = document.createElement('li')
        liEl.innerHTML = score
        highScoresDisplay.append(liEl)
    })

    highscoresEl.insertBefore(highScoresDisplay, highscoresEl.children[1])
}