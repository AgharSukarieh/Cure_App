/**
 * Custom Hook للوصول لبيانات المستخدم من Redux
 * يعطي الأولوية لـ Redux ثم Context كـ fallback
 */

import { useSelector } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook للوصول لبيانات المستخدم الحالي
 * @returns {Object} currentUser - بيانات المستخدم الحالي
 */
export const useCurrentUser = () => {
  // ✅ جلب من Redux (الأولوية)
  const reduxUser = useSelector(state => state.user?.userData);
  
  // ✅ جلب من Context (fallback)
  const { user: contextUser } = useAuth();
  
  // ✅ استخدام Redux إذا متوفر، وإلا Context
  const currentUser = reduxUser || contextUser;
  
  return {
    user: currentUser,
    isFromRedux: !!reduxUser,
    isFromContext: !reduxUser && !!contextUser,
    isAvailable: !!currentUser
  };
};

/**
 * Hook للوصول لـ medical_id (للمناديب الطبيين)
 * @returns {number|null} medical_id
 */
export const useMedicalId = () => {
  const { user } = useCurrentUser();
  return user?.medicals?.id || user?.id || null;
};

/**
 * Hook للوصول لـ user_id
 * @returns {number|null} user_id
 */
export const useUserId = () => {
  const { user } = useCurrentUser();
  return user?.id || null;
};

/**
 * Hook للوصول لـ user role
 * @returns {string|null} role
 */
export const useUserRole = () => {
  const { user } = useCurrentUser();
  return user?.role || null;
};

/**
 * Hook للوصول لـ supervisor info
 * @returns {Object|null} supervisor
 */
export const useSupervisor = () => {
  const { user } = useCurrentUser();
  return user?.supervisor || null;
};

/**
 * Hook للوصول لـ distributor info
 * @returns {Object|null} distributor
 */
export const useDistributor = () => {
  const { user } = useCurrentUser();
  return {
    id: user?.distributor_id || null,
    name: user?.distributor_name || null
  };
};

export default useCurrentUser;

