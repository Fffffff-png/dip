import { useState } from "react";
import MainPage from "./pages/MainPage";
import NotificationPage from "./pages/NotificationPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import Layout from "./components/Layout";
import CatalogPage from "./pages/CatalogPage";
import NewTitlePage from "./pages/NewTitlePage";
import { AuthProvider } from "./AuthProvider";
import TitlePage from "./pages/TitlePage";
import ReadPage from "./pages/ReadPage";
import BookmarksPage from "./pages/BookmarksPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="" element={<MainPage/>}/>
            <Route path="notifications" element={<NotificationPage/>}/>
            <Route path="search" element={<SearchPage/>}/>
            <Route path="catalog" element={<CatalogPage/>}/>
            <Route path="new-title" element={<NewTitlePage/>}/>
            <Route path="title/:dir" element={<TitlePage/>}/>
            <Route path="bookmarks" element={<BookmarksPage/>}/>  
          </Route>
          <Route path="/title/:dir/:chapter_id" element={<ReadPage/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
