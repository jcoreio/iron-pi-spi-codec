// @flow

import {expect} from 'chai'
import {describe, it} from 'mocha'

import IronPiIPCCodec from '../src/index'
import type {SetAllOutputsMessage} from '../src/index'

describe('IPC codec', () => {
  const codec: IronPiIPCCodec = new IronPiIPCCodec()

  it('encodes and decodes a setAllOutputs message with all flags false', () => {
    const msgIn: SetAllOutputsMessage = {
      outputs: [
        {
          address: 1,
          levels: [true, false, true, false],
        },
        {
          address: 2,
          levels: [true, true, true, true, false, false, false, false],
        }
      ],
      requestInputStates: true,
      flashLEDs: true,
    }
    const buf = codec.encodeSetAllOutputsMessage(msgIn)
    const msgOut = codec.decodeSetAllOutputsMessage(buf)
    expect(msgOut).to.deep.equal(msgIn)
  })
  it('encodes and decodes a setAllOutputs message with all flags true', () => {
    const msgIn: SetAllOutputsMessage = {
      outputs: [
        {
          address: 1,
          levels: [true, false, true, false],
        },
        {
          address: 2,
          levels: [true, true, true, true, false, false, false, false],
        }
      ],
      requestInputStates: false,
      flashLEDs: false,
    }
    const buf = codec.encodeSetAllOutputsMessage(msgIn)
    const msgOut = codec.decodeSetAllOutputsMessage(buf)
    expect(msgOut).to.deep.equal(msgIn)
  })
  it('encodes and decodes a setAllOutputs message with false and true flags', () => {
    const msgIn: SetAllOutputsMessage = {
      outputs: [
        {
          address: 1,
          levels: [true, false, true, false],
        },
        {
          address: 2,
          levels: [true, true, true, true, false, false, false, false],
        }
      ],
      requestInputStates: false,
      flashLEDs: true,
    }
    const buf = codec.encodeSetAllOutputsMessage(msgIn)
    const msgOut = codec.decodeSetAllOutputsMessage(buf)
    expect(msgOut).to.deep.equal(msgIn)
  })
})
