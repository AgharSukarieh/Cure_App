import { get } from '../WebService/RequestBuilder';

/**
 * جلب تخصصات الأطباء من API
 * يعيد مصفوفة بصيغة { value, label, abbr }
 */
export const fetchSpecialties = async () => {
  try {
    console.log('🔬 جلب التخصصات...');

    // Authorization يضاف تلقائياً من RequestBuilder
    const response = await get('doctor/speciality');

    console.log('📥 Response (speciality):', response);

    // الاستجابات المحتملة: { speciality: [...] } أو { data: { speciality: [...] } }
    const specialtiesRaw = response?.speciality || response?.data?.speciality || [];

    if (!Array.isArray(specialtiesRaw)) {
      console.warn('⚠️ Specialties is not an array:', specialtiesRaw);
      return [];
    }

    const formatted = specialtiesRaw.map(spec => ({
      value: spec.id,
      label: spec.name,
      abbr: spec.abbr,
    }));

    console.log(`✅ تم جلب ${formatted.length} تخصص`);
    return formatted;
  } catch (error) {
    console.error('❌ خطأ في جلب التخصصات:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

export default { fetchSpecialties };


