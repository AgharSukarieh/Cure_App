import { get } from '../WebService/RequestBuilder';
import { apiClient } from '../config/apiConfig';

/**
 * جلب تخصصات الأطباء من API
 * يعيد مصفوفة بصيغة { value, label, abbr }
 */
export const fetchSpecialties = async () => {
  try {
    console.log('🔬 جلب التخصصات...');
    
    // جرّب المسار الجديد أولاً
    let specialtiesRaw = [];
    try {
      const res = await apiClient.get('specialties');
      const data = res?.data;
      if (Array.isArray(data)) {
        specialtiesRaw = data;
      } else if (data?.status === true && Array.isArray(data?.data)) {
        specialtiesRaw = data.data;
      }
    } catch (e) {
      console.log('⚠️ specialties endpoint not available, falling back to legacy');
    }

    if (!Array.isArray(specialtiesRaw) || specialtiesRaw.length === 0) {
      // Authorization يضاف تلقائياً من RequestBuilder (legacy)
      const response = await get('doctor/speciality');
      console.log('📥 Response (legacy speciality):', response);
      specialtiesRaw = response?.speciality || response?.data?.speciality || [];
    }

    if (!Array.isArray(specialtiesRaw)) {
      console.warn('⚠️ Specialties is not an array:', specialtiesRaw);
      return [];
    }

    const formatted = specialtiesRaw
      .map(spec => {
        if (!spec || typeof spec !== 'object') return null;
        const value = spec.value ?? spec.id ?? spec.speciality_id ?? spec.specialty_id;
        const label = spec.label ?? spec.name ?? spec.speciality_name ?? spec.specialty_name ?? '';
        return { value, label, abbr: spec.abbr };
      })
      .filter(Boolean);

    console.log(`✅ تم جلب ${formatted.length} تخصص`);
    return formatted;
  } catch (error) {
    // صمتاً: لا نطبع أخطاء التخصصات في الكونسول للمستخدم
    return [];
  }
};

export default { fetchSpecialties };


