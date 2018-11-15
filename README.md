# Iron Pi IPC Codec

Encodes and decodes messages exchanged over UNIX sockets with the Iron Pi SPI handler

## Getting Started

```
npm install --save @jcoreio/iron-pi-ipc-codec
```

## Example

```js

import IronPiIPCCodec from './index'
import type {SetOutputs} from './index'

const codec: IronPiIPCCodec = new IronPiIPCCodec()

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
const buf: Buffer = codec.encodeSetOutputs(setOutputs)
const msgOut = codec.decodeMessageToDriver(buf)
// msgOut = {setOutputs: {outputs: [ ... ]}}

```

## License

 [Apache-2.0](LICENSE)
