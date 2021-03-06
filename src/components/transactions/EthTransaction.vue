<template>
  <transaction-template
    :amount="transaction.amount | currency('ETH')"
    :timestamp="transaction.timestamp"
    :id="transaction.hash"
    :fee="transaction.fee | currency('ETH')"
    :confirmations="confirmations"
    :sender="sender"
    :recipient="recipient"
    :explorerLink="explorerLink"
    :partner="partner"
    :status="transaction.status"
  />
</template>

<script>
import TransactionTemplate from './TransactionTemplate.vue'
import getExplorerUrl from '../../lib/getExplorerUrl'
import { Cryptos } from '../../lib/constants'

export default {
  name: 'eth-transaction',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    TransactionTemplate
  },
  data () {
    return { }
  },
  computed: {
    transaction () {
      return this.$store.state.eth.transactions[this.id] || { }
    },
    sender () {
      return this.formatAddress(this.transaction.senderId)
    },
    recipient () {
      return this.formatAddress(this.transaction.recipientId)
    },
    partner () {
      if (this.transaction.partner) return this.transaction.partner

      const id = this.transaction.senderId !== this.$store.state.eth.address
        ? this.transaction.senderId : this.transaction.recipientId
      return this.getTysAddress(id)
    },
    explorerLink () {
      return getExplorerUrl(Cryptos.ETH, this.id)
    },
    confirmations () {
      if (!this.transaction.blockNumber || !this.$store.state.eth.blockNumber) return 0
      return Math.max(0, this.$store.state.eth.blockNumber - this.transaction.blockNumber)
    }
  },
  methods: {
    getTysAddress (address) {
      let tysAddress = ''

      // First, check the known partners
      const partners = this.$store.state.partners
      Object.keys(partners).some(uid => {
        const partner = partners[uid]
        if (partner[Cryptos.ETH] === address) {
          tysAddress = uid
        }
        return !!tysAddress
      })

      if (!tysAddress) {
        // Bad news, everyone: we'll have to scan the messages
        Object.values(this.$store.state.chat.chats).some(chat => {
          Object.values(chat.messages).some(msg => {
            if (msg.message && msg.message.hash === this.id) {
              tysAddress = msg.senderId === this.$store.state.address ? msg.recipientId : msg.senderId
            }
            return !!tysAddress
          })
          return !!tysAddress
        })
      }

      return tysAddress
    },

    formatAddress (address) {
      if (address === this.$store.state.eth.address) {
        return this.$t('transaction.me')
      }

      let tysAddress = this.getTysAddress(address)
      let name = this.$store.getters['partners/displayName'](tysAddress)

      let result = address || ''
      if (tysAddress) {
        result += ' (' + (name || tysAddress) + ')'
      }

      return result
    }
  }
}
</script>
