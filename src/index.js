// @flow

import protobuf from 'protobufjs'
import type {Type as ProtobufType} from 'protobufjs'

export type DeviceModel = {
  name: string, // e.g. 'iron-pi-cm8' or 'iron-pi-io16'
  version: string,
  numDigitalInputs: number,
  numDigitalOutputs: number,
  numAnalogInputs: number,
  hasConnectButton: boolean,
}

export type DetectedDevice = {
  address: number,
  model: DeviceModel,
}

export type HardwareInfo = {
  devices: Array<DetectedDevice>,
  serialNumber: string,
  accessCode: string,
}

export type DeviceInputState = {
  address: number,
  digitalInputs: Array<boolean>,
  digitalInputEventCounts: Array<number>,
  digitalOutputs: Array<boolean>,
  analogInputs: Array<number>,
  connectButtonPressed?: boolean,
  connectButtonEventCount?: number,
}

export type DeviceInputStates = {
  inputStates: Array<DeviceInputState>,
}

export type MessageFromDriver = {
  hardwareInfo?: HardwareInfo,
  deviceInputStates?: DeviceInputStates,
}

export type DeviceOutputState = {
  address: number,
  levels: Array<boolean>,
}

export type SetOutputs = {
  outputs: Array<DeviceOutputState>,
}

export type LEDCommand = {
  address: number,
  colors: string, // e.g. 'gg' or 'ggrr'
  onTime: number,
  offTime: number,
  idleTime: number,
}

export type SetLEDs = {
  leds: Array<LEDCommand>,
}

export type MessageToDriver = {
  setOutputs?: SetOutputs,
  setLEDs?: SetLEDs,
}

export default class IronPiIPCCodec {

  _MessageFromDriver: ProtobufType
  _MessageToDriver: ProtobufType

  constructor() {
    const root = protobuf.Root.fromJSON(require('./protocol.json'))
    const getType = type => root.lookupType(`IronPi.${type}`)
    this._MessageFromDriver = getType('MessageFromDriver')
    this._MessageToDriver = getType('MessageToDriver')
  }

  // Encode messages from driver

  encodeHardwareInfo(hardwareInfo: HardwareInfo): Buffer {
    return this._encodeMessageFromDriver({hardwareInfo})
  }

  encodeDeviceInputStates(deviceInputStates: DeviceInputStates): Buffer {
    return this._encodeMessageFromDriver({deviceInputStates})
  }

  // Emcode messages to driver

  encodeSetOutputs(setOutputs: SetOutputs): Buffer {
    return this._encodeMessageToDriver({setOutputs})
  }

  encodeSetLEDs(setLEDs: SetLEDs): Buffer {
    return this._encodeMessageToDriver({setLEDs})
  }

  // Decode messages

  decodeMessageFromDriver(buf: Buffer): MessageFromDriver {
    return decode(this._MessageFromDriver, buf)
  }

  decodeMessageToDriver(buf: Buffer): MessageToDriver {
    return decode(this._MessageToDriver, buf)
  }

  // Encode helpers

  _encodeMessageFromDriver(message: MessageFromDriver): Buffer {
    return encode(this._MessageFromDriver, message)
  }

  _encodeMessageToDriver(message: MessageToDriver): Buffer {
    return encode(this._MessageToDriver, message)
  }
}

function encode(type: ProtobufType, message: any): Buffer {
  return type.encode(message).finish()
}

function decode(type: ProtobufType, buf: Buffer): any {
  return type.toObject(type.decode(buf))
}
