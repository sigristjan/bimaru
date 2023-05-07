import {FieldSquare} from "./FieldSquare";
import {boardHeight, boardWidth, createEmptyBoard} from "../service/BimaruFactory";
import {range} from "../service/UtilService";
import React, {useState} from "react";
import {Field, FieldType} from "../model/Field";
import {
    everythingIsPlacedCorrectly,
    getColoredColumnCounters,
    getPlacedAmountOfShipsInColumns,
    getPlacedAmountOfShipsInRows,
    getColoredRowCounters
} from "../service/BoardService";

function getFieldStyle(currentPlacedShips: Field[][], field: Field) { //fixme arrange
    const neighbourOffsets: { xOffset: number, yOffset: number }[] = range(-1, 2).flatMap(xOffset =>
        range(-1, 2).map(yOffset => {
                return {xOffset, yOffset}
            }
        )
    ).filter(offsets => {
        const xCoordinate = field.getPosition().xCoordinate + offsets.xOffset
        const yCoordinate = field.getPosition().yCoordinate + offsets.yOffset
        return xCoordinate < boardWidth && xCoordinate >= 0 && yCoordinate < boardHeight && yCoordinate >= 0
            && ((offsets.xOffset === 0 && offsets.yOffset !== 0) || (offsets.xOffset !== 0 && offsets.yOffset === 0))
            && currentPlacedShips[xCoordinate][yCoordinate].getFieldType() === FieldType.SHIP
    })

    const hasRightNeighbour = neighbourOffsets.filter(offsets => offsets.xOffset === 1 && offsets.yOffset === 0).length !== 0
    const hasLeftNeighbour = neighbourOffsets.filter(offsets => offsets.xOffset === -1 && offsets.yOffset === 0).length !== 0
    const hasTopNeighbour = neighbourOffsets.filter(offsets => offsets.yOffset === -1).length !== 0
    const hasBottomNeighbour = neighbourOffsets.filter(offsets => offsets.yOffset === 1).length !== 0

    if (field.getFieldType() === FieldType.SHIP) {
        if ((hasRightNeighbour && hasLeftNeighbour) || (hasTopNeighbour && hasBottomNeighbour)) {
            return 'ship multi'
        } else if (hasRightNeighbour) {
            return 'ship right'
        } else if (hasLeftNeighbour) {
            return 'ship left'
        } else if (hasTopNeighbour) {
            return 'ship top'
        } else if (hasBottomNeighbour) {
            return 'ship bottom'
        } else {
            return 'ship alone'
        }
    } else if (field.getFieldType() === FieldType.WATER) {
        return 'water'
    } else {
        return 'empty'
    }
}

export function Board({solutionBoard}: { solutionBoard: Field[][] }) {

    const [userBoard, setUserBoard]: [fields: Field[][], setFields: any] = useState(createEmptyBoard(FieldType.EMPTY))

    function isTouchingCornerOfOtherShip(xCoordinateOfShip: number, yCoordinateOfShip: number): boolean {
        return range(-1, 2).flatMap(xOffset =>
            range(-1, 2).map(yOffset => {
                    return {xOffset, yOffset}
                }
            )
        ).filter(offsets => offsets.xOffset !== 0 && offsets.yOffset !== 0)
            .filter(offsets => {
                    const xCoordinate = xCoordinateOfShip + offsets.xOffset
                    const yCoordinate = yCoordinateOfShip + offsets.yOffset
                    return xCoordinate < boardWidth && xCoordinate >= 0 && yCoordinate < boardHeight && yCoordinate >= 0
                        && userBoard[xCoordinate][yCoordinate].getFieldType() === FieldType.SHIP
                }
            ).length !== 0
    }

    function handleClick(mouseEvent: React.MouseEvent, xCoordinate: number, yCoordinate: number) {
        const updatedFields = userBoard.slice()
        const fieldToClick = updatedFields[xCoordinate][yCoordinate];
        const isTouchingCorner = isTouchingCornerOfOtherShip(xCoordinate, yCoordinate)
        if (isLeftClick()) {
            fieldToClick.setNextState(isTouchingCorner)
        } else if (isRightClick()) {
            fieldToClick.setPreviousState(isTouchingCorner)
        }
        setUserBoard(updatedFields)

        function isLeftClick() {
            return mouseEvent.type === 'click';
        }

        function isRightClick() {
            return mouseEvent.type === 'contextmenu';
        }
    }

    const rowCountersOfSolution = getPlacedAmountOfShipsInRows(solutionBoard)
    const columnCountersOfSolution = getPlacedAmountOfShipsInColumns(solutionBoard)

    const rowCountersOfSolutionBoard: {
        amountOfShips: number,
        color: string
    }[] = getColoredRowCounters(rowCountersOfSolution, getPlacedAmountOfShipsInRows(userBoard))

    const columnCountersOfSolutionBoard: {
        amountOfShips: number,
        color: string
    }[] = getColoredColumnCounters(columnCountersOfSolution, getPlacedAmountOfShipsInColumns(userBoard))

    const allAreValid = everythingIsPlacedCorrectly(columnCountersOfSolutionBoard, rowCountersOfSolutionBoard)

    function getColumnCountersOfShips() {
        return range(0, boardWidth).map(xCoordinate => {
                const shipCounterOfCurrentColumn = columnCountersOfSolutionBoard[xCoordinate]
                return <div key={xCoordinate} className="height-count" style={{color: shipCounterOfCurrentColumn.color}}>
                    {shipCounterOfCurrentColumn.amountOfShips}
                </div>
            }
        );
    }

    function getEndDialog() {
        return <div className="end-dialog">
            <p>You have finished correctly :)</p>
        </div>
    }


    const allFields: JSX.Element =
        <div className="fields">
            {
                range(0, boardHeight).map(yCoordinate => {
                        const shipCounterOfCurrentRow = rowCountersOfSolutionBoard[yCoordinate];
                        return <div key={yCoordinate} className="board-row">
                            {range(0, boardWidth).map(xCoordinate => {
                                    const identifier = yCoordinate * boardWidth + xCoordinate;
                                    const fieldType = getFieldStyle(userBoard, userBoard[xCoordinate][yCoordinate])
                                    return <FieldSquare
                                        key={identifier}
                                        fieldType={fieldType}
                                        onFieldClick={(mouseEvent) => handleClick(mouseEvent, xCoordinate, yCoordinate)}
                                    />
                                }
                            )}
                            <div className="width-count" style={{color: shipCounterOfCurrentRow.color}}>
                                {shipCounterOfCurrentRow.amountOfShips}
                            </div>
                        </div>;
                    }
                )
            }
            {getColumnCountersOfShips()}
        </div>
    return (
        <>
            <div className="full-board">
                {allFields}
                {allAreValid && getEndDialog()}
            </div>
        </>
    )
}
