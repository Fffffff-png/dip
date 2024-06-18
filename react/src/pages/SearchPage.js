import React, { useCallback, useEffect, useState } from "react";
import IconSearch from "../components/icons/IconSearch";
import "./SearchPage.css"
import VerticalCard from "../components/VerticalCard";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {debounce} from "lodash"

export default function SearchPage(){
    const [query,setQuery]=useState('')
    const [data,setData]=useState()
    const navigate=useNavigate()
    const location=useLocation()

    const getQuery=()=>{
        const searchParams = new URLSearchParams(location.search)
        setQuery(searchParams.get("query" || ""))
    }

    useEffect(()=>{
        getQuery()
    },[location.search])

    const fetchData=useCallback(
        debounce(async (query)=>{
            try {
                if(!query){
                    setData([])
                } else{
                    const responce =await axios.get("http://localhost:5000/api/search?query="+query)
                    setData(responce.data)
                }
            } catch (error) {
                console.error(error)
            }
        },500),
        []
    )

    useEffect(()=>{
        fetchData(query)
    },[query,fetchData])

    const inputHandleChange=(e)=>{
        const newQuery=e.target.value
        setQuery(newQuery)
        const searchParams = new URLSearchParams(location.search)
        searchParams.set("query",newQuery)
        navigate({
            pathname:location.pathname,
            search:searchParams.toString()
        })
    }
    return(
            <div className="page-main-container" style={{minHeight:"100vh",marginTop:"0"}}>
                <div className="SearchInput" style={{boxSizing:"border-box",padding:"0 10px"}}>
                    <div className="SearchConteiner">
                        <IconSearch style={{marginRight:"6px",cursor:"pointer",fonySize:"1.5rem"}}/>
                        <input value={query}  onChange={inputHandleChange}/>
                    </div>
                </div>
                <div className="GridGridContainer">
                    <div className="GridGrid">
                    {data?
                    data.map(item =>(
                        <VerticalCard
                        title={item["name_Rus"]}
                        type={item["type"]}
                        imgSrc={`http://localhost:5000/media/${item["cover"]}`}
                        dir={item["dir"]}
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
    )
}