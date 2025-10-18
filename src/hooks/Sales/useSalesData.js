import { useState, useEffect, useCallback } from "react";
import { get } from "../../WebService/RequestBuilder";
import API from "../../config/apiConfig";

const useSalesData = (saleId, cityId, areaId, dateFrom, dateTo, t) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchData = useCallback(async (currentPage = 1, isLoadMore = false) => {
    if (!saleId) {
      setIsLoading(false);
      setData([]);
      return;
    }

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
      setPage(1);
      setHasMoreData(true);
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage.toString());
      
      if (cityId && cityId !== 'all') queryParams.append('city_id', cityId);
      if (areaId && areaId !== 'all') queryParams.append('area_id', areaId);
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const url = `${API.orders.sales_orders}?${queryParams.toString()}`;
      
      console.log('📡 جلب البيانات:', url);
      console.log('🔍 الفلاتر:', { page: currentPage, cityId, areaId, dateFrom, dateTo });

      const response = await get(url);
      
      console.log('📦 استجابة API:', response ? 'موجود' : 'غير موجود');

      let orders = [];

      if (response?.data?.data) {
        orders = response.data.data;
      } else if (response?.data) {
        orders = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        orders = response;
      } else if (response?.order_details) {
        orders = response.order_details;
      }

      console.log(`✅ تم استخراج ${orders.length} طلب`);

      const allOrderDetails = [];
      orders.forEach((order) => {
        if (order.order_details && Array.isArray(order.order_details)) {
          order.order_details.forEach((detail) => {
            allOrderDetails.push({
              ...detail,
              order_pharmacy: order.pharmacy,
              order_pharmacy_id: order.pharmacy_id,
              order_city: order.city,
              order_area: order.area,
              order_status: order.order_status || order.status,
              order_payment_method: order.payment_method,
              order_total_price: order.total_price,
              order_created_at: order.created_at,
              order_id: order.id,
            });
          });
        } else {
          allOrderDetails.push({
            id: order.id,
            order_id: order.id,
            product_name: 'N/A',
            units: 1,
            order_pharmacy: order.pharmacy_name || order.pharmacy,
            order_pharmacy_id: order.pharmacy_id,
            order_city: order.city,
            order_area: order.area,
            order_status: order.order_status || order.status,
            order_payment_method: order.payment_method,
            order_total_price: order.total_price,
            order_created_at: order.created_at,
            product: { 
              name: 'N/A', 
              price: order.total_price,
              company: { name: 'N/A' }
            },
          });
        }
      });

      console.log(`✅ تم استخراج ${allOrderDetails.length} order details`);

      const meta = response.meta || response.data?.meta;
      const hasMore = meta?.last_page ? currentPage < meta.last_page : allOrderDetails.length >= 10;
      setHasMoreData(hasMore);
      
      if (meta) {
        console.log(`✅ الصفحة ${meta.current_page} من ${meta.last_page}`);
        console.log(`📦 إجمالي الطلبات: ${meta.total}`);
      }

      const normalizedData = allOrderDetails.map((item, index) => {
        const companyName = item.product?.company?.name || 'N/A';
        const pharmacyName = item.order_pharmacy || 'Unknown Client';
        
        let totalPrice = 0;
        if (item.units && item.product?.price) {
          totalPrice = parseFloat(item.units) * parseFloat(item.product.price);
        } else if (item.order_total_price) {
          totalPrice = parseFloat(item.order_total_price);
        }
        totalPrice = totalPrice.toFixed(2);

        let status = 'pending';
        const rawStatus = (item.order_status || '').toString().toLowerCase();
        if (rawStatus === 'completed' || rawStatus === 'delivered') status = 'delivered';
        else if (rawStatus.includes('cancel')) status = 'canceled';

        let paymentMethod = 'N/A';
        const pm = item.order_payment_method;
        if (pm === '0' || pm === 0) paymentMethod = t('sales.cash') || 'Cash';
        else if (pm === '1' || pm === 1) paymentMethod = t('sales.credit') || 'Credit';
        else if (pm === '2' || pm === 2) paymentMethod = t('sales.check') || 'Check';

        return {
          id: `${item.order_id}-${item.id || index}`,
          order_id: item.order_id,
          client_name: pharmacyName,
          company_name: companyName,
          product_name: item.product?.name || 'N/A',
          units: item.units || 1,
          total_price: totalPrice,
          payment_method: paymentMethod,
          status: status,
          created_at: item.order_created_at || item.created_at,
          city: item.order_city,
          area: item.order_area,
          product: item.product,
        };
      });

      if (isLoadMore) {
        setData(prevData => [...prevData, ...normalizedData]);
        setPage(currentPage);
        console.log(`➕ تمت إضافة ${normalizedData.length} عنصر - الإجمالي: ${data.length + normalizedData.length}`);
      } else {
        setData(normalizedData);
        console.log(`🔄 تم تعيين بيانات: ${normalizedData.length} عنصر`);
      }

    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "فشل في تحميل بيانات المبيعات. حاول مرة أخرى.";
      setError(errorMsg);
      
      if (!isLoadMore) {
        setData([]);
      }
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [saleId, cityId, areaId, dateFrom, dateTo, t]);

  useEffect(() => {
    console.log('🔄 تغيير في الفلاتر، جلب البيانات...');
    fetchData(1, false);
  }, [fetchData]);

  const loadMoreData = useCallback(async () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      const nextPage = page + 1;
      console.log(`📄 تحميل الصفحة ${nextPage}...`);
      await fetchData(nextPage, true);
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, fetchData]);

  return {
    data,
    isLoading,
    error,
    hasMoreData,
    isLoadingMore,
    loadMoreData,
    refetch: () => fetchData(1, false),
  };
};

export default useSalesData;

