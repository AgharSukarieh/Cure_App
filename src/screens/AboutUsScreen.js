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
  Image,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const AboutUsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const features = [
    {
      id: 1,
      icon: 'shield-check',
      title: t('aboutUs.features.secure'),
      description: t('aboutUs.features.secureDesc'),
      color: '#10B981',
    },
    {
      id: 2,
      icon: 'clock',
      title: t('aboutUs.features.fast'),
      description: t('aboutUs.features.fastDesc'),
      color: '#3B82F6',
    },
    {
      id: 3,
      icon: 'users',
      title: t('aboutUs.features.reliable'),
      description: t('aboutUs.features.reliableDesc'),
      color: '#F59E0B',
    },
    {
      id: 4,
      icon: 'heart',
      title: t('aboutUs.features.caring'),
      description: t('aboutUs.features.caringDesc'),
      color: '#EF4444',
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: t('aboutUs.team.ceo'),
      position: t('aboutUs.team.ceoPosition'),
      image: '👨‍💼',
    },
    {
      id: 2,
      name: t('aboutUs.team.cto'),
      position: t('aboutUs.team.ctoPosition'),
      image: '👨‍💻',
    },
    {
      id: 3,
      name: t('aboutUs.team.cmo'),
      position: t('aboutUs.team.cmoPosition'),
      image: '👩‍💼',
    },
  ];

  const stats = [
    {
      id: 1,
      number: '10K+',
      label: t('aboutUs.stats.users'),
      icon: 'users',
      color: '#3B82F6',
    },
    {
      id: 2,
      number: '500+',
      label: t('aboutUs.stats.pharmacies'),
      icon: 'home',
      color: '#10B981',
    },
    {
      id: 3,
      number: '50K+',
      label: t('aboutUs.stats.orders'),
      icon: 'shopping-cart',
      color: '#F59E0B',
    },
    {
      id: 4,
      number: '99%',
      label: t('aboutUs.stats.satisfaction'),
      icon: 'star',
      color: '#EF4444',
    },
  ];

  const socialLinks = [
    {
      id: 1,
      name: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      url: 'https://facebook.com/pharmacy',
    },
    {
      id: 2,
      name: 'Twitter',
      icon: 'twitter',
      color: '#1DA1F2',
      url: 'https://twitter.com/pharmacy',
    },
    {
      id: 3,
      name: 'Instagram',
      icon: 'instagram',
      color: '#E4405F',
      url: 'https://instagram.com/pharmacy',
    },
    {
      id: 4,
      name: 'LinkedIn',
      icon: 'linkedin',
      color: '#0077B5',
      url: 'https://linkedin.com/company/pharmacy',
    },
  ];

  const handleSocialPress = (url) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  const FeatureCard = ({ feature }) => (
    <View style={[styles.featureCard, isRTL && styles.featureCardRTL]}>
      <LinearGradient
        colors={[feature.color + '20', feature.color + '10']}
        style={styles.featureGradient}
      >
        <View style={[styles.featureContent, isRTL && styles.featureContentRTL]}>
          <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
            <Feather name={feature.icon} size={24} color={feature.color} />
          </View>
          <Text style={[styles.featureTitle, isRTL && styles.featureTitleRTL]}>
            {feature.title}
          </Text>
          <Text style={[styles.featureDescription, isRTL && styles.featureDescriptionRTL]}>
            {feature.description}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const StatCard = ({ stat }) => (
    <View style={[styles.statCard, isRTL && styles.statCardRTL]}>
      <View style={[styles.statContent, isRTL && styles.statContentRTL]}>
        <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
          <Feather name={stat.icon} size={20} color={stat.color} />
        </View>
        <Text style={[styles.statNumber, isRTL && styles.statNumberRTL]}>
          {stat.number}
        </Text>
        <Text style={[styles.statLabel, isRTL && styles.statLabelRTL]}>
          {stat.label}
        </Text>
      </View>
    </View>
  );

  const TeamMember = ({ member }) => (
    <View style={[styles.teamMember, isRTL && styles.teamMemberRTL]}>
      <View style={styles.teamMemberImage}>
        <Text style={styles.teamMemberEmoji}>{member.image}</Text>
      </View>
      <Text style={[styles.teamMemberName, isRTL && styles.teamMemberNameRTL]}>
        {member.name}
      </Text>
      <Text style={[styles.teamMemberPosition, isRTL && styles.teamMemberPositionRTL]}>
        {member.position}
      </Text>
    </View>
  );

  const SocialLink = ({ social }) => (
    <TouchableOpacity
      style={[styles.socialLink, { backgroundColor: social.color + '20' }]}
      onPress={() => handleSocialPress(social.url)}
      activeOpacity={0.7}
    >
      <Feather name={social.icon} size={24} color={social.color} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <GoBack text={t('aboutUs.title')} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={[styles.headerSection, isRTL && styles.headerSectionRTL]}>
          <LinearGradient
            colors={['#2580B3', '#2580B3']}
            style={styles.headerGradient}
          >
            <View style={[styles.headerContent, isRTL && styles.headerContentRTL]}>
              <View style={styles.headerIconContainer}>
                <MaterialIcons name="business" size={32} color="#FFFFFF" />
              </View>
              <View style={[styles.headerTextContainer, isRTL && styles.headerTextContainerRTL]}>
                <Text style={[styles.headerTitle, isRTL && styles.headerTitleRTL]}>
                  {t('aboutUs.welcomeTitle')}
                </Text>
                <Text style={[styles.headerSubtitle, isRTL && styles.headerSubtitleRTL]}>
                  {t('aboutUs.welcomeSubtitle')}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Company Description */}
        <View style={[styles.descriptionSection, isRTL && styles.descriptionSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('aboutUs.ourStory')}
          </Text>
          <Text style={[styles.descriptionText, isRTL && styles.descriptionTextRTL]}>
            {t('aboutUs.description')}
          </Text>
        </View>

        {/* Features Section */}
        <View style={[styles.featuresSection, isRTL && styles.featuresSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('aboutUs.whyChooseUs')}
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </View>
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, isRTL && styles.statsSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('aboutUs.ourNumbers')}
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={[styles.teamSection, isRTL && styles.teamSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('aboutUs.ourTeam')}
          </Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </View>
        </View>

        {/* Mission & Vision */}
        <View style={[styles.missionSection, isRTL && styles.missionSectionRTL]}>
          <View style={[styles.missionCard, isRTL && styles.missionCardRTL]}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.missionGradient}
            >
              <View style={[styles.missionContent, isRTL && styles.missionContentRTL]}>
                <Feather name="target" size={24} color="#FFFFFF" />
                <Text style={[styles.missionTitle, isRTL && styles.missionTitleRTL]}>
                  {t('aboutUs.mission')}
                </Text>
                <Text style={[styles.missionText, isRTL && styles.missionTextRTL]}>
                  {t('aboutUs.missionText')}
                </Text>
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.visionCard, isRTL && styles.visionCardRTL]}>
            <LinearGradient
              colors={['#3B82F6', '#1E40AF']}
              style={styles.visionGradient}
            >
              <View style={[styles.visionContent, isRTL && styles.visionContentRTL]}>
                <Feather name="eye" size={24} color="#FFFFFF" />
                <Text style={[styles.visionTitle, isRTL && styles.visionTitleRTL]}>
                  {t('aboutUs.vision')}
                </Text>
                <Text style={[styles.visionText, isRTL && styles.visionTextRTL]}>
                  {t('aboutUs.visionText')}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Social Links */}
        <View style={[styles.socialSection, isRTL && styles.socialSectionRTL]}>
          <Text style={[styles.sectionTitle, isRTL && styles.sectionTitleRTL]}>
            {t('aboutUs.followUs')}
          </Text>
          <View style={[styles.socialLinks, isRTL && styles.socialLinksRTL]}>
            {socialLinks.map((social) => (
              <SocialLink key={social.id} social={social} />
            ))}
          </View>
        </View>

        {/* Contact Info */}
        <View style={[styles.contactSection, isRTL && styles.contactSectionRTL]}>
          <View style={[styles.contactCard, isRTL && styles.contactCardRTL]}>
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="mail" size={20} color="#6B7280" />
              <Text style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                {t('aboutUs.contactEmail')}
              </Text>
            </View>
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="phone" size={20} color="#6B7280" />
              <Text style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                {t('aboutUs.contactPhone')}
              </Text>
            </View>
            <View style={[styles.contactContent, isRTL && styles.contactContentRTL]}>
              <Feather name="map-pin" size={20} color="#6B7280" />
              <Text style={[styles.contactText, isRTL && styles.contactTextRTL]}>
                {t('aboutUs.contactAddress')}
              </Text>
            </View>
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

  descriptionSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  descriptionSectionRTL: {
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionTitleRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  descriptionTextRTL: {
    textAlign: 'right',
  },

  featuresSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  featuresSectionRTL: {
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureCardRTL: {
  },
  featureGradient: {
    borderRadius: 16,
  },
  featureContent: {
    padding: 16,
    alignItems: 'center',
  },
  featureContentRTL: {
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureTitleRTL: {
    textAlign: 'right',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureDescriptionRTL: {
    textAlign: 'right',
  },

  statsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsSectionRTL: {
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statCardRTL: {
  },
  statContent: {
    padding: 16,
    alignItems: 'center',
  },
  statContentRTL: {
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statNumberRTL: {
    textAlign: 'right',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statLabelRTL: {
    textAlign:  I18nManager.isRTL ? 'left' : 'right',
  },

  teamSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  teamSectionRTL: {
  },
  teamGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamMember: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  teamMemberRTL: {
  },
  teamMemberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamMemberEmoji: {
    fontSize: 32,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  teamMemberNameRTL: {
    textAlign: 'right',
  },
  teamMemberPosition: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  teamMemberPositionRTL: {
    textAlign: 'right',
  },

  missionSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  missionSectionRTL: {
  },
  missionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  missionCardRTL: {
  },
  missionGradient: {
    borderRadius: 16,
  },
  missionContent: {
    padding: 20,
    alignItems: 'center',
  },
  missionContentRTL: {
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  missionTitleRTL: {
    textAlign: 'right',
  },
  missionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  missionTextRTL: {
    textAlign: 'right',
  },
  visionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  visionCardRTL: {
  },
  visionGradient: {
    borderRadius: 16,
  },
  visionContent: {
    padding: 20,
    alignItems: 'center',
  },
  visionContentRTL: {
  },
  visionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  visionTitleRTL: {
    textAlign: 'right',
  },
  visionText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  visionTextRTL: {
    textAlign: 'right',
  },

  socialSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  socialSectionRTL: {
  },
  socialLinks: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialLinksRTL: {
  },
  socialLink: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contactSection: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  contactSectionRTL: {
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  contactCardRTL: {

  },
  contactContent: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactContentRTL: {
    flexDirection: 'row-reverse',
  },
  contactText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 12,
    flex: 1,
  },
  contactTextRTL: {
    marginLeft: 0,
    marginRight: I18nManager.isRTL ? 0 :     12,
    textAlign: I18nManager.isRTL ? 'left' : 'right',
  },
});

export default AboutUsScreen;
