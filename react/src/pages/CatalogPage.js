import React, { useEffect, useState } from "react";
import VerticalCard from "../components/VerticalCard";
import "./CatalogPage.css"
import IconArrowDropDownLine from "../components/icons/IconDropDown";
import Filter from "../components/Filter";
import Select from "react-select"
import getStyle from "../components/ReactSelectStyle";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const order=[
    {value:"0",label:"По популярности"},
    {value:"1",label:"По дате добавления"},
    {value:"2",label:"По дате обновления"},
]
export default function CatalogPage(){
    const navigate=useNavigate()
    const location=useLocation()
    const [selectOrder,setSelectOrder]=useState()
    const getOrderDefault=()=>{
        const searchParams = new URLSearchParams(location.search)
        let param=searchParams.get("order")
        setSelectOrder(order[param!=null?param:0])
    }
    const [data,setData]=useState(null)
    const style=getStyle()
    const selectHandleChange=(e)=>{
        console.log(selectOrder)
        const searchParams = new URLSearchParams(location.search)
        searchParams.delete("order",selectOrder)
        searchParams.set("order",e.value)
        navigate({
            pathname:location.pathname,
            search:searchParams.toString()
        })
        setSelectOrder(order[e.value])
    }
    useEffect(()=>{
        getOrderDefault()
    },[])
    useEffect(()=>{
        const searchParams = new URLSearchParams(location.search)
        const fetchData=async ()=>{
            try{
                const response = await axios.get("http://localhost:5000/api/catalog?"+searchParams.toString())
                setData(response.data)
                
            }catch(error) {
                console.error(error)
            }
        }
        fetchData()
    },[location.search])
    return(
        <React.Fragment>
            <div className="page-main-container" style={{minHeight:"100vh"}}>
                <h1 style={{paddingLeft:"1rem",margin:"0",paddingBottom:"2rem"}}>Каталог</h1>
                <div style={{display:"flex",width:"100%"}}>
                    <div style={{flex:"1"}}>
                        <div style={{padding:"0 16px",width:"200px"}}>
                            <Select
                            value={selectOrder}
                            isSearchable={false}
                            options={order}
                            styles={style}
                            onChange={(e)=>{selectHandleChange(e)}}
                            />
                        </div>
                        <div className="GridGridContainer">
                            <div className="GridGrid">
                                {data?
                                data.map(item =>(
                                    <VerticalCard
                                    key={item["id"]}
                                    title={item["name_Rus"]}
                                    type={item["type"]}
                                    imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                                    dir={item['dir']}
                                    rate={item["rating"]}
                                    grid={true}
                                    />
                                ))
                                :<div></div>}
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                                <div className="GridItemPlaceholder"/>
                            </div>
                        </div>
                    </div>
                    <div className="CatalogFilters">
                        <Filter/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}