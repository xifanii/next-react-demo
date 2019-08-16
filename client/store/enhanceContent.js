
export default async (appContext, isServer) => {
  const { store } = appContext;

  if (appContext.req && appContext.req.ctx) {
    appContext.ctx = appContext.req.ctx;
    delete appContext.req.ctx;
  }

  // 全局配置加载
  if (isServer) {
    const { ctx } = appContext;
    // await store.dispatch.user.getVipAndUserInfo({
    //   ctx
    // });
    // await store.dispatch.user.getScoreInfo({
    //   ctx
    // });
    await store.dispatch.config.getGlobalConfig({
      ctx
    });
  }
  appContext.isServer = isServer;
  return appContext;
};
