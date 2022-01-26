import { TickerMessage } from "./TickerMessage.type";

const ProtoBuf = require("./yaticker_pb");
const YaTicker = ProtoBuf.yaticker;

export function TickerMessageFromBuffer(buffer: any): TickerMessage {
  return YaTicker.deserializeBinary(buffer).toObject() as TickerMessage;
}
