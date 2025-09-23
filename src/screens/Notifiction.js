import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';

const NotificationScreen = () => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: t('notifications.newOrder'),
      message: t('notifications.newOrderMessage'),
      time: '5 ' + t('notifications.timeAgo.minutes'),
      read: false,
      type: 'order',
    },
    {
      id: 2,
      title: t('notifications.followUpReminder'),
      message: t('notifications.followUpMessage'),
      time: '1 ' + t('notifications.timeAgo.hours'),
      read: false,
      type: 'reminder',
    },
    {
      id: 3,
      title: t('notifications.inventoryUpdate'),
      message: t('notifications.inventoryMessage'),
      time: '3 ' + t('notifications.timeAgo.hours'),
      read: true,
      type: 'inventory',
    },
    {
      id: 4,
      title: t('notifications.clientMeeting'),
      message: t('notifications.meetingMessage'),
      time: '6 ' + t('notifications.timeAgo.hours'),
      read: true,
      type: 'meeting',
    },
    {
      id: 5,
      title: t('notifications.specialOffer'),
      message: t('notifications.offerMessage'),
      time: '1 ' + t('notifications.timeAgo.days'),
      read: true,
      type: 'promotion',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [filterUnread, setFilterUnread] = useState(false);

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  // وضع علامة مقروء على الإشعار
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  // وضع علامة مقروء على جميع الإشعارات
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  // تصفية الإشعارات
  const filteredNotifications = filterUnread
    ? notifications.filter((notification) => !notification.read)
    : notifications;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* الهيدر */}
      <View style={[styles.header, isRTL && styles.rtlHeader]}>
        <GoBack text={t('notifications.header')} />
        
      </View>

      <View style={[styles.headerRowContainer, isRTL && styles.rtlHeaderRow]}>
      <TouchableOpacity onPress={() => setFilterUnread(!filterUnread)}>
          <Text style={[styles.filterText, isRTL && styles.rtlText]}>
            {filterUnread ? t('notifications.showAll') : t('notifications.filterUnread')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={[styles.markAllText, isRTL && styles.rtlText]}>{t('notifications.markAllRead')}</Text>
        </TouchableOpacity>
      </View>

      {/* قائمة الإشعارات */}
      {loading ? (
        <ScrollView style={styles.notificationsList}>
          {/* Placeholder Header */}
          <View style={[styles.loadingHeader, isRTL && styles.rtlLoadingHeader]}>
            <View style={styles.loadingFilterButton} />
          </View>
          
          {/* Placeholder Notifications */}
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
        <ScrollView style={styles.notificationsList}>
          {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                isRTL && styles.rtlNotificationItem,
                !notification.read && styles.unreadNotification,
              ]}
              onPress={() => markAsRead(notification.id)}
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
  // RTL Styles
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
  // Loading Placeholder Styles
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