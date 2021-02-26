/*********************************************************************
* @author  Samuel Simão
* @brief   Mini-game
* @date    02/21/21 : 02/25/21
* @description

      Heroway - Missão Primeiro Emprego

* @note I've never wrote any kind of code in HTML or JavaScript, but I loved this experience!

* @chalenges
 * create enemies automatically ✔
 * narrow the number of steps available ✔
 * mini-demons cannot pass on chests and traps ✔
 * reload the page by clicking the reset button ✔

***********************************************************************/


/*-------------
 first: take the CSS variables to JS
    variables:
    --tile-size: 48px; 
    --helmet-offset: 12px; 
    --game-size: calc(var(--tile-size) * 20); 
-------------*/

// Global variables, they store the sizes
const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

//root keeps the CSS variables, which ones render the characters
const root = document.documentElement;
//setProperty build a CSS variable in JS
root.style.setProperty('--tile-size', `${TILE_SIZE}px`) //48px
root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`) //12px
root.style.setProperty('--game-sizze', `${GAME_SIZE}px`) //960px

//===================================================================================================================== createBoard

//--- function to create the board
function createBoard () {
    //catching the board element in HTML by its ID
    const boardElement = document.getElementById('board');
    //console.log(board)

    //list to store the actual characters positions
    const elements = [];

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- createElement
    //function to create the element and set it in the board
    function createElement(options){
        let {item, top, left} = options;
        //as the same as declare:
        /* const item = options.item;
        *  const top = options.top;
        *  const left = options.left;
        */

        //receive the characters positions
        const currentElement = { item, currentPosition: { top, left } };
        //stores this info in the element
        elements.push(currentElement);

        //console.log(elements);
        
        //create the div in the code, HTML stuff
        const htmlElement = document.createElement('div');
        //element that will be set in
        htmlElement.className = item
        //position of this element 
        htmlElement.style.top = `${top}px`;   //'px' is necessary because we are talking about pixels
        htmlElement.style.left = `${left}px`;  //this syntax concatenates the int value with the str

        //set the element in the board
        boardElement.appendChild(htmlElement);

        //-------------------------------------------------------------------------------- GetNewDirection
        //function that receives the button pressed and adjust the characters position
        function GetNewDirection (buttonPressed, position){
          switch (buttonPressed){

            case 'ArrowUp':
              return {top: position.top - TILE_SIZE, left: position.left};
            case 'ArrowDown':
              return {top: position.top + TILE_SIZE, left: position.left};
            case 'ArrowRight':
              return {top: position.top, left: position.left + TILE_SIZE};
            case 'ArrowLeft':
              return {top: position.top, left: position.left - TILE_SIZE};

            default:
              return position;
          }
        }//end GetNewDirection

        //-------------------------------------------------------------------------------- validateMoviment
        //function to validate the characters moviment, blocking them from getting out the board
        function validateMoviment (position, conflictItem, curEl){

          //mini-demons are not able to pass on chests and traps 
            if (curEl?.item === 'mini-demon'){
              return(
                position.left >= 48 &&
                position.left <= 864 &&
                position.top >= 96 &&
                position.top <= 816 &&
                conflictItem?.item !== 'forniture' &&
                //additional itens for mini-demons
                conflictItem?.item !== 'chest' &&
                conflictItem?.item !== 'trap' 
                //&& conflictItem?.item !== 'mini-demon'
              )
          }//end in mini-demon

            return(
              //as we have conditions in this return,it will return True or False
              //conditions for the element be in the board
              position.left >= 48 &&
              position.left <= 864 &&
              position.top >= 96 &&
              position.top <= 816 &&
              // ? -> se houver algo no conflictItem, então procura o item. o ? fazcom que se não houver nada, nem faz o teste lógico
              // why '?' -> if there is something in conlictItem, so it will look for the Item. the '?' don´t allows this test if there is nothing in it
              conflictItem?.item !== 'forniture'
            )
        }//end validateMoviment

        //-------------------------------------------------------------------------------- GetMovementConflict
        //function to analize if there is conflict in the characters walking
        function GetMovementConflict(position, els){
            //test the characters position
            const conflictItem = els.find( (currentElement) => {
              return(
                  //se houver uma top e um left iguais, retorna em quem bateu
                  //if there is a top and a left coord equal to each other, return that there were a bump 
                  currentElement.currentPosition.top === position.top &&
                  currentElement.currentPosition.left === position.left
              )
            });

        //return that there was conflict with some element in the board
        return conflictItem;
        }//end GetMovementConflict

        //-------------------------------------------------------------------------------- validateConflict
        //function that says that there was a interaction between the elements
        function validateConflict(currentEl, conflictItem){

          function finishGame(message){

            //wait Xms and then repeat this function
            setTimeout(() => {
              //send the message
              alert(message);
              //reload the page
              location.reload();
            }, 100); //100ms
          }

          //if currentElement is void (undefined), get out of here
          if(!conflictItem){
            return;
          }

          if (currentEl.item === 'hero'){

            if(
              conflictItem.item === 'mini-demon' ||
              conflictItem.item === 'trap'
              ) {
                finishGame('você morreu');
              }

            if(
              conflictItem.item === 'chest' 
              ) {
                finishGame('você ganhou');
              }
  
          }//end if hero

          //if mini-demon bumps into the hero, you lose
          if (currentEl.item === 'mini-demon' && conflictItem.item === 'hero'){
            finishGame('você morreu');
          }
        }


        //-------------------------------------------------------------------------------- move
        //function to move the characters
        function move(buttonPressed){
          //console.log('move', buttonPressed);
          //console.log(elements);

          //set the news positions coord
          const newPosition = GetNewDirection(buttonPressed, currentElement.currentPosition);

          const conflictItem = GetMovementConflict(newPosition, elements);

          //send the position to the function verify is this is valid, returns True or False
          const isValidMoviment = validateMoviment(newPosition, conflictItem, currentElement);

          //console.log(isValidMoviment);

          //if the move is valid, so it is executed
          if(isValidMoviment) {
            currentElement.currentPosition = newPosition;
            //set the new positions coord
            htmlElement.style.top = `${newPosition.top}px`;
            htmlElement.style.left = `${newPosition.left}px`;

            //verifies if you had passed on a enemy
            validateConflict(currentElement, conflictItem);

          }

        }//end move

        return{
          move: move
        }
    }//end createElement

    //=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- createCharacters
    //functions that facilitates the creation of the elements

    function createItem (options){
      createElement(options);
    }

    function createHero (options){
      const hero = createElement({
        item: 'hero',
        top: options.top,
        left: options.left
      });


      //IMPORTANT! this function can be used for another interactions too, such as clicks or focus
      document.addEventListener('keydown', (event) => {
      //console.log('pressionado: ', event.key);

      //send to move the key pressed
      hero.move(event.key);

          //every hit on the keyboard is counted as a step
           Fsteps(totalSteps);
      });
    }


    function createEnemy (options){
      const enemy = createElement({
        item: 'mini-demon',
        top: options.top,
        left: options.left
      });

      setInterval(() => {
          //console.log('mexe'); //verify if it is repeating at the time setted
          const direction = ['ArrowUp', 'Arrowdown', 'ArrowRight', 'ArrowLeft']; //array with the possible new positions for mini-demons
          const randomIndex = Math.floor(Math.random() * direction.length);
          //console.log(randomIndex);
          const randomDirection = direction[randomIndex];

          enemy.move(randomDirection);

      }, 500) //o 500 é o tempo em ms
    }

    //return do createBoard
    return{
        //createElement: createElement
        createItem: createItem,
        createHero: createHero,
        createEnemy: createEnemy
    }
}
//=======================================================================================================

//------ use the reset button to reload the page
function reset(){
  document.addEventListener('click', (event) => {
    
    if (event.target.className === 'reset'){
      setTimeout(() => {
        //send the message
        alert('Loooooooserrr');
        //reload the page
        location.reload();
      }, 100); //100ms

    }});
  }
  reset();

//variable that stores the number of steps taken
var steps = 0;

function Fsteps (maxSteps){

  var stepsAvailable = maxSteps - steps;
  steps++;
  console.log(stepsAvailable);

  //update the stepsAvailable for the player
  let stepShown = document.querySelector('.steps');   //the . asks to look for a class
  console.log(stepShown);
  console.log(stepShown.textContent);
  stepShown.textContent = 'Passos: ' + (stepsAvailable);

  //if you knock-out the stepsAvailable, you lose
  if (stepsAvailable === 0){
    setTimeout(() => {
      //send the message
      alert('Walker Loooooooserrr');
      //reload the page
      location.reload();
    }, 100); //100ms
  }

  if (totalSteps === stepsAvailable){
    let stepShown = document.querySelector('.steps');
    console.log(stepShown);
    console.log(stepShown.textContent);
    stepShown.textContent = 'Passos: ' + maxSteps;
  }

}

//set the maximum steps!
const totalSteps = 50;

Fsteps(totalSteps);


const board = createBoard();

/*--- what we want the element to have
 * item -> mini-demon | hero | chest | trap
 * position X / top  -> number
 * position Y / left -> number
 */

// RESTRICTIONS FOR CHARACTERS RENDERIZATION
// 2<= top <= 17
// 1<= left <= 18

//-------- chest
board.createItem({item: 'chest',top: TILE_SIZE * 2, left: TILE_SIZE * 18});

//-------- forniture
//fixed objects, where the hero cannot pass on
board.createItem({item: 'forniture',top: TILE_SIZE * 17, left: TILE_SIZE * 2}); //stairs
board.createItem({item: 'forniture',top: TILE_SIZE * 2, left: TILE_SIZE * 8}); //lava
board.createItem({item: 'forniture',top: TILE_SIZE * 2, left: TILE_SIZE * 16}); //lava
board.createItem({item: 'forniture',top: TILE_SIZE * 2, left: TILE_SIZE * 3}); //lava

//-------- hero
board.createHero({top: TILE_SIZE * 17, left: TILE_SIZE * 1});


//-------- enemies
//create enemies automatically 
const numEnemies = 25;

for ( var i = 0; i<numEnemies; i++){

  const topIndex = (Math.floor(Math.random() * 16)) + 2;
  const leftIndex = (Math.floor(Math.random() * 18)) + 1;

  board.createEnemy({top: TILE_SIZE * topIndex, left: TILE_SIZE * leftIndex});
};



//-------- traps
board.createItem({item: 'trap',top: TILE_SIZE * 10, left: TILE_SIZE * 1}); //trap
board.createItem({item: 'trap',top: TILE_SIZE * 15, left: TILE_SIZE * 8}); //trap
board.createItem({item: 'trap',top: TILE_SIZE * 12, left: TILE_SIZE * 2}); //trap
board.createItem({item: 'trap',top: TILE_SIZE * 6, left: TILE_SIZE * 10}); //trap
board.createItem({item: 'trap',top: TILE_SIZE * 8, left: TILE_SIZE * 5}); //trap



//board

/* top - left === coordinates
 * 02-01 /-----/ ~02-03~ /-----/ /-----/ /-----/ /-----/ ~02-08~ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ ~02-16~ /-----/ 02-18
 *
 *       /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/
 * 
 * 17-01 ~17-02~ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ /-----/ 17-18 
 * 
*/