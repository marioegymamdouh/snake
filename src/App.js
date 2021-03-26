import React, {useState, useEffect} from "react";
import './App.css';


const App = () => {
    const environmentSize = 20;
    const firstSize = 19;
    const [environment, setEnvironment] = useState(() => {
        const firstEnvironment = new Array(environmentSize).fill(0).map(()=> [...new Array(environmentSize).fill(0)]);
        for (let i = 0; i < firstSize; i++) firstEnvironment[0][i] = 1;
        return firstEnvironment
    });
    const [snake, setSnake] = useState({
        body: new Array(firstSize).fill(0).map((item, index) => [0, index]),
        oldTail: false
    });
    const [direction, setDirection] = useState(39);
    const [keyClicked, setKeyClicked] = useState(false);
    const [intervalState, setIntervalState] = useState(false);
    const [isAlive, setIsAlive] = useState(true)
    const [directions, setDirections] = useState([37,38,39,40]);
    const [time, setTime] = useState(null);

    useEffect(() => {
        window.addEventListener('keydown', (e) => setKeyClicked(e));
    },[]);
    useEffect(() => {
        if (intervalState === false && isAlive) {
            const speed = (1/snake.body.length) * 1600;
            const interval = setInterval(() => {
                setTime(new Date());
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
    useEffect(() => {
        setEnvironment(oldEnv => {
            const newEnv = [...oldEnv.map(item => [...item])]
            const head = snake.body[snake.body.length - 1];
            if (snake.oldTail) newEnv[snake.oldTail[0]][snake.oldTail[1]] = 0;
            else {
                const newFood = getRandomCoordinates();
                newEnv[newFood[0]][newFood[1]] = 9;
            }
            newEnv[head[0]][head[1]] = 1;
            return newEnv;
        })
    }, [snake]);
    useEffect(() => {
        if (!isAlive) {
            clearInterval(intervalState);
            setDirections([])
        }
    }, [isAlive])
    useEffect(() => {
        time && move(direction);
    }, [time])

    const move = (direction) => {
        setSnake(oldSnake => {
            const newSnake = {
                ...oldSnake,
                body: [...oldSnake.body]
            };
            const oldHead = newSnake.body[newSnake.body.length - 1];
            newSnake.oldTail = newSnake.body[0];
            const edge = environmentSize -1;
            switch (direction) {
                case 37 :
                    if (oldHead[1] === 0) newSnake.body.push([oldHead[0], edge]);
                    else newSnake.body.push([oldHead[0], oldHead[1]-1]);
                    break;
                case 38 :
                    if (oldHead[0] === 0) newSnake.body.push([edge, oldHead[1]]);
                    else newSnake.body.push([oldHead[0]-1, oldHead[1]]);
                    break;
                case 39 :
                    if (oldHead[1] === edge) newSnake.body.push([oldHead[0], 0]);
                    else newSnake.body.push([oldHead[0], oldHead[1]+1]);
                    break;
                case 40 :
                    if (oldHead[0] === edge) newSnake.body.push([0, oldHead[1]]);
                    else newSnake.body.push([oldHead[0]+1, oldHead[1]]);
                    break;
            }
            const oldHeadInEnv = environment[newSnake.body[newSnake.body.length-1][0]][newSnake.body[newSnake.body.length-1][1]];

            if (oldHeadInEnv === 9) newSnake.oldTail = false;
            else if (
                oldHeadInEnv === 1 &&
                !(
                    newSnake.body[newSnake.body.length-1][0] === newSnake.oldTail[0] &&
                    newSnake.body[newSnake.body.length-1][1] === newSnake.oldTail[1]
                )
            ) setIsAlive(false);
            else newSnake.body.shift();

            return newSnake;
        })
    };
    const getRandomCoordinates = () => {

        let newCoordinates = [
            Math.floor(Math.random() * (environmentSize - 1)),
            Math.floor(Math.random() * (environmentSize - 1))
        ];
        const foodInSnake = snake.body.find(item => item[0] === newCoordinates[0] && item[1] === newCoordinates[1])
        if (!(foodInSnake === undefined)) newCoordinates = getRandomCoordinates();
        return newCoordinates
    };
    const styles = {
        gridTemplateColumns: `repeat(${environmentSize}, 1fr)`,
        gridTemplateRows: `repeat(${environmentSize}, 1fr)`,
    }

    return (
        <div className='container'>
            <div className='outerSpace' style={styles}>
                {environment && environment.map((dim, dimIndex) =>
                    dim.map((cell, cellIndex) => {
                        const classes = ['cell'];
                        if (cell === 1) classes.push('snake');
                        if (cell === 9) classes.push('food');
                        if (dimIndex === snake.body[0][0] && cellIndex === snake.body[0][1]) classes.push('tail')
                        if (dimIndex === snake.body[snake.body.length-1][0] && cellIndex === snake.body[snake.body.length-1][1]) classes.push('head')
                        return <div key={dimIndex + '-' + cellIndex} className={classes.join(' ')}/>
                    })
                ).flat()}

            </div>
            { !isAlive && <h2>You died noob</h2> }
            { <h3>score {snake.body.length - firstSize}</h3> }
        </div>
    )
};

export default App;