import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { ethClient } from "./modules/eth-client";
import { solanaClient } from "./modules/solana-client";
import { wallet } from "./modules/wallets";

class RootState {}

class RootGetters extends Getters<RootState> {}

class RootMutations extends Mutations<RootState> {}

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {}

export default new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
  modules: { ethClient, solanaClient, wallet },
});
