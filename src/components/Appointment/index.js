import React, {Fragment} from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {

  return (
    <article className="appointment">
    <header>{props.time}</header>
    {!props.interview ? <Empty/> : <Show 
    student={props.interview.student} 
    interviewer={props.interview.interviewer.name}
    />}
    </article>
  )
}


