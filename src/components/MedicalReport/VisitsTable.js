import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, I18nManager } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 55;

const VisitsTable = ({ visits, currentUser, t, onDetailsPress, onEditPress, onEndVisit }) => {
    const isRTL = I18nManager.isRTL;

    return (
        <View style={styles.table}>
            {/* العمود الثابت - الأسماء */}
            <View style={styles.fixedColumn}>
                <View style={styles.fixedHeaderCell}>
                    <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                        {t('medicalReportScreen.name') || 'الاسم'}
                    </Text>
                </View>
                {visits.map((item, index) => (
                    <View
                        key={item.id}
                        style={[
                            styles.fixedCell,
                            index % 2 === 1 ? styles.oddRow : styles.evenRow,
                        ]}
                    >
                        <Text
                            style={[styles.fixedCellText, isRTL && styles.rtlText]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.doctorName || "N/A"}
                        </Text>
                    </View>
                ))}
            </View>

            {/* الأعمدة القابلة للتمرير */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    {/* رأس الجدول */}
                    <View style={styles.scrollableHeaderRow}>
                        <View style={styles.scrollableHeaderCell}>
                            <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                {currentUser?.role === "sales" 
                                    ? (t('medicalReportScreen.phone') || 'الهاتف')
                                    : (t('medicalReportScreen.specialty') || 'التخصص')
                                }
                            </Text>
                        </View>
                        
                        {/* أعمدة إضافية للسيلز */}
                        {currentUser?.role === "sales" && (
                            <>
                                <View style={styles.scrollableHeaderCell}>
                                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                        {t('medicalReportScreen.city') || 'المدينة'}
                                    </Text>
                                </View>
                                <View style={styles.scrollableHeaderCell}>
                                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                        {t('medicalReportScreen.area') || 'المنطقة'}
                                    </Text>
                                </View>
                                <View style={styles.scrollableHeaderCell}>
                                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                        {t('medicalReportScreen.responsiblePharmacist') || 'الصيدلي المسؤول'}
                                    </Text>
                                </View>
                            </>
                        )}
                        
                        <View style={styles.scrollableHeaderCell}>
                            <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                {t('medicalReportScreen.time') || 'الوقت'}
                            </Text>
                        </View>
                        <View style={styles.scrollableHeaderCell}>
                            <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                {t('medicalReportScreen.lastVisit') || 'آخر زيارة'}
                            </Text>
                        </View>
                        <View style={styles.scrollableHeaderCell}>
                            <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                {t('medicalReportScreen.status') || 'الحالة'}
                            </Text>
                        </View>
                        <View style={styles.scrollableHeaderCell}>
                            <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                                {t('medicalReportScreen.actions') || 'الإجراءات'}
                            </Text>
                        </View>
                    </View>

                    {/* صفوف البيانات */}
                    {visits.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.scrollableDataRow,
                                index % 2 === 1 ? styles.oddRow : styles.evenRow,
                            ]}
                        >
                            <View style={styles.scrollableCell}>
                                <Text style={styles.scrollableCellText}>
                                    {currentUser?.role === "sales" 
                                        ? (item.doctorPhone || item.phone || "-")
                                        : (item.specialty || "N/A")
                                    }
                                </Text>
                            </View>
                            
                            {/* أعمدة إضافية للسيلز */}
                            {currentUser?.role === "sales" && (
                                <>
                                    <View style={styles.scrollableCell}>
                                        <Text style={styles.scrollableCellText}>
                                            {item.cityName || item.city_name || "N/A"}
                                        </Text>
                                    </View>
                                    <View style={styles.scrollableCell}>
                                        <Text style={styles.scrollableCellText}>
                                            {item.areaName || item.area_name || "N/A"}
                                        </Text>
                                    </View>
                                    <View style={styles.scrollableCell}>
                                        <Text style={styles.scrollableCellText}>
                                            {item.pharmacy?.responsible_pharmacist_name || item.responsible_pharmacist_name || "-"}
                                        </Text>
                                    </View>
                                </>
                            )}
                            
                            <View style={styles.scrollableCell}>
                                <Text style={styles.scrollableCellText}>
                                    {item.appointmentTime || "N/A"}
                                </Text>
                            </View>
                            <View style={styles.scrollableCell}>
                                <Text style={styles.scrollableCellText}>
                                    {item.lastVisit || "N/A"}
                                </Text>
                            </View>
                            <View style={styles.scrollableCell}>
                                <View style={[
                                    styles.statusBadge, 
                                    item.status === 'Visited' ? styles.statusVisited : styles.statusPending
                                ]}>
                                    <Text style={styles.statusTitle}>
                                        {item.status === 'Visited' ? 
                                            (t('medicalReportScreen.visited') || 'تم') : 
                                            (t('medicalReportScreen.pending') || 'في الانتظار')
                                        }
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.scrollableCell}>
                                <View style={styles.actionsContainer}>
                                    {/* زر المعلومات */}
                                    <TouchableOpacity
                                        style={styles.detailsButton}
                                        onPress={() => onDetailsPress(item)}
                                        activeOpacity={0.7}
                                    >
                                        <MaterialIcons name="info" size={16} color="#fff" />
                                    </TouchableOpacity>
                                    
                                    {/* زر إنهاء الزيارة - يظهر فقط إذا لم تنتهِ الزيارة */}
                                    {!item.endVisit && !item.end_visit && onEndVisit ? (
                                        <TouchableOpacity
                                            style={styles.endVisitButton}
                                            onPress={() => onEndVisit(item)}
                                            activeOpacity={0.7}
                                        >
                                            <MaterialIcons name="check-circle" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
    },
    fixedColumn: {
        width: FIXED_COLUMN_WIDTH,
        backgroundColor: "#FFFFFF",
        borderRightWidth: 1,
        borderRightColor: "#E0E0E0",
    },
    fixedHeaderCell: {
        height: ROW_HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 10,
        backgroundColor: "#F1F3F5",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    fixedHeaderText: { 
        fontSize: 14, 
        fontWeight: "bold", 
        color: "#183E9F" 
    },
    fixedCell: {
        height: ROW_HEIGHT,
        justifyContent: "center",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    fixedCellText: { 
        fontSize: 14, 
        color: "#333" 
    },
    scrollableHeaderRow: {
        flexDirection: "row",
        height: ROW_HEIGHT,
        backgroundColor: "#F1F3F5",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    scrollableDataRow: {
        flexDirection: "row",
        height: ROW_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    scrollableHeaderCell: {
        width: SCROLLABLE_COLUMN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    scrollableHeaderText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1A46BE",
        textAlign: "center",
    },
    scrollableCell: {
        width: SCROLLABLE_COLUMN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    scrollableCellText: { 
        fontSize: 14, 
        color: "#333", 
        textAlign: "center" 
    },
    methodText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#183E9F",
    },
    evenRow: { 
        backgroundColor: "#FFFFFF" 
    },
    oddRow: { 
        backgroundColor: "#FAFAFA" 
    },
    statusBadge: { 
        borderRadius: 6, 
        paddingHorizontal: 6, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    statusVisited: { 
        backgroundColor: '#38A169' 
    },
    statusPending: { 
        backgroundColor: '#DD6B20', 
        paddingHorizontal: 4, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    statusTitle: { 
        borderRadius: 12, 
        paddingHorizontal: 6, 
        justifyContent: 'center', 
        alignItems: 'center', 
        color: '#fff', 
        fontSize: 12, 
        paddingVertical: 6 
    },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
    },
    detailsButton: {
        backgroundColor: '#183E9F',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 35,
        minHeight: 35,
        elevation: 2,
        shadowColor: '#183E9F',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    editButton: {
        backgroundColor: '#28a745',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 35,
        minHeight: 35,
        elevation: 2,
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    endVisitButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 35,
        minHeight: 35,
        elevation: 2,
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
});

export default VisitsTable;

