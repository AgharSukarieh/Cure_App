// Updated API Request - Now using new API configuration
import API from '../config/apiConfig';

// Legacy exports for backward compatibility
export const Api = API.baseURL;

export const LOGIN = `${API.baseURL}${API.auth.login}`;
export const GET_DOCTORS_LIST = `${API.baseURL}${API.doctor.doctors}`;
export const GET_PHARMACY = `${API.baseURL}${API.pharmacy.list}`;
export const GET_Products = `${API.baseURL}${API.product.products}`;
export const GET_Areas = `${API.baseURL}${API.area.area}`;
export const GET_CITY = `${API.baseURL}${API.area.city}`;
export const MED_ADD_DAILY = `${API.baseURL}${API.medical.add_daily_report}`;
export const MED_EDIT_DAILY = `${API.baseURL}${API.medical.edit_daily_report}`;

export const MED_GET_DAILY = `${API.baseURL}${API.medical.get_daily_report}`;
export const UPDATE_LOCATION = `${API.baseURL}${API.update_location}`;
export const GET_SPECIALTIES = `${API.baseURL}${API.area.specialties}`;
export const GET_MED_CLIENT = `${API.baseURL}${API.users.med_client}`;
export const GET_CLIENT_DOCTOR = `${API.baseURL}${API.users.client_doctor}`;
export const CREATE_DOCTOR = `${API.baseURL}${API.doctor.create_doctor}`;
export const CREATE_PHARMACY = `${API.baseURL}${API.pharmacy.create_pharmacy}`;
export const ADD_PHARMACY_IMAGE = `${API.baseURL}${API.pharmacy.add_image}`;

export const MED_ADD_DAILYSCHEDULE = `${API.baseURL}${API.medical.add_daily_schedule}`;
export const MED_GET_DAILYSCHEDULE = `${API.baseURL}${API.medical.get_daily_schedule}`;
export const SAL_ADD_REPORT = `${API.baseURL}${API.sales.add_report}`;
export const SAL_GET_REPORT = `${API.baseURL}${API.sales.reports}`;
export const SAL_ADD_IINVENTORY = `${API.baseURL}${API.sales.add_inventory}`;
export const SAL_GET_IINVENTORY = `${API.baseURL}${API.sales.inventory}`;
export const SAL_GET_LAST_ORDER = `${API.baseURL}${API.sales.last_order}`;
export const SAL_GET_PRODUCT_BY_BARCODE = `${API.baseURL}${API.sales.product_by_barcode}`;

export const SAL_GET_PHARMACY = `${API.baseURL}${API.sales.pharmacy}`;
export const GET_SEARCH_RESULTS = `${API.baseURL}${API.get_user_to_chat}`;

export const GET_CHAT_MESSAGES = `${API.baseURL}${API.single_chat.get_mess}`;
export const POST_ADD_MESSAGE = `${API.baseURL}${API.single_chat.send_mess}`;

export const GET_USER_GROUPS = `${API.baseURL}${API.group_chat.get_conv}`;
export const GET_GROUPS_MESSAGES = `${API.baseURL}${API.group_chat.get_mess}`;
export const POST_GROUP_MESSAGE = `${API.baseURL}${API.group_chat.send_mess}`;

// Export the new API configuration for modern usage
export { API };