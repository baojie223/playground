// import './index.scss'

import(/* webpackPrefetch: true */ './utils').then(({ curriedSum }) => {
  curriedSum(10, 15)(2)
})

export {}
