import {Position} from "../model/Position";
import {Field, FieldType} from "../model/Field";
import {range} from "./UtilService";
import {boardHeight, boardWidth} from "./BimaruFactory";

export const placeShips = (board: Field[][]): Field[][] => {
    const boardToChange = board;
    placeShip(4, boardToChange);
    placeShip(3, boardToChange);
    placeShip(3, boardToChange);
    placeShip(2, boardToChange);
    placeShip(2, boardToChange);
    placeShip(1, boardToChange);
    placeShip(1, boardToChange);
    placeShip(1, boardToChange);

    return boardToChange;
}

function randomPosition(positionsToPlace: Position[]): Position {
    const max = positionsToPlace.length - 1
    const random = Math.random()
    return positionsToPlace[Math.floor(random * max)]
}

function placeShip(shipLength: number, board: Field[][]): boolean {
    const possiblePositions = board.flat().filter(field => field.getFieldType() === FieldType.WATER).map(water => water.getPosition());
    let canPlace = false;

    while (!canPlace) { //fixme ohne while und const für canplace
        const isHorizontal = Math.random() < 0.5;
        const positionsToPlace: Position[] = possiblePositions.filter(
            pos => !(isHorizontal && pos.xCoordinate > boardWidth - shipLength) && !(!isHorizontal && pos.yCoordinate > boardHeight - shipLength)
        );
        const position: Position = randomPosition(positionsToPlace);

        if (position) {
            const index = possiblePositions.indexOf(position);
            possiblePositions.splice(index, 1);

            canPlace = canPlaceShip(shipLength, isHorizontal, position.xCoordinate, position.yCoordinate, board);

            if (!canPlace) {
                canPlace = canPlaceShip(shipLength, !isHorizontal, position.xCoordinate, position.yCoordinate, board);
            } else if (canPlace) {
                range(0, shipLength).forEach(function (i) {
                    const x = position.xCoordinate + (isHorizontal ? i : 0);
                    const y = position.yCoordinate + (!isHorizontal ? i : 0);
                    board[x][y] = new Field(FieldType.SHIP, new Position(x, y));
                })
            } else if (possiblePositions.length === 0) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
}

function canPlaceShip(shipLength: number, isHorizontal: boolean, startX: number, startY: number, board: Field[][]): boolean {
    return Array.from({length: shipLength + 2}, (_, i) => i - 1)
        .flatMap(i => Array.from({length: 3}, (_, j) => j - 1).map(j => {
            const x = isHorizontal ? startX + i : startX + j;
            const y = isHorizontal ? startY + j : startY + i;
            return board[x]?.[y];
        }))
        .filter(field => typeof field !== 'undefined' && field.getFieldType() === FieldType.SHIP)
        .length === 0;
}


export function getPlacedAmountOfShipsInRows(userBoard: Field[][]): number[] {
    return range(0, boardHeight).flatMap(y => {
        return range(0, boardWidth).map(x => {
                return userBoard[x][y].getFieldType() === FieldType.SHIP
            }
        ).filter(isShip => isShip).length
    })
}

export function getPlacedAmountOfShipsInColumns(userBoard: Field[][]): number[] {
    return range(0, boardWidth).flatMap(x => {
        return range(0, boardHeight).map(y => {
                return userBoard[x][y].getFieldType() === FieldType.SHIP
            }
        ).filter(isShip => isShip).length
    })
}

export function getColoredRowCounters(rowCountersOfSolution: number[], currentPlacedAmountOfShipsInRow: number[]) {
    return range(0, boardHeight).map(row => {
            return getCounterFromIndex(rowCountersOfSolution[row], currentPlacedAmountOfShipsInRow[row])
        }
    );
}

export function getColoredColumnCounters(columnCountersOfSolution: number[], currentPlacedAmountOfShipsInColumn: number[]) {
    return range(0, boardWidth).map(column => {
            return getCounterFromIndex(columnCountersOfSolution[column], currentPlacedAmountOfShipsInColumn[column])
        }
    );
}

export function getCounterFromIndex(amountOfShips: number, userPlacedShips: number) {
    return {
        amountOfShips: amountOfShips,
        color: userPlacedShips === amountOfShips ? 'black' : 'red'
    }
}

export function everythingIsPlacedCorrectly(heightCountersOfSolutionBoard: {
    amountOfShips: number;
    color: string
}[], widthCountersOfSolutionBoard: {
    amountOfShips: number;
    color: string
}[]) {
    return heightCountersOfSolutionBoard.filter(counter => counter.color === 'red').length === 0
        && widthCountersOfSolutionBoard.filter(counter => counter.color === 'red').length === 0;
}
