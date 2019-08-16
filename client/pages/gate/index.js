import React, { PureComponent } from 'react';
import gate from '@/models/gate';
import { withRematch } from '@/store';
import css from './style.less';

const mapState = state => ({
  gate: state.gate,
  config: state.config
});

@withRematch(mapState, null, gate)
export default class Gate extends PureComponent {
  static async getInitialProps({ isServer, store, ctx }) {
    console.log('>>>>>>>>>>>>> in gate page');
    await store.dispatch.gate.getGateConfig({
      ctx
    });

    return {
      isServer,
    };
  }

  render() {

    return (

      <div>
        <header>
          <title>test page</title>
        </header>
        <div className={css.test}>
          test
        </div>  
      </div>

    );
  }
}
