import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from '../Signup';
import Login from '../Login';
import Landing from '../Landing';
import Schedule from '../Schedule';
import Workout from '../Workout';
import Nutrition from '../Nutrition';
import ErrorPage from '../ErrorePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Landing/>} />
                <Route exact path="/signup" element={<Signup/>} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/schedule" element={<Schedule/>} />
                <Route exact path="/workout" element={<Workout/>} />
                <Route exact path="/nutrition/:mealID" element={<Nutrition/>} />
                <Route path="*" element={<ErrorPage/>} />
            </Routes>
        </Router>
    )
}

export default App;
