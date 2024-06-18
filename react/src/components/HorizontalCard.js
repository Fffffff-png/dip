import { Link } from "react-router-dom"

export default function HorizontalCard(props){
    const imgSrc=props.imgSrc
    const name=props.name
    const type=props.type
    const dir=props.dir
    return(
        <Link to={`title/${dir}`} style={{marginBottom:"4px",padding:"3px 8px 3px 3px",display:"flex", alignItems:"center"}}>
            <div className="image-container" style={{width:"72px",minWidth:"72px"}}>
                <div className="Image" style={{backgroundImage:`url(${imgSrc})`}}></div>
            </div>
            <div style={{marginLeft:"16px"}}>
                <h1 className="card-text-name" style={{fontSize: ".9rem"}}>{name}</h1> 
                <h1 className="card-text-type" style={{fontSize: ".9rem"}}>{type}</h1> 
            </div>
        </Link>
    )
}