import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Platform, ActionSheetIOS } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { moderateScale } from 'react-native-size-matters';
import { CategoryOption } from '@/constants/Types';


// Define the type for the props
type TaskCategorySelectProps = {
  onValueChange: (value: string) => void;
  categoryValue: string;
};

const TaskCategorySelect = ({ onValueChange, categoryValue }: TaskCategorySelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(categoryValue || null);

  const items: CategoryOption[] = [
    { label: 'Errands & Shopping', value: 'errands' },
    { label: 'Delivery & Pickups', value: 'delivery' },
    { label: 'Cleaning & House Help', value: 'cleaning' },
    { label: 'Tech Help', value: 'tech' },
    { label: 'Event Assistance', value: 'events' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Other', value: 'other' },
  ];

  const selectedItem = items.find(item => item.value === (categoryValue));

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      // Use iOS ActionSheet for native feel
      const options = ['Cancel', ...items.map(item => item.label)];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedItem = items[buttonIndex - 1];
            handleValueChange(selectedItem.value);
          }
        }
      );
    } else {
      // Use custom modal for Android
      setModalVisible(true);
    }
  };

  const handleSelect = (item: CategoryOption) => {
    handleValueChange(item.value);
    setModalVisible(false);
  };

  const renderModalItem = ({ item }: { item: CategoryOption }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.modalItemText}>{item.label}</Text>
      {( categoryValue ) === item.value && (
        <Ionicons name="checkmark" size={20} color={colors.text.green} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selector} onPress={handlePress} activeOpacity={0.7}>
        <Text style={[
          styles.selectorText,
          !selectedItem && styles.placeholderText
        ]}>
          {selectedItem ? selectedItem.label : 'Select task category'}
        </Text>
        <View style={styles.iconContainer}>
          <Ionicons name="chevron-down" size={20} color={colors.text.light} />
        </View>
      </TouchableOpacity>

      {/* Android Modal */}
      {Platform.OS === 'android' && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={colors.text.bright} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={items}
                keyExtractor={(item) => item.value}
                renderItem={renderModalItem}
                style={styles.modalList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

export default TaskCategorySelect;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    backgroundColor: colors.component.input,
    borderColor: colors.component.stroke,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    paddingHorizontal: wp('5%'),
    height: hp('6.6%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    fontSize: 14,
    flex: 1,
  },
  placeholderText: {
    color: colors.text.placeholder,
    fontFamily: 'poppins-regular',
    fontSize: 14,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    width: wp('90%'),
    maxHeight: hp('60%'),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.component.stroke,
  },
  modalTitle: {
    fontSize: moderateScale(18, 0.2),
    fontFamily: 'poppins-medium',
    color: colors.text.bright,
  },
  closeButton: {
    padding: 4,
  },
  modalList: {
    maxHeight: hp('40%'),
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.component.stroke,
  },
  modalItemText: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
    color: colors.text.bright,
    flex: 1,
  },
});