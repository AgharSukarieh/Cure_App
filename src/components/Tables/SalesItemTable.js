import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import SalesModel from '../Modals/SalesModel'

const SalesItemTable = ({item}) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState('')
    const DDD = (row) => {
        setModal(true)
        setrowdata(row)
    }

  return (
    <>
    <View style={{ ...styles.row, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }}>
        <View style={{ ...styles.rowel, width: '30.1%', }}>
            <Text style={{ ...styles.rowel_tetx, color: item?.id % 2 == 0 ? '#fff' : '#000' }}>{item?.pharm_name}</Text>
        </View>

        <View style={styles.rowel}>
            {item?.items?.slice(0, 3).map((row, index2) => (
                <Text key={index2} style={{ ...styles.rowel_tetx, color: item?.id % 2 == 0 ? '#fff' : '#000' }}>{row.item_name}</Text>
            ))}
        </View>

        <View style={styles.rowel}>
            {item?.items?.slice(0, 3).map((row, index2) => (
             <Text key={index2} style={{ ...styles.rowel_tetx, color: index % 2 == 0 ? '#fff' : '#000' }}>{row.items_sum} / {row.bonus}</Text>
            ))}
        </View>
        
        <View style={{ ...styles.rowel, width: '12%', }}>
            <TouchableOpacity onPress={() => { DDD(item) }}>
                <AntDesign name="infocirlceo" color='gold' size={17} />
            </TouchableOpacity>
        </View>
    </View>
    <SalesModel show={modal} hide={() => { setModal(false) }} data={rowdata} />
    </>
  )
}

export default SalesItemTable

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderWidth: 1,
        borderColor: '#7189FF',
        marginTop: 10,
        borderRadius: 7
    },
    rowel: {
        width: '29%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    rowel_tetx: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#000',
        height: 20,
    },
    rowel_tetx2: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#fff',
        height: 20,
    }
})