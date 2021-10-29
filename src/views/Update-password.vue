<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Update password</span>
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
                <label for="password">Old password</label>
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
            <div class="input-field">
                <input
                    id="newPassword"
                    type="password"
                    autocomplete="off"
                    v-model.trim="v$.newPassword.$model"
                    :class="{invalid: v$.newPassword.$invalid && v$.newPassword.$dirty}"
                >
                <label for="newPassword">New password</label>
                <small
                    v-if="v$.newPassword.$invalid && v$.newPassword.$dirty && v$.newPassword.$model"
                    class="helper-text"
                    :data-error="`${this.$translate('registerWritePassword')}
                                  ${v$.newPassword.min.$params.min}
                                  ${this.$translate('registerNowIsOnly')}
                                  ${v$.newPassword.$model.length}`"
                ></small>
                <small
                    v-else-if="!v$.newPassword.$model && v$.newPassword.$dirty"
                    class="helper-text "
                    :data-error="this.$translate('registerWritePassword')"
                ></small>
            </div>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                >
                    Update password
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{ $translate('registerHaveAcc') }}
                <router-link to="/register">{{$translate('registerRegButton')}}</router-link>
            </p>
            <p class="center">
                Did you forget the password ?
                <router-link to="/reset-password">Restore password</router-link>
            </p>
            <p class="center">
                Do you have an account already ?
                <router-link to="/login">Login</router-link>
            </p>
        </div>
    </form>

</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import messages from '../utils/messages'

export default {
    name: 'Update-password',
    setup () {
        return { v$: useVuelidate() }
    },
    data () {
        return {
            email: '',
            password: '',
            newPassword: ''
        }
    },
    validations () {
        return {
            email: { required, email },
            password: { required, min: minLength(6) },
            newPassword: { required, min: minLength(6) }
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
                    this.$message('Now you can login with your new password')
                }
                await this.$store.dispatch('updatePassword', this.newPassword)
                await this.$store.dispatch('logout')
            } catch (e) {}
        }
    }
}
</script>

<style scoped>

</style>
