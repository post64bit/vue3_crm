<template>
    <form class="card auth-card" @submit.prevent='submitHandler'>
        <div class="card-content">
            <span class="card-title">{{$translate('registerHomeBookkeeping')}}</span>
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
                <label for="password">{{this.$translate('registerWritePassword')}}</label>
                <small
                    v-if="v$.password.$invalid && v$.password.$dirty && v$.password.$model"
                    class="helper-text"
                    :data-error="`${this.$translate('registerMinimumPassLeng')}
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
                    id="name"
                    type="text"
                    v-model.trim="v$.name.$model"
                    :class="{invalid: v$.name.$invalid && v$.name.$dirty}"
                >
                <label for="name">{{ $translate('profileName') }}</label>
                <small
                    v-if="!v$.name.$model && v$.name.$dirty"
                    class="helper-text invalid"
                    :data-error="this.$translate('registerWriteName')"
                ></small>
            </div>
            <p>
                <label>
                    <input type="checkbox" v-model="checkbox"/>
                    <span :class="checkbox ? '' : 'nonActive'">
                        {{this.$translate('registerAgree')}}
                    </span>
                </label>
            </p>
        </div>
        <div class="card-action">
            <div>
                <button
                    class="btn waves-effect waves-light auth-submit"
                    type="submit"
                >
                    {{this.$translate('registerRegButton')}}
                    <i class="material-icons right">send</i>
                </button>
            </div>

            <p class="center">
                {{this.$translate('registerHaveHadAcc')}}
                <router-link to="/login">{{this.$translate('registerLogIn')}}</router-link>
            </p>
            <p class="center">
                Did you forget the password ?
                <router-link to="/reset-password">Restore password</router-link>
            </p>
        </div>
    </form>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { email, minLength, required } from '@vuelidate/validators'

export default {
    name: 'Register',
    setup () {
        return { v$: useVuelidate() }
    },
    data () {
        return {
            email: '',
            password: '',
            name: '',
            checkbox: false
        }
    },
    validations () {
        return {
            email: { required, email },
            password: { required, min: minLength(6) },
            name: { required },
            checkbox: { mustBeTrue: v => v }
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
                password: this.password,
                name: this.name
            }
            try {
                await this.$store.dispatch('register', formData)
                this.$router.push('/login')
                this.$message('And now confirm your email address to log in')
            } catch (e) {}
        }
    }
}
</script>

<style scoped>
.nonActive {
    border-bottom: solid 2px red;
}
</style>
