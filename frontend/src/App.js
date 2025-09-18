import './App.css';
import AddInterview from './Pages/AddInterview';
import AllInterviews from './Pages/AllInterviews';
import CheckUser from './Pages/CheckUser';
import CreateUser from './Pages/CreateUser';
import Home from './Pages/Home';
import { Routes, Route } from 'react-router-dom';
import Logs from './Pages/Logs';
import Interview from './Pages/Interview';
function App() {
  return (
    <div className="mx-auto max-w-[1260px] flex justify-evenly mt-24">
            <Routes>
             <Route path = '/' element = {<Home/>}> </Route>
             <Route path = '/interviewer/form' element = {<CreateUser/>}> </Route>
             <Route path = '/check/User' element = {<CheckUser/>}> </Route>
             <Route path = '/allInterviews/:userid' element = {<AllInterviews/>}> </Route>
             <Route path = '/send-invite/:userid' element = {<AddInterview/>}> </Route>
             <Route path = '/logs/:interviewid' element = {<Logs/>}> </Route>
             <Route path = '/interview/enter/:interviewid' element = {<Interview/>}> </Route>
             {/* <Route path = '/student/enter' element = {<Student/>}> </Route>
             <Route path = '/teacher/enter' element = {<Teacher/>}> </Route>
             <Route path = '/teacher/createpoll/:userId' element = {<CreatePoll/>}> </Route>
             <Route path = '/student/activepoll/:userId' element = {<ActivePoll/>}> </Route>
             <Route path = '/student/exit/:userId' element = {<ExitStudent/>}> </Route> */}
      </Routes>
    </div>
  );
}

export default App;
