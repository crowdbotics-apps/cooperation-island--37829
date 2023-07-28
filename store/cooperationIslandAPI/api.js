import axios from "axios"
const cooperationIslandAPI = axios.create({
  baseURL: "https://cooperation-island--37829.botics.co",
  headers: { Accept: "application/json", "Content-Type": "application/json" }
})
function api_v1_access_code_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/access-code/`)
}
function api_v1_details_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/details/`)
}
function api_v1_details_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/details/`)
}
function api_v1_details_update(payload) {
  return cooperationIslandAPI.put(`/api/v1/details/`)
}
function api_v1_details_read(payload) {
  return cooperationIslandAPI.get(`/api/v1/details/${payload.id}/`)
}
function api_v1_details_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/details/${payload.id}/`)
}
function api_v1_details_update(payload) {
  return cooperationIslandAPI.put(`/api/v1/details/${payload.id}/`)
}
function api_v1_email_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/email/`)
}
function api_v1_feedback_read(payload) {
  return cooperationIslandAPI.get(`/api/v1/feedback/${payload.activity_type}/`)
}
function api_v1_feedback_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/feedback/${payload.activity_type}/`)
}
function api_v1_login_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/login/`)
}
function api_v1_privacy_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/privacy/`)
}
function api_v1_qualities_tell_us_about_you_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/qualities/tell-us-about-you/`)
}
function api_v1_refresh_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/refresh/`)
}
function api_v1_reset_password_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/reset-password/`)
}
function api_v1_reset_password_read(payload) {
  return cooperationIslandAPI.get(
    `/api/v1/reset-password/${payload.session_id}/`
  )
}
function api_v1_reset_password_update(payload) {
  return cooperationIslandAPI.post(
    `/api/v1/reset-password/${payload.session_id}/`
  )
}
function api_v1_score_fish_mind_reading_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/score/fish-mind-reading/`)
}
function api_v1_score_fish_mind_reading_create(payload) {
  return cooperationIslandAPI.post(
    `/api/v1/score/fish-mind-reading/`,
    payload.data
  )
}
function api_v1_score_tree_shaking_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/score/tree-shaking/`)
}
function api_v1_signup_create(payload) {
  return cooperationIslandAPI.post(`/api/v1/signup/`, payload.data)
}
function api_v1_terms_conditions_list(payload) {
  return cooperationIslandAPI.get(`/api/v1/terms-conditions/`)
}
function api_v1_users_update_avatar_id_partial_update(payload) {
  return cooperationIslandAPI.patch(`/api/v1/users/update_avatar_id/`)
}
function api_v1_verify_read(payload) {
  return cooperationIslandAPI.get(
    `/api/v1/verify/${payload.uidb64}/${payload.token}/`
  )
}
function rest_auth_login_create(payload) {
  return cooperationIslandAPI.post(`/rest-auth/login/`, payload.data)
}
function rest_auth_logout_list(payload) {
  return cooperationIslandAPI.get(`/rest-auth/logout/`)
}
function rest_auth_logout_create(payload) {
  return cooperationIslandAPI.post(`/rest-auth/logout/`)
}
function rest_auth_password_change_create(payload) {
  return cooperationIslandAPI.post(`/rest-auth/password/change/`, payload.data)
}
function rest_auth_password_reset_create(payload) {
  return cooperationIslandAPI.post(`/rest-auth/password/reset/`, payload.data)
}
function rest_auth_password_reset_confirm_create(payload) {
  return cooperationIslandAPI.post(
    `/rest-auth/password/reset/confirm/`,
    payload.data
  )
}
function rest_auth_registration_create(payload) {
  return cooperationIslandAPI.post(`/rest-auth/registration/`, payload.data)
}
function rest_auth_registration_verify_email_create(payload) {
  return cooperationIslandAPI.post(
    `/rest-auth/registration/verify-email/`,
    payload.data
  )
}
function rest_auth_user_read(payload) {
  return cooperationIslandAPI.get(`/rest-auth/user/`)
}
function rest_auth_user_update(payload) {
  return cooperationIslandAPI.put(`/rest-auth/user/`, payload.data)
}
function rest_auth_user_partial_update(payload) {
  return cooperationIslandAPI.patch(`/rest-auth/user/`, payload.data)
}
export const apiService = {
  api_v1_access_code_list,
  api_v1_details_list,
  api_v1_details_create,
  api_v1_details_update,
  api_v1_details_read,
  api_v1_details_create,
  api_v1_details_update,
  api_v1_email_create,
  api_v1_feedback_read,
  api_v1_feedback_create,
  api_v1_login_create,
  api_v1_privacy_list,
  api_v1_qualities_tell_us_about_you_create,
  api_v1_refresh_list,
  api_v1_reset_password_create,
  api_v1_reset_password_read,
  api_v1_reset_password_update,
  api_v1_score_fish_mind_reading_list,
  api_v1_score_fish_mind_reading_create,
  api_v1_score_tree_shaking_create,
  api_v1_signup_create,
  api_v1_terms_conditions_list,
  api_v1_users_update_avatar_id_partial_update,
  api_v1_verify_read,
  rest_auth_login_create,
  rest_auth_logout_list,
  rest_auth_logout_create,
  rest_auth_password_change_create,
  rest_auth_password_reset_create,
  rest_auth_password_reset_confirm_create,
  rest_auth_registration_create,
  rest_auth_registration_verify_email_create,
  rest_auth_user_read,
  rest_auth_user_update,
  rest_auth_user_partial_update
}
