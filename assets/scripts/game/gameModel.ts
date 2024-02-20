import { EventTarget } from "cc";
import { EGameModelEvents } from "./types/eGameModeEvents";

/**
 * Events:
 * onChangeScore (newScore, oldScore)
 * onChangeMoves (newMoves, oldMoves)
 * OnMovesOver ()
 */
export class GameModel extends EventTarget {
    public get targetScore(): number { return this.targetScoreInternal; }

    public get currentScore(): number { return this.currentScoreInternal; }
    public set currentScore(value: number) {
        this.emit(EGameModelEvents.OnChangeScore, value, this.currentScoreInternal);
        this.currentScoreInternal = value;

        if (this.currentScoreInternal >= this.targetScore) {
            this.emit(EGameModelEvents.OnScoreGot);
        }
    }

    public get movesLeft(): number { return this.movesLeftInternal; }
    public set movesLeft(value: number) {
        value = Math.max(value, 0);
        this.emit(EGameModelEvents.OnChangeMoves, value, this.movesLeftInternal);
        this.movesLeftInternal = value;

        if (this.movesLeft <= 0) {
            this.emit(EGameModelEvents.OnMovesOver);
        }
    }

    private currentScoreInternal: number = 0;
    private movesLeftInternal: number = 10;

    constructor(
        private readonly targetScoreInternal: number = 10,
        moves: number,
    ) {
        super();
        this.movesLeftInternal = Math.max(moves, 1);
    }
}