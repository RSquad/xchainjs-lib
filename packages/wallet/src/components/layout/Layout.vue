<template>
  <v-app>
    <Aside />
    <Header />
    <v-overlay :value="isSolanaPageLoading || isEtheriumPageLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-main>
      <v-container fluid class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Aside from '@/components/layout/Aside.vue'
import Header from '@/components/layout/Header.vue'
import { ethClientModuleMapper } from '@/store/modules/eth-client'
import { solanaClientModuleMapper } from '@/store/modules/solana-client'
import { walletModuleMapper } from '@/store/modules/wallets'

const Mappers = Vue.extend({
  computed: {
    ...ethClientModuleMapper.mapGetters(['isEthTxsLoading', 'isEthBalanceLoading']),
    ...solanaClientModuleMapper.mapGetters(['isSolTxsLoading', 'isSolBalanceLoading']),
  },
  methods: { ...walletModuleMapper.mapActions(['fetchWallets']) },
})

@Component({ components: { Aside, Header } })
export default class Layout extends Mappers {
  public get isSolanaPageLoading(): boolean {
    return (this.isSolTxsLoading || this.isSolBalanceLoading) && this.$router.currentRoute.params?.coin === 'SOL'
  }

  public get isEtheriumPageLoading(): boolean {
    return (this.isEthTxsLoading || this.isEthBalanceLoading) && this.$router.currentRoute.params?.coin === 'ETH'
  }

  mounted() {
    this.fetchWallets()
  }
}
</script>

