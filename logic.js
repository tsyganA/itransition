class GameLogic {
    constructor(moves) {
        this.moves = moves;
    }

    determineWinner(playerMove, computerMove) {
        const playerIndex = this.moves.indexOf(playerMove);
        const computerIndex = this.moves.indexOf(computerMove);
        const half = Math.floor(this.moves.length / 2);

        if (playerIndex === computerIndex) {
            return 'Draw';
        } else if (
            (computerIndex > playerIndex && computerIndex - playerIndex <= half) ||
            (playerIndex > computerIndex && playerIndex - computerIndex > half)
        ) {
            return 'Computer wins';
        } else {
            return 'Player wins';
        }
    }
}

module.exports = GameLogic;
