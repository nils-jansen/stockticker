import { useState, useEffect, useRef } from "react";

interface TickerProps {
  symbol: string;
}

function Ticker(props: TickerProps) {
  const [price, setPrice] = useState(NaN);
  const socket = useRef<WebSocket>();

  useEffect(() => {
    if (!socket.current) {
      socket.current = new WebSocket("wss://streamer.finance.yahoo.com/");
      socket.current.addEventListener("open", () => {
        console.log("websocket open");
        const initialMessage = {
          subscribe: [
            "^GSPC",
            "^DJI",
            "^IXIC",
            "^RUT",
            "CL=F",
            "GC=F",
            props.symbol,
          ],
        };
        socket.current?.send(JSON.stringify(initialMessage));
      });

      socket.current.addEventListener("message", (event: MessageEvent) => {
        console.log(event.data);
      });
    }
  });

  return (
    <div className="h-full flex items-center justify-center">
      {isNaN(price) ? "Loading" : `${price} $`}
    </div>
  );
}

export default Ticker;
