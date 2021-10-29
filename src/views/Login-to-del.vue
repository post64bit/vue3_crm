<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Delete account</span>
            <div class="input-field">
                <input
                    id="email"
                    type="text"
                    v-model.trim="v$.email.$model"
                    :class="{invalid: v$.email.$invalid && v$.email.$dirty}"
                >
                <label for="email">{{$translate('registerEmail')}}</label>
                <small
                    v-if="v$.email.$invalid && v$.email.$dirty && v$.email.$model"
                    class="helper-text invalid"
                    :data-error="this.$translate('registerWrongEmail')"
                ></small>
                <small
                    v-else-if="!v$.email.$model && v$.email.$dirty"
                    class="helper-text invalid"
                    :data-error="this.$translate('registerWriteEmail')"
                ></small>
            </div>
            <div class="input-field">
                <input
                    id="password"
                    type="password"
                    autocomplete="off"
                    v-model.trim="v$.password.$model"
                    :class="{invalid: v$.password.$invalid && v$.password.$dirty}"
                >
                <label for="password">{{$translate('registerWritePassword')}}</label>
                <small
                    v-if="v$.password.$invalid && v$.password.$dirty && v$.password.$model"
                    class="helper-text"
                    :data-error="`${this.$translate('registerWritePassword')}
                                  ${v$.password.min.$params.min}
                                  ${this.$translate('registerNowIsOnly')}
                                  ${v$.password.$model.length}`"
                ></small>
                <small
                    v-else-if="!v$.password.$model && v$.password.$dirty"
                    class="helper-text "
                    :data-error="this.$translate('registerWritePassword')"
                ></small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit red"
                    type="submit"
                >
                    Delete
                    <i class="material-icons right">delete</i>
                </button>
            </div>

            <p class="center">
                Don't want to delete account?
                <router-link to="/profile">return to profile</router-link>
            </p>
        </div>
    </form>

</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import messages from '../utils/messages'

export default {
    name: 'Login-to-del',
    setup () {
        return { v$: useVuelidate() }
    },
    data () {
        return {
            email: '',
            password: ''
        }
    },
    validations () {
        return {
            email: { required, email },
            password: { required, min: minLength(6) }
        }
    },
    mounted () {
        if (messages[this.$route.query.message]) {
            this.$message(messages[this.$route.query.message])
        }
    },
    methods: {
        async submitHandler () {
            if (this.v$.$invalid) {
                this.v$.$touch()
                return
            }
            const formData = {
                email: this.email,
                password: this.password
            }
            try {
                const emailVerified = await this.$store.dispatch('login', formData)
                if (!emailVerified) {
                    this.$message('Please verify your email to log in!')
                } else {
                    this.$router.push('/login')
                }
                await this.$store.dispatch('deleteAccount')
                this.$message('Your account was deleted :(')
            } catch (e) {}
        }
    }
}
</script>

<style scoped>

</style>
