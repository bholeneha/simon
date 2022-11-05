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

    // console.log(simon.playOrder.length)

    hasWon = false;
    isCorrect = false;
    player.playOrder= [];

    for (i=0; i<simon.playOrder.length; i++){
        let divToListenFor = simon.playOrder[i]
        console.log('this is where player input is checked')
        
        simonEl.addEventListener('click', function(e) {
            if (e.target.id === divToListenFor){
                console.log('That is correct' + e.target.id)
                let colorClicked = e.target
                player.playOrder.push(colorClicked.id)
                console.log(`This is where ${colorClicked} was added to ${player.playOrder}`)
                colorClicked.classList.add('playing')
                // End animation for the div
                setTimeout( function(){
                    e.target.classList.remove('playing')
                }, 500)
                isCorrect = true

                if(i==(simon.playOrder.length-1)){
                    hasWon = true
                }

            } else {
                console.log('Game Over!')
                //LOST INDICATOR ANIMATION
                isCorrect = false
                gameOver()
            }
        })
        if(!isCorrect){break;};
    }



    setTimeout(levelUp, simon.playOrder.length*3000)
}


function levelUp(){
    if(hasWon){
        //WIN
        //Update Level, Score
        level++
        levelEl.textContent = `Level : ${level}`
        score+=10
        scoreEl.textContent = `Score : ${score}`
        //WIN INDICATOR ANIMATION
        levelUpAnimation()

        //Back to Simons Turn
        setTimeout (simonsTurn, simon.playOrder.length*3000)
    } 
}

function gameOver() {
    gameOverAnimation()

    level = 0;
    score = 0;
    simon.playOrder = [];
    player.playOrder = [];
}

/*----- All Animation Functions Go Here -----*/

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

function levelUpAnimation() {
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

function gameOverAnimation(){
    let animate = setInterval( function(){
        
        //Exit cb after 3 intervals
        if (i==3) {
            clearInterval(animate)
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