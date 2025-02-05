"use client"

import { useState } from "react";
import Snackbar from "./components/Snackbar";

export default function Home() {
  const [notification, setNotification] = useState<"warning" | "success" | "error" | null>(null);
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);

  return (
    <div className="">
      <main className="">
        <button onClick={() => setNotification("success")}>test success</button>
        <button onClick={() => setNotification("error")}>test error</button>
        <button onClick={() => setNotification("warning")}>test warning</button>
        <button onClick={() => setWidth(200)}>set width</button>
        <button onClick={() => setOpacity(0)}>set op</button>
        <div className="transition-test" style={{ width: width, opacity: opacity }}></div>
      </main>

      <Snackbar type={notification} setNotification={setNotification} />
    </div>
  );
}
