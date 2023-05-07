import React from "react";

export function FieldSquare({fieldType, onFieldClick}: {fieldType: string, onFieldClick: (event: React.MouseEvent) => void}) {
    function getOnClick() {
        return function (event: React.MouseEvent) {
            event.preventDefault()
            onFieldClick(event)
        };
    }

    return (
        <button onContextMenu={getOnClick()} onClick={getOnClick()} className={fieldType+ " field"}><div></div></button>
    )
}