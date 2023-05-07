import {Position} from "../model/Position";
import {Field, FieldType} from "../model/Field";
import {range} from "./UtilService";

export const boardHeight: number = 10
export const boardWidth: number = 10

export const createEmptyBoard: (defaultType: FieldType) => Field[][] = (defaultType) => {
    return range(0, boardWidth).map(xCoordinate => {
            return range(0, boardHeight).map(yCoordinate => {
                    const position = new Position(xCoordinate, yCoordinate);
                    return new Field(defaultType, position);
                }
            )
        }
    )
}