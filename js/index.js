
import Game from "./Game.js";

//instance the game and it start
const game = new Game();
game.start();

document.addEventListener("keyup", e => { game.control(e.key) });
document.querySelector("#controls").addEventListener("click", e => { game.control(e.target.dataset.key) } );