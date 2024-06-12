import React, {useEffect, useState, lazy} from 'react';
import styled from 'styled-components';
import {v4} from 'uuid'
import { isEmpty } from 'lodash'
import { init, loadRemote } from '@module-federation/runtime'
import type { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';
// import antd from 'antd'

// console.log(antd)

import Triangle from './comps/triangle'

const Wrapper = styled.div`
  color: '#999';
`

// console.log(antd)

init({
  name: 'host',
  remotes: [
    {
      name: 'remote',
      entry: 'http://localhost:9002/remoteEntry.js'
    }
  ],
  shared: {
    '@ca/core-api': {
      version: '0.1.0',
      lib: async () => import('@ca/core-api'),
      shareConfig: {
        singleton: true,
        requiredVersion: '0.1.0'
      }
    }
  }
})

function App() {
  const [RemoteLib, setRemoteLib] = useState(null)
  useEffect(() => {
    loadRemote('remote/Button').then(m => {
      setRemoteLib(m)
      console.log(m)
    })
  })
  return (
    <div>
      <h1>Basic Host -- Remote </h1>
      <h2>Host uuid: { v4() } { isEmpty() }</h2>
      <Wrapper>
        I am from demo !
      </Wrapper>
      { RemoteLib && RemoteLib.default() }
      <svg height="100%" viewBox="-5 -4.33 10 8.66" style={{ backgroundColor: "black" }}>
          <Triangle style={{ fill: "white" }}/>
      </svg>
    </div>
  );
}

export default App;
