// @flow

import {expect} from 'chai'
import {describe, it} from 'mocha'

import IronPiIPCCodec from '../src/index'
import type {DeviceInputStates, HardwareInfo, SetLEDs, SetOutputs} from '../src/index'

describe('IronPiIPCCodec', () => {
  const codec: IronPiIPCCodec = new IronPiIPCCodec()

  // Messages from driver

  it('encodes and decodes a HardwareInfo message', () => {
    const hardwareInfo: HardwareInfo = {
      devices: [
        {
          address: 1,
          model: {
            name: 'iron-pi-cm8',
            version: '1.0.0',
            numDigitalInputs: 8,
            numDigitalOutputs: 10,
            numAnalogInputs: 4,
            hasConnectButton: true
          }
        },
        {
          address: 2,
          model: {
            name: 'iron-pi-io16',
            version: '1.0.1',
            numDigitalInputs: 16,
            numDigitalOutputs: 18,
            numAnalogInputs: 8,
            hasConnectButton: false
          }
        },
      ],
      serialNumber: 'ABCDEFG',
      accessCode: 'WXYZ',
    }
    const buf = codec.encodeHardwareInfo(hardwareInfo)
    const msgOut = codec.decodeMessageFromDriver(buf)
    expect(msgOut).to.deep.equal({hardwareInfo})
  })

  it('encodes and decodes a DeviceInputStates message', () => {
    const deviceInputStates: DeviceInputStates = {
      inputStates: [
        {
          address: 1,
          digitalInputs: [true, false, true, true, false, false, true, false],
          digitalInputEventCounts: [0, 1, 2, 3, 9, 7, 5, 3],
          digitalOutputs: [true, true, false, false, true, false, true, true],
          analogInputs: [1.5, 2.5, 3.5, 4.5],
          connectButtonPressed: true,
          connectButtonEventCount: 55,
        },
        {
          address: 2,
          digitalInputs: [true, true, false, true, false, false, true, false, false, false],
          digitalInputEventCounts: [55, 44, 33, 22, 11, 11, 22, 33, 44, 55, 66],
          digitalOutputs: [true, true, false, false, true, false, true, true, true, false],
          analogInputs: [1.5, 2.5, 3.5, 4.5, 1, 2, 3, 4, 5, 6],
          connectButtonPressed: false,
          connectButtonEventCount: 0,
        },
      ],
    }
    const buf = codec.encodeDeviceInputStates(deviceInputStates)
    const msgOut = codec.decodeMessageFromDriver(buf)
    expect(msgOut).to.deep.equal({deviceInputStates})
  })

  // Messages to driver

  it('encodes and decodes a SetOutputs message', () => {
    const setOutputs: SetOutputs = {
      outputs: [
        {
          address: 1,
          levels: [true, false, true, false],
        },
        {
          address: 2,
          levels: [true, true, true, true, false, false, false, false],
        }
      ]
    }
    const buf = codec.encodeSetOutputs(setOutputs)
    const msgOut = codec.decodeMessageToDriver(buf)
    expect(msgOut).to.deep.equal({setOutputs})
  })

  it('encodes and decodes a SetLEDs message', () => {
    const setLEDs: SetLEDs = {
      leds: [
        {
          address: 1,
          colors: 'rrgg',
          onTime: 300,
          offTime: 300,
          idleTime: 1000,
        },
        {
          address: 2,
          colors: 'gggr',
          onTime: 200,
          offTime: 200,
          idleTime: 100,
        }
      ]
    }
    const buf = codec.encodeSetLEDs(setLEDs)
    const msgOut = codec.decodeMessageToDriver(buf)
    expect(msgOut).to.deep.equal({setLEDs})
  })
})
