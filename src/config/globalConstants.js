// Import the new API configuration
import API from './apiConfig';

// Updated global constants using the new API structure
const base_URL = () => {
	return "http://10.42.0.1:8003/api/"; // Updated to 8003 as requested
};

export default {
	baseURL: base_URL(),
	storageTokenKeyName: "access_token",
	lang: "language",
	uId: "uId",
	role: "role",
	userData: "userData",
	visit_id: "visit_id",
	
	// Updated to use new API structure
	auth: {
		login: API.auth.login,
		logout: API.auth.logout,
		register: API.auth.register,
		delete_account: API.auth.delete_account
	},
	sales: {
		pharmacy: API.sales.pharmacy,
		reports: API.sales.reports,
		add_report: API.sales.add_report,
		collection: API.sales.collection,
		inventory: API.sales.inventory,
		add_inventory: API.sales.add_inventory,
		last_order: API.sales.last_order,
		// pharmacy_areas: API.sales.pharmacy_areas, // Not available in apiConfig
		orders: API.sales.orders,
		product_by_barcode: API.sales.product_by_barcode
	},
	medical: {
		reports: API.medical.reports,
		add_daily_report: API.medical.add_daily_report,
		edit_daily_report: API.medical.edit_daily_report,
		get_daily_report: API.medical.get_daily_report,
		add_daily_schedule: API.medical.add_daily_schedule,
		get_daily_schedule: API.medical.get_daily_schedule,
		frequncy_visits: API.medical.frequncy_visits,
		visits: API.medical.visits
	},
	users: {
		// cityArea: API.users.cityArea, // Not available in apiConfig
		user_orders: API.users.user_orders,
		order_details: API.users.order_details,
		med_client: API.users.med_client,
		client_doctor: API.users.client_doctor
	},
	doctor: {
		doctors: API.doctor.doctors,
		speciality: API.doctor.speciality,
		create_doctor: API.doctor.create_doctor
	},
	pharmacy: {
		list: API.pharmacy.list,
		create_pharmacy: API.pharmacy.create_pharmacy,
		add_image: API.pharmacy.add_image
	},
	area: {
		area: API.area.area,
		city: API.area.city,
		specialties: API.area.specialties,
		get_cities: API.area.get_cities
	},
	plans: {
		get_plans: API.plans,
	},
	visit: {
		sales: API.sales.visits,
		medical: API.medical.visits,
	},
	product: {
		products: API.product.products,
		sample_products: API.product.sample_products,
	},
	inventory: {
		get_inventory: API.sales.inventory,
	},
	orders: {
		add_order: API.orders.add_order,
		get_orders: API.orders.get_orders,
		sales_order: API.orders.sales_order,
		order_details: API.orders.order_details
	},
	return: {
		get_returns: API.orders.return_orders,
		add_returns: API.orders.return_product,
	},
	single_chat: {
		get_conv: API.chat.single_chat.get_conversations,
		get_mess: API.chat.single_chat.get_messages,
		send_mess: API.chat.single_chat.send_message,
		seen_chat: API.chat.single_chat.seen_chat,
	},
	group_chat: {
		get_conv: API.chat.group_chat.get_conversations,
		get_mess: API.chat.group_chat.get_messages,
		send_mess: API.chat.group_chat.send_message,
		seen_chat: API.chat.group_chat.seen_chat,
		create_group: API.chat.group_chat.create_group,
	},
	// get_user_to_chat: API.get_user_to_chat, // Not available in apiConfig
	get_cities: API.area.get_cities,
	update_location: API.area.update_location,
	
	// Additional database endpoints
	companies: {
		companies: API.companies
	},
	bonuses: {
		bonuses: API.bonuses
	},
	visits: {
		visits: API.visits,
		sale_visits: API.sale_visits
	},
	orderdetails: {
		orderdetails: API.orderdetails
	},
	
	// Export the new API configuration for modern usage
	API: API
};


// console.log("**************");
// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://makfi.ncitsolutions.com/api/client/auth/login',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//   },
//   data: {mobile_number: '+962798287580',},
// };

// try {
//   const response = await axios.request(config);
//   console.log(JSON.stringify(response.data));
//   console.log('1111111111111111');
// } catch (error) {
//   console.log('22222222222222222');
//   console.log(error.message);
// }