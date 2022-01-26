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

  useEffect(() => {
    if (!socket.current) {
      setMessage("Starting WebSocket...");
      socket.current = new WebSocket("wss://streamer.finance.yahoo.com/");

      socket.current?.addEventListener("message", (event: MessageEvent) => {
        try {
          const message = TickerMessageFromBuffer(event.data);

          if (message.id === props.symbol) {
            setPrice(message.price);
            const formattedPrice = new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(message.price);
            document.title = `${props.symbol} ${formattedPrice}`;
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
        document.title = props.symbol;
        setMessage("WebSocket closed.");
      });
    }
  }, [props.symbol]);

  if (isNaN(price) || socket.current?.readyState === WebSocket.CLOSED) {
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
    <div className="h-full">
      <div
        style={{ height: "90%" }}
        className="flex items-center justify-center"
      >
        <div>
          <div className="flex flex-row-reverse justify-between">
            <div className="px-2 py-1 flex items-center gap-x-2 bg-slate-200 rounded-lg">
              <p className="font-semibold text-sm italic">LIVE</p>
              <div className="w-2 h-2 bg-red-600 rounded-full hover:animate-ping"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">{props.symbol}</div>
            </div>
          </div>
          {price > previousPrice ? (
            <div className="py-8 text-5xl md:text-7xl lg:text-9xl font-bold text-green-600">
              {formattedPrice}
            </div>
          ) : (
            <div className="py-8 text-5xl md:text-7xl lg:text-9xl font-bold text-red-600">
              {formattedPrice}
            </div>
          )}
        </div>
      </div>
      <div
        style={{ height: "10%" }}
        className="flex items-center justify-center gap-8"
      >
        <button
          disabled={socket.current?.readyState === WebSocket.CLOSED}
          onClick={() => {
            socket.current?.close();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        >
          Close WebSocket
        </button>
        <button
          disabled={socket.current?.readyState === WebSocket.CLOSED}
          onClick={() => {
            window.location.reload();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
        >
          Reload
        </button>
      </div>
    </div>
  );
}

export default Ticker;
