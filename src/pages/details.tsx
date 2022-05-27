import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Details() {
  const [details, setDetails] = useState({
    id: 0,
    month: "",
    camp: "",
    school: "",
    country: "",
    lessons: 0,
  });

  useEffect(() => {
    setDetails(JSON.parse(`${localStorage.getItem("point")}`));
  }, []);
  return (
    <div>
      <p>point detail: {details.id}</p>
      <p>point month: {details.month}</p>
      <p>point camp: {details.camp}</p>
      <p>point school: {details.school}</p>
      <p>point country: {details.country}</p>
      <p>point lessons: {details.lessons}</p>
      <button><Link to={"/"} >Return</Link></button>
    </div>
  );
}
export default Details;
