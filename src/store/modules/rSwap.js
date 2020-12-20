import Web3 from 'web3'
const {toBN} = Web3.utils

const approveAmount = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

export default {
    namespaced:true,
    state: () => ({
        swappable: toBN(0),
        rHEGIC:toBN(0)
    }),
    mutations:{
      setSwappable(state, amount){state.swappable = amount},
      setrHEGIC(state, amount){state.rHEGIC = amount},
      subscribe(state, id){state.sID = id},
    },
    actions:{
      subscribe({dispatch, rootState}){
        rootState.contracts.rSwap.events.TokensSwapped()
          .on('data', () => dispatch('updateBalances'))
      },
      async updateBalances({commit, rootState}){
        const {rSwap, rHEGIC} = rootState.contracts
        const account = rootState.accounts[0]
        return Promise.all([
          rSwap.methods.availableAmount().call().then(toBN).then(x=>commit('setSwappable',x)),
          account ?
            rHEGIC.methods.balanceOf(account).call().then(toBN).then(x=>commit('setrHEGIC',x))
            : null,
        ])
      },
      async init({dispatch}){
        await dispatch('updateBalances')
        dispatch('subscribe')
      },
      async swap({dispatch, rootState}, amount) {
        const {rSwap, rHEGIC} = rootState.contracts
        const account = rootState.accounts[0]
        const allowance = await rHEGIC.methods.allowance(account, rSwap._address).call().then(toBN)
        if(allowance.lt(amount)) await dispatch('processContractInteraction', {
          name: 'approve',
          method: rHEGIC.methods.approve(rSwap._address, approveAmount)
        }, {root: true})

        await dispatch('processContractInteraction', {
          name: 'rSwap',
          method: rSwap.methods.swap(amount)
        }, {root: true})
        await dispatch('updateBalances')
      },
    }
}
