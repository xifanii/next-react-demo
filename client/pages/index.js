import Link from 'next/link';
import React from 'react';
import { withRematch } from '@/store';
import home from '@/models/home';
import css from './global.less';

const mapState = state => ({
  home: state.home,
});

const mapDispatch = ({ home: { increment, incrementAsync } }) => ({
  increment: () => increment(1),
  incrementBy: amount => () => increment(amount),
  incrementAsync: () => incrementAsync(1),
});
@withRematch(mapState, mapDispatch, home)
export default class Page extends React.Component {
  static async getInitialProps(props) {
    const {
      pathname, query, isServer, store,
    } = props;
    await store.dispatch.home.incrementAsync(5);
    return {
      pathname, query, isServer, store,
    };
  }

  render() {
    const { home: { couter }, increment, incrementBy, incrementAsync } = this.props;
    console.log("in render <<<");
    return (
      <div>
        <h1 className="title">next.js</h1>
        <br />
        <h3 className={css.test}>The count is {couter}</h3>
        <p>
          <button onClick={increment} type="button">increment</button>
        </p>
        <p>
          <button onClick={() => increment(1)} type="button">
            increment (using dispatch function)
        </button>
        </p>
        <p>
          <button onClick={incrementBy(5)} type="button">increment by 5</button>
        </p>
        <p>
          <button onClick={incrementAsync} type="button">incrementAsync</button>
        </p>
        <div>
          <Link href="/gate" prefetch >
            <a>预加载 gate 页面</a>
          </Link>
        </div>
      </div>
    );
  }
}

/**
 *
 * @api {get} / 首页
 * @apiName 首页
 * @apiGroup Pages
 * @apiVersion  0.1.0
 *
 * @apiExample {href} 请求例子
 * http://mobile.wmzy.com
 *
 * @apiHeader {String} [token] 用户token
 *
 */
