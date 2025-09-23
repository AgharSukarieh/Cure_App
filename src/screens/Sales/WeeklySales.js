import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView, Alert, ActivityIndicator, Modal, I18nManager } from 'react-native';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';

// --- مكونات وهمية لتعويض المكونات الأصلية ---
const GoBack = ({ text }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={fakeStyles.header}>
      <Text style={[fakeStyles.headerText, isRTL && fakeStyles.rtlText]}>{text}</Text>
    </View>
  );
};

// --- 1. إضافة كود المودال الوهمي (Weeklyareaedit) هنا ---
const Weeklyareaedit = ({ show, hide, data, submit }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const FAKE_AREAS = [
    { id: 1, name: 'الزرقاء' },
    { id: 2, name: 'عمان' },
    { id: 3, name: 'إربد' },
    { id: 4, name: 'العقبة' },
    { id: 5, name: 'الكرك' },
  ];

  const handleSelectArea = (area) => {
    // عند اختيار منطقة، يتم استدعاء دالة الحفظ وتمرير البيانات
    submit({ area_id: area.id, area_name: area.name });
  };

  return (
    <Modal
      transparent={true}
      visible={show}
      onRequestClose={hide}
      animationType="fade"
    >
      <TouchableOpacity style={fakeStyles.modalOverlay} activeOpacity={1} onPressOut={hide}>
        <View style={fakeStyles.modalContainer}>
          <Text style={[fakeStyles.modalTitle, isRTL && fakeStyles.rtlText]}>{t('weeklySales.selectAreaFor')} {Moment(data?.item).format('D MMM')}</Text>
          <ScrollView>
            {FAKE_AREAS.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={fakeStyles.areaButton}
                onPress={() => handleSelectArea(area)}
              >
                <Text style={[fakeStyles.areaButtonText, isRTL && fakeStyles.rtlText]}>{area.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={fakeStyles.closeButton} onPress={hide}>
            <Text style={[fakeStyles.closeButtonText, isRTL && fakeStyles.rtlText]}>{t('weeklySales.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};


// --- بيانات وهمية (Fake Data) ---
const FAKE_USER_INFO = {
  id: 101,
  name: 'Aghar',
  role: 'sales',
};

const FAKE_WEEKLY_SCHEDULE_DATA = [
  { date: '2023-03-01', area_id: 1, area_name: 'الزرقاء' },
  { date: '2023-03-02', area_id: 2, area_name: 'عمان' },
  { date: '2023-03-05', area_id: 3, area_name: 'إربد' },
  { date: '2023-03-06', area_id: 1, area_name: 'الزرقاء' },
  { date: '2023-03-08', area_id: 4, area_name: 'العقبة' },
  { date: '2023-03-15', area_id: 2, area_name: 'عمان' },
  { date: '2023-03-22', area_id: 3, area_name: 'إربد' },
];

const WeeklySales = ({ navigation, route }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const data = route?.params?.data || { id: 3, name: 'March' };
  const year = route?.params?.year || 2023;
  const month = data.id;

  const [user, setUser] = useState(null);
  const [weeklyscdata, setWeeklyscdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [dayinfo, setDayinfo] = useState(null);

  const getInitialData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(FAKE_USER_INFO);
      setWeeklyscdata(FAKE_WEEKLY_SCHEDULE_DATA);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  function getDaysInMonth() {
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month - 1, i));
    }
    return days;
  }
  const daysInCurrentMonth = getDaysInMonth();

  const edit = (item) => {
    let data = { item: Moment(item).format('YYYY-M-D') };
    setDayinfo(data);
    setModal(true);
  };

  const submitedit = (editedData) => {
    console.log('Submitting edit:', {
      area_id: editedData.area_id,
      date: dayinfo.item,
      userid: user.id,
    });
    const newSchedule = [...weeklyscdata];
    const existingIndex = newSchedule.findIndex(d => d.date === dayinfo.item);
    if (existingIndex > -1) {
      newSchedule[existingIndex].area_name = editedData.area_name;
    } else {
      newSchedule.push({ date: dayinfo.item, area_id: editedData.area_id, area_name: editedData.area_name });
    }
    setWeeklyscdata(newSchedule);
    setModal(false);
  };

  const alertarea = () => {
    Alert.alert(t('weeklySales.alert'), t('weeklySales.selectAreaFirst'));
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#469ED8" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GoBack text={t('weeklySales.headerTitle')} />
        <Text style={[style.lale, isRTL && style.rtlText]}>{data.name}</Text>
        <View style={style.cardContainer}>
          {daysInCurrentMonth?.map((item, index) => {
            const matchingData = weeklyscdata.find(data => Moment(data.date).isSame(item, 'day'));
            const areaName = matchingData ? matchingData.area_name : t('weeklySales.noArea');
            const hasArea = !!matchingData;

            const goToDaily = () => {
              const screen = user.role === 'sales' ? 'Daily-sales' : 'Daily-notSales';
              navigation.navigate(screen, {
                title: Moment(item).format('dddd, D MMM YYYY'),
                date: Moment(item).format('YYYY-M-D'),
                area: matchingData,
              });
            };

            return (
              <React.Fragment key={index}>
                {index % 7 === 0 && (
                  <View style={style.week}>
                    <Text style={[style.weektext, isRTL && style.rtlText]}>{t('weeklySales.week')} {Math.floor(index / 7) + 1}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={style.card}
                  onLongPress={() => edit(item)}
                  onPress={hasArea ? goToDaily : alertarea}
                >
                  <View style={style.header}>
                    <Text style={style.dayt}>{Moment(item).format('ddd')}</Text>
                  </View>
                  <View style={{ ...style.day, backgroundColor: hasArea ? '#469ED8' : '#7383d1' }}>
                    <Text style={style.dayd}>{Moment(item).format('D')}</Text>
                    <Text style={style.dayn} numberOfLines={1}>{areaName}</Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
      <Weeklyareaedit show={modal} hide={() => setModal(false)} data={dayinfo} submit={submitedit} />
    </SafeAreaView>
  );
};

export default WeeklySales;

export const style = StyleSheet.create({
  cardContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: { width: '12%', height: 100, marginBottom: 25 },
  header: {
    backgroundColor: '#253274',
    width: '100%',
    height: '40%',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  day: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingHorizontal: 2,
  },
  dayt: { color: '#fff', textTransform: 'uppercase', fontSize: 10 },
  dayd: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  dayn: { color: '#fff', fontSize: 10, textAlign: 'center' },
  week: { width: '100%', alignItems: 'center' },
  weektext: { marginBottom: 7, color: '#000', fontSize: 18 },
  lale: {
    marginHorizontal: 15,
    marginVertical: 8,
    fontSize: 30,
    textTransform: 'capitalize',
    color: '#469ED8',
    fontWeight: '700',
  },
  // أنماط RTL
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

const fakeStyles = StyleSheet.create({
  header: { padding: 15, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderColor: '#eee' },
  headerText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  // --- ستايلات المودال ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  areaButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  areaButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // أنماط RTL
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
