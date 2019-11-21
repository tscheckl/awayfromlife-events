<template>
    <div :id="id" class="loading-skeleton-element">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'loading-skeleton-element',
    props: {
        width: {
            type: String,
            default: '100%' 
        },
        height: {
            type: String, 
            default: '100%'
        }
    },
    data() {
        return {
            id: undefined
        }
    },
    created() {        
        this.id = Math.random().toString(36).substr(2, 9);
    },
    mounted() {
        document.getElementById(this.id).style.width = this.width;
        document.getElementById(this.id).style.height = this.height;
            
    }
}
</script>

<style lang="scss">
    @import "./src/scss/Utilities/_loadingSkeletonElement.scss";
</style>