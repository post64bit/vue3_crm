<template>
    <nav class="navbar orange lighten-1">
        <div class="nav-wrapper">
            <div class="navbar-left">
                <a href="#" @click="$emit('click_burger')">
                    <i class="material-icons black-text">dehaze</i>
                </a>
                <span class="black-text">{{dateFilter()}}</span>
            </div>

            <ul class="right hide-on-small-and-down">
                <li>
                    <a
                        :style="{minWidth: '150px'}"
                        class="dropdown-trigger black-text"
                        href="#"
                        data-target="dropdown"
                        ref="dropdown"
                    >
                        {{ name }}
                        <i class="material-icons right">arrow_drop_down</i>
                    </a>

                    <ul id='dropdown' class='dropdown-content'>
                        <li>
                            <router-link to="/profile" class="black-text">
                                <i class="material-icons">account_circle</i>{{$translate('navbarProfile')}}
                            </router-link>
                        </li>
                        <li class="divider" tabindex="-1"></li>
                        <li>
                            <a href="#" class="black-text" @click.prevent="logout">
                                <i class="material-icons">assignment_return</i>{{$translate('navbarExit')}}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data () {
        return {
            date: new Date(),
            interval: null,
            dropdown: null
        }
    },
    mounted () {
        this.dropdown = M.Dropdown.init(this.$refs.dropdown)
        this.interval = setInterval(() => {
            this.date = new Date()
        }, 1000)
    },
    computed: {
        name () {
            return this.$store.getters.info.name
        }
    },
    methods: {
        async logout () {
            await this.$store.dispatch('logout')
            this.$router.push('/login?message=logout')
        },
        dateFilter (format = 'datetime') {
            const options = {}
            if (format.includes('date')) {
                options.day = '2-digit'
                options.year = 'numeric'
                options.month = 'long'
            }
            if (format.includes('time')) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }
            return new Intl.DateTimeFormat(this.$store.getters.info.locale || 'ru-RU', options)
                .format(new Date(this.date))
        }

    },
    beforeUnmount () {
        clearInterval(this.interval)
        if (this.dropdown && this.dropdown.destroy) this.dropdown.destroy()
    }
}
</script>

<style scoped>

</style>
