import React from "react";

export default function Footer(){
    return(
        <React.Fragment>
            <footer>
                <div className="page-main-container" style={{margin: 0}}>
                    <div className="page-main-vert-container footer" style={{justifyContent: "center",textAlign: "center"}}>
                        <div className="column">
                            <h1 className="card-text-name">
                                ReComics
                            </h1>
                            <h1 className="card-text-type" style={{fontSize: ".9rem",paddingTop: "1rem"}}>
                                recomics.ru © 2024
                            </h1>
                        </div>
                        <div className="column">
                            <h1 className="card-text-name">
                                Почта для связи
                            </h1>
                            <h1 className="card-text-type" style={{fontSize: ".9rem",paddingTop: "1rem"}}>
                                contact@recomics.ru
                            </h1>
                        </div>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    )
}