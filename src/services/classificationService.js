import { get } from '../WebService/RequestBuilder';
import { BASE_URL } from '../config/apiConfig';

export const fetchClassifications = async () => {
  try {
    // Authorization يُضاف تلقائياً عبر RequestBuilder
    const res = await get('doctors/classifications');
    const data = res?.data || res || {};
    const list = data.classifications || [];
    if (!Array.isArray(list)) return [];
    return list.map(x => ({ value: x, label: String(x) }));
  } catch (e) {
    console.log('❌ Error fetching classifications:', e?.message || e);
    return [];
  }
};

export default { fetchClassifications };


