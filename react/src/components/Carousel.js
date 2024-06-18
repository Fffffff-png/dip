import React from "react";

export default function Carousel(props){
    return(
        <React.Fragment>
            <div className="carousel-container">
                <div className="carousel-carousel" style={{gap: "6px"}}>
                    {props.children}
                </div>
            </div>
        </React.Fragment>
    )
}