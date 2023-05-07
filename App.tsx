import React from 'react';
import './App.css';
import {Board} from "./component/Board";
import {createEmptyBoard} from "./service/BimaruFactory";
import {placeShips} from "./service/BoardService";
import {FieldType} from "./model/Field";

function App() {
    const solutionBoard = placeShips(createEmptyBoard(FieldType.WATER))
    return (
        <div className="App">
            <h1>Bimaru</h1>
            <div className="board">
                <Board solutionBoard={solutionBoard}/>
            </div>
        </div>
    );
}

export default App;
