console.log('connected!')
class SimonGame {

  /*----- constants -----*/
  colorCells = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'yellow'
  }

  simon = {
    playOrder: [],
  }

  player = {
    name: "",
    playOrder: [],
    highScore: null
  }

  //Number of high scores to display
  numOfHighScores = 5;

  //Using nullish coalescing operator to return an empty array if highScoreData doesnt exist in local storage
  // TODO: highScores = JSON.parse(localStorage.getItem("highScoresData")) ?? [];
  highScores = [];

  /*----- audio -----*/

  audCtx = new (AudioContext || webkitAudioContext)()
  audio = this.audCtx.createOscillator()


  frequencies = {
    'red': 125,
    'blue': 225,
    'green': 325,
    'yellow': 425,
  }

  /*----- app's state (variables) -----*/
  level;
  score;
  hasClicked;

  /*----- cached element references -----*/

  //Heading
  headingEl = document.getElementById('heading')

  //Divs
  simonEl = document.getElementById('simon')
  enterEl = document.getElementById('enter-screen')
  highscoresEl = document.getElementById('highscores')
  highscoresListEl = document.getElementById('highscores-list')

  //Buttons
  playBtn = document.getElementById('play')
  enterBtn = document.getElementById('enter')
  homeBtn = document.getElementById('home')
  reentryBtn = document.getElementById('reentry')
  nameInputBox = document.getElementById('name')

  //Stats Elements
  statsEl = document.getElementById('stats')
  levelEl = document.getElementById('level')
  scoreEl = document.getElementById('score')

  //Simon Divs
  colorDivs = document.querySelectorAll('.color-button')
  messageEl = document.getElementById('messages')

  constructor() {
    this.audio.start();
    this.enterBtn.addEventListener('click', this.enterPlayScreen.bind(this));
    /*----- Play Screen Event Listeners -----*/
    this.playBtn.addEventListener('click', this.playSimon.bind(this))
    this.messageEl.innerHTML = "Click <h2>Simon</h2> to Play!";
    /*----- Exit Screen Related -----*/
    //Event Listeners
    this.reentryBtn.addEventListener('click', this.returnToSimon.bind(this))
    this.homeBtn.addEventListener('click', this.returnToHome.bind(this))
  }

  /*----- Enter Screen Functions -----*/
  enterPlayScreen(e) {

    this.audCtx.resume()
    //Hide and show relevant elements
    this.enterEl.classList.add('hidden')
    this.statsEl.classList.remove('hidden')
    this.messageEl.classList.remove('hidden')
    this.simonEl.classList.remove('hidden')
    this.player.name = this.nameInputBox.value
  }

  /*----- Play Screen Functions -----*/
  playSimon() {

    //Play button disabled
    this.playBtn.disabled = true
    //Initializing level, score, array
    this.level = 0
    this.levelEl.textContent = `Level : ${this.level}`
    this.score = 0
    this.scoreEl.textContent = `Score : ${this.score}`
    this.simon.playOrder = []
    this.player.playOrder = []
    this.player.highScore = 0

    //Starting Simons Turn
    this.simonsTurn()
  }

  simonsTurn() {

    //Message to user to wait for Simon to finish
    this.messageEl.innerHTML = "<h2>Simon's turn!</h2> <br><br> Wait, watch and remember the order."

    //Reset players array
    this.player.playOrder = []

    //Adding next color to Simon's array
    let num = Math.floor(Math.random() * 4 + 1)
    this.simon.playOrder.push(this.colorCells[num])

    //Animating Simon's array
    this.playAnimation(this.simon.playOrder, 0)

    console.log(this.simon.playOrder.length)

    //Triggering players turn after certain time 
    setTimeout(this.playersTurn, this.simon.playOrder.length * 1000)
  }

  playersTurn() {

    //Message to user to respond
    this.messageEl.innerHTML = "<h2>Your turn! </h2> <br><br> Click the colors to copy Simon. <br><br>(You have 5 seconds to respond)"

    //Flag to see if user has clicked 
    this.hasClicked = false;

    //Event Listener is added so user can play their turn
    this.simonEl.addEventListener('click', checkClick)

    //User gets 5 seconds to click or game over
    let timer = setTimeout(function () {
      if (hasClicked == true) {
        simonEl.removeEventListener('click', checkClick)
      } else {
        simonEl.removeEventListener('click', checkClick)
        gameOver();
      }
    }, 5000)
  }


  checkClick(e) {

    //Check to see if user clicked the right child elements 
    if (e.target.classList.contains('color-button')) {

      //Saving the target and its index in a variable 
      let colorClicked = e.target
      let idx = player.playOrder.push(colorClicked.id) - 1

      //Animating the target clicked
      colorClicked.classList.add('playing')

      //Play Audio
      audio.frequency.value = frequencies[colorClicked.id]
      audio.connect(audCtx.destination)

      // End animation and audio for the div
      setTimeout(function () {
        e.target.classList.remove('playing')
        audio.disconnect(audCtx.destination)
      }, 500)

      //Flag for user response set to true
      hasClicked = true;

      //Check if click matches simon's array
      if (player.playOrder[idx] === simon.playOrder[idx]) {

        //Check if its the last element in the array
        if (player.playOrder.length === simon.playOrder.length) {

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

  levelUp() {

    //Message to the user for correct response and level up
    messageEl.innerHTML = "<h2>Correct!</h2><br><br> Great job!"

    //WIN INDICATOR ANIMATION
    gameEventAnimation('playing')

    //Update Level, Score
    level++
    levelEl.textContent = `Level : ${level}`
    score += 14
    scoreEl.textContent = `Score : ${score}`

    //Back to Simons Turn
    setTimeout(simonsTurn, 2000)
  }

  gameOver() {

    //Saving score as high score or the current player
    if (player.highScore < score || player.highScore == null) {
      player.highScore = score
    }

    //Checking High Score 
    let newHighScore = { name: player.name, highScore: player.highScore }
    checkHighScore(newHighScore, highScores)

    //LOSE INDICATOR ANIMATION
    gameEventAnimation('gameover')

    //After a two seconds, display highscores screen
    setTimeout(function () {
      //Hide and show relevant elements
      enterEl.classList.add('hidden')
      statsEl.classList.add('hidden')
      messageEl.classList.add('hidden')
      simonEl.classList.add('hidden')

      highscoresEl.classList.remove('hidden')


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

    }, 2000)

  }

  /*----- All Animation Functions Go Here -----*/

  //Animation for Simon's turn
  playAnimation(arr, i) {
    let animate = setInterval(
      function () {

        //Exit cb function if index is undefined 
        if (i == arr.length - 1) {
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
        setTimeout(function () {
          divToAnimate.classList.remove('playing')
          audio.disconnect(audCtx.destination)
        }, 500)

        i++
      }
      , 700)
  }

  //Animation for Level Up 
  gameEventAnimation(gameEvent) {
    i = 0
    let animate = setInterval(function () {

      //Exit cb after 3 intervals
      if (i === 3) {
        clearInterval(animate)
      }

      //If gameEvent is game over, display message 
      if (gameEvent === "gameover") {
        // Message to user for game over while game over animation
        messageEl.innerHTML = "Uh oh. <h2>GAME OVER.</h2> <br><br> Restarting..."
      }

      //Animation of the color buttons 
      colorDivs.forEach((div) => {

        //Start animation for the color button
        div.classList.add(`${gameEvent}`)

        //End animation for the color button
        setTimeout(function () {
          div.classList.remove(`${gameEvent}`)
        }, 100)
      })
      i++;
    }, 200
    )
  }

  /*----- High Scores Related -----*/

  checkHighScore(newScore, list) {

    //Using the Elvis operator and nullish operator to get the lowest score. 
    //If undefined, set to zero
    const lowestScore = list[numOfHighScores - 1]?.score ?? 0;

    if (newScore.highScore > lowestScore) {

      //ADD to the list
      list.push(newScore);

      //SORT the list
      list.sort((a, b) => b.highScore - a.highScore);

      //Select new list 
      list.splice(numOfHighScores)

      //Save to Local Storage
      localStorage.setItem('highScoresData', JSON.stringify(list));
    }

    showHighScores(list)
  }

  showHighScores(list) {
    highscoresListEl.innerHTML = ""

    list.forEach(score => {
      if (score.highScore > 0) {
        const liEl = document.createElement('li')
        liEl.innerHTML = `<br>${score.name}: ${score.highScore}<br>`
        highscoresListEl.append(liEl)
      }
    })
  }

  returnToSimon() {
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

  returnToHome() {
    //Hiding
    highscoresEl.classList.add('hidden')
    simonEl.classList.add('hidden')
    messageEl.classList.add('hidden')
    statsEl.classList.add('hidden')

    //Showing
    enterEl.classList.remove('hidden')

    //Resetting name input box
    nameInputBox.value = ""

    //Resume Audio Context
    audCtx.resume()
  }

}