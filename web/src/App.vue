<template>
    <router-view v-slot="{ Component, route }">
        <transition
            class="router-container"
            :name="route.meta.transition"
            :mode="route.meta.mode"
        >
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    height: 100%;
    overflow: hidden;
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

.router-container {
    overflow: hidden;
}

.slide-left,
.slide-right {
    &-enter-active,
    &-leave-active {
        position: fixed;
        width: 100%;
        min-height: 100vh;
        top: 0;
    }
}
$duration: 0.3s;

// router view
.slide-right-enter-active {
    transition: transform $duration ease-in-out;
    z-index: 2;
    transform: translateX(100%);
}
.slide-right-enter-to {
    z-index: 2;
    transform: translateX(0%);
}
.slide-right-leave-active {
    z-index: -1;
}
.slide-right-leave-to {
    z-index: -1;
}
// router view back

.slide-left-leave-active {
    transition: transform $duration ease-in-out;
    z-index: 2;
    transform: translateX(0%);
}
.slide-left-leave-to {
    z-index: 2;
    transform: translateX(100%);
}
</style>
