import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { formatDate, sliceString } from '@/utils/index'

import {
  baseAmount,
  baseToAsset,
  BaseAmount,
} from '@xchainjs/xchain-util'
import { Client, SOL_DECIMAL } from "@xchainjs/xchain-solana";

import type {
  Network,
  Tx,
  TxHistoryParams,
  TxParams,
} from '@xchainjs/xchain-client'
import type { SolanaTx } from "@xchainjs/xchain-solana";

export type { Network } from '@xchainjs/xchain-client'


function formatTx(item: SolanaTx) {
  return {
    ...item,
    date: formatDate(+item.blockTime * 1000),
    value: item.transaction.message.instructions[0].parsed.info.lamports,
    formattedValue: baseToAsset(baseAmount(item.transaction.message.instructions[0].parsed.info.lamports, SOL_DECIMAL))
      .amount()
      .toFixed(SOL_DECIMAL),
    signature: item.transaction.signatures[0],
    fromAddress: item.transaction.message.instructions[0].parsed.info.source,
    toAddress: item.transaction.message.instructions[0].parsed.info.destination,
    formattedSignature: sliceString(item.transaction.signatures[0]),
    formattedFromAddress: sliceString(item.transaction.message.instructions[0].parsed.info.source),
    formattedToAddress: sliceString(item.transaction.message.instructions[0].parsed.info.destination),
  }
}

export const getExplorerAddressUrl = (address: string, network: Network): string => {
  const client = new Client({ network })
  return client.getExplorerAddressUrl(address)
}

class SolanaClientState {
  txs: SolanaTx[] | null = null
  balance: number | null = null
  network: Network = 'testnet'
}

class SolanaClientGetters extends Getters<SolanaClientState> {
  public get formattedTxs() {
    if (this.state.txs === null) return null
    return this.state.txs.map(item => formatTx(item))
  }

  public get balance(): number | null {
    return this.state.balance
  }

  public get formattedBalance(): any {
    if (this.state.balance === null) return null
    const lamports: string = this.state.balance.toString()
    const ba = baseAmount(lamports, SOL_DECIMAL)
    const asset = baseToAsset(ba)
    const formattedValue = asset.amount().toFixed(SOL_DECIMAL)

    return formattedValue
  }

  public get isSolTxsLoading(): boolean {
    return this.state.txs === null
  }

  public get isSolBalanceLoading(): boolean {
    return this.state.balance === null
  }

  public get network(): Network {
    return this.state.network
  }
}

class SolanaClientMutations extends Mutations<SolanaClientState> {
  setTxs(payload: SolanaTx[]) {
    this.state.txs = payload
  }
  setBalance(payload: number | null) {
    this.state.balance = payload
  }

  setNetwork(payload: Network) {
    this.state.network = payload
  }

  clearTxs() {
    this.state.txs = null
  }

  clearBalance() {
    this.state.balance = null
  }
}

class SolanaClientActions extends Actions<
  SolanaClientState,
  SolanaClientGetters,
  SolanaClientMutations,
  SolanaClientActions
> {
  public async setBalance(balance: number) {
    this.mutations.setBalance(balance)
  }

  public async setTxs(txs: SolanaTx[]) {
    this.mutations.setTxs(txs)
  }

  public async transfer({
    phrase,
    address,
    recipient,
    amount,
  }: {
    phrase: string
    address: string
    recipient: string
    amount: BaseAmount
  }) {
    const network = this.getters.network
    const client = new Client({ network, phrase })
    if(address != client.getAddress()) {
      throw new Error('Address doesn`t match phrase')
    }

    const params: TxParams = { amount, recipient }
    return client.transfer(params)
  }

  public async fetchBalance(address: string) {
    const network = this.getters.network
    const client = new Client({ network })
    const res = await client.getBalance(address)
    const value = res[0]?.amount?.amount()?.toNumber()

    this.mutations.setBalance(value)
    return value
  }

  public async fetchTxs(address: string) {
    const network = this.getters.network
    const client = new Client({ network })
    const params: TxHistoryParams = {
      address,
      limit: 10
    }
    const txPage = await client.getTransactions(params)
    const txs = await Promise.all(txPage.txs.map(tx => client.getTransactionData(tx.hash)))
    this.mutations.setTxs(txs.map((tx: Tx): SolanaTx =>
      (tx as any as { original: SolanaTx }).original
    ))
  }

  public setNetwork(network: Network) {
    this.mutations.setNetwork(network)
  }

  public clearSolTxs() {
    this.mutations.clearTxs()
  }

  public clearSolBalance() {
    this.mutations.clearBalance()
  }
}

export const solanaClient = new Module({
  state: SolanaClientState,
  getters: SolanaClientGetters,
  mutations: SolanaClientMutations,
  actions: SolanaClientActions,
})

export const solanaClientModuleMapper = createMapper(solanaClient)
