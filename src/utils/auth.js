import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIdKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(id) {
  return Cookies.set(UserIdKey, id)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
