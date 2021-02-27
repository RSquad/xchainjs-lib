<template>
  <div class="v-solana-page py-8">
    <Inner>
      <div class="d-flex justify-space-between align-center mb-16">
        <h2>
          {{ address + ` (${network})` }}
        </h2>
        <div>
          <v-icon class="v-solana-page__pointer mx-2" v-clipboard="() => address">mdi-content-copy</v-icon>
          <a target="_blank" class="v-solana-page__link" :href="geExplorerLink()">
            <v-icon class="v-solana-page__pointer">mdi-open-in-new</v-icon>
          </a>
        </div>
      </div>

      <div class="v-solana-page__balance">
        <div class="v-solana-page__balance-value v-solana-page__pointer" v-clipboard="() => formattedBalance">
          <img class="v-solana-page__balance-icon" src="@/assets/img/sol.png" alt="" />{{
            `${isSolBalanceLoading ? 'Loading' : `${formattedBalance} SOL`}`
          }}
        </div>
        <div class="v-solana-page__balance-text">Balance</div>
      </div>
      <h5 class="mb-6">Send to</h5>
      <v-row no-gutters class="mb-2">
        <v-col class="mr-7">
          <v-text-field v-model="recipient" label="Recipient" outlined></v-text-field>
        </v-col>
        <v-col>
          <v-text-field v-model="amount" label="Amount" outlined> </v-text-field>
        </v-col>
      </v-row>
      <div class="d-flex justify-end mb-10">
        <v-btn
          :loading="isSendButtonLoading"
          @click="onClickTransfer"
          :disabled="!recipient || !amount"
          height="56"
          width="232"
        >
          Send
        </v-btn>
      </div>

      <v-data-table
        class="mytable"
        :headers="headers"
        :items="formattedTxs || []"
        :items-per-page="5"
        :loading="isSolTxsLoading"
      >
        <template v-slot:[`item.formattedSignature`]="{ item }">
          <v-icon class="v-solana-page__pointer mr-2" v-clipboard="() => item.signature">mdi-content-copy</v-icon>
          {{ item.formattedSignature }}
        </template>
        <template v-slot:[`item.formattedFromAddress`]="{ item }">
          <div class="table-col-bg--gray">
            <v-icon class="v-solana-page__pointer mr-2" v-clipboard="() => item.fromAddress">mdi-content-copy</v-icon>
            {{ item.formattedFromAddress }}
          </div>
        </template>
        <template v-slot:[`item.formattedToAddress`]="{ item }">
          <v-icon class="v-solana-page__pointer mr-2" v-clipboard="() => item.toAddress">mdi-content-copy</v-icon>
          {{ item.formattedToAddress }}
        </template>
        <template v-slot:[`item.formattedValue`]="{ item }">
          <div class="table-col-bg--gray">{{ item.formattedValue }} SOL</div>
        </template>
        <template v-slot:[`item.type`]="{ item }">
          <div v-if="item.toAddress.toLowerCase() === address.toLowerCase()" class="table-col-bg--green text-center">
            In
          </div>
          <div v-if="item.fromAddress.toLowerCase() === address.toLowerCase()" class="table-col-bg--yellow text-center">
            Out
          </div>
        </template>
      </v-data-table>
      <v-snackbar v-model="snackbarSuccess" :timeout="1500" color="success"> Transfer complete </v-snackbar>
      <v-snackbar v-model="snackbarError" :timeout="1500" color="error"> Transfer error </v-snackbar>
    </Inner>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getExplorerAddressUrl, Network, solanaClientModuleMapper } from '@/store/modules/solana-client'
import { walletModuleMapper } from '@/store/modules/wallets'
import Inner from '@/components/layout/Inner.vue'
import { assetAmount, assetToBase } from '@xchainjs/xchain-util'

const Mappers = Vue.extend({
  computed: {
    ...solanaClientModuleMapper.mapGetters([
      'formattedBalance',
      'formattedTxs',
      'isSolTxsLoading',
      'isSolBalanceLoading',
    ]),
  },
  methods: {
    ...solanaClientModuleMapper.mapActions(['fetchBalance', 'fetchTxs', 'transfer', 'setNetwork']),
    ...walletModuleMapper.mapGetters(['seedPhraseByAddressAndNet']),
    ...walletModuleMapper.mapActions(['fetchWallets']),
  },
})

@Component({ components: { Inner } })
export default class SolanaPage extends Mappers {
  @Prop() coin: string
  @Prop() address: string
  @Prop() network: Network

  snackbarSuccess = false
  snackbarError = false

  recipient = ''
  amount = ''

  isSendButtonLoading = false

  intervalId: any

  headers = [
    { value: 'type', text: '', sortable: false },
    {
      text: 'Signature',
      value: 'formattedSignature',
    },
    { text: 'From address', value: 'formattedFromAddress' },
    { text: 'To address', value: 'formattedToAddress' },
    { text: 'Value', value: 'formattedValue' },
    { text: 'Date', value: 'date' },
  ]

  async onClickTransfer() {
    this.isSendButtonLoading = true
    const phrase = this.seedPhraseByAddressAndNet()(this.address, this.network) as string
    try {
      await this.transfer({
        phrase,
        address: this.address,
        recipient: this.recipient,
        amount: assetToBase(assetAmount(this.amount, 9)),
      })
      this.snackbarSuccess = true
      this.isSendButtonLoading = false
      this.recipient = ''
      this.amount = ''
    } catch (error) {
      if (error) {
        this.isSendButtonLoading = false
        this.snackbarError = true
      }
    }
  }

  public get changeAddressAndNetwork() {
    return this.address + this.network
  }

  geExplorerLink() {
    return getExplorerAddressUrl(this.address, this.network)
  }

  startIterval() {
    this.intervalId = setInterval(() => {
      this.fetchBalance(this.address)
    }, 10000)
  }

  @Watch('formattedBalance')
  onChangeBalance() {
    if (this.formattedBalance !== null) {
      this.fetchTxs(this.address)
    }
  }

  @Watch('changeAddressAndNetwork')
  onChangePublicKey() {
    this.setNetwork(this.network)

    this.fetchBalance(this.address)
  }

  mounted() {
    this.setNetwork(this.network)
    this.fetchBalance(this.address)
    this.startIterval()
  }

  beforeDestroy() {
    clearInterval(this.intervalId)
  }
}
</script>

<style lang="sass" scoped>
.v-solana-page
  &__pointer
    cursor: pointer
  &__link
    color: transparent
  &__balance
    height: 80px
    background: #F6F6F6
    border-radius: 16px
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 20px
    margin-bottom: 40px
    &-icon
      display: block
      margin-right: 16px
      width: 40px
      height: 40px
    &-value
      display: flex
      align-items: center
      font-weight: 700
      font-size: 24px
      line-height: 20px
      letter-spacing: 0.25px
      color: #374047
    &-text
      font-weight: 700
      font-size: 18px
      line-height: 20px
      letter-spacing: 0.25px
      color: #CDC6C5
</style>