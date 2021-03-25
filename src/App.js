import React, {useState, useEffect} from "react";
import './App.css';

const App = () => {
    const environmentSize = 20;
    const firstSize = 4;
    const [environment, setEnvironment] = useState([]);
    const [snake, setSnake] = useState([]);
    const [direction, setDirection] = useState(39);
    const [keyClicked, setKeyClicked] = useState(false);
    const [intervalState, setIntervalState] = useState(false);
    const [food, setFood] = useState(false);
    const directions = [37,38,39,40]

    useEffect(() => {
        const firstEnvironment = new Array(environmentSize).fill(0).map(()=> [...new Array(environmentSize).fill(0)]);
        const firstSnake = new Array(firstSize).fill(0).map((item, index) => [0, index]);
        const firstFood = [getRandomInt(0, environmentSize-1), getRandomInt(0, environmentSize-1)];
        setEnvironment(firstEnvironment);
        setSnake(firstSnake)
        setFood(firstSnake);

        window.addEventListener('keydown', (e) => setKeyClicked(e));
    },[]);
    useEffect(() => {
        if (intervalState === false) {
            const speed = snake.length === 0 ? 400 : (1/snake.length) * 1600;
            const interval = setInterval(() => {
                move(direction);
            }, speed);
            setIntervalState(interval)
        }
    }, [direction])
    useEffect(() => {
        const keyCode = keyClicked.keyCode;
        if (keyClicked && directions.includes(keyCode)) {
            if (Math.abs(keyCode - direction) !== 2 && keyCode !== direction) {
                move(keyCode);
                setIntervalState(false);
                clearInterval(intervalState);
                setDirection(keyCode);
            }
        }
    }, [keyClicked]);

    const move = (direction) => {
        setSnake(oldSnake => {
            const newSnake = [...oldSnake];
            const oldHead = newSnake[newSnake.length - 1];
            const edge = environmentSize -1;
            newSnake.shift();
            switch (direction) {
                case 37 :
                    if (oldHead[1] === 0) newSnake.push([oldHead[0], edge]);
                    else newSnake.push([oldHead[0], oldHead[1]-1]);
                    break;
                case 38 :
                    if (oldHead[0] === 0) newSnake.push([edge, oldHead[1]]);
                    else newSnake.push([oldHead[0]-1, oldHead[1]]);
                    break;
                case 39 :
                    if (oldHead[1] === edge) newSnake.push([oldHead[0], 0]);
                    else newSnake.push([oldHead[0], oldHead[1]+1]);
                    break;
                case 40 :
                    if (oldHead[0] === edge) newSnake.push([0, oldHead[1]]);
                    else newSnake.push([oldHead[0]+1, oldHead[1]]);
                    break;
            }
            return newSnake;
        })
    };
    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const body = environment.map((dim, dimIndex) =>
        dim.map((cell, cellIndex) =>
            <div key={dimIndex + '-' + cellIndex} className='cell'/>)
    );

    snake.forEach((node) => {
        body[node[0]][node[1]] = <div key={node[0] + '-' + node[1]} className='cell snake'/>
    })

    food && bo


    return (
        <div className='container'>
            <div className='outerSpace'>
                {body.flat()}
            </div>
        </div>
    )
};

export default App;