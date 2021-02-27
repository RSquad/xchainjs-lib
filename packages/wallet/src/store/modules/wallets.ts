import { Getters, Mutations, Actions, Module, createMapper } from "vuex-smart-module";
import { isEmpty, uniq } from "lodash";
import localForage from "localforage";
import { wallets } from "../../constants/index";

export interface WalletModel {
  id: number;
  name: string;
  blockchain: string;
  coin: string;
  network: string;
  address: string;
  publicKey?: string;
  privateKey?: string | null;
  seedPhrase?: string;
}

class WalletState {
  wallets: WalletModel[] = [];
}

class WalletGetters extends Getters<WalletState> {
  public get getUniqBlockchains() {
    if (!this.state.wallets) {
      return [];
    }
    return uniq(this.state.wallets.map((item) => item.blockchain));
  }

  public get wallets(): WalletModel[] {
    return this.state.wallets;
  }

  public get walletsByBlockchain() {
    return (blockchain: string) => this.state.wallets.filter((item) => item.blockchain === blockchain);
  }

  public get walletsByCoin() {
    return (coin: string) => this.state.wallets.filter((item) => item.coin === coin);
  }

  public get walletByAddressAndNet() {
    return (address: string, network: string) =>
      this.state.wallets.find((item) => item.address === address && item.network === network);
  }

  public get seedPhraseByAddressAndNet() {
    return (address: string, network: string) =>
      this.state.wallets.find((item) => item.address === address && item.network === network)?.seedPhrase;
  }
}

class WalletMutations extends Mutations<WalletState> {
  setWallets(payload: WalletModel[]) {
    this.state.wallets = payload;
  }
}

class WalletActions extends Actions<WalletState, WalletGetters, WalletMutations, WalletActions> {
  public async fetchWallets() {
    const wallets: WalletModel[] = await localForage.getItem("wallets").then((wallets): WalletModel[] => {
      if (isEmpty(wallets)) return [];
      return wallets as WalletModel[];
    });
    this.mutations.setWallets(wallets);
  }

  public setTestWallets() {
    this.mutations.setWallets(wallets);
    localForage.setItem("wallets", wallets);
  }
}

export const wallet = new Module({
  state: WalletState,
  getters: WalletGetters,
  mutations: WalletMutations,
  actions: WalletActions,
});

export const walletModuleMapper = createMapper(wallet);
