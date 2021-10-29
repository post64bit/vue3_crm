<template>
    <div class="center-align">
        <div class="preloader-wrapper active">
            <div ref="currentlyColor" class="spinner-layer" :class="color">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                <div class="circle"></div>
            </div><div class="circle-clipper right">
                <div class="circle"></div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loader',
    computed: {
        color () {
            const color = ['spinner-blue-only', 'spinner-red-only', 'spinner-green-only', 'spinner-yellow-only']
            const random = Math.floor(Math.random() * color.length)
            if (color[random] === localStorage.getItem('color')) {
                color.splice(color.indexOf(color[random]), 1)
                return color[Math.floor(Math.random() * color.length)]
            }
            return color[random]
        }
    },
    mounted () {
        localStorage.setItem('color', this.$refs.currentlyColor.className.split(' ')[1])
    }
}
</script>

<style scoped>

</style>
