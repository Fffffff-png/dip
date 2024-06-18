export default function Comment(props){
    const username=props.username
    const comment=props.comment
    return(
        <div style={{padding:"8px 10px 8px 10px",display:"flex",flexDirection:"column",backgroundColor:"#e1e1e1",borderRadius:"5px",justifyContent:"center"}}>
            <div style={{fontWeight:"600"}}>{username}</div>
            <div style={{paddingTop:"10px", wordBreak:"break-all"}}>{comment}</div>
        </div>
    )
}