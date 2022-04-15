import React from "react";

export default function Loader(props) {
    return (
        <div className={"loader-forms " + (props.loading ? "active" : "")}>
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

