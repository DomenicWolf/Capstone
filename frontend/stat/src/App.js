import logo from './logo.svg';
import './App.css';

import {Routes,BrowserRouter,Route} from 'react-router-dom'
import NavBar from './NavBar';
import LolHome from './LolHome';
import { useState } from 'react';
import LolPlayerPage from './LolPlayerPage';
import Test from './Test';
import { useLocation } from 'react-router-dom';
import Home from './Home';
import RiotTxtContent from './RiotTxtFile';




function App() {
   



  return (
    <div className="">
      <BrowserRouter>
        <NavBar ></NavBar>
        <main>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/lol-home' element={<LolHome/>}/>
            <Route path='/lol-player-page' element={<LolPlayerPage/>}/>
            <Route path="/%2F%2Friot.txt" element={<RiotTxtContent></RiotTxtContent>}/>
            <Route path='/test' element={<Test></Test>}/>
          </Routes>
        </main>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
