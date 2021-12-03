<script setup>
import { shortAddress } from './util/index'

const chain_id = ref()
const getChainId = async () => {
  chain_id.value = await window.ethereum.send('eth_chainId')
}

const accounts = ref()
const prefix = ref()
setTimeout(() => {
  accounts.value = window.ethereum.selectedAddress
}, 0);
const requestAccount = () => {
  window.ethereum.send({
    method: 'eth_requestAccounts'
  }, res => {
    setTimeout(() => {
      prefix.value = 'get by req: '
      accounts.value = window.ethereum.selectedAddress
    }, 100);


    window.ethereum.on('accountsChanged', res => {
      prefix.value = 'get by ev: '
      accounts.value = res
    })

  })

}

const address = computed(() => {
  return shortAddress(accounts.value || '')
})


const swithNet = ref()
const toggle = ref(false)
const requestSwitchNetwork = () => {
  toggle.value = !toggle.value
  let testHeco = '0x100'
  let mainnet = '0x1'
  window.ethereum.send({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: toggle.value ? testHeco : mainnet }],
  }, (res) => {
    swithNet.value = res
  })
}
setTimeout(() => {
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
}, 200);
</script>

<template>
  <h3>Test app function</h3>
  <div>
    <button @click="getChainId">Get chain_id</button>
    <p>{{ chain_id }}</p>
  </div>
  <div>
    <button @click="requestSwitchNetwork">switchEthereumChain</button>
    <p>{{ swithNet }}</p>
  </div>
  <div>
    <button @click="requestAccount">requestAccount</button>
    <p>{{ prefix }}{{ address }}</p>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
ul li {
  list-style: none;
}
</style>
