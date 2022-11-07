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

let level, score;
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
    
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])
    // console.log(simon.playOrder)
    playAnimation(simon.playOrder, 0)

    
    setTimeout(playersTurn, simon.playOrder.length*2000)
}

function playersTurn(){

    hasWon = false;
    isCorrect = null;
    player.playOrder= [];

    simonEl.addEventListener('click', function(e) {
        console.log(e.target.id)
        let colorClicked = e.target
        // player.playOrder.push(`${colorClicked.id}`)
        let index = player.playOrder.push(colorClicked.id)-1
        console.log(`This is where ${colorClicked.id} was added to:`)
        console.log(player.playOrder)
        console.log(`at ${(index)}`)
        colorClicked.classList.add('playing')
            // End animation for the div
            setTimeout( function(){
                e.target.classList.remove('playing')
            }, 500)
        
        setTimeout(checkClick.bind(undefined, index), 5000)
    })

    
}

function checkClick(idx) {
        console.log(`This is being run now`)
        console.log(player.playOrder[idx])
        console.log(simon.playOrder[idx])

        if (player.playOrder[idx] === simon.playOrder[idx]){
            levelUp()
        } else {
            gameOver()
        }
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
      , 1000)
}

//Animation for Level Up 
function levelUpAnimation() {
    i = 0
    let animate = setInterval( function(){
        

        //Exit cb after 3 intervals
        if (i==3) {
            clearInterval(animate)
        }

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