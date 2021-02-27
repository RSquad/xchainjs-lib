import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { Balance, Network } from '@xchainjs/xchain-client'
import { formatDate, sliceString } from '@/utils/index'
import { isEmpty } from 'lodash'
import { Client } from '@xchainjs/xchain-ethereum'
import { BaseAmount, baseToAsset } from '@xchainjs/xchain-util'

export type Asset = {
  chain: 'ETH'
  symbol: string
  ticker: string
}

// type TFieldAmount = { type: 'BASE'; amount: () => BigNumber; decimal: number }
type TItemFrom = {
  from: string
  amount: BaseAmount
}
type TItemTo = {
  to: string
  amount: BaseAmount
}
export interface EthTx {
  asset: Asset
  from: TItemFrom[]
  to: TItemTo[]
  date: Date
  type: 'transfer'
  hash: string
  input?: string
}

function formatTx(item: EthTx) {
  return {
    ...item,
    fromAddress: item.from[0].from,
    toAddress: item.to[0].to,
    hash: item.hash,
    formattedFromAddress: sliceString(item.from[0].from),
    formattedToAddress: sliceString(item.to[0].to),
    value: item.to[0].amount.amount().toNumber(),
    formattedValue: baseToAsset(item.to[0].amount)
      .amount()
      .toFixed(8),
    formattedHash: sliceString(item.hash),
    date: formatDate(item.date),
    message: item.input && Buffer.from(item.input.split('0x')[1], 'hex').toString('utf8'),
  }
}
export const defaultClientProps = {
  infuraCreds: {
    projectId: 'a8f3395b2a894b72a891ee7ab31b47ce',
    projectSecret: '',
  },
  etherscanApiKey: 'PRDAHTV89FAQHNBH2K5JYHAM1ED53J5UBU',
}

export const getExplorerAddressUrl = (address: string, network: Network) => {
  switch (network) {
    case 'testnet':
      return `https://ropsten.etherscan.io/address/${address}`
    case 'mainnet':
      return `https://etherscan.io/address/${address}`
  }
}

class EthClientState {
  txs: EthTx[] | null = null
  balances: Balance[] | null = null
  phrase: string
}

class EthClientGetters extends Getters<EthClientState> {
  public get formattedTxs() {
    if (this.state.txs === null) return null
    if (isEmpty(this.state.txs)) return []
    return this.state.txs.map(item => formatTx(item))
  }

  public get formatBalance(): any {
    if (this.state.balances === null) return null
    return baseToAsset(this.state.balances[0].amount)
      .amount()
      .toFixed(8)
  }

  public get balance(): Balance | null {
    if (isEmpty(this.state.balances) || this.state.balances === null) return null
    return this.state.balances[0]
  }

  public get isEthTxsLoading(): boolean {
    return this.state.txs === null
  }

  public get isEthBalanceLoading(): boolean {
    return this.state.balances === null
  }
}

class EthClientMutations extends Mutations<EthClientState> {
  public setTxs(payload: EthTx[]) {
    this.state.txs = payload
  }

  public setBalances(payload: Balance[]) {
    this.state.balances = payload
  }

  setPhrase(phrase: string) {
    this.state.phrase = phrase
  }

  clearTxs() {
    this.state.txs = null
  }

  clearBalance() {
    this.state.balances = null
  }
}

class EthClientActions extends Actions<EthClientState, EthClientGetters, EthClientMutations, EthClientActions> {
  public async setTxs(txs: EthTx[]) {
    this.mutations.setTxs(txs)
  }

  public setBalances(balances: Balance[]) {
    this.mutations.setBalances(balances)
  }

  public async transfer({ amount, recipient, memo, network }: any) {
    const client = new Client({ ...defaultClientProps, network, phrase: this.state.phrase })
    await client.transfer({
      amount,
      recipient,
      memo,
    })
  }

  public async fetchBalances({ address, network }: { address: string; network: Network }) {
    const client = new Client({ ...defaultClientProps, network, phrase: this.state.phrase })
    const balances = await client.getBalance(address)
    this.actions.setBalances(balances)
  }

  public async fetchTxs({ network, address }: { network: Network; address: string }) {
    const client = new Client({ ...defaultClientProps, network, phrase: this.state.phrase })
    const { txs } = await client.getTransactions({ limit: 10, address })
    this.actions.setTxs(txs as EthTx[])
  }

  setPhrase(phrase: string) {
    this.mutations.setPhrase(phrase)
  }

  clearEthTxs() {
    this.mutations.clearTxs()
  }

  clearEthBalance() {
    this.mutations.clearBalance()
  }
}

export const ethClient = new Module({
  state: EthClientState,
  getters: EthClientGetters,
  mutations: EthClientMutations,
  actions: EthClientActions,
})

export const ethClientModuleMapper = createMapper(ethClient)
