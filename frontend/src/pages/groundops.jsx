import { useEffect, useState } from "react";
import { getPage } from "../api";
import AccessDenied from "./accessDenied";

export default function GroundOperations() {
  const [result, setResult] = useState(null);
  useEffect(() => { getPage("groundops").then(setResult).catch(() => {}); }, []);
  if (!result) return <p>Loading ground operations...</p>;
  if (result.status === 403) return <AccessDenied />;
  if (result.status === 401) return <p>Please log in again.</p>;
  return <section className="page-stack"><div className="page-heading"><h1>Ground operations</h1></div><article className="card"><p>Ground operations page.</p></article></section>;
}
