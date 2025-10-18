import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  I18nManager,
  Animated,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import moment from "moment";
import CustomDatePicker from "../../components/CustomPicker";
import Input from "../../components/Input";
import ButtonWithIndicator from "../../components/ButtonWithIndicator";
import PaymentMethodModel from "../../components/Modals/PaymentMethodModel";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import GoBack from "../../components/GoBack";
import globalConstants from "../../config/globalConstants";
import { get, post } from "../../WebService/RequestBuilder";
import { useAlert } from "../../components/Alert/AlertProvider";

const { width, height } = Dimensions.get("window");

const SkeletonPlaceholder = () => {
  const opacityValue = new Animated.Value(0.5);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.5,
          useNativeDriver: true,
          duration: 500,
        }),
      ])
    ).start();
  }, [opacityValue]);

  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          <View style={styles.scrollableHeaderRow}>
            {[...Array(4)].map((_, i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonHeaderCell, { opacity: opacityValue }]}
              />
            ))}
          </View>
          {[...Array(3)].map((_, rowIndex) => (
            <View key={rowIndex} style={styles.scrollableRow}>
              {[...Array(4)].map((_, cellIndex) => (
                <Animated.View
                  key={cellIndex}
                  style={[styles.skeletonCell, { opacity: opacityValue }]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const StyledAccountTable = ({ data }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableDate")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tablePaymentMethod")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableAmount")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableStatus")}
              </Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.scrollableRow,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  {item.payment_date}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  {item.payment_method}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  {item.amount.toLocaleString()} JOD
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={[
                  styles.scrollableCellText, 
                  { 
                    color: item.status === "مكتمل" ? "#51CF66" : "#F59E0B",
                    fontWeight: "600"
                  }
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Filter Modal Component
const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
  const { t } = useTranslation();
  const [filterMethod, setFilterMethod] = useState(initialFilters.method);
  const [filterStatus, setFilterStatus] = useState(initialFilters.status);
  const [filterStartDate, setFilterStartDate] = useState(initialFilters.startDate);
  const [filterEndDate, setFilterEndDate] = useState(initialFilters.endDate);
  const animatedValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleApply = () => {
    if (filterStartDate && filterEndDate && filterStartDate > filterEndDate) {
      Alert.alert(t("accountInfo.invalidDateRange"), t("accountInfo.startDateAfterEndDate"));
      return;
    }
    onApply({
      method: filterMethod,
      status: filterStatus,
      startDate: filterStartDate,
      endDate: filterEndDate,
    });
    onClose();
  };

  const handleClear = () => {
    setFilterMethod(null);
    setFilterStatus(null);
    setFilterStartDate(null);
    setFilterEndDate(null);
    onApply({ method: null, status: null, startDate: null, endDate: null });
    onClose();
  };

  const FilterOption = ({ label, value, currentValue, setValue }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        currentValue === value && styles.filterOptionSelected,
      ]}
      onPress={() => setValue(value)}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.filterOptionText,
          currentValue === value && styles.filterOptionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel={t("accountInfo.closeFilterModal")}
        />
        <Animated.View
          style={[
            styles.filterModalContainer,
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("accountInfo.filterModalTitle")}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel={t("accountInfo.closeButton")}
            >
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.filterForm}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.tablePaymentMethod")}</Text>
              <View style={styles.filterOptionsRow}>
                <FilterOption
                  label={t("accountInfo.all")}
                  value={null}
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
                <FilterOption
                  label={t("accountInfo.paymentMethodCash")}
                  value="نقداً"
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
                <FilterOption
                  label={t("accountInfo.paymentMethodCheck")}
                  value="شيك"
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.tableStatus")}</Text>
              <View style={styles.filterOptionsRow}>
                <FilterOption
                  label={t("accountInfo.all")}
                  value={null}
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
                <FilterOption
                  label={t("accountInfo.statusCompleted")}
                  value="مكتمل"
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
                <FilterOption
                  label={t("accountInfo.statusPending")}
                  value="معلق"
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.startDate")}</Text>
              <CustomDatePicker
                value={filterStartDate}
                onDateChange={setFilterStartDate}
                placeholder={t("accountInfo.selectStartDate")}
                accessibilityLabel={t("accountInfo.startDate")}
              />
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.endDate")}</Text>
              <CustomDatePicker
                value={filterEndDate}
                onDateChange={setFilterEndDate}
                placeholder={t("accountInfo.selectEndDate")}
                accessibilityLabel={t("accountInfo.endDate")}
              />
            </View>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                accessibilityLabel={t("accountInfo.applyFilters")}
              >
                <Text style={styles.applyButtonText}>{t("accountInfo.applyFilters")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                accessibilityLabel={t("accountInfo.clearFilters")}
              >
                <Text style={styles.clearButtonText}>{t("accountInfo.clearFilters")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const AccountInfo = ({ item, route }) => {
  const { t } = useTranslation();
  const alert = useAlert();
  
  const visitData = route?.params?.item || item;
  const visitId = route?.params?.visit_id;
  
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 AccountInfo - البيانات الواردة:');
    console.log('   - pharmacy_id:', visitData?.pharmacy_id);
    console.log('   - pharmacy_name:', visitData?.pharmacy_name || visitData?.name);
    console.log('   - visit_id:', visitId || visitData?.id);
    console.log('   - credit_amount:', visitData?.credit_amount);
    console.log('   - price_ceiling:', visitData?.price_ceiling);
    console.log('   - startVisit:', visitData?.startVisit);
    console.log('   - start_visit:', visitData?.start_visit);
    console.log('   - visitDate:', visitData?.visitDate);
    console.log('   - created_at:', visitData?.created_at);
    console.log('   - من route.params:', !!route?.params?.item);
    console.log('   - من props:', !!item);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // ✅ تحديث credit_amount الأولي
    if (visitData?.credit_amount) {
      setCurrentCreditAmount(visitData.credit_amount);
    }
  }, [visitData, visitId, route, item]);
  
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chooseMethodModalVisible, setChooseMethodModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [lastCollections, setLastCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [clickable, setClickable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentCreditAmount, setCurrentCreditAmount] = useState(visitData?.credit_amount || 0);
  
  // ✅ إضافة state للشيكات المعلقة
  const [pendingChecksTotal, setPendingChecksTotal] = useState(0);
  const [pendingChecksCount, setPendingChecksCount] = useState(0);
  
  const [filters, setFilters] = useState({
    method: null,
    status: null,
    startDate: null,
    endDate: null,
  });

  // ✅ دالة جلب البيانات من API
  const getLastPayment = async () => {
    // ✅ التحقق من pharmacy_id أولاً
    if (!visitData?.pharmacy_id) {
      console.error('❌ pharmacy_id مفقود في visitData');
      Alert.alert('خطأ', 'معلومات الصيدلية غير متوفرة');
      setDataLoading(false);
      return;
    }
    
    setDataLoading(true);
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💰 جلب بيانات التحصيل...');
      console.log('🏥 Pharmacy ID:', visitData.pharmacy_id);
      
      // ✅ جلب تاريخ الزيارة من visitData مع console logs
      console.log('🔍 البحث عن التاريخ:');
      console.log('   - visitData.startVisit:', visitData?.startVisit);
      console.log('   - visitData.start_visit:', visitData?.start_visit);
      console.log('   - visitData.visitDate:', visitData?.visitDate);
      console.log('   - visitData.created_at:', visitData?.created_at);
      
      // ✅ استخراج التاريخ - قد يكون object فيه date
      let dateToUse = visitData?.startVisit;
      
      if (!dateToUse && visitData?.start_visit) {
        // إذا start_visit هو object فيه date
        dateToUse = typeof visitData.start_visit === 'object' && visitData.start_visit?.date
          ? visitData.start_visit.date
          : visitData.start_visit;
      }
      
      if (!dateToUse) {
        dateToUse = visitData?.visitDate || visitData?.created_at;
      }
      
      console.log('📅 التاريخ المُختار:', dateToUse);
      console.log('📅 نوع التاريخ:', typeof dateToUse);
      
      const visitDate = dateToUse 
        ? moment(dateToUse).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD');
      
      console.log('📅 التاريخ بعد التنسيق:', visitDate);
      
      const params = {
        pharmacy_id: visitData.pharmacy_id,    // معرف الصيدلية
        dateFrom: visitDate,                   // من تاريخ الزيارة
        dateTo: visitDate,                     // إلى نفس التاريخ
        status: 'all',                         // كل الدفعات (معتمدة + معلقة)
        limit: 0                              // كل النتائج (بدون pagination)
      };
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 Parameters النهائية:', params);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const response = await get(
        globalConstants.sales.collection,
        null, 
        params
      );
      
      console.log('✅ استجابة API:', response);
      console.log('📊 response.data نوعه:', typeof response?.data);
      console.log('📊 response.data طوله:', response?.data?.length);
      
      if (response?.data) {
        // طباعة البيانات الخام بالتفصيل
        console.log('📦 البيانات الخام الكاملة من API:');
        response.data.forEach((payment, idx) => {
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`   ${idx + 1}. Payment #${payment.id}:`);
          console.log(`      - method: ${payment.method}`);
          console.log(`      - amount: ${payment.amount}`);
          console.log(`      - pharmacy_id: ${payment.pharmacy_id}`);
          console.log(`      - pharmacy_name: ${payment.pharmacy_name}`);
          console.log(`      - check_number: ${payment.check_number}`);
          console.log(`      - settlement: ${payment.settlement}`);
          console.log(`      - received_at: ${payment.received_at}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        console.log('🔄 بدء تحويل البيانات...');
        const collections = response.data.map((payment, idx) => {
          // Console log لكل دفعة قبل التحويل
          if (idx < 3) {
            console.log(`   🔍 Payment ${idx + 1}:`);
            console.log(`      - payment.method = "${payment.method}" (نوعه: ${typeof payment.method})`);
            console.log(`      - payment.method === 'cash'? ${payment.method === 'cash'}`);
            console.log(`      - سيتحول إلى: ${payment.method === 'cash' ? 'نقداً' : 'شيك'}`);
          }
          
          return {
            id: payment.id,
            payment_date: moment(payment.received_at || payment.created_at).format('YYYY-MM-DD HH:mm'),
            payment_method: payment.method === 'cash' ? 'نقداً' : 'شيك',
            amount: parseFloat(payment.amount) || 0,
            status: payment.status === 'cash' || payment.status === 'approve' 
              ? 'مكتمل' 
              : 'معلق',  // ✅ refuse = معلق
            check_number: payment.check_number,
            settlement: payment.settlement,
            received_at: payment.received_at,
            // معلومات إضافية
            sale_name: payment.sale_name,
            pharmacy_name: payment.pharmacy_name,
            credit_amount: payment.credit_amount,
            price_ceiling: payment.price_ceiling,
            city_name: payment.city_name,
            area_name: payment.area_name,
          };
        });
        
        console.log('📊 بعد التحويل - الإحصائيات:');
        console.log('   - إجمالي المدفوعات:', collections.length);
        console.log('   - نقداً:', collections.filter(p => p.payment_method === 'نقداً').length);
        console.log('   - شيك:', collections.filter(p => p.payment_method === 'شيك').length);
        
        // عرض أول 5 عناصر بعد التحويل بالتفصيل
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 عينة من البيانات المُحولة (أول 5):');
        collections.slice(0, 5).forEach((item, idx) => {
          console.log(`   ${idx + 1}. ${item.payment_method} - ${item.amount} JOD - ${item.status}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
      setLastCollections(collections);
      setFilteredCollections(collections);
        
        // ✅ تحديث بيانات الشيكات المعلقة من API
        if (response.pending_checks_total !== undefined) {
          setPendingChecksTotal(response.pending_checks_total);
          console.log(`💰 مجموع الشيكات المعلقة: ${response.pending_checks_total} JOD`);
        }
        
        if (response.pending_checks_count !== undefined) {
          setPendingChecksCount(response.pending_checks_count);
          console.log(`📋 عدد الشيكات المعلقة: ${response.pending_checks_count} شيك`);
        }
        
        console.log('✅ تم تعيين البيانات:');
        console.log('   - lastCollections:', collections.length);
        console.log('   - filteredCollections:', collections.length);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // ✅ جلب credit_amount المحدث مباشرة من pharmacy
        try {
          console.log('💰 جلب الدين المحدث من pharmacy...');
          
          const pharmacyResponse = await get(`pharmacy/${visitData.pharmacy_id}`);
          
          console.log('📥 Pharmacy Response:', pharmacyResponse);
          
          if (pharmacyResponse?.credit_amount !== undefined) {
            setCurrentCreditAmount(pharmacyResponse.credit_amount);
            console.log('✅ تم تحديث الدين من pharmacy:', pharmacyResponse.credit_amount, 'JOD');
          }
        } catch (pharmacyError) {
          console.error('⚠️ فشل جلب بيانات pharmacy:', pharmacyError);
          
          // Fallback: استخدم credit_amount من أول collection
          if (collections.length > 0 && collections[0].credit_amount !== undefined) {
            setCurrentCreditAmount(collections[0].credit_amount);
            console.log('⚠️ استخدام credit_amount من collection:', collections[0].credit_amount);
          }
        }
      } else {
        setLastCollections([]);
        setFilteredCollections([]);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      setLastCollections([]);
      setFilteredCollections([]);
    } finally {
      setDataLoading(false);
    }
  };

  // ✅ جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    if (visitData?.pharmacy_id) {
      getLastPayment();
    } else {
      console.warn('⚠️ لا يوجد pharmacy_id في visitData');
      setDataLoading(false);
    }
  }, [visitData?.pharmacy_id]);

  useEffect(() => {
    const applyFilters = () => {
      console.log('🔍 تطبيق الفلاتر...');
      console.log('   - عدد المدفوعات الأصلية:', lastCollections.length);
      console.log('   - فلتر الطريقة:', filters.method);
      console.log('   - فلتر من تاريخ:', filters.startDate);
      console.log('   - فلتر إلى تاريخ:', filters.endDate);
      
      let filtered = [...lastCollections];
      
      if (filters.method) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter((item) => item.payment_method === filters.method);
        console.log(`   ✂️ فلتر الطريقة: ${beforeFilter} → ${filtered.length}`);
      }
      
      if (filters.startDate) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(
          (item) => new Date(item.payment_date) >= new Date(filters.startDate)
        );
        console.log(`   ✂️ فلتر من تاريخ: ${beforeFilter} → ${filtered.length}`);
      }
      
      if (filters.endDate) {
        const beforeFilter = filtered.length;
        filtered = filtered.filter(
          (item) => new Date(item.payment_date) <= new Date(filters.endDate)
        );
        console.log(`   ✂️ فلتر إلى تاريخ: ${beforeFilter} → ${filtered.length}`);
      }
      
      console.log('✅ النتيجة النهائية بعد الفلترة:', filtered.length);
      console.log('   - نقداً:', filtered.filter(p => p.payment_method === 'نقداً').length);
      console.log('   - شيك:', filtered.filter(p => p.payment_method === 'شيك').length);
      
      setFilteredCollections(filtered);
    };
    applyFilters();
  }, [filters, lastCollections]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // ✅ حساب الإجماليات من البيانات
  // ✅ رصيد الشيكات المعلقة فقط (بدون النقدي)
  // ✅ يعرض فقط مجموع الشيكات التي لم يتم الموافقة عليها بعد
  const pendingPayments = lastCollections
    .filter(payment => payment.status === 'معلق' && payment.payment_method === 'شيك')
    .reduce((sum, payment) => sum + (payment.amount || 0), 0);
  
  // Console log للإجماليات
  useEffect(() => {
    console.log('💰 الإحصائيات المالية:');
    console.log('   - الدين الحالي (credit_amount):', currentCreditAmount, 'JOD');
    console.log('   - الشيكات المعلقة فقط:', pendingPayments, 'JOD');
  }, [currentCreditAmount, pendingPayments]);

  // ✅ دالة التحصيل (Collect Money)
  const collect_money = async (data) => {
    // ✅ التحقق من pharmacy_id
    if (!data.pharmacy_id) {
      Alert.alert('خطأ', 'معرف الصيدلية مفقود');
      console.error('❌ pharmacy_id مفقود في data:', data);
      return;
    }
    
    setClickable(false);
    setLoading(true);
    
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('💰 تحصيل المبلغ:');
      console.log('   - pharmacy_id:', data.pharmacy_id);
      console.log('   - payment:', data.payment);
      console.log('   - method:', data.payment_method);
      console.log('   - received_at:', data.received_at);
      console.log('   - البيانات الكاملة:', data);
      
      const response = await post(
        globalConstants.sales.collection,
        data, 
        null
      );
      
      console.log('✅ نجح التحصيل:', response);
      
      if (response?.code === 200) {
        // ✅ عرض Alert مخصص للنجاح بدون كبسة OK
        alert.showSuccess(
          'تم بنجاح! 🎉',
          response.message || 'تم تحصيل المبلغ بنجاح!',
          {
            duration: 3000, // يختفي تلقائياً بعد 3 ثوان
            showCloseButton: false, // بدون كبسة إغلاق
            animationType: 'slide',
            position: 'top'
          }
        );
        
        // تحديث البيانات
        await getLastPayment();
        
        // إغلاق المودال
        setChooseMethodModalVisible(false);
      } else {
        Alert.alert('خطأ', response.message || 'فشل تحصيل المبلغ');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('❌ خطأ في التحصيل:', error);
      console.error('📥 Response Data:', error.response?.data);
      console.error('📥 Response Status:', error.response?.status);
      console.error('📥 Full Error:', JSON.stringify(error.response, null, 2));
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || 'فشل التحصيل. حاول مرة أخرى.';
      
      // عرض تفاصيل الخطأ
      const errorDetails = error.response?.data?.errors 
        ? '\n\n' + JSON.stringify(error.response.data.errors, null, 2)
        : '';
        
      Alert.alert('خطأ', errorMessage + errorDetails);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } finally {
      setClickable(true);
      setLoading(false);
    }
  };

  // ✅ دالة للـ Pull-to-Refresh
  const onRefresh = async () => {
    console.log('🔄 Pull-to-Refresh - تحديث بيانات AccountInfo...');
    setRefreshing(true);
    
    try {
      // إعادة تحميل البيانات
      await getLastPayment();
      console.log('✅ تم تحديث البيانات بنجاح');
    } catch (error) {
      console.error('❌ خطأ في تحديث البيانات:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2C8EB3']}
            tintColor="#2C8EB3"
            title="جاري التحديث..."
            titleColor="#666"
          />
        }
      >
        <StatusBar barStyle="dark-content" backgroundColor={"#E0F2FF"} />
        <GoBack />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("accountInfo.title")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("accountInfo.subtitle")}
          </Text>
        </View>
        <View style={styles.summaryCards}>
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            style={[styles.summaryCard, styles.balanceCard]}
          >
            <View style={styles.cardIcon}>
              <Feather name="alert-circle" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryCardLabel}>
              الدين الحالي
            </Text>
            <Text style={styles.summaryCardValue}>
              {currentCreditAmount.toLocaleString()} JOD
            </Text>
          </LinearGradient>
          <View style={[styles.summaryCard, styles.pendingCard]}>
            <View style={styles.cardIcon}>
              <Feather name="clock" size={24} color="#D97706" />
            </View>
            <Text style={[styles.summaryCardLabel, { color: "#6B7280" }]}>
              الشيكات المعلقة
            </Text>
            <Text style={[styles.summaryCardValue, { color: "#111827" }]}>
              {pendingChecksTotal.toLocaleString()} JOD
            </Text>
          </View>
        </View>
        
       {/*  
        {pendingChecksTotal > 0 && (
          <View style={styles.pendingChecksCard}>
            <View style={styles.pendingChecksHeader}>
              <View style={styles.pendingChecksIcon}>
                <Text style={styles.pendingChecksIconText}>💰</Text>
              </View>
              <View style={styles.pendingChecksInfo}>
                <Text style={styles.pendingChecksTitle}>الشيكات المعلقة</Text>
                <Text style={styles.pendingChecksSubtitle}>
                  {pendingChecksCount} شيك في انتظار الموافقة
                </Text>
              </View>
            </View>
            <View style={styles.pendingChecksAmount}>
              <Text style={styles.pendingChecksAmountText}>
                {pendingChecksTotal.toLocaleString()} JOD
              </Text>
            </View>
          </View>
        )} */}
        
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {t("accountInfo.collectionsHistory")}
            </Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
              accessibilityLabel={t("accountInfo.filter")}
              accessibilityRole="button"
            >
              <Feather name="filter" size={16} color="#3660CC" />
              <Text style={styles.filterButtonText}>
                {t("accountInfo.filter")}
              </Text>
            </TouchableOpacity>
          </View>
          {dataLoading ? (
            <SkeletonPlaceholder />
          ) : filteredCollections.length > 0 ? (
            <StyledAccountTable data={filteredCollections} />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="file-text" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>
                {t("accountInfo.noData")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.fixedButton}
          onPress={() => setChooseMethodModalVisible(true)}
          accessibilityLabel={t("accountInfo.addNewPayment")}
          accessibilityRole="button"
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.fixedButtonText}>
            {t("accountInfo.addNewPayment")}
          </Text>
        </TouchableOpacity>
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
      <PaymentMethodModel
        show={chooseMethodModalVisible}
        hide={() => setChooseMethodModalVisible(false)}
        submit={collect_money}
        pharmacyId={visitData?.pharmacy_id}
        loading={loading}
        visitDate={(() => {
          const dateToUse = visitData?.startVisit || visitData?.start_visit || visitData?.visitDate || visitData?.created_at;
          return dateToUse 
            ? (typeof dateToUse === 'object' && dateToUse?.date 
                ? moment(dateToUse.date).format('YYYY-MM-DD')
                : moment(dateToUse).format('YYYY-MM-DD'))
            : moment().format('YYYY-MM-DD');
        })()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContainer: { paddingBottom: 120, paddingTop: 15 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#183E9F",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceCard: {
    backgroundColor: "#3660CC",
  },
  pendingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryCardLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 5,
    opacity: 0.9,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: "#99AAB5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183E9F",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#3660CC",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
  },
  tableWrapper: { flexDirection: "row", paddingHorizontal: 15 },
  scrollableHeaderRow: { flexDirection: "row" },
  scrollableHeaderCell: {
    width: width * 0.3,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  scrollableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  scrollableCell: {
    width: width * 0.3,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableCellText: { fontSize: 14, color: "#333", textAlign: "center" },
  tableHeader: { backgroundColor: "#F1F5F9" },
  evenRow: { backgroundColor: "#FFFFFF" },
  oddRow: { backgroundColor: "#FAFAFA" },
  skeletonHeaderCell: {
    height: 50,
    width: width * 0.3,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    margin: 8,
  },
  skeletonCell: {
    height: 52,
    width: width * 0.3,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    margin: 8,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  fixedButton: {
    flexDirection: "row",
    backgroundColor: "#3660CC",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fixedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  filterModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: "100%",
    maxHeight: height * 0.75,
    minHeight: height * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  filterForm: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  filterOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  filterOptionSelected: {
    backgroundColor: "#3660CC",
    borderColor: "#3660CC",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  filterOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterButtons: {
    flexDirection: "row",
   
    gap: 10,
    marginTop: 20,
  },
  applyButton: {
    paddingHorizontal: 20,
    width: '50%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#3660CC",
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    width: '45%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  // ✅ Styles للشيكات المعلقة
  pendingChecksCard: {
    backgroundColor: "#FFF3CD",
    borderWidth: 1,
    borderColor: "#FFEAA7",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pendingChecksHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pendingChecksIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFC107",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  pendingChecksIconText: {
    fontSize: 20,
  },
  pendingChecksInfo: {
    flex: 1,
  },
  pendingChecksTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 2,
  },
  pendingChecksSubtitle: {
    fontSize: 12,
    color: "#856404",
    opacity: 0.8,
  },
  pendingChecksAmount: {
    alignItems: "flex-end",
  },
  pendingChecksAmountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#856404",
  },
});

export default AccountInfo;