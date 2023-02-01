<template>
    <router-view />
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    height: 100%;
}
html {
    height: 100%;
}
body {
    height: 98%;
    background-color: #21252b;
}
nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
:root {
    --design-unit: 3 !important;
}
</style>
