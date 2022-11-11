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
const highScores = JSON.parse(localStorage.getItem("highScoresData")) ?? [];

/*----- audio -----*/

const audCtx = new (window.AudioContext || window.webkitAudioContext)()
const audio = audCtx.createOscillator()
audio.start()

const frequencies = {
    'red': 125,
    'blue': 225,
    'green': 325,
    'yellow': 425,
}

/*----- app's state (variables) -----*/
let level, score, hasClicked;

/*----- cached element references -----*/

//Heading
const headingEl = document.getElementById('heading')

//Divs
const simonEl = document.getElementById('simon')
const enterEl = document.getElementById('enter-screen')
const highscoresEl = document.getElementById('highscores')
const highscoresListEl = document.getElementById('highscores-list')

//Buttons
const playBtn = document.getElementById('play')
const enterBtn = document.getElementById('enter')
const homeBtn = document.getElementById('home')
const reentryBtn = document.getElementById('reentry')
const nameInputBox = document.getElementById('name')

//Stats Elements
const statsEl = document.getElementById('stats')
const levelEl = document.getElementById('level')
const scoreEl = document.getElementById('score')

//Simon Divs
const colorDivs = document.querySelectorAll('.color-button')
const messageEl = document.getElementById('messages')


/*----- Enter Screen Event Listeners -----*/
enterBtn.addEventListener('click', enterPlayScreen)


/*----- Enter Screen Functions -----*/
function enterPlayScreen(e){

    audCtx.resume()

    //Hide and show relevant elements
    enterEl.classList.add('hidden')

    statsEl.classList.remove('hidden')
    messageEl.classList.remove('hidden')
    simonEl.classList.remove('hidden')

    player.name = nameInputBox.value
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
    simon.playOrder = []
    player.playOrder = []
    player.highScore = 0

    //Starting Simons Turn
    simonsTurn()
}

function simonsTurn(){

    //Message to user to wait for Simon to finish
    messageEl.innerHTML = "<h2>Simon's turn!</h2> <br><br> Wait, watch and remember the order."

    //Adding next color to Simon's array
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])

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

        //Play Audio
        audio.frequency.value = frequencies[colorClicked.id]
        audio.connect(audCtx.destination)

        // End animation and audio for the div
        setTimeout( function(){
            e.target.classList.remove('playing')
            audio.disconnect(audCtx.destination)
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
    score+=14
    scoreEl.textContent = `Score : ${score}`
    
    //Back to Simons Turn
    setTimeout (simonsTurn, 2000)
}

function gameOver(){

    audio.stop()

    //Saving score as high score or the current player
    if (player.highScore<score || player.highScore == null){
        player.highScore = score
    }

    //Checking High Score 
    let newHighScore = {name:player.name, highScore:player.highScore}
    checkHighScore(newHighScore, highScores)

    //LOSE INDICATOR ANIMATION
    gameEventAnimation('gameover')

    //After a two seconds, display highscores screen
    setTimeout(function(){
        //Hide and show relevant elements
        enterEl.classList.add('hidden')
        statsEl.classList.add('hidden')
        messageEl.classList.add('hidden')
        simonEl.classList.add('hidden')

        highscoresEl.classList.remove('hidden')
    }, 2000)

    
    //After three secs, initialize the game 
    setTimeout(function(){

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

        //  Play audio for the button
        audio.frequency.value = parseFloat(frequencies[cellColor])
        audio.connect(audCtx.destination)

        //Start animation for the color button
        divToAnimate.classList.add('playing')

        //End animation for the color button
        setTimeout( function(){
        divToAnimate.classList.remove('playing')
        audio.disconnect(audCtx.destination)
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

/*----- High Scores Related -----*/

function checkHighScore(newScore, list){

    //Using the Elvis operator and nullish operator to get the lowest score. 
    //If undefined, set to zero
    const lowestScore = list[numOfHighScores-1]?.score ?? 0;
    
    if (newScore.highScore>lowestScore){
        
        //ADD to the list
        list.push(newScore);

        //SORT the list
        list.sort((a,b) => b.highScore - a.highScore);

        //Select new list 
        list.splice(numOfHighScores)

        //Save to Local Storage
        localStorage.setItem('highScoresData', JSON.stringify(list));
    }
    
    showHighScores(list)
}

function showHighScores(list){
    highscoresListEl.innerHTML = ""

    list.forEach(score => {
        if (score.highScore>0){
            const liEl = document.createElement('li')
            liEl.innerHTML = `<br>${score.name}: ${score.highScore}<br>`
            highscoresListEl.append(liEl)
        }
    })
}

/*----- Exit Screen Related -----*/

//Event Listeners
reentryBtn.addEventListener('click', returnToSimon)
homeBtn.addEventListener('click', returnToHome)

function returnToSimon(){
    //Hiding
    highscoresEl.classList.add('hidden')
    enterEl.classList.add('hidden')

    //Showing
    simonEl.classList.remove('hidden')
    messageEl.classList.remove('hidden')
    statsEl.classList.remove('hidden')

    //Resume Audio Context
    audCtx.resume()
}

function returnToHome(){
    //Hiding
    highscoresEl.classList.add('hidden')
    simonEl.classList.add('hidden')
    messageEl.classList.add('hidden')
    statsEl.classList.add('hidden')

    //Showing
    enterEl.classList.remove('hidden')

    //Resetting name input box
    nameInputBox.value = ""
}