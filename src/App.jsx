import { Toaster } from "react-hot-toast";
import "./App.css";
import Root from "./router/Root";

function App() {
  return (
    <>
      <Root />
      <Toaster />
    </>
  );
}

export default App;
