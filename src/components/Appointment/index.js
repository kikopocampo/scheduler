import React, {Fragment} from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import { useVisualMode } from "hooks/useVisualMode";
import { getInterviewersForDay } from "helpers/selectors";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const {mode, transition, back} = useVisualMode(
    props.interview? SHOW : EMPTY
  );
  return (
    <article className="appointment">
    <header>{props.time}</header>
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer.name}
      onEdit={()=> console.log("EDIT")}
      onDelete={()=> console.log("DELETE")}
    />}
    {mode === CREATE && <Form
      interviewers={props.interviewers}
      onSave={()=> console.log("SAVE")}
      onCancel={()=> transition(EMPTY)}  
    />}
    </article>
  )
}


