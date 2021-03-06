import * as tysApi from '../../../lib/tyslin-api'
import { isErc20, Cryptos } from '../../../lib/constants'

const CONTACT_LIST_KEY = 'contact_list'
const UPDATE_TIMEOUT = 3 * 60 * 1000 // 3 min
const SAVE_TIMEOUT = 30 * 1000 // 30 s

let bgTimer = null

export default {
  /** Resets module state */
  reset: {
    root: true,
    handler (context) {
      context.dispatch('saveContactsList')
      context.commit('reset')
      clearInterval(bgTimer)
    }
  },

  /** Starts background sync after login */
  afterLogin: {
    root: true,
    handler (context) {
      context.dispatch('startSync')
    }
  },

  /** Starts background sync after page reloads */
  rehydrate: {
    root: true,
    handler (context) {
      const passphrase = context.rootGetters.getPassPhrase
      if (passphrase) {
        context.dispatch('startSync')
      }
    }
  },

  /**
   * Fetches crypto address for the specified partner
   * @param {any} context Vuex action context
   * @param {{ crypto: string, partner: string }} payload partner address and the desired crypto
   * @returns {Promise<string>}
   */
  fetchAddress (context, payload) {
    const crypto = isErc20(payload.crypto) ? Cryptos.ETH : payload.crypto

    const existingPartner = context.state.list[payload.partner]
    const existingAddress = existingPartner && existingPartner[crypto]
    if (existingAddress) return Promise.resolve(existingAddress)

    const key = `${crypto}:address`.toLowerCase()

    return tysApi.getStored(key, payload.partner).then(
      address => {
        context.commit('address', { ...payload, crypto, address })
        return address
      },
      error => {
        console.error('Failed to fetch address', payload, error)
        return false
      }
    )
  },

  /**
   * Retrieves contact list from the KVS
   * @param {any} context Vuex action context
   */
  fetchContactsList (context) {
    const lastUpdate = context.state.lastUpdate

    // Check if it's time to update
    if ((Date.now() - lastUpdate) < UPDATE_TIMEOUT) return

    return tysApi.getStored(CONTACT_LIST_KEY)
      .then(cl => context.commit('contactList', cl))
      .catch(err => console.warn('Failed to fetch contact list', err))
  },

  /**
   * Saves contacts list to KVS
   * @param {any} context Vuex action context
   */
  saveContactsList (context) {
    const lastChange = context.state.lastChange

    // Check if it's time to save (and there are changes to save)
    if (!lastChange || (Date.now() - lastChange) < SAVE_TIMEOUT) return
    // Setting `lastChange` to 0 guards against redundant call while save transaction is being processed
    context.state.lastChange = 0

    const contacts = Object.keys(context.state.list).reduce((map, uid) => {
      const item = context.state.list[uid]
      map[uid] = { ...item }
      return map
    }, { })

    return tysApi.storeValue(CONTACT_LIST_KEY, contacts, true)
      .then(response => {
        if (!response.success) {
          console.warn('Contacts list save was rejected')
        }
      })
      .catch(err => {
        console.warn('Failed to save contact list', err)
        // Re-mark state as dirty to save on the next tick
        context.state.lastChange = lastChange
      })
  },

  /**
   * Starts contact list sync.
   * @param {any} context Vuex action context
   */
  startSync (context) {
    context.dispatch('fetchContactsList')

    clearInterval(bgTimer)
    bgTimer = setInterval(() => {
      context.dispatch('saveContactsList')
      context.dispatch('fetchContactsList')
    }, 1000)
  }
}
