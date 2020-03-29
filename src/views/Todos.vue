<template>
    <v-container class="fill-height" fluid>
        <v-btn fab dark fixed bottom right color="primary" @click="editItem(undefined)">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-dialog v-model="dialogEdit" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Compose Todo</span>
                </v-card-title>
                <v-card-text class="mt-2">
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field :rules="[rules.required]" v-model="editedTodo.title" label="Title"></v-text-field>
                        <v-text-field :rules="[rules.required]" v-model="editedTodo.description" label="Description"></v-text-field>
                        <v-radio-group label="Priority" v-model="editedTodo.priority">
                            <v-radio label="High" value="High" color="red"></v-radio>
                            <v-radio label="Moderate" value="Moderate" color="orange"></v-radio>
                            <v-radio label="Low" value="Low" color="green"></v-radio>
                        </v-radio-group>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="close">Cancel</v-btn>
                    <v-btn text :disabled="saveDisabled" color="primary" @click="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogCancel" max-width="290">
            <v-card>
                <v-card-title class="headline">Are you sure?</v-card-title>
                <v-card-text>
                    This todo will be permanently deleted
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="deleteItem()">
                        Proceed
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-layout child-flex>
            <v-card align="center" class="mb-12 mx-auto elevation-6" justify="center" max-width="1000">
                <v-card-title>
                    <span class="headline">My Todos</span>
                </v-card-title>
                <v-card-text align="left">
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search"></v-text-field>
                    <v-simple-table v-if="!isMobile">
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="subtitle-2 text-left">Title</th>
                                    <th class="subtitle-2 text-left">Description</th>
                                    <th class="subtitle-2 text-left">Priority</th>
                                    <th class="subtitle-2 text-left" align="right">Actions</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="todo in filteredTodos" :key="todo.id">
                                    <td class="subtitle-1">{{todo.title}}</td>
                                    <td>{{todo.description}}</td>
                                    <td>
                                        <v-chip :color="getColor(todo.priority)" dark>{{ todo.priority }}</v-chip>
                                    </td>
                                    <td align="right">
                                        <v-icon small class="mr-2" @click="editItem(todo.id)">
                                            mdi-pencil
                                        </v-icon>
                                        <v-icon small @click="deleteItemDialog(todo.id)">
                                            mdi-delete
                                        </v-icon>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                    <div v-else>
                        <v-data-iterator content-tag="v-layout" row wrap :items="filteredTodos" no-data-text="Add a todo." hide-default-footer>
                            <v-flex slot="item" slot-scope="props">
                                <v-card class="mb-4">
                                    <v-card-title>
                                        <h4>{{ props.item.title }}</h4>
                                    </v-card-title>
                                    <v-divider></v-divider>
                                    <v-list dense>
                                        <v-list-item>
                                            <v-list-item-content>Description:</v-list-item-content>
                                            <v-list-item-content class="align-end">{{ props.item.description }}</v-list-item-content>
                                        </v-list-item>
                                        <!-- Some additional item details, et. al -->
                                        <v-list-item>
                                            <v-list-item-content>Priority:</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                <span>
                                                    <v-chip small :color="getColor(props.item.priority)" dark>{{ props.item.priority }}</v-chip>
                                                </span>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                    <v-card-actions align="right">
                                        <v-spacer></v-spacer>
                                        <v-btn text>
                                            <v-icon small @click="editItem(props.item.id)">
                                                mdi-pencil
                                            </v-icon>
                                        </v-btn>
                                        <v-btn text>
                                            <v-icon small @click="deleteItemDialog(props.item.id)">
                                                mdi-delete
                                            </v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-flex>
                        </v-data-iterator>
                    </div>
                    <div align="center" v-if="loading" class="mt-4">
                        <p>Loading... Please wait</p>
                        <v-progress-linear class="mt-4" color="primary" indeterminate rounded height="6"></v-progress-linear>
                    </div>
                </v-card-text>
            </v-card>
        </v-layout>
    </v-container>
