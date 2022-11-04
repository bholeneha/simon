console.log('connected!')

/*----- constants -----*/
colorCells = {
    1: 'red',
    2: 'blue',
    3: 'lightgreen',
    4: 'yellow'
}

colorAudio = {
    1: '',
    2: '',
    3: '',
    4: ''
}

/*----- app's state (variables) -----*/
const simon = {
    newNum: null,
    playOrder: [],
    level: null
}

const player = {
    playOrder: [2, 4, 3],
    level: null,
    score: null,
    highScore: null
}

/*----- cached element references -----*/
const simonEl = document.getElementById('simon')
const playBtn = document.getElementById('play')

/*----- event listeners -----*/
playBtn.addEventListener('click', play)

/*----- functions -----*/
function play() {
    //SIMONS TURN
    //simon randomly selects a number between 1 and 4 and randomly selects a div
    let num = Math.floor(Math.random()*4+1)
    simon.playOrder.push(num)
    console.log(simon.playOrder)
    playAnimation(simon.playOrder, 0)


}


function playAnimation(arr, i){
    let animate = setInterval(
        function(){
            
        //Exit cb function if index is undefined 
          if (i==arr.length-1) {
            clearInterval(animate)
          }

          let cellNum = arr[i]
          
          //Grab the corresponding div to animate
          let divToAnimate = document.getElementById(colorCells[cellNum])
          divToAnimate.style.backgroundColor = colorCells[cellNum]

          //Start animation for the color button
          divToAnimate.classList.add('playing')
          
          //End animation for the color button
          setTimeout( function(){
            divToAnimate.classList.remove('playing')
            console.log('I ran!')
          }, 1000)
          
          i++
        }
      , 2000)
}