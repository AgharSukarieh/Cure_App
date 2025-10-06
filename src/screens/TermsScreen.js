import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  I18nManager,
  Animated,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const TermsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [expandedSections, setExpandedSections] = useState({});

  const termsData = [
    {
      id: 1,
      title: 'terms.sections.acceptance',
      content: 'terms.sections.acceptanceContent',
      icon: 'check-circle',
      color: '#10B981',
    },
    {
      id: 2,
      title: 'terms.sections.serviceDescription',
      content: 'terms.sections.serviceDescriptionContent',
      icon: 'info',
      color: '#3B82F6',
    },
    {
      id: 3,
      title: 'terms.sections.userAccount',
      content: 'terms.sections.userAccountContent',
      icon: 'user',
      color: '#F59E0B',
    },
    {
      id: 4,
      title: 'terms.sections.privacy',
      content: 'terms.sections.privacyContent',
      icon: 'shield',
      color: '#8B5CF6',
    },
    {
      id: 5,
      title: 'terms.sections.payment',
      content: 'terms.sections.paymentContent',
      icon: 'credit-card',
      color: '#EF4444',
    },
    {
      id: 6,
      title: 'terms.sections.liability',
      content: 'terms.sections.liabilityContent',
      icon: 'alert-triangle',
      color: '#F97316',
    },
    {
      id: 7,
      title: 'terms.sections.termination',
      content: 'terms.sections.terminationContent',
      icon: 'x-circle',
      color: '#6B7280',
    },
    {
      id: 8,
      title: 'terms.sections.changes',
      content: 'terms.sections.changesContent',
      icon: 'edit',
      color: '#06B6D4',
    },
  ];

  const toggleExpanded = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const TermsSection = ({ section }) => {
    const isExpanded = expandedSections[section.id];
    const animatedValue = new Animated.Value(isExpanded ? 1 : 0);

    React.useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [isExpanded]);

    const heightInterpolate = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150],
    });

    const rotateInterpolate = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View style={[styles.termsSection, isRTL && styles.termsSectionRTL]}>
        <TouchableOpacity
          style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}
          onPress={() => toggleExpanded(section.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.sectionHeaderContent, isRTL && styles.sectionHeaderContentRTL]}>
            <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
              <Feather 
                name={section.icon} 
                size={20} 
                color={section.color} 
              />
            </View>
            <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
              {t(section.title)}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Feather 
              name="chevron-down" 
              size={20} 
              color="#6B7280" 
            />
          </Animated.View>
        </TouchableOpacity>
        
        <Animated.View style={{ height: heightInterpolate, overflow: 'hidden' }}>
          <View style={[styles.sectionContent, isRTL && styles.sectionContentRTL]}>
            <Text style={[styles.contentText, isRTL && styles.contentTextRTL]}>
              {t(section.content)}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <GoBack text={t('terms.title')} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={[styles.headerSection, isRTL && styles.headerSectionRTL]}>
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={styles.headerGradient}
          >
            <View style={[styles.headerContent, isRTL && styles.headerContentRTL]}>
              <View style={[styles.headerIconContainer, isRTL && styles.headerIconContainerRTL]}>
                <MaterialIcons name="gavel" size={32} color="#FFFFFF" />
              </View>
              <View style={[styles.headerTextContainer, isRTL && styles.headerTextContainerRTL]}>
                <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
                  {t('terms.welcomeTitle')}
                </Text>
                <Text style={[styles.headerSubtitle, isRTL && styles.headerSubtitleRTL]}>
                  {t('terms.welcomeSubtitle')}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Last Updated */}
        <View style={[styles.lastUpdatedSection, isRTL && styles.lastUpdatedSectionRTL]}>
          <View style={[styles.lastUpdatedContent, isRTL && styles.lastUpdatedContentRTL]}>
            <Feather name="calendar" size={16} color="#6B7280" />
            <Text style={[styles.lastUpdatedText, isRTL && styles.lastUpdatedTextRTL]}>
              {t('terms.lastUpdated')}: {t('terms.updateDate')}
            </Text>
          </View>
        </View>

        {/* Terms Sections */}
        <View style={[styles.termsContainer, isRTL && styles.termsContainerRTL]}>
          <Text style={[styles.sectionHeaderTitle, isRTL && styles.sectionHeaderTitleRTL]}>
            {t('terms.sectionsTitle')}
          </Text>
          
          {termsData.map((section) => (
            <TermsSection key={section.id} section={section} />
          ))}
        </View>

        <View style={[styles.contactSection, isRTL && styles.contactSectionRTL]}>
          <LinearGradient
            colors={['#F8F9FA', '#E9ECEF']}
            style={styles.contactGradient}
          >
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="mail" size={24} color="#3B82F6" />
              <View style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                <Text style={[styles.contactTitle, isRTL && styles.contactTitleRTL]}>
                  {t('terms.questionsTitle')}
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.contactSubtitleRTL]}>
                  {t('terms.contactInfo')}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => navigation.navigate('FAQScreen')}
              >
                <Feather name="help-circle" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.agreementSection, isRTL && styles.agreementSectionRTL]}>
          <View style={[styles.agreementContent, isRTL && styles.agreementContentRTL]}>
            <Feather name="check-circle" size={20} color="#10B981" />
            <Text style={[styles.agreementText, isRTL && styles.agreementTextRTL]}>
              {t('terms.agreementText')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  
  headerSection: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  headerSectionRTL: {
  },
  headerGradient: {
    borderRadius: 20,
    padding: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContentRTL: {
    flexDirection: 'row',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerIconContainerRTL: {
    marginRight: 16,
    marginLeft: 0,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTextContainerRTL: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerTitleRTL: {
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  headerSubtitleRTL: {
    textAlign: 'right',
  },

  lastUpdatedSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  lastUpdatedSectionRTL: {
  },
  lastUpdatedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lastUpdatedContentRTL: {
    flexDirection: 'row',
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  lastUpdatedTextRTL: {
    marginLeft: 8,
    marginRight: 0,
    textAlign: 'right',
  },

  termsContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  termsContainerRTL: {
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeaderTitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  termsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  termsSectionRTL: {
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  sectionHeaderRTL: {
    flexDirection: 'row',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  sectionHeaderContentRTL: {
    flexDirection: 'row',
    marginRight: 12,
    marginLeft: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,
  },
  sectionTitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContentRTL: {
  },
  contentText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 10,
  },
  contentTextRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },

  contactSection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  contactSectionRTL: {
  },
  contactGradient: {
    borderRadius: 16,
    padding: 20,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactContentRTL: {
    flexDirection: 'row',
  },
  contactText: {
    flex: 1,
    marginHorizontal: 12,
  },
  contactTextRTL: {
    alignItems: 'flex-end',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactTitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactSubtitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  agreementSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  agreementSectionRTL: {
  },
  agreementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  agreementContentRTL: {
    flexDirection: 'row',
  },
  agreementText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  agreementTextRTL: {
    marginLeft: 8,
    marginRight: 0,
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
});

export default TermsScreen;