</template>
<script>
const fuzzysort = require('fuzzysort')
import { v4 as uuidv4 } from 'uuid';
export default {
    data() {
        return {
            loading: false,
            search: '',
            isMobile: undefined,
            dialogEdit: false,
            dialogCancel: false,
            editedId: undefined,
            editedTodo: {
                title: '',
                description: '',
                priority: '',
            },
            todos: [],
            valid: false,
            rules: { required: value => !!value || 'Required.' },
        }
    },
    computed: {
        saveDisabled() {
            return !(this.editedTodo.title && this.editedTodo.description && this.valid)
        },
        searchResults() {
            const results = fuzzysort.go(this.search, this.todos, { key: 'text' })
            return results.map((result) => { return result.obj.id })
        },
        filteredTodos() {
            if (this.search) {
                return this.todos.filter(todo => this.searchResults.includes(todo.id))
            } else {
                return this.todos
            }
        }
    },
    methods: {
        editItem(id) {
            function getDefaultTodo() {
                const id = uuidv4()
                return {
                    title: '',
                    description: '',
                    priority: 'Low',
                    id: id
                }
            }
            this.editedId = id
            this.editedTodo = id == undefined ? getDefaultTodo() : this.todos.filter(todo => todo.id == id)[0]
            this.dialogEdit = true
            if (this.$refs.form) { this.$refs.form.resetValidation() }
        },
        deleteItemDialog(id) {
            this.dialogCancel = true
            this.deleteid = id
        },
        deleteItem() {
            this.todos = this.todos.filter(todo => todo.id != this.deleteid)
            this.deleteid = undefined
            this.dialogCancel = false
        },
        close() {
            this.dialogEdit = false
            setTimeout(() => {
                this.editedTodo = Object.assign({}, this.defaultItem)
                this.editedid = undefined
            }, 300)
        },
        save() {
            this.todos = this.todos.filter(todo => todo.id != this.editedId)
            this.todos.push(this.editedTodo)
            this.close()
        },
        getColor(priority) {
            if (priority == 'High') return 'red'
            else if (priority == 'Moderate') return 'orange'
            else return 'green'
        },
        showTodo(todo) {
            if (this.search) {
                return this.searchResults.includes(todo.id)
            } else true
        },
        onResize() {
            this.isMobile = window.innerWidth < 600
        }
    },
    beforeMount() {
        this.$eventHub.$on('to_top', this.resetResultLenght)
    },
    mounted() {
        if (!this.todos.length) {
            this.todos = [{
                    title: 'Holidays',
                    description: 'Book the next holidays',
                    priority: 'Low',
                }, {
                    title: 'Update',
                    description: 'Deploy the website at the version 3.4',
                    priority: 'Moderate'
                }, {
                    title: 'Shop',
                    description: 'Buy vinegar and oregano',
                    priority: 'Low'
                }, {
                    title: 'Bills Payments',
                    description: 'Pay electricity and water bills',
                    priority: 'High'
                }, {
                    title: 'Cook',
                    description: 'Make a cake',
                    priority: 'Low'
                },

            ].map((todo) => {
                return { ...todo,
                    ...{
                        id: uuidv4(),
                        text: `${todo.title} ${todo.description}`
                    }
                }
            })
        }
        // for non touch devices
        window.onscroll = () => {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            if (bottomOfWindow) {
                this.resultLength += 10
            }
        }
        // for touch devices
        window.addEventListener("touchmove", () => {
            let bottomOfWindow = Math.round(document.documentElement.scrollTop + window.innerHeight) / document.documentElement.offsetHeight >= 0.9;
            if (bottomOfWindow) {
                this.resultLength += 10
            }
        })
        this.onResize()
        window.addEventListener('resize', this.onResize, { passive: true })
        this.$eventHub.$on('to_top', this.resetResultLenght)
    },
    beforeDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true })
        }
    }
}
</script>