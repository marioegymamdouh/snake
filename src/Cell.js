import React from "react";

const Cell = React.memo(({cell, head, tail}) => {
    return <div
        className={
            `cell ${cell && cell === 1 && 'snake'}` +
            ` ${cell && cell === 9 && 'food'}` +
            ` ${tail && tail && 'tail'}` +
            ` ${head && head && 'head'}`}
    />
});

export default Cell;