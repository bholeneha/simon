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
    newNum: null,
    playOrder: [],
    isTurn: true,
    time: 5000
}

const player = {
    playOrder: [],
    score: null,
    isTurn: false,
    highScore: null
}

let level, score, turn
/*----- cached element references -----*/
const simonEl = document.getElementById('simon')
const playBtn = document.getElementById('play')
const levelEl = document.getElementById('level')
const scoreEl = document.getElementById('score')

/*----- event listeners -----*/
playBtn.addEventListener('click', playSimon)

/*----- functions -----*/
function playSimon(){
    turn = 0

    level = 0
    levelEl.textContent = `Level : ${level}`

    score = 0
    scoreEl.textContent = `Score : ${score}`


    simon.playOrder = [];
    player.playOrder = [];

    console.log('play simon func is working')

    simonsTurn()
}

function simonsTurn(){
    
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(colorCells[num])
    console.log(simon.playOrder)
    playAnimation(simon.playOrder, 0)

    turn++
    
    setTimeout(playersTurn, simon.playOrder.length*2000)
}

function playersTurn(){
    simonEl.addEventListener('click', function(e) {
        console.log(e.target.id)
        for(i=0; i<simon.playOrder.length; i++){
            if (e.target.id === simon){
                console.log('That is correct')
            } else {
                console.log('try again')
            }
        }
        
    })


    //Update Level, Score, Turn variables. 
    turn = ++turn%2
    level++
    levelEl.textContent = `Level : ${level}`
    score+=10
    scoreEl.textContent = `Score : ${score}`
    setTimeout (simonsTurn, simon.playOrder.length*2000)
}


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

// function playerTurn(e) {
//     if (e.target.id===`${simon.playOrder[0]}`){
//         console.log(`that is correct`)
//         player.playOrder.push(e.target.id)
//         e.target.classList.add('playing')

//         //Store the click in player.playOrder
//         player.playOrder.push(e.target.id)

//         //Add playing class to div to animate it
//         e.target.classList.add('playing')

//         //End animation for the div
//         setTimeout( function(){
//             e.target.classList.remove('playing')
//         }, 300)

//     } else {
//         console.log(`try again!`)
//     }

// }
// 