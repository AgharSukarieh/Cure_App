import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const SkuModel = ({ show, hide, data, submit }) => {
    const { t } = useTranslation();
    
    // ✅ جلب المدن والمناطق من Redux
    const userLocationData = useSelector(state => state.cities.userLocationData);
    const citiesFormatted = userLocationData?.citiesFormatted || [];
    const reduxAreas = userLocationData?.areas || [];
    
    // ✅ دالة للحصول على اسم المدينة من city_id
    const getCityName = (cityId) => {
        if (!cityId) return 'N/A';
        const city = citiesFormatted.find(c => c.value === cityId);
        console.log('🏙️ getCityName:', { cityId, city, citiesCount: citiesFormatted.length });
        return city?.label || `City #${cityId}`;
    };
    
    // ✅ دالة للحصول على اسم المنطقة من area_id
    const getAreaName = (areaId) => {
        if (!areaId) return 'N/A';
        const area = reduxAreas.find(a => a.value === areaId);
        console.log('📍 getAreaName:', { areaId, area, areasCount: reduxAreas.length });
        return area?.label || `Area #${areaId}`;
    };
    
    // ✅ Log البيانات عند فتح الـ Modal
    React.useEffect(() => {
        if (show && data) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📋 SkuModel Data:', {
                city_id: data?.city_id || data?.doctor?.city_id,
                area_id: data?.area_id || data?.doctor?.area_id,
                cityName: data?.cityName,
                areaName: data?.areaName,
                hasDoctor: !!data?.doctor,
                citiesInRedux: citiesFormatted.length,
                areasInRedux: reduxAreas.length
            });
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }, [show, data]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onSwipeComplete={() => setModalVisible2(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity 
                            onPress={hide} 
                            style={styles.closeButton}
                        >
                            <AntDesign name="close" color='#183E9F' size={width * 0.08} />
                        </TouchableOpacity>
                        
                        <View style={styles.titleContainer}>
                          
                            <Text style={styles.mainTitle}>{t('skuModel.title')}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* معلومات الطبيب/الصيدلية */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('skuModel.doctorInfo')}</Text>
                            
                            {/* الاسم - يظهر دائماً */}
                            <View style={styles.card}>
                                <Text style={styles.label}>{t('skuModel.doctorName')}</Text>
                                <Text style={styles.value}>{data?.doctorName || data?.doctor?.name || 'N/A'}</Text>
                            </View>

                            {/* التخصص - يظهر فقط إذا كان موجود */}
                            {(data?.specialty || data?.doctor?.speciality?.name) && (
                                <View style={styles.card}>
                                    <Text style={styles.label}>{t('skuModel.specialty')}</Text>
                                    <Text style={styles.value}>{data?.specialty || data?.doctor?.speciality?.name}</Text>
                                </View>
                            )}

                            {/* التصنيف - يظهر فقط إذا كان موجود */}
                            {(data?.classification && data?.classification !== '-') || data?.doctor?.classification ? (
                                <View style={styles.card}>
                                    <Text style={styles.label}>{t('skuModel.classification')}</Text>
                                    <Text style={styles.value}>{data?.classification || data?.doctor?.classification}</Text>
                                </View>
                            ) : null}

                            {/* ✅ معلومات مختلفة حسب نوع الزيارة */}
                            {data?.visitType === 'pharmacy' ? (
                                // ✅ للصيدليات: عرض المعلومات المالية (فقط إذا كانت موجودة)
                                <>
                                    {/* مندوب المبيعات - يظهر فقط إذا كان موجود */}
                                    {data?.sale_name && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.saleRepresentative')}</Text>
                                            <Text style={styles.value}>{data.sale_name}</Text>
                                        </View>
                                    )}

                                    {/* المبلغ - يظهر فقط إذا كان أكبر من 0 */}
                                    {data?.amount > 0 && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.amount')}</Text>
                                            <Text style={[styles.value, styles.amountText]}>{data.amount.toLocaleString()} JOD</Text>
                                        </View>
                                    )}

                                    {/* المبلغ الآجل - يظهر فقط إذا كان أكبر من 0 */}
                                    {data?.credit_amount > 0 && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.creditAmount')}</Text>
                                            <Text style={[styles.value, styles.amountText]}>{data.credit_amount.toLocaleString()} JOD</Text>
                                        </View>
                                    )}

                                    {/* سقف السعر - يظهر فقط إذا كان أكبر من 0 */}
                                    {data?.price_ceiling > 0 && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.priceCeiling')}</Text>
                                            <Text style={[styles.value, styles.amountText]}>{data.price_ceiling.toLocaleString()} JOD</Text>
                                        </View>
                                    )}

                                    {/* طريقة الدفع - يظهر فقط إذا كانت موجودة */}
                                    {data?.method && data?.method !== '-' && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.paymentMethod')}</Text>
                                            <Text style={styles.value}>{data.method}</Text>
                                        </View>
                                    )}
                                    
                                    {/* الصيدلي المسؤول - يظهر فقط إذا كان موجود */}
                                    {(data?.pharmacy?.responsible_pharmacist_name || data?.responsible_pharmacist_name) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>الصيدلي المسؤول</Text>
                                            <Text style={styles.value}>{data?.pharmacy?.responsible_pharmacist_name || data?.responsible_pharmacist_name}</Text>
                                        </View>
                                    )}
                                    
                                    {/* الهاتف - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorPhone || data?.phone) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.phone')}</Text>
                                            <Text style={styles.value}>{data?.doctorPhone || data?.phone}</Text>
                                        </View>
                                    )}
                                    
                                    {/* العنوان - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorAddress || data?.address) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.address')}</Text>
                                            <Text style={styles.value}>{data?.doctorAddress || data?.address}</Text>
                                        </View>
                                    )}
                                    
                                    {/* البريد الإلكتروني - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorEmail || data?.email) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.email')}</Text>
                                            <Text style={styles.value}>{data?.doctorEmail || data?.email}</Text>
                                        </View>
                                    )}

                                    {data?.settlement && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.settlement')}</Text>
                                            <Text style={styles.value}>{moment(data.settlement).format('YYYY-MM-DD')}</Text>
                                        </View>
                                    )}

                                    {data?.check_number && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.checkNumber')}</Text>
                                            <Text style={styles.value}>{data.check_number}</Text>
                                        </View>
                                    )}
                                </>
                            ) : (
                                // ✅ للأطباء: عرض معلومات الاتصال (فقط إذا كانت موجودة)
                                <>
                                    {/* الهاتف - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorPhone || data?.doctor?.phone) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.phone')}</Text>
                                            <Text style={styles.value}>{data?.doctorPhone || data?.doctor?.phone}</Text>
                                        </View>
                                    )}

                                    {/* البريد الإلكتروني - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorEmail || data?.doctor?.email) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.email')}</Text>
                                            <Text style={styles.value}>{data?.doctorEmail || data?.doctor?.email}</Text>
                                        </View>
                                    )}

                                    {/* العنوان - يظهر فقط إذا كان موجود */}
                                    {(data?.doctorAddress || data?.doctor?.address) && (
                                        <View style={styles.card}>
                                            <Text style={styles.label}>{t('skuModel.address')}</Text>
                                            <Text style={styles.value}>{data?.doctorAddress || data?.doctor?.address}</Text>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>

                        {/* الموقع - يظهر فقط إذا كانت البيانات موجودة */}
                        {(data?.cityName || data?.city_name || data?.areaName || data?.area_name) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{t('skuModel.location')}</Text>
                                
                                {/* المدينة - يظهر فقط إذا كانت موجودة */}
                                {(data?.cityName || data?.city_name || data?.city || data?.doctor?.city?.name) && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.city')}</Text>
                                        <Text style={styles.value}>
                                            {data?.cityName || 
                                             data?.city_name || 
                                             data?.city ||
                                             data?.doctor?.city?.name || 
                                             getCityName(data?.city_id || data?.doctor?.city_id)}
                                        </Text>
                                    </View>
                                )}

                                {/* المنطقة - يظهر فقط إذا كانت موجودة */}
                                {(data?.areaName || data?.area_name || data?.area || data?.doctor?.area?.name) && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.area')}</Text>
                                        <Text style={styles.value}>
                                            {data?.areaName || 
                                             data?.area_name || 
                                             data?.area ||
                                             data?.doctor?.area?.name || 
                                             getAreaName(data?.area_id || data?.doctor?.area_id)}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* معلومات الزيارة - يظهر فقط إذا كانت هناك بيانات */}
                        {(data?.startVisit || data?.start_visit || data?.endVisit || data?.end_visit || data?.duration) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{t('skuModel.visitInfo')}</Text>
                                
                                {(data?.startVisit || data?.start_visit) && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.startTime')}</Text>
                                        <Text style={styles.value}>
                                            {data?.startVisit ? moment(data.startVisit).format('YYYY-MM-DD hh:mm A') : 
                                             data?.start_visit ? moment(data.start_visit).format('YYYY-MM-DD hh:mm A') : 'N/A'}
                                        </Text>
                                    </View>
                                )}

                                {(data?.endVisit || data?.end_visit) && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.endTime')}</Text>
                                        <Text style={styles.value}>
                                            {data?.endVisit ? moment(data.endVisit).format('YYYY-MM-DD hh:mm A') : 
                                             data?.end_visit ? moment(data.end_visit).format('YYYY-MM-DD hh:mm A') : 'N/A'}
                                        </Text>
                                    </View>
                                )}

                                {data?.duration && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.duration')}</Text>
                                        <Text style={styles.value}>{data?.duration}</Text>
                                    </View>
                                )}

                                {(data?.status === 'Visited' || data?.status === 'Pending') && (
                                    <View style={styles.card}>
                                        <Text style={styles.label}>{t('skuModel.status')}</Text>
                                        <Text style={[styles.value, styles.statusValue, 
                                            data?.status === 'Visited' ? styles.visited : styles.pending]}>
                                            {data?.status === 'Visited' ? t('skuModel.visited') : t('skuModel.pending')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* العينات الموزعة */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('skuModel.sampleProducts')}</Text>
                            
                            {(data?.sample_products?.length > 0 || data?.sample_product?.length > 0) ? (
                                <View style={styles.productsContainer}>
                                    {(data?.sample_products || data?.sample_product || []).map((item, index) => (
                                        <View style={styles.productCard} key={index}>
                                            <Text style={styles.productTitle}>{t('skuModel.product')} {index + 1}</Text>
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productLabel}>{t('skuModel.productName')}</Text>
                                                <Text style={styles.productValue}>{item?.product_name || item?.product?.name || 'N/A'}</Text>
                                            </View>
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productLabel}>{t('skuModel.quantity')}</Text>
                                                <Text style={styles.productValue}>{String(item?.quantity || 1)}</Text>
                                            </View>
                                            {(item?.public_price || item?.product?.public_price) && (
                                                <View style={styles.productInfo}>
                                                    <Text style={styles.productLabel}>{t('skuModel.publicPrice')}</Text>
                                                    <Text style={styles.productValue}>{String(item?.public_price || item?.product?.public_price || 'N/A')}</Text>
                                                </View>
                                            )}
                                            {(item?.pharmacy_price || item?.product?.pharmacy_price) && (
                                                <View style={styles.productInfo}>
                                                    <Text style={styles.productLabel}>{t('skuModel.pharmacyPrice')}</Text>
                                                    <Text style={styles.productValue}>{String(item?.pharmacy_price || item?.product?.pharmacy_price || 'N/A')}</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.card}>
                                    <Text style={styles.value}>{t('skuModel.noSamples')}</Text>
                                </View>
                            )}
                        </View>

                        {/* الملاحظات - يظهر فقط إذا كانت موجودة */}
                        {data?.notes && data?.notes.trim() !== '' && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>{t('skuModel.notes')}</Text>
                                <View style={styles.notesCard}>
                                    <Text style={styles.notesValue}>{data.notes}</Text>
                                </View>
                            </View>
                        )}

                       
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default SkuModel;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0707078c',
        padding: width * 0.02,
    },
    modalView: {
        backgroundColor: "#fff",
        borderRadius: width * 0.04,
        width: '100%',
        maxWidth: 600, // Maximum width for tablets
        height: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: width * 0.05,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: height * 0.02,
    },
    closeButton: {
        padding: width * 0.01,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: width * 0.02,
    },
    mainTitle: {
        fontSize: width * 0.06,
        color: '#000',
        marginHorizontal: width * 0.02,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: height * 0.02,
    },
    section: {
        marginBottom: height * 0.03,
    },
    sectionTitle: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#183E9F',
        marginBottom: height * 0.015,
        textAlign: 'left',
        borderBottomWidth: 1,
        borderBottomColor: '#183E9F',
        paddingBottom: height * 0.005,
    },
    card: {
        backgroundColor: '#F8F9FA',
        padding: width * 0.04,
        marginVertical: height * 0.005,
        borderRadius: width * 0.02,
        borderLeftWidth: 3,
        borderLeftColor: '#183E9F',
    },
    label: {
        fontSize: width * 0.035,
        color: '#666',
        marginBottom: height * 0.005,
        fontWeight: '500',
    },
    value: {
        fontSize: width * 0.038,
        color: '#000',
        fontWeight: '400',
        lineHeight: height * 0.025,
    },
    amountText: {
        fontSize: width * 0.042,
        color: '#28A745',
        fontWeight: '700',
    },
    statusValue: {
        fontWeight: 'bold',
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.005,
        borderRadius: width * 0.01,
        alignSelf: 'flex-start',
    },
    visited: {
        backgroundColor: '#D4EDDA',
        color: '#155724',
    },
    pending: {
        backgroundColor: '#FFF3CD',
        color: '#856404',
    },
    productsContainer: {
        marginTop: height * 0.01,
    },
    productCard: {
        backgroundColor: '#E3F2FD',
        padding: width * 0.04,
        marginVertical: height * 0.008,
        borderRadius: width * 0.02,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    productTitle: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: height * 0.01,
        textAlign: 'center',
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.005,
    },
    productLabel: {
        fontSize: width * 0.033,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    productValue: {
        fontSize: width * 0.035,
        color: '#000',
        fontWeight: '400',
        flex: 1,
        textAlign: 'left',
    },
    notesCard: {
        backgroundColor: '#FFF3E0',
        padding: width * 0.04,
        borderRadius: width * 0.02,
        borderLeftWidth: 3,
        borderLeftColor: '#FF9800',
    },
    notesValue: {
        fontSize: width * 0.038,
        color: '#000',
        lineHeight: height * 0.025,
        textAlign: 'left',
    },
    coordinates: {
        marginTop: height * 0.005,
    },
    coordinateText: {
        fontSize: width * 0.033,
        color: '#666',
        fontFamily: 'monospace',
        marginBottom: height * 0.003,
    },
});

// For extra small screens (like iPhone SE)
const extraSmallStyles = StyleSheet.create({
    modalView: {
        padding: width * 0.03,
        borderRadius: width * 0.03,
    },
    mainTitle: {
        fontSize: width * 0.055,
    },
    label: {
        fontSize: width * 0.032,
    },
    value: {
        fontSize: width * 0.034,
    },
});

// For tablets and large screens
const largeScreenStyles = StyleSheet.create({
    modalView: {
        maxWidth: 700,
        padding: width * 0.04,
    },
    mainTitle: {
        fontSize: width * 0.05,
    },
    sectionTitle: {
        fontSize: width * 0.04,
    },
    label: {
        fontSize: width * 0.032,
    },
    value: {
        fontSize: width * 0.035,
    },
});