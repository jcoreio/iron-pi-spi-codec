// @flow

import protobuf from 'protobufjs'
import type {Type as ProtobufType} from 'protobufjs'

export type IronPiDeviceModel = {
  model: string,
  version: string,
  numDigitalInputs: number,
  numDigitalOutputs: number,
  numAnalogInputs: number,
  hasConnectButton: boolean,
}

export type IronPiDetectedDevice = {
  address: number,
  info: IronPiDeviceModel,
}

export type IronPiStateFromDevice = {
  address: number,
  digitalInputs: Array<boolean>,
  digitalInputEventCounts: Array<number>,
  digitalOutputs: Array<boolean>,
  analogInputs: Array<number>,
  connectButtonPressed?: boolean,
  connectButtonEventCount?: number,
}

export type IronPiHardwareInfo = {
  devices: Array<IronPiDetectedDevice>,
  serialNumber: string,
  accessCode: string,
}

export type DeviceOutputStates = {
  address: number,
  levels: Array<boolean>,
}

export type SetAllOutputsMessage = {
  outputs: Array<DeviceOutputStates>,
  requestInputStates?: ?boolean,
  flashLEDs?: ?boolean,
}

export type LEDMessage = {
  address: number,
  colors: string, // e.g. 'gg' or 'ggrr'
  onTime: number,
  offTime: number,
  idleTime: number,
}

export const IPC_PROTO_VERSION = 1

export const IPC_SOCKET_PATH = '/tmp/socket-iron-pi'

// Messages from the SPI handler to clients
export const IPC_MSG_DEVICES_LIST = 1

// Messages from clients to the SPI handler
export const IPC_MSG_SET_ALL_OUTPUTS = 20
export const IPC_MSG_SET_LEDS = 21

const decode = (type: ProtobufType, buf: Buffer) => type.toObject(type.decode(buf))

export default class IronPiIPCCodec {

  _SetAllOutputsMessageType: ProtobufType

  constructor() {
    const root = protobuf.Root.fromJSON(require('./protocol.json'))
    const getType = type => root.lookupType(`IronPi.${type}`)
    this._SetAllOutputsMessageType = getType('SetAllOutputsMessage')
  }

  encodeSetAllOutputsMessage(setAllOutputsMessage: SetAllOutputsMessage): Buffer {
    return this._SetAllOutputsMessageType.encode(setAllOutputsMessage).finish()
  }

  decodeSetAllOutputsMessage(buf: Buffer): SetAllOutputsMessage {
    return decode(this._SetAllOutputsMessageType, buf)
  }
}
