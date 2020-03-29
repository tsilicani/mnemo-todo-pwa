<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center" class="mx-auto">
            <v-col cols="12" sm="8" md="4">
                <v-card max-width="350" class="mx-auto elevation-12">
                    <div v-if="$store.getters.userIsLoggedIn && $route.path == '/profile'">
                        <v-toolbar color="primary" dark flat>
                            <app-title> / Account</app-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-email</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>{{$store.getters.userEmail}}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon :color="$store.getters.userEmailIsVerified ? 'success' : 'error'">{{$store.getters.userEmailIsVerified ? 'mdi-check' : 'mdi-alert'}}</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>Email {{$store.getters.userEmailIsVerified ? 'verified' : 'not verified'}}
                                        <v-btn v-if="!$store.getters.userEmailIsVerified" small color="primary" class="ma-2" :disabled="submitLoading" :loading="submitLoading" @click="sendVerificationCode">Verify</v-btn>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-icon>
                                    <v-icon>mdi-key-change</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        <v-btn small color="primary" link to="newpassword">Change Password</v-btn>
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" @click="$eventHub.$emit('log_out')" block>
                                <v-icon left>mdi-location-exit</v-icon>Log Out
                            </v-btn>
                        </v-card-actions>
                    </div>
                    <div v-else>
                        <v-toolbar color="primary" dark flat>
                            <app-title> / {{viewText}}</app-title>
                        </v-toolbar>
                        <v-card-text>
                            <p v-if="($route.path == '/newpassword' || $route.path == '/forgot') && step == 0" class="mt-3">Press the button below to get the disposable code needed to change the password.
                            </p>
                            <p v-if="$route.path == '/login'" class="mt-3">Need a ToDoApp account? <router-link link to="signup">Sign Up</router-link>
                            </p>
                            <p v-if="$route.path == '/signup'" class="mt-3">Already have a ToDoApp account? <router-link link to="login">Log In</router-link>
                            </p>
                            <v-form v-model="valid" lazy-validation>
                                <v-text-field name="email" v-if="showEmailInput" v-bind="inputAttrs" v-model='input.email' label="Email" prepend-icon="mdi-email" :rules="[rules.required, rules.validEmail]" autocomplete="username" @animationstart="checkAnimation" />
                                <v-text-field name="code" label="Emailed code" v-model="input.code" v-if="showCodeInput" prepend-icon="mdi-key" :rules="[rules.required]" autocomplete="off" />
                                <v-text-field name="password" v-if="showPasswordInput" v-bind="inputAttrs" v-model='input.password' hint="At least 8 characters" counter :type="showPassword ? 'text' : 'password'" :label="passwordLabel" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" @click:append="showPassword = !showPassword" v-bind:autocomplete="autoCompletePassword" />
                            </v-form>
                            <p class="mt-3 mb-2">
                                <router-link v-if="$route.path == '/login'" link to="forgot">Forgot password?</router-link>
                            </p>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn :disabled="submitDisabled" block color="primary" @click="submit" :loading="submitLoading">{{submitText}}</v-btn>
                        </v-card-actions>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { signUp, signIn, sendCode, verifyEmail, resetPassword } from '../lib/dummy-auth'
import AppTitle from '../components/AppTitle'

