let defaultApi = "http://175.178.87.254:8088/api"
let defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6MSwiYWNjb3VudCI6ImFkbWluIiwibmFtZSI6IueuoeeQhuWRmCIsInBob25lIjoiMTU5NzY1NzMwNCIsImlhdCI6MTY2MDExMTEwMywiZXhwIjoxNjYwMTk3NTAzfQ.lVvtXsB1YjQAFzwGQPKN48OILsaBY6w_pskLpX6IrIk'
if( process.env.NODE_ENV == "production" ){
  if (!window.__MICRO_APP_ENVIRONMENT__){
    //生产环境 且 独立运行 获取配置
    defaultApi = localStorage.getItem("api") || defaultApi
    defaultToken = localStorage.getItem("token") || defaultToken
  }
}

export function GET_TOKEN(){
  if (window.__MICRO_APP_ENVIRONMENT__){
    return window.microApp.getData()?.TOKEN || defaultToken
  }else {
    return defaultToken
  }
}
export function GET_VUE_APP_BASE_API(){
  if (window.__MICRO_APP_ENVIRONMENT__){
    return window.microApp.getData()?.VUE_APP_BASE_API || defaultApi
  }else {
    return defaultApi
  }
}

