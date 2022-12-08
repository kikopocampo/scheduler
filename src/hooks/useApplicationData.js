import {useState, useEffect} from "react";
import axios from 'axios';


export const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      setState(prev => ({...prev, days:all[0].data, appointments:all[1].data, interviewers:all[2].data}))
    })
    
  }, [])
  
  const getRemainingSpots = (appId,state) => {
    const getDaySelected = state.days.find(d => {
      return d.appointments.find(app => app === appId)
    })
    const slots = getDaySelected.appointments.filter(slot => !state.appointments[slot].interview)
    return {dayPosition: getDaySelected.id - 1, daySlots:slots.length};
  };

  const setDay = day => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newState = {...state, appointments}
    const {dayPosition, daySlots} = getRemainingSpots(id, newState);
    
    const day = {
      ...state.days[dayPosition],
      spots: daySlots
    }
    
    const days = [
      ...state.days,
    ];
    days.splice(dayPosition, 1, day);

    return axios.put(`/api/appointments/${id}`, {interview}) 
      .then(() => {
        setState({...state, appointments, days});
      })
  
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
   
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const newState = {...state, appointments}
    const {dayPosition, daySlots} = getRemainingSpots(id, newState);
    
    const day = {
      ...state.days[dayPosition],
      spots: daySlots
    }
    
    const days = [
      ...state.days,
    ];
    days.splice(dayPosition, 1, day);
   
    return axios.delete(`/api/appointments/${id}`, appointment) 
      .then(() => {
        setState({...state, appointments, days});
      })
  
  };

  return {state, setDay, bookInterview, cancelInterview}
}
