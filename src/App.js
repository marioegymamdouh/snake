import React, {useState, useEffect} from "react";
import './App.css';
import Cell from "./Cell";

const environmentSize = 100;
const firstSize = 50;
const firstFood = Math.floor( Math.random() * ( ( environmentSize * environmentSize ) - firstSize ) + firstSize );
const body = new Array(environmentSize * environmentSize).fill(0).map((item, index) =>
        <Cell
            cell={index < firstSize ? 1 : 0}
            key={index}
            head={index === (firstSize - 1)}
            tail={index === 0}
        />
    )
const App = () => {
    const directions = [37,38,39,40];
    const [food, setFood] = useState({
        old: false,
        new: firstFood
    });
    const [environment, setEnvironment] = useState(() => {
        const firstEnvironment = new Array(environmentSize * environmentSize).fill(0);
        for (let i = 0; i < firstSize; i++) firstEnvironment[i] = 1;
        firstEnvironment[firstFood] = 9;
        return firstEnvironment
    });
    const [snake, setSnake] = useState(Array.from(Array(firstSize).keys()));
    const [direction, setDirection] = useState(39);
    const [oldTail, setOldTail] = useState();
    const [clickEvent, setClickEvent] = useState(false);
    const [intervalState, setIntervalState] = useState(false);
    const [isAlive, setIsAlive] = useState(true)
    const [time, setTime] = useState(null);

    useEffect(() => {
        window.addEventListener('keydown', (e) => setClickEvent(e));
    },[]);
    useEffect(() => {
        const speed = (1/snake.length) * 1600;
        const interval = setInterval(() => {
            setTime(new Date());
        }, speed);
        setIntervalState(interval)
    }, [direction]);
    useEffect(() => {
        const keyCode = clickEvent.keyCode;
        if (clickEvent && directions.includes(keyCode)) {
            if (Math.abs(keyCode - direction) !== 2 && keyCode !== direction) {
                move(keyCode);
                setIntervalState(false);
                clearInterval(intervalState);
                setDirection(keyCode);
            }
        }
    }, [clickEvent]);
    useEffect(() => {
        time && move(direction);
    }, [time])
    useEffect(() => {
        body[food.new] = <Cell
            cell={9}
            key={food.new}
        />;
        if (food.old) body[food.old] = <Cell
            cell={0}
            key={food.new}
        />;
    }, [food])

    const move = (direction) => {
        isAlive && setSnake(oldSnake => {
            const newSnake = [...oldSnake];
            const oldHead = newSnake[newSnake.length - 1];

            switch (direction) {
                case 37 :
                    if (isEdge(oldHead, 0)) newSnake.push(oldHead - 1  + environmentSize);
                    else newSnake.push(oldHead - 1);
                    break;
                case 38 :
                    if (isEdge(oldHead, 1)) newSnake.push(oldHead + (environmentSize * (environmentSize - 1)));
                    else newSnake.push(oldHead - environmentSize);
                    break;
                case 39 :
                    if (isEdge(oldHead, 2)) newSnake.push(oldHead + 1 - environmentSize);
                    else newSnake.push(oldHead + 1);
                    break;
                case 40 :
                    if (isEdge(oldHead, 3)) newSnake.push(oldHead - (environmentSize * (environmentSize - 1)));
                    else newSnake.push(oldHead + environmentSize);
                    break;
            }

            setEnvironment(oldEnv => {
                const newEnv = [...oldEnv]
                const head = newSnake[newSnake.length - 1];

                if (newEnv[head] === 9) {
                    const newFood = getRandomCoordinates()
                    newEnv[newFood] = 9;
                    setFood(oldState => ({
                        new: newFood,
                        old: oldState.new
                    }))
                } else {
                    newEnv[oldSnake[0]] = 0;
                    setOldTail(newSnake.shift());
                }

                if (newEnv[head] === 1 && (head !== oldSnake[0])) {
                    clearInterval(intervalState)
                    setIsAlive(false);
                }

                newEnv[head] = 1;

                return newEnv;
            })

            return newSnake;
        })
    };
    const isEdge = (cellId ,edgeId) => {
        switch (edgeId) {
            case 0: return cellId % environmentSize === 0
            case 1: return cellId < environmentSize
            case 2: return cellId % environmentSize === (environmentSize - 1)
            case 3: return cellId >= (environmentSize * (environmentSize - 1))
        }
    };

    const getRandomCoordinates = () => {
        let newCoordinates = Math.floor(Math.random() * (environmentSize*environmentSize));
        const foodInSnake = environment[newCoordinates];
        if (foodInSnake === 1) newCoordinates = getRandomCoordinates();
        return newCoordinates
    };
    const styles = {
        gridTemplateColumns: `repeat(${environmentSize}, 1fr)`,
        gridTemplateRows: `repeat(${environmentSize}, 1fr)`,
    }


    if (oldTail || oldTail === 0) body[oldTail] = <Cell
        cell={0}
        key={oldTail}
    />;
    body[snake[0]] = <Cell
        cell={1}
        key={snake[0]}
        tail={true}
    />;
    body[snake[snake.length - 1]] = <Cell
        cell={1}
        key={snake[snake.length - 1]}
        head={true}
    />;
    body[snake[snake.length - 2]] = <Cell
        cell={1}
        key={snake[snake.length - 2]}
        head={false}
    />;

    return (
        <div className='container'>
            <div className='outerSpace' style={styles}>
                {environment && body}
            </div>
            { !isAlive && <h2>You died noob</h2> }
            { <h3>score {snake.length - firstSize}</h3> }
        </div>
    )
};

export default App;