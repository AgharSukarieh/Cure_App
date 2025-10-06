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

const FAQScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [expandedItems, setExpandedItems] = useState({});

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'faq.general.question1',
      answer: 'faq.general.answer1',
      icon: 'help-circle',
    },
    {
      id: 2,
      category: 'general',
      question: 'faq.general.question2',
      answer: 'faq.general.answer2',
      icon: 'info',
    },
    {
      id: 3,
      category: 'account',
      question: 'faq.account.question1',
      answer: 'faq.account.answer1',
      icon: 'user',
    },
    {
      id: 4,
      category: 'account',
      question: 'faq.account.question2',
      answer: 'faq.account.answer2',
      icon: 'shield',
    },
    {
      id: 5,
      category: 'orders',
      question: 'faq.orders.question1',
      answer: 'faq.orders.answer1',
      icon: 'shopping-cart',
    },
    {
      id: 6,
      category: 'orders',
      question: 'faq.orders.question2',
      answer: 'faq.orders.answer2',
      icon: 'truck',
    },
    {
      id: 7,
      category: 'payment',
      question: 'faq.payment.question1',
      answer: 'faq.payment.answer1',
      icon: 'credit-card',
    },
    {
      id: 8,
      category: 'payment',
      question: 'faq.payment.question2',
      answer: 'faq.payment.answer2',
      icon: 'dollar-sign',
    },
    {
      id: 9,
      category: 'technical',
      question: 'faq.technical.question1',
      answer: 'faq.technical.answer1',
      icon: 'smartphone',
    },
    {
      id: 10,
      category: 'technical',
      question: 'faq.technical.question2',
      answer: 'faq.technical.answer2',
      icon: 'wifi',
    },
  ];

  const categories = [
    { key: 'all', label: 'faq.categories.all', icon: 'grid', color: '#3B82F6' },
    { key: 'general', label: 'faq.categories.general', icon: 'help-circle', color: '#10B981' },
    { key: 'account', label: 'faq.categories.account', icon: 'user', color: '#F59E0B' },
    { key: 'orders', label: 'faq.categories.orders', icon: 'shopping-cart', color: '#EF4444' },
    { key: 'payment', label: 'faq.categories.payment', icon: 'credit-card', color: '#8B5CF6' },
    { key: 'technical', label: 'faq.categories.technical', icon: 'smartphone', color: '#06B6D4' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const FAQItem = ({ item }) => {
    const isExpanded = expandedItems[item.id];
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
      outputRange: [0, 100],
    });

    const rotateInterpolate = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <View style={[styles.faqItem, isRTL && styles.faqItemRTL]}>
        <TouchableOpacity
          style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}
          onPress={() => toggleExpanded(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.faqHeaderContent, isRTL && styles.faqHeaderContentRTL]}>
            <View style={[styles.iconContainer, { backgroundColor: categories.find(cat => cat.key === item.category)?.color + '20' }]}>
              <Feather 
                name={item.icon} 
                size={20} 
                color={categories.find(cat => cat.key === item.category)?.color} 
              />
            </View>
            <Text style={[styles.questionText, isRTL && styles.questionTextRTL]}>
              {t(item.question)}
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
          <View style={[styles.faqAnswer, isRTL && styles.faqAnswerRTL]}>
            <Text style={[styles.answerText, isRTL && styles.answerTextRTL]}>
              {t(item.answer)}
            </Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  const CategoryButton = ({ category }) => {
    const isSelected = selectedCategory === category.key;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          isSelected && styles.categoryButtonSelected,
          isRTL && styles.categoryButtonRTL
        ]}
        onPress={() => setSelectedCategory(category.key)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isSelected ? [category.color, category.color + 'CC'] : ['#F8F9FA', '#F1F3F4']}
          style={styles.categoryGradient}
        >
          <Feather 
            name={category.icon} 
            size={16} 
            color={isSelected ? '#FFFFFF' : category.color} 
          />
          <Text style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
            isRTL && styles.categoryTextRTL
          ]}>
            {t(category.label)}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <GoBack text={t('faq.title')} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.headerSection, isRTL && styles.headerSectionRTL]}>
          <LinearGradient
            colors={['#2580B3', '#2580B3']}
            style={styles.headerGradient}
          >
            <View style={[styles.headerContent, isRTL && styles.headerContentRTL]}>
              <View style={styles.headerIconContainer}>
                <Feather name="help-circle" size={32} color="#FFFFFF" />
              </View>
              <View style={[styles.headerTextContainer, isRTL && styles.headerTextContainerRTL]}>
                <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
                  {t('faq.welcomeTitle')}
                </Text>
                <Text style={[styles.headerSubtitle, isRTL && styles.headerSubtitleRTL]}>
                  {t('faq.welcomeSubtitle')}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.categoriesSection, isRTL && styles.categoriesSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('faq.categoriesTitle')}
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
            style={[styles.categoriesScrollView, isRTL && styles.categoriesScrollViewRTL]}
          >
            {categories.map((category) => (
              <CategoryButton key={category.key} category={category} />
            ))}
          </ScrollView>
        </View>

        <View style={[styles.faqSection, isRTL && styles.faqSectionRTL]}>
          <View style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}>
            <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
              {t('faq.questionsTitle')}
            </Text>
            {/* <Text style={[styles.faqCount, isRTL && styles.faqCountRTL]}>
              {filteredFAQs.length} {t('faq.questions')}
            </Text> */}
          </View>
          
          {filteredFAQs.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </View>

        <View style={[styles.contactSection, isRTL && styles.contactSectionRTL]}>
          <LinearGradient
            colors={['#F8F9FA', '#E9ECEF']}
            style={styles.contactGradient}
          >
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="message-circle" size={24} color="#3B82F6" />
              <View style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                <Text style={[styles.contactTitle, isRTL && styles.contactTitleRTL]}>
                  {t('faq.needHelp')}
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.contactSubtitleRTL]}>
                  {t('faq.contactUs')}
                </Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Feather name="arrow-left" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
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
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  headerContentRTL: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: I18nManager.isRTL ? 8 : 0,
    marginLeft: I18nManager.isRTL ? 0 : 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTextContainerRTL: {
    alignItems: I18nManager.isRTL?'flex-start':'flex-end',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerTitleRTL: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  headerSubtitleRTL: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },

  categoriesSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  categoriesSectionRTL: {
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionTitleRTL: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
  categoriesScrollView: {
  },
  categoriesScrollViewRTL: {
  },
  categoriesScroll: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryButtonRTL: {
    marginRight: 0,
    marginLeft: 12,
  },
  categoryButtonSelected: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
   
  },
  categoryTextRTL: {
    marginLeft: I18nManager.isRTL ? 8 : 0,
    marginRight: I18nManager.isRTL ? 0 : 8,
    
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },

  faqSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  faqSectionRTL: {
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  faqHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  faqCount: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  faqCountRTL: {
    textAlign: 'right',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  faqItemRTL: {
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  faqHeaderRTL: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
  },
  faqHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  faqHeaderContentRTL: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    marginRight: 0,
    marginLeft: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    lineHeight: 22,

  
  },
  questionTextRTL: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  faqAnswerRTL: {
  },
  answerText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 10,
  },
  answerTextRTL: {
    textAlign: I18nManager.isRTL ? 'left' : 'right',
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
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
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
    textAlign: 'right',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  contactSubtitleRTL: {
    textAlign: 'right',
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FAQScreen;
