import React, {FC} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useLocation, useParams} from "react-router-dom";
import Main from "./components/Main";

const App: FC = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/:id'} element={<Main/>}/>
          <Route path={'*'} element={<Navigate to={`f${(+new Date).toString(16)}`}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
