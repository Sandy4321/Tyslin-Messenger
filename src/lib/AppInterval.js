import { interval, from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import store from '@/store'
// import { flushCryptoAddresses } from './store-crypto-address'
// import { Fees } from './constants'

export default {
  messageInterval: interval(3000)
    .pipe(mergeMap(() => from(
      store.dispatch('chat/getNewMessages')
    ))),
  accountInterval: interval(20000),
  messageSubscription: null,
  accountSubscription: null,

  subscribe () {
    this.messageSubscription = this.messageInterval.subscribe(() => {})
    this.accountSubscription = this.accountInterval.subscribe(() => {
      store.dispatch('updateBalance')

      // if (store.state.balance > Fees.KVS) {
      //   flushCryptoAddresses()
      // }
    })
  },

  unsubscribe () {
    this.messageSubscription && this.messageSubscription.unsubscribe()
    this.accountSubscription && this.accountSubscription.unsubscribe()
  }
}
