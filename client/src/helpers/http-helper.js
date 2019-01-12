import axios from 'axios';
import { getToken } from './token-helper'
import config from '../config/config.dev'

const url = config.apiURL

export function get(endpoint) {
    return axios
        .get(url + endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // eslint-disable-next-line
                'Authorization': 'Bearer' + ' ' + getToken() // eslint-disable-next-line
            }
        });
}

export function post(endpoint, data) {
    return axios
        .post(url + endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // eslint-disable-next-line
                'Authorization': 'Bearer' + ' ' + getToken()
            }
        });
}

export function put(endpoint, data) {
    return axios
        .put(url + endpoint, data, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // eslint-disable-next-line
                'Authorization': 'Bearer' + ' ' + getToken()
            }
        });
}

export function deletes(endpoint) {
    return axios
        .delete(url + endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // eslint-disable-next-line
                'Authorization': 'Bearer' + ' ' + getToken()
            }
        });
}
