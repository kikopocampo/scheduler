export function getAppointmentsForDay(state, day) {
  //returns an array of the appointment of the day
  const appointment = Object.values(state.days).filter(dayInfo => dayInfo.name === day)
  //maps the said array into the appointment objects
  // '?' used in case the said day is not in the database => undefined
  return appointment[0]?.appointments.map(appointment => {
    for(const key in state.appointments) {
      if(Number(key) === appointment) {
        return state.appointments[key]
      }
    }
  return null;
  //if undefined, short-short circuiting is used to return [] instead of undefined
  }) || [];
}

export function getInterview (state, interview) {
let output = {};
  if(interview) {
    output['student'] = interview.student;
    Object.values(state.interviewers).forEach(interviewer => {
      if (interviewer.id === interview.interviewer) {
        output['interviewer'] = interviewer;
      }
    })
  } else {
    return null;
  }
return output;
};

export function getInterviewersForDay(state, day) {
  //returns an array of the appointment of the day
  const interviewers = Object.values(state.days).filter(dayInfo => dayInfo.name === day)
  //maps the said array into the appointment objects
  // '?' used in case the said day is not in the database => undefined
  return interviewers[0]?.interviewers.map(interviewer => {
    for(const key in state.interviewers) {
      if(Number(key) === interviewer) {
        return state.interviewers[key]
      }
    }
  //if undefined, short-short circuiting is used to return [] instead of undefined
  return null;
  }) || [];
}


