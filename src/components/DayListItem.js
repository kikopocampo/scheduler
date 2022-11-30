import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss"

export default function DayListItem(props) {
  let listClass = classNames(
    "day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full" : props.spots === 0,
    })

  const formatSpots = (spots) => {
    return spots === 1 ? 'spot' : 'spots'
  }

  return (
    <li className={listClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">
        {props.spots ? props.spots : 'no'} {formatSpots(props.spots)} remaining
      </h3>
    </li>
  );
}