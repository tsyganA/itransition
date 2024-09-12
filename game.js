const HMACGenerator = require('./generator');
const GameLogic = require('./logic');
const HelpTable = require('./help');

class Game {
    constructor(moves) {
        if (moves.length < 3 || moves.length % 2 === 0) {
            throw new Error('Error: Please provide an odd number of moves greater than 1.');
        }
        this.moves = moves;
        this.hmacGenerator = new HMACGenerator();
        this.gameLogic = new GameLogic(this.moves);
        this.helpTable = new HelpTable(this.moves);
    }

    start() {
        const computerMoveIndex = Math.floor(Math.random() * this.moves.length);
        const computerMove = this.moves[computerMoveIndex];
        const hmac = this.hmacGenerator.generateHMAC(computerMove);
        console.log('HMAC:', hmac);
        console.log('Available moves:');
        this.moves.forEach((move, index) => {
            console.log(`${index + 1} - ${move}`);
        });

        console.log('0 - exit');
        console.log('? - help');

        const readline = require('readline-sync');
        let playerInput;
        do {
            playerInput = readline.question('Enter your move: ');

            if (playerInput === '?') {
                this.helpTable.printHelpTable();
            } else if (playerInput === '0') {
                console.log('Exit');
                return;
            } else if (isNaN(playerInput) || playerInput < 1 || playerInput > this.moves.length) {
                console.log('Invalid player input:', playerInput);
                console.log('Invalid choice. Try again.');
            } else {
                const playerMove = this.moves[parseInt(playerInput) - 1];
                console.log('Your move:', playerMove);
                console.log('Computer move:', computerMove);

                const result = this.gameLogic.determineWinner(playerMove, computerMove);
                console.log(result);
                console.log('HMAC key:', this.hmacGenerator.secretKey);
                break;
            }
        } while (true);
    }
}

module.exports = Game;
