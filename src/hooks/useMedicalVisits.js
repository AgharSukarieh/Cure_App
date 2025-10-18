import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import Moment from 'moment';
import { get } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';

/**
 * Custom Hook لإدارة الزيارات الطبية
 */
const useMedicalVisits = (currentUser, medicalId, selectedDate) => {
    const [visits, setVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    /**
     * دالة لجلب بيانات الزيارات الطبية مع pagination
     */
    const getMedicalVisits = useCallback(async (currentPage = 1, isLoadMore = false) => {
        // تعيين حالة التحميل
        if (isLoadMore) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            setPage(1);
            setHasMoreData(true);
        }
        
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🏥 جلب بيانات الزيارات من API');
            console.log('👤 نوع المستخدم:', currentUser?.role);
            
            // اختيار الـ endpoint والمعاملات حسب نوع المستخدم
            let endpoint, params;
            
            if (currentUser?.role === 'sales') {
                endpoint = Constants.visit.sales;
                params = {
                    start_visit: Moment(selectedDate).format('YYYY-MM-DD'),
                    sale_id: currentUser?.sales?.id,
                    page: currentPage,
                    limit: 15  // ✅ تغيير per_page إلى limit
                };
                console.log('🔍 Parameters (Sales):', params);
            } else {
                endpoint = Constants.visit.medical;
                params = {
                    medical_id: medicalId,
                    date: Moment(selectedDate).format('yyyy-MM-DD'),
                    page: currentPage,
                    per_page: 15
                };
                console.log('🔍 Parameters (Medical):', params);
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            const response = await get(endpoint, null, params);
            
            console.log('✅ استجابة API:', response);
            console.log('📊 عدد الزيارات:', response.data?.length || 0);
            
            const medicalVisits = response.data || [];
            
            if (medicalVisits.length > 0) {
                // تحويل البيانات إلى تنسيق الجدول
                const formattedVisits = medicalVisits.map((visit) => {
                    const isPharmacyVisit = visit.pharmacy_id || visit.pharmacy_name;
                    
                    // معالجة العينات
                    const sampleProducts = (visit.sample_product || []).map(sample => ({
                        id: sample.id,
                        product_name: sample.product?.name || 'N/A',
                        quantity: sample.quantity || 0,
                        public_price: sample.product?.public_price || 0,
                        pharmacy_price: sample.product?.pharmacy_price || 0
                    }));
                    
                    return {
                        id: visit.id,
                        visitType: isPharmacyVisit ? 'pharmacy' : 'doctor',
                        
                        // معلومات الطبيب/الصيدلية
                        doctorName: isPharmacyVisit 
                            ? (visit.name || `صيدلية #${visit.pharmacy_id}`)
                            : (visit.doctor?.name || `طبيب #${visit.doctor_id}`),
                        
                        specialty: isPharmacyVisit 
                            ? 'صيدلية' 
                            : (visit.doctor?.speciality?.name || visit.doctor?.speciality?.abbr || visit.specialty || 'طبيب'),
                        
                        specialtyAbbr: isPharmacyVisit 
                            ? 'PHARM' 
                            : (visit.doctor?.speciality?.abbr || 'DOC'),
                        
                        classification: visit.classification || '-',
                        
                        doctorPhone: visit.phone || '',
                        
                        doctorAddress: visit.address || '',
                        
                        doctorEmail: visit.email || '',
                        
                        // المدينة والمنطقة (مباشرة من visit في Sales)
                        cityName: visit.city || (visit.doctor?.city?.name) || '-',
                        
                        city_name: visit.city || (visit.doctor?.city?.name) || '-',
                        
                        areaName: visit.area || (visit.doctor?.area?.name) || '-',
                        
                        area_name: visit.area || (visit.doctor?.area?.name) || '-',
                        
                        city_id: visit.city_id || visit.doctor?.city_id,
                        area_id: visit.area_id || visit.doctor?.area_id,
                        
                        // معلومات الزيارة
                        appointmentTime: Moment(visit.start_visit).format('HH:mm'),
                        lastVisit: Moment(visit.start_visit).format('yyyy-MM-DD'),
                        status: visit.end_visit ? 'Visited' : 'Pending',
                        visitDate: Moment(visit.start_visit).format('yyyy-MM-DD'),
                        startVisit: visit.start_visit,
                        endVisit: visit.end_visit,
                        duration: visit.end_visit ? 
                            Moment(visit.end_visit).diff(Moment(visit.start_visit), 'minutes') + ' دقيقة' : 
                            'N/A',
                        notes: visit.notes || '',
                        
                        // الإحداثيات
                        startLatitude: visit.start_visit_latitude,
                        startLongitude: visit.start_visit_longitude,
                        endLatitude: visit.end_visit_latitude,
                        endLongitude: visit.end_visit_longitude,
                        
                        // معلومات إضافية للطبيب
                        doctor_id: visit.doctor_id,
                        medical_id: visit.medical_id,
                        medical_name: visit.medical?.name || '',
                        speciality_id: visit.doctor?.speciality_id,
                        doctor: visit.doctor,
                        
                        // معلومات إضافية للصيدلية
                        pharmacy_id: visit.pharmacy_id,
                        pharmacy_name: visit.name,
                        pharmacy: {
                            id: visit.pharmacy_id,
                            name: visit.name,
                            phone: visit.phone,
                            address: visit.address,
                            email: visit.email,
                            city: visit.city,
                            area: visit.area,
                            classification: visit.classification,
                            activate_status: visit.activate_status,
                            status: visit.status,
                            owner_name: visit.owner_name,
                            owner_phone: visit.owner_phone,
                            owner_email: visit.owner_email,
                            responsible_pharmacist_name: visit.responsible_pharmacist_name,
                        },
                        sale_id: visit.sale_id,
                        sale_name: visit.sale_name,
                        sale: visit.sale,
                        amount: visit.amount || 0,
                        credit_amount: visit.credit_amount || 0,
                        price_ceiling: visit.price_ceiling || 0,
                        method: visit.method || '-',
                        settlement: visit.settlement,
                        check_number: visit.check_number,
                        received_at: visit.received_at,
                        created_at: visit.created_at,
                        
                        // العينات الموزعة
                        sample_products: sampleProducts,
                        samples_count: sampleProducts.length,
                        samples_summary: sampleProducts.length > 0 ? 
                            sampleProducts.map(s => `${s.product_name} (${s.quantity})`).join(', ') : 
                            'لا توجد عينات'
                    };
                });
                
                console.log('✅ تم تحويل', formattedVisits.length, 'زيارة');
                
                // معالجة pagination metadata
                const meta = response.meta || response;
                const hasMore = meta?.last_page ? currentPage < meta.last_page : formattedVisits.length >= 15;
                setHasMoreData(hasMore);
                
                if (meta?.last_page) {
                    console.log(`✅ الصفحة ${meta.current_page || currentPage} من ${meta.last_page}`);
                    console.log(`📦 إجمالي الزيارات: ${meta.total}`);
                }
                
                // دمج البيانات أو استبدالها
                if (isLoadMore) {
                    setVisits(prevVisits => {
                        // إزالة التكرارات: دمج البيانات الجديدة مع القديمة وإزالة المكرر
                        const existingIds = new Set(prevVisits.map(v => v.id));
                        const newVisits = formattedVisits.filter(v => !existingIds.has(v.id));
                        return [...prevVisits, ...newVisits];
                    });
                    setPage(currentPage);
                    console.log(`➕ تمت إضافة ${formattedVisits.length} زيارة`);
                } else {
                    setVisits(formattedVisits);
                    console.log(`🔄 تم تعيين ${formattedVisits.length} زيارة`);
                }
            } else {
                console.log('⚠️ لا توجد زيارات لهذا التاريخ');
                if (!isLoadMore) {
                    setVisits([]);
                }
            }
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            return response;
        } catch (error) {
            console.error('❌ خطأ في جلب الزيارات الطبية:', error);
            if (!isLoadMore) {
                setVisits([]);
            }
            return null;
        } finally {
            if (isLoadMore) {
                setIsLoadingMore(false);
            } else {
                setIsLoading(false);
            }
        }
    }, [currentUser, medicalId, selectedDate]);

    /**
     * دالة لتحميل المزيد من البيانات
     */
    const loadMoreVisits = useCallback(() => {
        if (!isLoadingMore && hasMoreData) {
            const nextPage = page + 1;
            console.log('📄 تحميل الصفحة التالية:', nextPage);
            getMedicalVisits(nextPage, true);
        }
    }, [page, hasMoreData, isLoadingMore, getMedicalVisits]);

    /**
     * تحميل البيانات عند تغيير التاريخ أو المستخدم
     */
    useEffect(() => {
        if (currentUser?.id) {
            getMedicalVisits();
        }
    }, [currentUser?.id, selectedDate]);

    /**
     * دالة لإضافة زيارة جديدة إلى القائمة
     */
    const addVisit = useCallback((newVisitData) => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 استلام زيارة جديدة:', newVisitData);
        
        const isPharmacyVisit = newVisitData.pharmacy_id || newVisitData.pharmacy_name;
        const extractedStartVisit = newVisitData.start_visit?.date || newVisitData.start_visit || newVisitData.received_at || new Date();
        
        const formattedVisit = {
            id: newVisitData.id || Date.now(),
            visitType: isPharmacyVisit ? 'pharmacy' : 'doctor',
            doctorName: isPharmacyVisit 
                ? (newVisitData.pharmacy_name || newVisitData.pharmacy?.name || `صيدلية #${newVisitData.pharmacy_id}`)
                : (newVisitData.doctor?.name || `طبيب #${newVisitData.doctor_id}`),
            specialty: isPharmacyVisit 
                ? 'Pharmacy' 
                : (newVisitData.doctor?.speciality?.name || 'N/A'),
            specialtyAbbr: isPharmacyVisit 
                ? 'PHARM' 
                : (newVisitData.doctor?.speciality?.abbr || 'N/A'),
            classification: isPharmacyVisit 
                ? 'N/A'
                : (newVisitData.doctor?.classification || 'N/A'),
            doctorPhone: isPharmacyVisit 
                ? (newVisitData.pharmacy?.phone || '')
                : (newVisitData.doctor?.phone || ''),
            doctorAddress: isPharmacyVisit 
                ? (newVisitData.pharmacy?.address || '')
                : (newVisitData.doctor?.address || ''),
            doctorEmail: isPharmacyVisit 
                ? (newVisitData.pharmacy?.email || '')
                : (newVisitData.doctor?.email || ''),
            appointmentTime: Moment(extractedStartVisit).format('HH:mm'),
            lastVisit: Moment(extractedStartVisit).format('yyyy-MM-DD'),
            status: newVisitData.status || (newVisitData.end_visit ? 'Completed' : 'Active'),
            visitDate: Moment(extractedStartVisit).format('yyyy-MM-DD'),
            startVisit: newVisitData.start_visit?.date || newVisitData.start_visit || newVisitData.received_at || new Date().toISOString(),
            endVisit: newVisitData.end_visit || null,
            duration: newVisitData.end_visit ? 
                Moment(newVisitData.end_visit).diff(Moment(newVisitData.start_visit), 'minutes') + ' دقيقة' : 
                'Active',
            notes: newVisitData.notes || '',
            startLatitude: newVisitData.start_visit_latitude || newVisitData.start_latitude,
            startLongitude: newVisitData.start_visit_longitude || newVisitData.start_longitude,
            endLatitude: newVisitData.end_visit_latitude || newVisitData.end_latitude || null,
            endLongitude: newVisitData.end_visit_longitude || newVisitData.end_longitude || null,
            doctor_id: newVisitData.doctor_id,
            medical_id: newVisitData.medical_id,
            medical_name: newVisitData.medical?.name || '',
            speciality_id: newVisitData.doctor?.speciality_id,
            doctor: newVisitData.doctor,
            pharmacy_id: newVisitData.pharmacy_id,
            pharmacy_name: newVisitData.pharmacy_name,
            pharmacy: newVisitData.pharmacy,
            sale_id: newVisitData.sale_id,
            sale_name: newVisitData.sale_name,
            sale: newVisitData.sale,
            amount: newVisitData.amount || 0,
            credit_amount: newVisitData.credit_amount || 0,
            price_ceiling: newVisitData.price_ceiling || 0,
            method: newVisitData.method || 'N/A',
            settlement: newVisitData.settlement,
            check_number: newVisitData.check_number,
            received_at: newVisitData.received_at,
            created_at: newVisitData.created_at,
            sample_products: newVisitData.sample_product || [],
            samples_count: newVisitData.sample_product?.length || 0,
            samples_summary: newVisitData.sample_product?.length > 0 ? 
                newVisitData.sample_product.map(s => `${s.product?.name} (${s.quantity || 1})`).join(', ') : 
                'لا توجد عينات'
        };
        
        console.log('✅ البيانات المنسقة:', formattedVisit);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        setVisits(prevVisits => [formattedVisit, ...prevVisits]);
        
        // ✅ إزالة Alert المكرر - سيتم إظهار alert واحد فقط من MedicalReportScreen
    }, []);

    return {
        visits,
        isLoading,
        isLoadingMore,
        hasMoreData,
        getMedicalVisits,
        loadMoreVisits,
        addVisit
    };
};

export default useMedicalVisits;

