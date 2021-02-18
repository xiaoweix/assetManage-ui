import Vue from 'vue'
import axios from 'axios'
import { get, post } from 'src/network/http'

Vue.prototype.$axios = axios
Vue.prototype.$get = get
Vue.prototype.$post = post
