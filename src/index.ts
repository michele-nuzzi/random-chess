import { BLACK, Chess, Move, WHITE } from "chess.js"
import { createInterface } from "readline/promises";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

const prompt = readline.question.bind( readline );

void async function main() {
    const chess = new Chess();

    let tmp = await prompt("which player are you? (b | w)");
    tmp = tmp[0].toLowerCase();

    const alternatePeriod = 3;
    const fullCycle = alternatePeriod * 2;
    let turnNo = 0;

    function isFreeMove(): boolean
    {
        return turnNo % fullCycle < alternatePeriod;
    }

    const playerColor = tmp === BLACK ? BLACK : WHITE;

    while (!chess.isGameOver()) {
        if( chess.turn() === playerColor )
        {
            if( isFreeMove() )
            {
                tmp = await prompt("insert your FREE move: ");
                let move: Move;
                try {
                    move = chess.move( tmp );
                }
                catch {
                    console.log(
                        "\n" +
                        "Invalid move;" +
                        "\nif you are using SAN notation remember it is case sensitive;"+ 
                        "\nplease retry..." +
                        "\n"
                    );
                    continue;
                }
                console.log( chess.ascii(), "\n" );
            }
            else
            {
                const moves = chess.moves()
                const moveStr = moves[Math.floor(Math.random() * moves.length)]
                const move = chess.move( moveStr );
                console.log(
                    "\nYou get a random move:",
                    JSON.stringify(
                        {
                            from: move.from,
                            to: move.to,
                            san: move.san,
                        },
                        undefined,
                        2
                    ),
                    "\n",
                    chess.ascii(), "\n"
                );
            }
            turnNo++;
        }
        else // opponent turn
        {
            tmp = await prompt("insert opponent move: ");
            let move: Move;
            try {
                move = chess.move( tmp )
            }
            catch {
                console.log(
                    "\n" +
                    "Invalid move;" +
                    "\nif you are using SAN notation remember it is case sensitive;"+ 
                    "\nplease retry..." +
                    "\n"
                );
                continue;
            }
        }
    }
}();

function formatMove( str: string ): string
{
    return str
    .replace("n", "N")
    .replace("r", "R")
    .replace("b", "B")
    .replace("k", "K")
    .replace("q", "Q");
}