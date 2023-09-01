import logo from './logo.svg';
import './App.css';

import {Routes,BrowserRouter,Route} from 'react-router-dom'
import NavBar from './NavBar';
import Home from './Home';
import { useState } from 'react';
import LolPlayerPage from './LolPlayerPage';
import Test from './Test';
import { useLocation } from 'react-router-dom';





function App() {
   



  return (
    <div className="">
      <BrowserRouter>
        <NavBar ></NavBar>
        <main>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/lol' element={<LolPlayerPage/>}/>
           
            <Route path='/test' element={<Test></Test>}/>
          </Routes>
        </main>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
