import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Modal,
    ScrollView,
    Dimensions,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "../styles";
import moment from "moment";
import Constants from "../../config/globalConstants";
import { put } from "../../WebService/RequestBuilder";
import GetLocation from "react-native-get-location";
import LoadingScreen from "../LoadingScreen";

const { width, height } = Dimensions.get('window');

const SkueditModel = ({ show, hide, submit, data, reload }) => {
    const [location, setLocation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function getLocation() {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 60000,
            })
                .then(location => {
                    setLocation(location);
                    setIsLoading(false);
                    resolve(location);
                })
                .catch(error => {
                    setIsLoading(false);
                    reject(error);
                });
        });
    }

    useEffect(() => {
        // Location fetching logic remains the same
    }, []);

    const endVisit = async () => {
        try {
            // الحصول على الموقع الحالي
            const ll = await getLocation();
            
            if (!ll) {
                Alert.alert('خطأ', 'غير قادر على الحصول على موقعك الحالي');
                return;
            }
            
            if (!data?.id) {
                Alert.alert('خطأ', 'معرف الزيارة مفقود');
                return;
            }
            
            const locationData = {
                longitude: ll.longitude,
                latitude: ll.latitude
            };
            
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📤 إنهاء الزيارة...');
            console.log('🆔 Visit ID:', data?.id);
            console.log('🏥 Visit Type:', data?.visitType);
            console.log('📍 Location:', locationData);
            
            // اختيار الـ endpoint المناسب
            const endpoint = data?.visitType === 'pharmacy' || data?.pharmacy_id 
                ? Constants.visit.sales  // للصيدليات (Sales)
                : Constants.visit.medical;  // للأطباء (Medical)
            
            console.log('🔗 Endpoint:', `${endpoint}/${data?.id}`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            const response = await put(
                `${endpoint}/${data?.id}`,
                locationData,
                null
            );
            
            console.log('✅ استجابة الـ API:', response);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            if (response?.code === 200) {
                Alert.alert('نجح', 'تم إنهاء الزيارة بنجاح!');
                hide();
                reload();
            } else if (response?.code === 400) {
                Alert.alert('تنبيه', 'هذه الزيارة انتهت بالفعل');
                hide();
            } else {
                Alert.alert('خطأ', response?.message || 'فشل إنهاء الزيارة');
            }
            
        } catch (error) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('❌ خطأ في إنهاء الزيارة:', error);
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            Alert.alert('خطأ', 'فشل إنهاء الزيارة. حاول مرة أخرى.');
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onRequestClose={hide}
        >
            <View style={style.modalContainer}>
                <View style={style.modalView}>
                

                    {/* Content */}
                    <View style={style.content}>
                        <View style={style.messageContainer}>
                            <Text style={style.messageText}>
                                هل أنت متأكد من إنهاء هذه الزيارة؟
                            </Text>
                        </View>

                        {/* Visit Info Summary */}
                        <View style={style.infoContainer}>
                            <View style={style.infoRow}>
                                <Text style={style.infoLabel}>
                                    {data?.visitType === 'pharmacy' ? 'الصيدلية:' : 'الطبيب:'}
                                </Text>
                                <Text style={style.infoValue}>
                                    {data?.doctorName || data?.doctor?.name || data?.pharmacy_name || 'N/A'}
                                </Text>
                            </View>
                            <View style={style.infoRow}>
                                <Text style={style.infoLabel}>وقت البدء:</Text>
                                <Text style={style.infoValue}>
                                    {data?.startVisit ? moment(data.startVisit).format('YYYY-MM-DD hh:mm A') : 
                                     data?.start_visit ? moment(data.start_visit).format('YYYY-MM-DD hh:mm A') : 'N/A'}
                                </Text>
                            </View>
                            {data?.end_visit && (
                                <View style={style.infoRow}>
                                    <Text style={style.infoLabel}>الحالة:</Text>
                                    <Text style={[style.infoValue, style.completedStatus]}>
                                        تمت الزيارة
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Buttons */}
                        <View style={style.buttonsContainer}>
                            {!data?.end_visit && (
                                <TouchableOpacity
                                    style={style.endVisitBtn}
                                    onPress={endVisit}
                                    disabled={isLoading}
                                >
                                    <Text style={style.endVisitBtnText}>
                                        {isLoading ? "جاري الإنهاء..." : "إنهاء الزيارة"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            
                            <TouchableOpacity 
                                style={style.cancelBtn}
                                onPress={hide}
                                disabled={isLoading}
                            >
                                <Text style={style.cancelBtnText}>
                                    {data?.end_visit ? "إغلاق" : "إلغاء"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {isLoading && <LoadingScreen />}
        </Modal>
    );
};

export default SkueditModel;

const style = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0707078c",
        paddingHorizontal: width * 0.05,
    },
    modalView: {
        backgroundColor: "#fff",
        borderRadius: width * 0.04,
        width: "100%",
        maxWidth: 500,
        minHeight: height * 0.45,
        maxHeight: height * 0.75,
        shadowColor: "#000",
        shadowOffset: { 
            width: 0, 
            height: width * 0.008 
        },
        shadowOpacity: 0.25,
        shadowRadius: width * 0.02,
        elevation: 5,
        padding: width * 0.05,
        paddingBottom: height * 0.03,
    },
    header: {
        alignItems: "flex-end",
        marginBottom: height * 0.02,
    },
    closeButton: {
        padding: width * 0.01,
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
    },
    messageContainer: {
        marginBottom: height * 0.03,
        paddingHorizontal: width * 0.02,
    },
    messageText: {
        textAlign: "center",
        fontSize: width * 0.045,
        color: "#000",
        fontWeight: "600",
        lineHeight: height * 0.03,
    },
    infoContainer: {
        backgroundColor: "#F8F9FA",
        borderRadius: width * 0.03,
        padding: width * 0.04,
        marginBottom: height * 0.03,
        borderLeftWidth: width * 0.01,
        borderLeftColor: "#183E9F",
    },
    infoRow: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: height * 0.01,
    },
    infoLabel: {
        fontSize: width * 0.035,
        color: "#666",
        fontWeight: "500",
        flex: 1,
    },
    infoValue: {
        fontSize: width * 0.035,
        color: "#000",
        fontWeight: "400",
        flex: 1,
        textAlign: "right",
    },
    completedStatus: {
        color: "#28a745",
        fontWeight: "600",
    },
    buttonsContainer: {
        width: "100%",
        paddingTop: height * 0.02,
        paddingBottom: height * 0.01,
    },
    endVisitBtn: {
        backgroundColor: "#D63A69",
        paddingVertical: height * 0.02,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: width * 0.03,
        marginBottom: height * 0.015,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: height * 0.002,
        },
        shadowOpacity: 0.1,
        shadowRadius: width * 0.01,
        elevation: 3,
    },
    endVisitBtnText: {
        color: "#fff",
        fontSize: width * 0.04,
        fontWeight: "600",
    },
    cancelBtn: {
        backgroundColor: "#183E9F",
        paddingVertical: height * 0.018,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: width * 0.03,
        marginBottom: height * 0.01,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: height * 0.002,
        },
        shadowOpacity: 0.1,
        shadowRadius: width * 0.01,
        elevation: 3,
    },
    cancelBtnText: {
        color: "#fff",
        fontSize: width * 0.04,
        fontWeight: "600",
    },
});

// Responsive styles for different screen sizes
const responsiveStyles = StyleSheet.create({
    // For small screens (phones)
    small: {
        modalView: {
            minHeight: height * 0.5,
            maxHeight: height * 0.8,
        },
        messageText: {
            fontSize: width * 0.042,
        },
    },
    // For large screens (tablets)
    large: {
        modalView: {
            minHeight: height * 0.4,
            maxHeight: height * 0.65,
        },
        messageText: {
            fontSize: width * 0.038,
        },
    },
});

// Helper function to get responsive styles
const getResponsiveStyle = () => {
    if (width < 375) { // Small phones
        return responsiveStyles.small;
    } else if (width >= 768) { // Tablets and larger
        return responsiveStyles.large;
    }
    return {};
};

// Apply responsive styles
Object.assign(style, getResponsiveStyle());