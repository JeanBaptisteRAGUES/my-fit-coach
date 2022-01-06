import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Signup from '../Signup';
import Login from '../Login';
import Landing from '../Landing';
import Schedule from '../Schedule';
import Workout from '../Workout';
import Nutrition from '../Nutrition';
import ErrorPage from '../ErrorePage';
import ExerciceMenu from '../ExerciceMenu';
import Exercice from '../Exercice';
import ExerciceForm from '../ExerciceForm';
import ExerciceUpdate from '../ExerciceUpdate';
import SessionMenu from '../SessionMenu';
import Session from '../Session';
import SessionForm from '../SessionForm';
import SessionUpdate from '../SessionUpdate';
import TrainingForm from '../TrainingForm';
import TestComponent from '../TestComponent';
import Header from '../Header';
import Profile from '../Profile';

const App = () => {
    return (
        <Router>
            <Header/>
            <Profile/>
            <Routes>
                <Route exact path="/" element={<Landing/>} />
                <Route exact path="/signup" element={<Signup/>} />
                <Route exact path="/login" element={<Login/>} />
                <Route exact path="/schedule" element={<Schedule/>} />
                <Route exact path="/workout" element={<Workout/>} />
                <Route exact path="/nutrition/:mealID" element={<Nutrition/>} />
                <Route exact path="/exercice-menu" element={<ExerciceMenu/>} />
                <Route exact path="/exercice" element={<Exercice/>} />
                <Route exact path="/exercice-form" element={<ExerciceForm/>} />
                <Route exact path="/exercice-update" element={<ExerciceUpdate/>} />
                <Route exact path="/session-menu" element={<SessionMenu/>} />
                <Route exact path="/session" element={<Session/>} />
                <Route exact path="/session-form" element={<SessionForm/>} />
                <Route exact path="/session-update" element={<SessionUpdate/>} />
                <Route exact path="/training-form" element={<TrainingForm/>} />
                <Route exact path="/test" element={<TestComponent/>} />
                <Route path="*" element={<ErrorPage/>} />
            </Routes>
        </Router>
    )
}

export default App;
