<script setup lang="ts">
import { generateTree } from "../components/Merkle";
const poll = generateTree(["abc", "cde", "efg"])
</script>

<template>
  <div class="min-h-[calc(100vh-216px)] flex items-center">
    <Head>
      <title>ZΞRO Demo</title>
    </Head>
    <Register />
    {{  }}
  </div>
</template>
