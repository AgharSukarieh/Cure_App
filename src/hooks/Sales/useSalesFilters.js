import { useState, useCallback } from "react";

const useSalesFilters = (userLocationData, dispatch, updateAreasForCity) => {
  const [cityValue, setCityValue] = useState(null);
  const [areaValue, setAreaValue] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [openFrom, setOpenFrom] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [calenderFrom, setCalenderFrom] = useState("");
  const [openTo, setOpenTo] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());
  const [calenderTo, setCalenderTo] = useState("");

  const formatDate = useCallback((date) => {
    return date.toISOString().split("T")[0];
  }, []);

  const handleCityChange = useCallback((item) => {
    setCityValue(item.value);
    setAreaValue(null);
    setSelectedCityId(item.value);
    setSelectedAreaId(null);
    
    dispatch(updateAreasForCity(item.value));
    
    const filteredAreas = (userLocationData.areas || [])
      .filter(area => String(area.city_id) === String(item.value))
      .map(area => ({
        value: area.id,
        label: area.name
      }));
    
    setAreas(filteredAreas);
    console.log(`📍 تم تحديث المناطق للمدينة ${item.value}:`, filteredAreas.length, 'منطقة');
  }, [dispatch, userLocationData.areas, updateAreasForCity]);

  const handleAreaChange = useCallback((item) => {
    setAreaValue(item.value);
    setSelectedAreaId(item.value);
  }, []);

  const handleDateFromConfirm = useCallback((date) => {
    setOpenFrom(false);
    setDateFrom(date);
    const formattedDate = formatDate(date);
    setCalenderFrom(formattedDate);
    setSelectedDateFrom(formattedDate);
  }, [formatDate]);

  const handleDateToConfirm = useCallback((date) => {
    setOpenTo(false);
    setDateTo(date);
    const formattedDate = formatDate(date);
    setCalenderTo(formattedDate);
    setSelectedDateTo(formattedDate);
  }, [formatDate]);

  const handleResetFilters = useCallback(() => {
    setCityValue(null);
    setAreaValue(null);
    setAreas([]);
    setSelectedCityId(null);
    setSelectedAreaId(null);
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
    setCalenderFrom("");
    setCalenderTo("");
  }, []);

  return {
    cityValue,
    areaValue,
    areas,
    selectedCityId,
    selectedAreaId,
    selectedDateFrom,
    selectedDateTo,
    openFrom,
    setOpenFrom,
    dateFrom,
    calenderFrom,
    openTo,
    setOpenTo,
    dateTo,
    calenderTo,
    handleCityChange,
    handleAreaChange,
    handleDateFromConfirm,
    handleDateToConfirm,
    handleResetFilters,
  };
};

export default useSalesFilters;

