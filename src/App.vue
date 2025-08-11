<template>
    <div id="app">
        <Navbar />

        <main><RouterView /></main>

        <Footer />
    </div>
</template>

<script setup>
import Navbar from "./common/Navbar.vue";
import Footer from "./common/Footer.vue";
import { RouterView } from "vue-router";
</script>

<style scoped></style>
