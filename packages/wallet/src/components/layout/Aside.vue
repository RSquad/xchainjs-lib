<template>
  <v-navigation-drawer class="py-16" permanent app clipped :value="true" right width="300" floating>
    <v-list expand class="mt-12">
      <v-list-item link class="mb-8" :to="`/`">
        <v-list-item-icon><v-icon color="#333333">mdi-plus</v-icon> </v-list-item-icon>
        <v-list-item-title>Add wallet</v-list-item-title>
      </v-list-item>
      <v-list-group v-for="(blockchain, i) in getUniqBlockchains" :key="i + blockchain" :value="true">
        <template v-slot:activator>
          <v-list-item-title>{{ blockchain }}</v-list-item-title>
        </template>
        <template v-slot:appendIcon><v-icon size="24" color="black">mdi-chevron-down</v-icon> </template>
        <v-list-group no-action sub-group v-for="(coin, i) in uniqCoins(blockchain)" :key="i + coin" :value="true">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ coin.coin }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-slot:appendIcon><v-icon size="16" color="black">mdi-chevron-down</v-icon> </template>
          <template v-slot:prependIcon><div></div></template>

          <v-list-item
            v-for="(wallet, i) in getWalletsByCoin(coin.coin)"
            :key="i + wallet.address"
            link
            :to="`/${blockchain}/${coin.coin}/${wallet.address}/${wallet.network}`"
            @click="onClickLink"
          >
            <v-list-item-content>
              <v-list-item-title>{{ `${sliceString(wallet.address)} (${wallet.network})` }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { walletModuleMapper } from '@/store/modules/wallets'
import { Component, Vue } from 'vue-property-decorator'
import { isEmpty, uniqBy } from 'lodash'
import { sliceString } from '@/utils'
import { ethClientModuleMapper } from '@/store/modules/eth-client'
import { solanaClientModuleMapper } from '@/store/modules/solana-client'

const Mappers = Vue.extend({
  computed: {
    ...walletModuleMapper.mapGetters(['getUniqBlockchains', 'walletsByBlockchain', 'walletsByCoin']),
  },
  methods: {
    ...ethClientModuleMapper.mapActions(['clearEthTxs', 'clearEthBalance']),
    ...solanaClientModuleMapper.mapActions(['clearSolTxs', 'clearSolBalance']),
    ...walletModuleMapper.mapActions(['fetchWallets']),
  },
})

@Component({ methods: { isEmpty, sliceString } })
export default class Aside extends Mappers {
  public get uniqCoins() {
    return (blockchainName: string) => {
      const filteredWalletsByBlockchain = this.walletsByBlockchain(blockchainName)
      const uniqCoins = uniqBy(filteredWalletsByBlockchain, 'coin')
      return uniqCoins
    }
  }

  public get getWalletsByCoin() {
    return (coin: string) => this.walletsByCoin(coin)
  }

  onClickLink() {
    this.clearEthBalance()
    this.clearEthTxs()
    this.clearSolTxs()
    this.clearSolBalance()
  }
}
</script>
