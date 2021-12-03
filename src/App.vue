<script setup>
import { shortAddress } from './util/index'
import { ethers } from 'ethers'
import { ChainParam } from './const'
import MetaMaskOnboarding from '@metamask/onboarding'

// attension: page in wallet dapp browser can not swith net

const onboarding = new MetaMaskOnboarding()

const accounts = ref()
const chain_id = ref()


const provider = markRaw(new ethers.providers.Web3Provider(window.ethereum))
const signer = markRaw(provider.getSigner())

accounts.value = window.ethereum.selectedAddress

window.ethereum.on('chainChanged', () => {
  window.location.reload();
});


// unit8 chain_id
const getChainId = async () => {
  chain_id.value = await signer.getChainId()
}

const prefix = ref()
const requestAccount = async () => {
  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    //will check brower to open extension download url or official site
    onboarding.startOnboarding()
  }
  if (window.ethereum) {
    await window.ethereum.enable()

    const address = await signer.getAddress()
    accounts.value = address

    window.ethereum.on('accountsChanged', res => {
      prefix.value = 'get by ev: '
      accounts.value = res
    })
  }
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
  let chainId = toggle.value ? testHeco : mainnet
  try {
    await switchNetwork(chainId)
  } catch (error) {
    console.log('error swith network')
    await addNetwork()
    switchNetwork(chainId)
  }
}
const switchNetwork = (chainId) => {
  return provider.send('wallet_switchEthereumChain', [{ chainId }])
}
const addNetwork = async () => {
  return await provider.send('wallet_addEthereumChain', [ChainParam])
}


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
