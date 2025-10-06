import React, { useState, useEffect } from 'react';

const CitiesAreasDemo = () => {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [blockId, setBlockId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredAreas, setFilteredAreas] = useState([]);

  // جلب البيانات من API
  const fetchCitiesAndAreas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://10.42.0.1:8003/api/user/cities-areas', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR...'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const { cities, areas, block_id } = result.data;
        
        // حفظ البيانات في state
        setCities(cities);
        setAreas(areas);
        setBlockId(block_id);
        
        // حفظ البيانات في localStorage
        localStorage.setItem('citiesAndAreas', JSON.stringify({
          cities,
          areas,
          block_id,
          timestamp: new Date().toISOString()
        }));
        
        console.log('تم جلب البيانات بنجاح:', { cities, areas, block_id });
      } else {
        throw new Error(result.message || 'فشل في جلب البيانات');
      }
    } catch (err) {
      setError(err.message);
      console.error('خطأ في جلب البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات من localStorage عند بدء التطبيق
  const loadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('citiesAndAreas');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCities(parsedData.cities || []);
        setAreas(parsedData.areas || []);
        setBlockId(parsedData.block_id);
        console.log('تم تحميل البيانات من localStorage');
      }
    } catch (err) {
      console.error('خطأ في تحميل البيانات من localStorage:', err);
    }
  };

  // عند الضغط على مدينة
  const handleCityClick = (city) => {
    setSelectedCity(city);
    const cityAreas = areas.filter(area => area.city_id === city.id);
    setFilteredAreas(cityAreas);
    console.log(`تم اختيار مدينة: ${city.name}`, cityAreas);
  };

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadFromLocalStorage();
    fetchCitiesAndAreas();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px'
      }}>
        إدارة المدن والمناطق
      </h1>

      {/* معلومات Block ID */}
      {blockId && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <strong>Block ID: {blockId}</strong>
        </div>
      )}

      {/* حالة التحميل */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <p>جاري التحميل...</p>
        </div>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>خطأ:</strong> {error}
          <button 
            onClick={fetchCitiesAndAreas}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* قائمة المدن */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            color: '#1976d2',
            borderBottom: '2px solid #1976d2',
            paddingBottom: '10px'
          }}>
            المدن ({cities.length})
          </h2>
          
          {cities.length > 0 ? (
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '5px',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {cities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => handleCityClick(city)}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    backgroundColor: selectedCity?.id === city.id ? '#e3f2fd' : 'white',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCity?.id !== city.id) {
                      e.target.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCity?.id !== city.id) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <strong>{city.name}</strong>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    marginTop: '5px'
                  }}>
                    ID: {city.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p style={{ 
                textAlign: 'center', 
                color: '#666',
                fontStyle: 'italic'
              }}>
                لا توجد مدن متاحة
              </p>
            )
          )}
        </div>

        {/* قائمة المناطق */}
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            color: '#388e3c',
            borderBottom: '2px solid #388e3c',
            paddingBottom: '10px'
          }}>
            المناطق ({filteredAreas.length})
            {selectedCity && (
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'normal',
                color: '#666'
              }}>
                {' '}- {selectedCity.name}
              </span>
            )}
          </h2>
          
          {selectedCity ? (
            filteredAreas.length > 0 ? (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <strong>{area.name}</strong>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      marginTop: '5px'
                    }}>
                      ID: {area.id} | City ID: {area.city_id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ 
                textAlign: 'center', 
                color: '#666',
                fontStyle: 'italic',
                backgroundColor: '#fff3cd',
                padding: '20px',
                borderRadius: '5px',
                border: '1px solid #ffeaa7'
              }}>
                لا توجد مناطق لهذه المدينة
              </p>
            )
          ) : (
            <p style={{ 
              textAlign: 'center', 
              color: '#666',
              fontStyle: 'italic',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '5px',
              border: '1px solid #dee2e6'
            }}>
              اختر مدينة لعرض المناطق
            </p>
          )}
        </div>
      </div>

      {/* إحصائيات */}
      {!loading && !error && (
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>الإحصائيات</h3>
          <p style={{ margin: '5px 0' }}>
            <strong>عدد المدن:</strong> {cities.length}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>إجمالي المناطق:</strong> {areas.length}
          </p>
          {selectedCity && (
            <p style={{ margin: '5px 0' }}>
              <strong>مناطق المدينة المختارة:</strong> {filteredAreas.length}
            </p>
          )}
        </div>
      )}

      {/* أزرار التحكم */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button 
          onClick={fetchCitiesAndAreas}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          تحديث البيانات
        </button>
        
        <button 
          onClick={() => {
            setSelectedCity(null);
            setFilteredAreas([]);
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          إعادة تعيين
        </button>
      </div>
    </div>
  );
};

export default CitiesAreasDemo;
