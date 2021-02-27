<template>
  <div class="v-main-page py-8">
    <Inner>
      <h1 class="mb-6">Add wallet</h1>
      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
        <div class="v-main-page__grid">
          <v-text-field
            v-model="name"
            :rules="[(v) => !!v || 'Name is required']"
            label="Name"
            outlined
            required
          ></v-text-field>

          <v-select
            v-model="blockchain"
            :items="blockchains"
            :rules="[(v) => !!v || 'Blockchain is required']"
            label="Blockchain"
            outlined
            required
          ></v-select>
          <v-select
            v-model="coin"
            :items="coins"
            :rules="[(v) => !!v || 'Coins is required']"
            label="Coins"
            outlined
            :disabled="!blockchain"
            required
          ></v-select>
          <v-select
            v-model="network"
            :items="networks"
            :rules="[(v) => !!v || 'Network is required']"
            label="Network"
            outlined
            :disabled="!blockchain"
            required
          ></v-select>
          <v-text-field
            v-model.trim="seedPhrase"
            :rules="[(v) => !!v || 'Seed phrase is required', (v) => validatePhrase(v)]"
            label="Seed phrase"
            :disabled="!blockchain"
            required
            outlined
          >
            <template v-slot:append>
              <v-btn class="mt-n1" @click="generatePhrase" height="32" :disabled="!blockchain"> Generate </v-btn>
            </template>
          </v-text-field>
          <v-text-field v-model="address" disabled label="Address" outlined></v-text-field>
          <v-text-field v-model="publicKey" disabled label="Public key" outlined></v-text-field>
          <v-text-field v-model="privateKey" disabled label="Private key" outlined></v-text-field>
        </div>
        <v-row align-content="space-between" class="mt-5" no-gutters>
          <v-col cols="9">
            <v-btn
              type="submit"
              :disabled="!valid || !name || !coin || !blockchain || !network || !seedPhrase"
              height="56"
              block
            >
              Add
            </v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn @click="setTestWallets" type="button" text color="#0759A5" plain height="56" block
              >Set Defaulte Wallets
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </Inner>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Inner from '@/components/layout/Inner.vue'
import localForage from 'localforage'
import { isEmpty } from 'lodash'
import { WalletModel } from '@/store/modules/wallets'
import nacl from 'tweetnacl'
import { walletModuleMapper } from '@/store/modules/wallets'
// @ts-ignore
import * as bs58 from 'bs58'
import * as crypto from '@xchainjs/xchain-crypto'
import { defaultPath, HDNode } from '@ethersproject/hdnode'

const Mappers = Vue.extend({
  methods: {
    ...walletModuleMapper.mapActions(['fetchWallets', 'setTestWallets']),
  },
})

@Component({ components: { Inner } })
export default class MainPage extends Mappers {
  valid = true
  name = ''

  coin = ''
  coinsEthereum = ['ETH']
  coinsSolana = ['SOL']

  blockchain = ''
  blockchains = ['ethereum', 'solana']

  network = ''
  networksSolana = ['mainnet-beta', 'testnet']
  networksEthereum = ['mainnet', 'testnet']

  seedPhrase = ''

  address = ''
  publicKey = ''
  privateKey = ''

  @Watch('seedPhrase')
  onChangeSeedPhrase() {
    if (this.blockchain === 'ethereum') {
      const node = HDNode.fromMnemonic(this.seedPhrase).derivePath(defaultPath)
      this.address = node.address
      this.publicKey = node.publicKey
      this.privateKey = node.privateKey
    }

    if (this.blockchain === 'solana') {
      const seed = crypto.getSeed(this.seedPhrase)
      const keypair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32))
      this.address = bs58.encode(keypair.publicKey)
      this.publicKey = bs58.encode(keypair.publicKey)
      this.privateKey = bs58.encode(keypair.secretKey)
    }
  }
  public get coins(): string[] {
    if (this.blockchain === 'ethereum') return this.coinsEthereum
    if (this.blockchain === 'solana') return this.coinsSolana
    return []
  }

  public get networks(): string[] {
    if (this.blockchain === 'ethereum') return this.networksEthereum
    if (this.blockchain === 'solana') return this.networksSolana
    return []
  }

  async onSubmit() {
    const wallets: any = await localForage.getItem('wallets').then((wallets) => {
      if (isEmpty(wallets)) return []
      return wallets
    })
    const newWallets: WalletModel[] = wallets
    newWallets.push({
      id: newWallets.length,
      name: this.name,
      blockchain: this.blockchain,
      coin: this.coin,
      network: this.network,
      address: this.address,
      publicKey: this.publicKey,
      privateKey: this.privateKey,
      seedPhrase: this.seedPhrase,
    })
    await localForage.setItem('wallets', newWallets)
    await this.fetchWallets()
  }

  generatePhrase() {
    this.seedPhrase = crypto.generatePhrase(12)
  }

  validatePhrase(phrase: string) {
    return !crypto.validatePhrase(phrase) ? 'Invalid phrase' : true
  }

  // mounted() {
  //   this.fetchWallets()
  // }
}
</script>

<style lang="sass" scoped>
.v-main-page
  h1
    font-weight: 700
    font-size: 48px
    line-height: 64px
  &__grid
    display: grid
    grid-template-columns: 1fr 1fr
    grid-column-gap: 30px
    grid-row-gap: 8px
    box-sizing: border-box
</style>
