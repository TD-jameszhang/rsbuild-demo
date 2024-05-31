import React from 'react';
import styled from 'styled-components';
import {v4} from 'uuid'
import { isEmpty } from 'lodash'
import RemoteButton from 'demo/Button'

import Triangle from './comps/triangle'

const Wrapper = styled.div`
  color: '#999';
`

function App() {
  return (
    <div>
      <h1>Basic Host -- Remote </h1>
      <h2>Host uuid: { v4() } { isEmpty() }</h2>
      <React.Suspense fallback="Loading Button">
        <RemoteButton />
      </React.Suspense>
      <Wrapper>
        I am from demo !
      </Wrapper>
      <svg height="100%" viewBox="-5 -4.33 10 8.66" style={{ backgroundColor: "black" }}>
          <Triangle style={{ fill: "white" }}/>
      </svg>
    </div>
  );
}

export default App;
