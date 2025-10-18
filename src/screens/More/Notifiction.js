import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  I18nManager,
  RefreshControl,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import GoBack from '../../components/GoBack';
import { get, post } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';

const NotificationScreen = () => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterUnread, setFilterUnread] = useState(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ جلب الإشعارات من الـ API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!user?.id) {
      console.warn('⚠️ لا يوجد user ID');
      setLoading(false);
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔔 جلب الإشعارات للمستخدم:', user.id);
      
      const response = await get(`notification/${user.id}`);
      
      console.log('📥 Response:', response);
      console.log('📊 Type:', Array.isArray(response) ? 'Array' : typeof response);
      
      if (response && Array.isArray(response)) {
        // تحويل البيانات من الـ Backend إلى التنسيق المطلوب
        const formattedNotifications = response.map(notif => ({
          id: notif.id,
          title: notif.title || 'إشعار',
          message: notif.message || '',
          time: notif.created_at ? moment(notif.created_at).fromNow() : '',
          start_date: notif.start_date,
          end_date: notif.end_date,
          image: notif.image,
          distributor_id: notif.distributor_id,
          read: false, // الإشعارات المجلوبة من هذا الـ endpoint هي غير مقروءة
          type: 'promotion', // كل الإشعارات من هذا الـ endpoint هي ترويجية
        }));
        
        setNotifications(formattedNotifications);
        console.log(`✅ تم جلب ${formattedNotifications.length} إشعار`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else {
        console.log('📭 لا توجد إشعارات');
        setNotifications([]);
      }
      
    } catch (err) {
      console.error('❌ خطأ في جلب الإشعارات:', err);
      Alert.alert(
        t('notifications.error') || 'خطأ',
        t('notifications.fetchError') || 'فشل في جلب الإشعارات'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, t]);

  // ✅ جلب الإشعارات عند فتح الصفحة
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // تحديد أيقونة حسب نوع الإشعار
  const getIconByType = (type) => {
    switch (type) {
      case 'order':
        return 'shopping-cart';
      case 'reminder':
        return 'clock-o';
      case 'inventory':
        return 'archive';
      case 'meeting':
        return 'users';
      case 'promotion':
        return 'tag';
      default:
        return 'bell';
    }
  };

  // تحديد لون حسب نوع الإشعار
  const getColorByType = (type) => {
    switch (type) {
      case 'order':
        return '#007AFF';
      case 'reminder':
        return '#FF9500';
      case 'inventory':
        return '#34C759';
      case 'meeting':
        return '#AF52DE';
      case 'promotion':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ وضع علامة على إشعار واحد كمقروء
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const markAsRead = async (notification) => {
    try {
      console.log('📖 وضع علامة على الإشعار:', notification.id);
      
      const response = await post('postNotificationSingle', {
        noteiId: notification.id
      });
      
      console.log('📥 Response:', response);
      
      if (response?.message) {
        console.log('✅ تم وضع علامة على الإشعار بنجاح');
        
        // إزالة الإشعار من القائمة (لأنه أصبح مقروءاً)
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }
    } catch (err) {
      console.error('❌ خطأ في وضع علامة:', err);
      Alert.alert(
        t('notifications.error') || 'خطأ',
        t('notifications.markReadError') || 'فشل في تحديث الإشعار'
      );
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ وضع علامة على جميع الإشعارات كمقروءة
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const markAllAsRead = async () => {
    if (!user?.id) {
      console.warn('⚠️ لا يوجد user ID');
      return;
    }

    if (notifications.length === 0) {
      Alert.alert(
        t('notifications.info') || 'معلومة',
        t('notifications.noUnread') || 'لا توجد إشعارات غير مقروءة'
      );
      return;
    }

    try {
      console.log('📖📖 وضع علامة على جميع الإشعارات للمستخدم:', user.id);
      
      const response = await post(`postNotification/${user.id}`);
      
      console.log('📥 Response:', response);
      
      if (response?.message) {
        console.log('✅ تم وضع علامة على جميع الإشعارات');
        
        // مسح جميع الإشعارات من القائمة
        setNotifications([]);
        
        Alert.alert(
          t('notifications.success') || 'نجح',
          t('notifications.allMarkedRead') || 'تم وضع علامة على جميع الإشعارات كمقروءة'
        );
      }
    } catch (err) {
      console.error('❌ خطأ في وضع علامة على جميع الإشعارات:', err);
      Alert.alert(
        t('notifications.error') || 'خطأ',
        t('notifications.markAllReadError') || 'فشل في تحديث الإشعارات'
      );
    }
  };

  // ✅ Pull to Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(false);
  }, [fetchNotifications]);

  // ✅ الإشعارات المعروضة
  // ملاحظة: جميع الإشعارات من endpoint /api/notification/{user_id} هي غير مقروءة بالفعل
  const filteredNotifications = filterUnread
    ? notifications.filter((notification) => !notification.read)
    : notifications;
  
  // ✅ عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <GoBack text={`${t('notifications.header')} ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
      </View>

      <View style={[styles.headerRowContainer, isRTL && styles.rtlHeaderRow]}>
        <TouchableOpacity onPress={() => setFilterUnread(!filterUnread)}>
          <Text style={[styles.filterText, isRTL && styles.rtlText]}>
            {filterUnread ? t('notifications.showAll') : t('notifications.filterUnread')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={markAllAsRead} disabled={unreadCount === 0}>
          <Text style={[
            styles.markAllText, 
            isRTL && styles.rtlText,
            unreadCount === 0 && styles.disabledText
          ]}>
            {t('notifications.markAllRead')}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ScrollView style={styles.notificationsList}>
          <View style={[styles.loadingHeader, isRTL && styles.rtlLoadingHeader]}>
            <View style={styles.loadingFilterButton} />
          </View>
          
          {[1, 2, 3, 4, 5].map((index) => (
            <View key={index} style={[styles.loadingNotificationItem, isRTL && styles.rtlLoadingNotificationItem]}>
              <View style={[styles.loadingNotificationIcon, isRTL && styles.rtlLoadingNotificationIcon]} />
              <View style={styles.loadingNotificationContent}>
                <View style={[styles.loadingTitle, isRTL && styles.rtlLoadingText]} />
                <View style={[styles.loadingMessage, isRTL && styles.rtlLoadingText]} />
                <View style={[styles.loadingTime, isRTL && styles.rtlLoadingText]} />
              </View>
              <View style={[styles.loadingUnreadIndicator, isRTL && styles.rtlLoadingUnreadIndicator]} />
            </View>
          ))}
        </ScrollView>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('notifications.noNotifications')}</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.notificationsList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
              title={t('notifications.pullToRefresh') || 'اسحب للتحديث'}
            />
          }
        >
          {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                isRTL && styles.rtlNotificationItem,
                !notification.read && styles.unreadNotification,
              ]}
              onPress={() => markAsRead(notification)}
              activeOpacity={0.7}
            >
              <View style={[styles.notificationIcon, isRTL && styles.rtlNotificationIcon]}>
                <FontAwesome
                  name={getIconByType(notification.type)}
                  size={24}
                  color={getColorByType(notification.type)}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, isRTL && styles.rtlText]}>{notification.title}</Text>
                <Text style={[styles.notificationMessage, isRTL && styles.rtlText]} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={[styles.notificationTime, isRTL && styles.rtlText]}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={[styles.unreadIndicator, isRTL && styles.rtlUnreadIndicator]} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRowContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    flexDirection:I18nManager.isRTL?'row-reverse':'row',
    justifyContent:"space-between"
  },
  markAllText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledText: {
    color: '#C7C7CC',
  },
  filterText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  unreadNotification: {
    backgroundColor: '#F2F8FF',
  },
  notificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F9',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#3C3C43',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  rtlText: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    writingDirection: 'rtl',
  },
  rtlHeader: {
    flexDirection:  I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  rtlHeaderRow: {
    alignItems: 'flex-end',
  },
  rtlNotificationItem: {
    flexDirection:  I18nManager.isRTL ? 'row' : 'row-reverse',
  },
  rtlNotificationIcon: {
    marginRight: 0,
    marginLeft: 12,
  },
  rtlUnreadIndicator: {
    marginLeft: 0,
    marginRight: 8,
  },
  loadingHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  rtlLoadingHeader: {
    alignItems: 'flex-end',
  },
  loadingFilterButton: {
    width: 120,
    height: 20,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
  },
  loadingNotificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 2,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  rtlLoadingNotificationItem: {
    flexDirection: 'row-reverse',
  },
  loadingNotificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5EA',
  },
  rtlLoadingNotificationIcon: {
    marginRight: 0,
    marginLeft: 12,
  },
  loadingNotificationContent: {
    flex: 1,
  },
  loadingTitle: {
    width: '70%',
    height: 16,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    marginBottom: 8,
  },
  loadingMessage: {
    width: '90%',
    height: 14,
    backgroundColor: '#E5E5EA',
    borderRadius: 7,
    marginBottom: 6,
  },
  loadingTime: {
    width: '40%',
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
  },
  rtlLoadingText: {
    alignSelf: 'flex-end',
  },
  loadingUnreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E5EA',
    marginLeft: 8,
  },
  rtlLoadingUnreadIndicator: {
    marginLeft: 0,
    marginRight: 8,
  },
});

export default NotificationScreen;