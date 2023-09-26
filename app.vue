<script lang="ts" setup>
import { Web3Auth } from "@web3auth/modal";

const web3auth = ref<Web3Auth>();

//Initialize within your constructor
onMounted(async() => {
  web3auth.value = new Web3Auth({
      clientId: "BM1Y5tLpww5mz5LEZOJg-CwBGvHYDgX5-vAQiOAXyKG_qxrV8SD2HJg0fcugvMmQvbrCiNNIcEpYl4UycoJXrdc",
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x1",
      },
      // enableLogging: true,
      uiConfig: {
        // loginMethodsOrder
        defaultLanguage: 'en',
        primaryButton: 'socialLogin',

      },
    })


await web3auth.value.initModal();


})

const connect = async() => {
  await web3auth.value!.connect();
}
</script>

<template>
  <div>
    <button @click="connect">Connect</button>
  </div>
</template>
