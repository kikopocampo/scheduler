import { useEffect, useReducer} from "react";
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {

  const getRemainingSpots = (appId,state) => {
    const getDaySelected = state.days.find(d => {
      return d.appointments.find(app => app === appId)
    })
    const slots = getDaySelected.appointments.filter(slot => !state.appointments[slot].interview)
    return {dayPosition: getDaySelected.id - 1, daySlots:slots.length};
  };
 
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:{
      return ({...state, days:action.days, appointments:action.appointments, interviewers:action.interviewers})
    }
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview,
      };
     
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
  
      const newState = {...state, appointments}
      const {dayPosition, daySlots} = getRemainingSpots(action.id, newState);
      
      const day = {
        ...state.days[dayPosition],
        spots: daySlots
      }
      
      const days = [
        ...state.days,
      ];

      days.splice(dayPosition, 1, day);
     
      return {...state, appointments, days}
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
      
  }
}

export const useApplicationData = () => {
  const [state, dispatch] = useReducer( reducer , {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  
  // useEffect(() => {
  //   const webSocket = new WebSocket('ws://localhost:8001');

  //   webSocket.send("Hello")
  // }, []);
  
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      dispatch({ type: SET_APPLICATION_DATA, days:all[0].data, appointments:all[1].data, interviewers:all[2].data });
    })
    
  }, [state])
  
  const setDay = day => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, {interview}) 
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview});
      })
  };

  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`) 
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null});
      })
  };

  return {state, setDay, bookInterview, cancelInterview}
}
