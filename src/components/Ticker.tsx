import { useState, useEffect, useRef } from "react";
import { usePrevious } from "../util/usePrevious";
import { TickerMessageFromBuffer } from "../util/TickerMessageFromBuffer";

interface TickerProps {
  symbol: string;
}

function Ticker(props: TickerProps) {
  const [price, setPrice] = useState(NaN);
  const [change, setChange] = useState(NaN);
  const [changePercent, setChangePercent] = useState(NaN);
  const previousPrice = usePrevious(price);
  const [message, setMessage] = useState("Loading...");
  const socket = useRef<WebSocket>();
  const priceLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket.current) {
      setMessage("Starting WebSocket...");
      socket.current = new WebSocket("wss://streamer.finance.yahoo.com/");

      socket.current?.addEventListener("message", (event: MessageEvent) => {
        try {
          const message = TickerMessageFromBuffer(event.data);

          if (message.id === props.symbol) {
            setPrice(message.price);
            setChange(message.change);
            setChangePercent(message.changepercent);

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
        setMessage("WebSocket opened, waiting for first message...");
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

  var changeClasses: string[] = [];
  if (price < previousPrice) {
    changeClasses = ["bg-red-200"];
  } else if (price > previousPrice) {
    changeClasses = ["bg-green-200"];
  }

  if (changeClasses.length > 0) {
    priceLabelRef.current?.classList.add(...changeClasses);
    setTimeout(() => {
      priceLabelRef.current?.classList.remove(...changeClasses);
    }, 500);
  }

  const changeSign = change < 0 ? "" : "+";

  return (
    <div className=" h-full flex items-center justify-center">
      <div>
        <div className="flex flex-row-reverse justify-between">
          <div className="px-2 py-1 flex items-center gap-x-2 bg-slate-200 rounded-lg">
            <p className="font-semibold text-sm italic">LIVE</p>
            <div className="w-2 h-2 bg-red-600 rounded-full hover:animate-ping"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl md:text-2xl lg:text-4xl font-semibold">
              {props.symbol}
            </div>
          </div>
        </div>
        <div
          ref={priceLabelRef}
          id="priceLabel"
          className="my-8 text-5xl md:text-7xl lg:text-9xl font-bold transition-colors"
        >
          {formattedPrice}
        </div>
        <div
          className={`text-lg md:text-xl lg:text-2xl font-semibold text-center ${
            change < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {changeSign}
          {change.toFixed(2)} ({changeSign}
          {changePercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
}

export default Ticker;