export default {
    name: 'auth',

    components: { AppTitle },

    data() {
        return {
            user: {},
            showPassword: false,
            input: {
                email: '',
                password: '',
                code: ''
            },
            inputAttrs: {},
            valid: false,
            rules: {
                validEmail: v => /.+@.+\..+/.test(v) || 'E-mail must be valid.',
                required: value => !!value || 'Required.',
                min: v => v.length >= 8 || 'Min 8 characters.',
                emailMatch: () => ('The email and password you entered don\'t match.'),
            },
            submitLoading: false,
            step: 0,
        }
    },

    computed: {
        showEmailInput() {
            if (this.$store.getters.userIsLoggedIn) { return false }
            if (this.$route.path == '/verify') { return false }
            return true
        },
        showCodeInput() {
            if (this.$route.path == '/verify') { return true }
            return (this.$route.path == '/forgot' || this.$route.path == '/newpassword') && this.step == 1
        },
        showPasswordInput() {
            if (this.$route.path == '/verify') { return false }
            if (this.$route.path == '/forgot' || this.$route.path == '/newpassword') { return this.step == 1 }
            return true
        },
        passwordLabel() {
            return (this.$route.path == '/forgot' || this.$route.path == '/newpassword') ? 'New password' : 'Password'
        },
        autoCompletePassword: function() {
            if (this.$route.path == '/signup' || this.$route.path == '/forgot' || this.$route.path == '/newpassword') {
                return "new-password"
            } else {
                return "current-password"
            }
        },
        submitDisabled: function() {
            if (this.submitLoading) { return true }
            if (!this.valid) { return true }
            if (this.$route.path == '/verify') { return !(this.input.code) }
            if (this.$route.path == '/forgot' || this.$route.path == '/newpassword') {
                if (this.step == 0) {
                    return this.$store.getters.userIsLoggedIn ? false : !this.input.email
                }
                if (this.step == 1) { return this.$store.getters.userIsLoggedIn ? false : !(this.input.email && this.input.code && this.input.password) }
            }
            return !(this.input.email && this.input.password)
        },
        viewText: function() {
            if (this.$route.path == '/login') {
                return 'Log In'
            }
            if (this.$route.path == '/signup') {
                return 'Sign Up'
            }
            if (this.$route.path == '/newpassword' || this.$route.path == '/forgot') {
                return 'New password'
            }
            if (this.$route.path == '/verify') {
                return 'Verify'
            }
            return 'undefined_view'
        },
        submitText: function() {
            if (this.$route.path == '/login') {
                return 'Log In'
            }
            if (this.$route.path == '/signup') {
                return 'Sign Up'
            }
            if (this.$route.path == '/newpassword' || this.$route.path == '/forgot') {
                return this.step == 0 ? 'Get The Code' : 'Set Password'
            }
            if (this.$route.path == '/verify') {
                return 'Verify email'
            }
            return 'undefined_view'
        },
    },
    methods: {
        sendVerificationCode() {
            this.submitLoading = true
            sendCode(this.$store.getters.userEmail)
                .then(() => {
                    this.$router.push('verify')
                    this.snackbarMessage('We emailed you the verify code, check it out.')
                })
                .catch(err => { this.snackbarError(err.response.data) })
                .finally(() => { this.submitLoading = false })
        },
        checkAnimation(e) {
            if (e.animationName == "onAutoFillStart") {
                this.inputAttrs = { placeholder: ' ' }
            } else if (e.animationName == "onAutoFillCancel") {
                this.inputAttrs = {}
            }
        },
        snackbarMessage(text) { this.$eventHub.$emit('snackbar_on', text) },
        snackbarError(err) { this.$eventHub.$emit('snackbar_on', err.message ? err.message : 'An error is occurred.', 'error') },
        submit() {
            if (this.$route.path == '/signup') {
                this.submitLoading = true
                let isSignedUp = false
                signUp(this.input.email, this.input.password)
                    .then(() => {
                        isSignedUp = true
                        this.snackbarMessage('You are now signed up.')
                    })
                    .catch(err => {
                        this.snackbarError(err.response.data)
                    })
                    .finally(() => {
                        if (isSignedUp) {
                            signIn(this.input.email, this.input.password)
                                .then((response) => {
                                    this.$store.dispatch('setLoggedIn', response.data)
                                    this.snackbarMessage('You are now logged in.')
                                    this.$router.push('profile')
                                })
                                .catch(err => { this.snackbarError(err.response.data) })
                                .finally(() => { this.submitLoading = false })
                        } else { this.submitLoading = false }
                    })
            }
            if (this.$route.path == '/login') {
                this.submitLoading = true
                signIn(this.input.email, this.input.password)
                    .then((response) => {
                        this.$store.dispatch('setLoggedIn', response.data)
                        this.snackbarMessage('You are now logged in.')
                        this.$router.push('profile')
                    })
                    .catch(err => this.snackbarError(err.response.data))
                    .finally(() => { this.submitLoading = false })
            }
            if (this.$route.path == '/verify') {
                if (this.$store.getters.userIsLoggedIn) {
                    this.submitLoading = true
                    verifyEmail(this.$store.getters.userEmail, this.input.code)
                        .then(() => {
                            this.snackbarMessage('Your email is now verified.')
                            this.$store.dispatch('setVerificationDone')
                            this.$router.push('profile')
                        })
                        .catch(err => this.snackbarError(err.response.data))
                        .finally(() => { this.submitLoading = false })
                } else {
                    this.snackbarError({ message: 'You must be logged in to verify your email.' })
                    this.$router.push('login')
                }
            }
            if (this.$route.path == '/newpassword' || this.$route.path == '/forgot') {
                if (this.step == 0) {
                    this.submitLoading = true
                    sendCode(this.$store.getters.userIsLoggedIn ? this.$store.getters.userEmail : this.input.email)
                        .then(() => {
                            this.snackbarMessage('We emailed you the reset code, check it out.')
                            this.step = 1
                        })
                        .catch(err => this.snackbarError(err.response.data))
                        .finally(() => { this.submitLoading = false })
                }
                if (this.step == 1) {
                    this.submitLoading = true
                    let isResetDone = false
                    resetPassword(this.$route.path == '/forgot' ? this.input.email : this.$store.getters.userEmail, this.input.code, this.input.password)
                        .then(() => {
                            this.snackbarMessage('The new password has been set.')
                            isResetDone = true
                        })
                        .catch(err => this.snackbarError(err.response.data))
                        .finally(() => {
                            if (this.$route.path == '/forgot') {
                                if (isResetDone) {
                                    signIn(this.input.email, this.input.password)
                                        .then((response) => {
                                            this.$store.dispatch('setLoggedIn', response.data)
                                            this.snackbarMessage('You are now logged in.')
                                            this.$router.push('profile')
                                        })
                                        .catch(err => { this.snackbarError(err.response.data) })
                                        .finally(() => { this.submitLoading = false })
                                } else {
                                    this.submitLoading = false
                                }
                            } else {
                                this.submitLoading = false
                                this.$router.push('profile')
                            }
                        })
                }
            }
        },
    },
    beforeUpdate() {
        if (this.$route.path == '/profile' && !this.$store.getters.userIsLoggedIn) {
            this.$router.push('login')
        }
        if (!(this.$route.path == '/newpassword' || this.$route.path == '/forgot')) {
            this.step = 0
        }
    },
}
</script>
<style>
:-webkit-autofill {
    animation-name: onAutoFillStart;
}

:not(:-webkit-autofill) {
    animation-name: onAutoFillCancel;
}

@keyframes onAutoFillStart {
    from {}

    to {}
}

@keyframes onAutoFillCancel {
    from {}

    to {}
}
</style>