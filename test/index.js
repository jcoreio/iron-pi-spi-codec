// @flow

import {expect} from 'chai'
import {describe, it} from 'mocha'

import IronPiIPCCodec from '../src/index'
import type {SetLEDs, SetOutputs} from '../src/index'

describe('IPC codec', () => {
  const codec: IronPiIPCCodec = new IronPiIPCCodec()

  it('encodes and decodes a setOutputs message', () => {
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

  it('encodes and decodes a setLEDs message', () => {
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
