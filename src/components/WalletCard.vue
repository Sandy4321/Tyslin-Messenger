<template>
  <v-card flat :class="className" class="mt-3 pl-55">
    <v-list two-line :class="`${className}__list`">
      <v-list-tile @click="copyToClipboard(address)">
        <v-list-tile-content>
          <v-list-tile-title :class="`${className}__title`">
            {{ cryptoName }} {{ $t('home.wallet') }} 
          </v-list-tile-title>
          <v-list-tile-sub-title :class="`${className}__subtitle`">
            {{ address }}
          </v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon :class="`${className}__action`">mdi-content-copy</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile @click="$emit('click:balance', crypto)">
        <v-list-tile-content>
          <v-list-tile-title :class="`${className}__title`">
            {{ $t('home.balance') }}
          </v-list-tile-title>
          <v-list-tile-sub-title :class="`${className}__subtitle`">
            {{ balance | currency(crypto, true) }}
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider>Hello</v-divider>

    <WalletCardListActions
      :class="`${className}__list`"
      :crypto="crypto"
    />
  </v-card>
</template>

<script>
import { copyToClipboard } from '@/lib/textHelpers'
import WalletCardListActions from '@/components/WalletCardListActions'

export default {
  computed: {
    className () {
      return 'wallet-card'
    }
  },
  methods: {
    copyToClipboard (text) {
      copyToClipboard(text)

      this.$store.dispatch('snackbar/show', {
        message: this.$t('home.copied')
      })
    }
  },
  components: {
    WalletCardListActions
  },
  props: {
    address: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true
    },
    crypto: {
      type: String,
      default: 'TYS'
    },
    cryptoName: {
      type: String,
      default: 'TYSLIN'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~vuetify/src/stylus/settings/_colors.styl'

.wallet-card
  &__title
    font-size: 16px
    font-weight: 500
  &__subtitle
    font-size: 14px
    font-weight: 400
    word-break: break-word
    font-style: italic

/** Themes **/
.theme--light
  .wallet-card
    background-color: transparent

    &__list
      background: inherit
    &__title
      color: $grey.darken-3
    &__subtitle
      color: $grey.darken-2
.theme--dark
  .wallet-card
    background-color: transparent

    &__list
      background: inherit
    &__title
      color: $shades.white
    &__subtitle
      color: $shades.white
</style>
