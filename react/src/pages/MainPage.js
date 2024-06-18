import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import HorizontalCard from "../components/HorizontalCard";
import VerticalCard from "../components/VerticalCard";
import axios from "axios";

function MainPage() {
  const [data,setData]=useState(null)
  useEffect(()=>{
    const fetchData=async ()=>{
        try{
            const response = await axios.get("http://localhost:5000/api/catalog?order=0")
            setData(response.data)
            
            console.log(response.data)
        }catch(error) {
            console.error(error)
        }
    }
    fetchData()
  },[])
  return (
    <React.Fragment>
      <div className="full-screen">
        <div className="width-full" style={{marginTop:".375rem"}}>
          <Carousel>
            {data?
            data.slice(0,20).map(item =>(
                <VerticalCard
                title={item["name_Rus"]}
                type={item["type"]}
                imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                dir={item['dir']}
                rate={item["rating"]}
                grid={false}
                />
            ))
            :<div></div>}
          </Carousel>
        </div>
        <div className="width-full page-main">
          <div className="width-full page-main">
            <div className="page-main-container">
                <div className="page-main-container-text">
                    <h1>Горячие новинки</h1>
                </div>
                <Carousel>
                {data?
                  data.reverse().slice(0,20).map(item =>(
                      <VerticalCard
                      title={item["name_Rus"]}
                      type={item["type"]}
                      imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                      dir={item['dir']}
                      rate={item["rating"]}
                      grid={false}
                      />
                  ))
                  :<div></div>}
                </Carousel>
            </div>
            <div className="page-main-container scroll" style={{maxWidth:"1100px",backgroundColor:"var(--bg-secondary)"}}>
              <div className="page-main-vert-container scroll" style={{}}>
                <div className="column">
                  <h1>
                    Популярное сегодня
                  </h1>
                  <div>
                  {data?
                    data.slice(0,5).map(item =>(
                      <HorizontalCard
                      imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                      name={item["name_Rus"]}
                      type={item['year']}
                      dir={item['dir']}/>
                    ))
                    :<div></div>}
                  </div>
                </div>
                <div className="column">
                  <h1>
                    Популярно в этом месяце
                  </h1>
                  <div>
                    {data?
                    data.reverse().slice(0,5).map(item =>(
                      <HorizontalCard
                      imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                      name={item["name_Rus"]}
                      type={item['year']}
                      dir={item['dir']}/>
                    ))
                    :<div></div>}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="page-main-container">
              <div className="page-main-container-text" style={{alignItems:"center"}}>
                <h1>Последние обновления</h1>
                <a href="">больше</a>
              </div>
              <div className="page-main-vert-container">
                <div className="column" style={{width:"100%"}}>
                  {data?
                  data.slice(0,5).map(item =>(
                    <HorizontalCard
                    imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                    name={item["name_Rus"]}
                    type={"1 том 25 глава"}
                    dir={""}/>
                  ))
                  :<div></div>}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MainPage;
