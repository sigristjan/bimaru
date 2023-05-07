import {Position} from "./Position";

export enum FieldType {
    EMPTY,
    WATER,
    SHIP
}

export class Field  {
    private readonly position: Position;
    private fieldType: FieldType;

    getPosition(): Position {
        return this.position;
    }
    getFieldType(): FieldType {
        return this.fieldType;
    }

    constructor(fieldType: FieldType, position: Position) {
        this.fieldType = fieldType;
        this.position = position
    }

    setNextState(isTouchingCorner: boolean) {
        switch (this.fieldType) {
            case FieldType.EMPTY:
                this.fieldType = FieldType.WATER
                break;
            case FieldType.WATER:
                if (!isTouchingCorner) {
                    this.fieldType = FieldType.SHIP
                } else this.fieldType = FieldType.EMPTY
                break;
            case FieldType.SHIP:
                this.fieldType = FieldType.EMPTY
                break;
        }
    }

    setPreviousState(isTouchingCorner: boolean) {
        switch (this.fieldType) {
            case FieldType.EMPTY:
                if (!isTouchingCorner) {
                    this.fieldType = FieldType.SHIP
                } else this.fieldType = FieldType.WATER
                break;
            case FieldType.WATER:
                this.fieldType = FieldType.EMPTY
                break;
            case FieldType.SHIP:
                this.fieldType = FieldType.WATER
                break;
        }
    }
}

