import React from "react";

const Cell = React.memo(({index, cell, head, tail}) => {
    return <div
        key={index}
        className={
            `cell ${cell === 1 && 'snake'}` +
            ` ${cell === 9 && 'food'}` +
            ` ${tail && 'tail'}` +
            ` ${head && 'head'}`}
    />
});

export default Cell;