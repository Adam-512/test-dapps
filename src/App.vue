<script setup>
import { shortAddress } from './util/index'
import { ethers } from 'ethers'
import { ChainParam } from './const'

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()

const chain_id = ref()
// unit8 chain_id
const getChainId = async () => {
  chain_id.value = await signer.getChainId()
}

const accounts = ref()
const prefix = ref()
setTimeout(() => {
  accounts.value = window.ethereum.selectedAddress
}, 0);
const requestAccount = async () => {
  await window.ethereum.enable()

  const address = await signer.getAddress()
  accounts.value = address

  window.ethereum.on('accountsChanged', res => {
    prefix.value = 'get by ev: '
    accounts.value = res
  })

}

const address = computed(() => {
  return shortAddress(accounts.value || '')
})


const swithNet = ref()
const toggle = ref(false)
const requestSwitchNetwork = async () => {
  toggle.value = !toggle.value
  let testHeco = '0x100'
  let mainnet = '0x1'
  await requestAddNetwork()
  window.ethereum.send({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: toggle.value ? testHeco : mainnet }],
  }, (res) => {
    swithNet.value = res
  })
}
const requestAddNetwork = async () => {
  return await window.ethereum.send({ method: 'wallet_addEthereumChain', params: [ChainParam] }, () => { })
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
