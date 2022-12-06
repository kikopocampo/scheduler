import React from "react";
import "components/Appointment/styles.scss";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status"
import Confirm from "./Confirm"
import Error from "./Error"
import { useVisualMode } from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const {mode, transition, back} = useVisualMode(
    props.interview? SHOW : EMPTY
  );
    
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);
    // console.log(props.id,interview)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((err) => transition(ERROR_SAVE, true))
  };

  

  function deleteInterview() {
    transition(DELETE, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true))
      
  }

  return (
    <article className="appointment">
    <header>{props.time}</header>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer.name}
      onEdit={()=> transition(EDIT)}
      onDelete={() => transition(CONFIRM)}
    />}
    {mode === CREATE && <Form
      interviewers={props.interviewers}
      onSave={save}
      onCancel={back}
    />}
    {mode === EDIT && <Form 
      student = {props.interview.student}
      interviewer = {props.interview.interviewer.id}
      interviewers = {props.interviewers}
      onSave={save}
      onCancel={back}
      
    />}
    {mode === SAVING && <Status message="Saving"/>}
    {mode === DELETE && <Status message="Deleting"/>}
    {mode === CONFIRM && <Confirm
      message = 'Are you sure you want to delete?'
      onCancel={back}
      onConfirm={deleteInterview}
    />}
    {mode === ERROR_SAVE && <Error 
    message="Could not save appointment"
    onClose={back}/>}
    {mode === ERROR_DELETE && <Error 
    message="Could not delete appointment"
    onClose={back}/>}
    </article>
  )
}


