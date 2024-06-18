import NotificationItem from "../components/NotificationItem";
export default function NotificationPage(){
    return(
            <div className="page-main-container" style={{minHeight:"100vh"}}>
                <h1 style={{paddingLeft:"1rem",margin:"0",paddingBottom:"2rem"}}>Уведомления</h1>
                <div>
                    <NotificationItem image={"http://localhost:5000/media/c035fe4a-f78a-48d2-ada8-0d769454fe16.jpg"} date={"03-06-2024"} chapter={9} tom={9} titleName={"Жнец дрейфующей Луны"}/>
                    <NotificationItem image={"http://localhost:5000/media/c035fe4a-f78a-48d2-ada8-0d769454fe16.jpg"} date={"03-06-2024"} chapter={8} tom={8} titleName={"Жнец дрейфующей Луны"}/>
                    <NotificationItem image={"http://localhost:5000/media/c035fe4a-f78a-48d2-ada8-0d769454fe16.jpg"} date={"03-06-2024"} chapter={7} tom={7} titleName={"Жнец дрейфующей Луны"}/>
                    <NotificationItem image={"http://localhost:5000/media/c035fe4a-f78a-48d2-ada8-0d769454fe16.jpg"} date={"03-06-2024"} chapter={6} tom={6} titleName={"Жнец дрейфующей Луны"}/>
                    <NotificationItem image={"http://localhost:5000/media/c035fe4a-f78a-48d2-ada8-0d769454fe16.jpg"} date={"03-06-2024"} chapter={5} tom={5} titleName={"Жнец дрейфующей Луны"}/>
                </div>
            </div>
    )
}