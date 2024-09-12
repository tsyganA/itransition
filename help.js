const Table = require('cli-table3');

class HelpTable {
    constructor(moves) {
        this.moves = moves;
    }

    printHelpTable() {
        console.log('Generating help table...');
        const table = new Table({
            head: ['', ...this.moves],
        });

        this.moves.forEach((move, i) => {
            const row = [move];
            this.moves.forEach((opponentMove, j) => {
                const half = Math.floor(this.moves.length / 2);
                if (i === j) {
                    row.push('Draw');
                } else if ((j > i && j - i <= half) || (i > j && i - j > half)) {
                    row.push('Win');
                } else {
                    row.push('Lose');
                }
            });
            table.push(row);
        });

        console.log(table.toString());
    }
}

module.exports = HelpTable;
