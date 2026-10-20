import { useEffect, useState } from "react";
import { getPage } from "../api";
import AccessDenied from "./accessDenied";

export default function Maintenance() {
  const [result, setResult] = useState(null);
  useEffect(() => { getPage("maintenance").then(setResult).catch(() => {}); }, []);
  if (!result) return <p>Loading maintenance...</p>;
  if (result.status === 403) return <AccessDenied />;
  if (result.status === 401) return <p>Please log in again.</p>;
  return <section className="page-stack"><div className="page-heading"><h1>Maintenance</h1></div><article className="card"><p>Maintenance page.</p></article></section>;
}
