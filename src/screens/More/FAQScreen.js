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
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../../components/GoBack';
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
      question: 'ما هو تطبيق الصيدلية؟',
      answer: 'تطبيق الصيدلية هو منصة شاملة لإدارة الصيدليات والأدوية. يتيح للمستخدمين إدارة المخزون، تتبع المبيعات، إدارة العملاء، وإنتاج التقارير المالية والطبية.',
      icon: 'help-circle',
    },
    {
      id: 2,
      category: 'general',
      question: 'كيف يمكنني تحميل التطبيق؟',
      answer: 'يمكنك تحميل التطبيق من متجر Google Play أو App Store. ابحث عن "تطبيق الصيدلية" أو "Pharmacy App" وقم بالتحميل والتثبيت.',
      icon: 'info',
    },
    {
      id: 3,
      category: 'account',
      question: 'كيف يمكنني إنشاء حساب جديد؟',
      answer: 'اضغط على "إنشاء حساب جديد" في شاشة تسجيل الدخول، املأ البيانات المطلوبة (الاسم، الإيميل، كلمة المرور)، ثم اضغط على "إنشاء الحساب".',
      icon: 'user',
    },
    {
      id: 4,
      category: 'account',
      question: 'نسيت كلمة المرور، كيف يمكنني استردادها؟',
      answer: 'اضغط على "نسيت كلمة المرور" في شاشة تسجيل الدخول، أدخل إيميلك، وستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.',
      icon: 'shield',
    },
    {
      id: 5,
      category: 'orders',
      question: 'كيف يمكنني إضافة طلب جديد؟',
      answer: 'انتقل إلى قسم "الطلبات"، اضغط على "إضافة طلب جديد"، اختر العميل، أضف الأدوية المطلوبة، ثم احفظ الطلب.',
      icon: 'shopping-cart',
    },
    {
      id: 6,
      category: 'orders',
      question: 'كيف يمكنني تتبع حالة الطلبات؟',
      answer: 'في قسم "الطلبات"، ستجد قائمة بجميع الطلبات مع حالة كل طلب (جديد، قيد التنفيذ، مكتمل، ملغي). يمكنك النقر على أي طلب لرؤية التفاصيل.',
      icon: 'truck',
    },
    {
      id: 7,
      category: 'inventory',
      question: 'كيف يمكنني إدارة المخزون؟',
      answer: 'انتقل إلى قسم "المخزون"، يمكنك إضافة أدوية جديدة، تعديل الكميات المتوفرة، تحديث أسعار الأدوية، وتتبع انتهاء الصلاحية.',
      icon: 'package',
    },
    {
      id: 8,
      category: 'inventory',
      question: 'كيف أتلقى تنبيهات نفاد المخزون؟',
      answer: 'التطبيق يرسل تنبيهات تلقائية عندما تقل كمية أي دواء عن الحد الأدنى المحدد. يمكنك تعديل هذه الحدود في إعدادات المخزون.',
      icon: 'alert-triangle',
    },
    {
      id: 9,
      category: 'reports',
      question: 'كيف يمكنني عرض التقارير المالية؟',
      answer: 'انتقل إلى قسم "التقارير"، اختر نوع التقرير المطلوب (يومي، أسبوعي، شهري)، حدد الفترة الزمنية، ثم اضغط على "عرض التقرير".',
      icon: 'bar-chart',
    },
    {
      id: 10,
      category: 'reports',
      question: 'ما أنواع التقارير المتاحة؟',
      answer: 'التطبيق يوفر تقارير المبيعات، تقارير المخزون، تقارير العملاء، تقارير الأدوية الأكثر مبيعاً، وتقارير الأرباح والخسائر.',
      icon: 'file-text',
    },
    {
      id: 11,
      category: 'technical',
      question: 'التطبيق لا يعمل بشكل صحيح، ماذا أفعل؟',
      answer: 'جرب إعادة تشغيل التطبيق، تأكد من اتصالك بالإنترنت، تحقق من تحديث التطبيق، أو اتصل بالدعم الفني عبر قسم "تواصل معنا".',
      icon: 'smartphone',
    },
    {
      id: 12,
      category: 'technical',
      question: 'كيف يمكنني نسخ احتياطي للبيانات؟',
      answer: 'التطبيق يقوم بنسخ احتياطي تلقائي للبيانات على السحابة. يمكنك أيضاً تصدير البيانات يدوياً من إعدادات التطبيق.',
      icon: 'cloud',
    },
    {
      id: 13,
      category: 'security',
      question: 'هل بياناتي آمنة في التطبيق؟',
      answer: 'نعم، التطبيق يستخدم تشفير متقدم لحماية البيانات، وجميع المعلومات محمية بكلمة مرور قوية. لا نشارك بياناتك مع أطراف ثالثة.',
      icon: 'lock',
    },
    {
      id: 14,
      category: 'security',
      question: 'كيف يمكنني تغيير كلمة المرور؟',
      answer: 'انتقل إلى "الملف الشخصي"، اضغط على "تغيير كلمة المرور"، أدخل كلمة المرور الحالية، ثم كلمة المرور الجديدة، وأكد التغيير.',
      icon: 'key',
    },
    {
      id: 15,
      category: 'support',
      question: 'كيف يمكنني التواصل مع الدعم الفني؟',
      answer: 'يمكنك التواصل معنا عبر قسم "تواصل معنا" في التطبيق، أو إرسال إيميل إلى aghar4134@gmail.com، وسنرد عليك خلال 24 ساعة.',
      icon: 'headphones',
    }
  ];

  const categories = [
    { key: 'all', label: 'الكل', icon: 'grid', color: '#3B82F6' },
    { key: 'general', label: 'عام', icon: 'help-circle', color: '#10B981' },
    { key: 'account', label: 'الحساب', icon: 'user', color: '#F59E0B' },
    { key: 'orders', label: 'الطلبات', icon: 'shopping-cart', color: '#EF4444' },
    { key: 'inventory', label: 'المخزون', icon: 'package', color: '#8B5CF6' },
    { key: 'reports', label: 'التقارير', icon: 'bar-chart', color: '#06B6D4' },
    { key: 'technical', label: 'تقني', icon: 'smartphone', color: '#84CC16' },
    { key: 'security', label: 'الأمان', icon: 'lock', color: '#F97316' },
    { key: 'support', label: 'الدعم', icon: 'headphones', color: '#EC4899' },
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
            {category.label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <GoBack text="الأسئلة الشائعة" />
      
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
                  مرحباً بك في مركز المساعدة
                </Text>
                <Text style={[styles.headerSubtitle, isRTL && styles.headerSubtitleRTL]}>
                  ابحث عن إجابات لأسئلتك الشائعة حول تطبيق الصيدلية
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.categoriesSection, isRTL && styles.categoriesSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            الفئات
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
              الأسئلة والأجوبة
            </Text>
            {/* <Text style={[styles.faqCount, isRTL && styles.faqCountRTL]}>
              {filteredFAQs.length} {t('faq.questions')}
            </Text> */}
          </View>
          
          {filteredFAQs.map((item) => (
            <FAQItem key={item.id} item={item} />
          ))}
        </View>
<Pressable onPress={() => navigation.navigate("ContactUsScreen")}>
        <View style={[styles.contactSection, isRTL && styles.contactSectionRTL]}>
          <LinearGradient
            colors={['#F8F9FA', '#E9ECEF']}
            style={styles.contactGradient}
          >
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="message-circle" size={24} color="#3B82F6" />
              <View style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                <Text style={[styles.contactTitle, isRTL && styles.contactTitleRTL]}>
                  هل تحتاج مساعدة إضافية؟
                </Text>
                <Text style={[styles.contactSubtitle, isRTL && styles.contactSubtitleRTL]}>
                  تواصل معنا وسنكون سعداء لمساعدتك
                </Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Feather name="arrow-left" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        </Pressable>
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
