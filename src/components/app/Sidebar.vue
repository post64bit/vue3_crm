<template>
    <ul :key="func" class="sidenav app-sidenav" :class="{'open': modelValue}" style="margin-top: 60px; max-width: 20%">
        <router-link
            @click="$emit('click_burger')"
            v-for="link in links"
            :to="link.url"
            :key="link.url"
        >
            <li :class="{'active': link.url === $route.path}">
                <a href="#" class="waves-effect waves-orange pointer">
                    {{link.title}}
                </a>
            </li>
        </router-link>
    </ul>
</template>

<script>
export default {
    name: 'Sidebar',
    props: {
        modelValue: {
            type: Boolean
        }
    },
    data () {
        return {
            links: [
                { title: this.$translate('sidebarBill'), url: '/' },
                { title: this.$translate('sidebarHistory'), url: '/history' },
                { title: this.$translate('sidebarPlanning'), url: '/planning' },
                { title: this.$translate('sidebarRecord'), url: '/record' },
                { title: this.$translate('sidebarCategories'), url: '/categories' }
            ]
        }
    },
    mounted () {
        if (window.innerWidth < 900) {
            this.links.push({ title: 'Profile', url: '/profile' })
        }
    }
}
</script>

<style scoped>

</style>
