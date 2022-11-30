import React, {useState} from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props){
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  // console.log({interviewer})
  // console.log({student})

  const reset = () => {
    setStudent("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  return (
  <main className="appointment__card appointment__card--create">
  <section className="appointment__card-left">
    <form autoComplete="off" onSubmit={e => e.preventDefault()}>
      <input
        className="appointment__create-input text--semi-bold"
        name={student}
        value={student}
        type="text"
        placeholder="Enter Student Name"
        onChange={(e) => setStudent(e.target.value)}
      />
    </form>
    <InterviewerList 
     interviewers={props.interviewers}
     value = {interviewer}
     onChange = {(id) => setInterviewer(id)}
    />
  </section>
  <section className="appointment__card-right">
    <section className="appointment__actions">
      <Button danger onClick={cancel}>Cancel</Button>
      <Button confirm onClick={() => props.onSave(student,interviewer)}>Save</Button>
    </section>
  </section>
</main>
  );
}