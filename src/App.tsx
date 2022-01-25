import { useState } from "react";
import Form from "./components/Form";
import Ticker from "./components/Ticker";

function App() {
  const [symbol, setSymbol] = useState("");

  if (!symbol || symbol.length === 0) {
    return <Form onSymbolSelect={(s) => setSymbol(s)} />;
  } else {
    return <Ticker />;
  }
}

export default App;
