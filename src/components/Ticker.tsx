import { useState, useEffect, useRef } from "react";
import { usePrevious } from "../util/usePrevious";
import { TickerMessageFromBuffer } from "../util/TickerMessageFromBuffer";

interface TickerProps {
  symbol: string;
}

function Ticker(props: TickerProps) {
  const [price, setPrice] = useState(NaN);
  const previousPrice = usePrevious(price);
  const [message, setMessage] = useState("Loading...");
  const socket = useRef<WebSocket>();
  const encoder = new TextEncoder();

  useEffect(() => {
    if (!socket.current) {
      setMessage("Starting WebSocket...");
      socket.current = new WebSocket("wss://streamer.finance.yahoo.com/");

      socket.current?.addEventListener("message", (event: MessageEvent) => {
        try {
          const message = TickerMessageFromBuffer(event.data);

          if (message.id === props.symbol) {
            setPrice(message.price);
          }
        } catch (error) {
          console.log("unparsable message");
        }
      });

      socket.current.addEventListener("open", () => {
        setMessage("WebSocket opened, waiting for messages...");
        const initialMessage = {
          subscribe: [props.symbol],
        };
        socket.current?.send(JSON.stringify(initialMessage));
      });

      socket.current.addEventListener("error", (error) => {
        console.log(error);
        setMessage("Error on WebSocket, please check browser console.");
      });

      socket.current.addEventListener("close", () => {
        setMessage("WebSocket closed.");
      });
    }
  });

  if (isNaN(price)) {
    return (
      <div className="h-full flex items-center justify-center text-2xl">
        {message}
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(price);

  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <div className="flex flex-row-reverse justify-between">
          <div className="px-2 py-1 flex items-center gap-x-2 bg-gray-300 rounded-lg">
            <p className="font-semibold text-sm italic">LIVE</p>
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold">{props.symbol}</div>
          </div>
        </div>
        {price > previousPrice ? (
          <div className="py-8 text-6xl lg:text-9xl font-bold text-green-600">
            {formattedPrice}
          </div>
        ) : (
          <div className="py-8 text-6xl lg:text-9xl font-bold text-red-600">
            {formattedPrice}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ticker;
