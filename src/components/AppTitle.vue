<template>
    <span class="mnemo-logo ml-2 mr-5">mnem<v-icon class="mnemo-logo-icon"> mdi-check-circle-outline</v-icon>
        <slot></slot>
    </span>
</template>
<script>
export default {
    props: ['prependText'],
}
</script>
<style>
.mnemo-logo {
    font-size: 1.4rem !important;
    font-weight: 500;
    line-height: 2rem;
    /* letter-spacing: 0.0125em !important;*/
    letter-spacing: 0.12em !important;
    font-family: "Roboto", sans-serif !important;
}

.mnemo-logo-icon {
    font-size: 1rem !important;
    padding-bottom: 1.2px;
}
</style>