<template>
    <div>
        <Loader :style="{position: 'absolute', top: '50%', left: '50%'}" v-if="loading"/>
        <div v-else class="app-main-layout">
            <Navbar @click_burger="isOpen = !isOpen"/>
            <Sidebar :key="func" v-model="isOpen"/>
            <main class="app-content" :class="{full: !isOpen}">
                <div class="app-page">
                    <router-view/>
                </div>
            </main>

            <div class="fixed-action-btn">
                <router-link
                    to="/record"
                    class="btn-floating btn-large blue"
                    href="#"
                    data-position="left"
                    :key="this.$translate('mainLayoutCreateReс')"
                    v-tooltip="this.$translate('mainLayoutCreateReс')"
                >
                    <i class="large material-icons">add</i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/app/Navbar'
import Sidebar from '../components/app/Sidebar'
import Loader from '../components/app/Loader'
import messages from '@/utils/messages'

export default {
    name: 'MainLayout',
    components: {
        Loader,
        Navbar,
        Sidebar
    },
    data () {
        return {
            isOpen: true,
            loading: true
        }
    },
    async mounted () {
        if (!Object.keys(this.$store.getters.info).length) {
            await this.$store.dispatch('fetchInfo')
        }
        this.loading = false
    },
    computed: {
        error () {
            return this.$store.getters.error
        },
        func () {
            return this.$store.getters.info.locale
        }
    },
    watch: {
        error (fbError) {
            console.log(fbError)
            this.$error(messages[fbError.code] || this.$translate('mainLayoutWentWrong'))
        }
    }
}
</script>

<style scoped>

</style>
