import React, {useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  FieldInputProps,
  FormikContextType,
  FormikProps,
  useFormikContext,
} from 'formik';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';

interface IItem {
  key: string;
  value: string;
}

interface IProps extends PickerSelectProps {
  prefix?: JSX.Element;
  suffix?: (context: FormikContextType<any>) => JSX.Element;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<ViewStyle>;
  list: IItem[];
}

const Picker: React.FC<IProps> = props => {
  const context = useFormikContext();
  const {
    form,
    field,
    prefix,
    suffix,
    containerStyle,
    errorStyle,
    placeholder,
    list,
    ...rest
  } = props;
  const _placeholder = useMemo(() => {
    return {
      label: placeholder,
      value: '',
    };
  }, [placeholder]);
  const prevPickerValue = useRef(field.value);
  const pickerRef = useRef<RNPickerSelect>();

  const onClose = useCallback(() => {
    if (prevPickerValue.current !== field.value) {
      context.setFieldValue(field.name, prevPickerValue.current);
    }
    context.setTouched({[field.name]: true});
  }, [context, field.name, field.value]);
  const InputAccessoryView = useCallback(() => {
    return (
      <View style={styles.modal_view}>
        <TouchableWithoutFeedback
          onPress={() => {
            context.setFieldValue(field.name, prevPickerValue.current);
            pickerRef.current?.togglePicker(true);
          }}
          hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
          <View testID="needed_for_touchable">
            <Text style={styles.cancel}>取消</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.picker_title}>请选交易大类</Text>
        <TouchableWithoutFeedback
          onPress={() => {
            prevPickerValue.current = field.value;
            pickerRef.current?.togglePicker(true);
          }}
          hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}>
          <View testID="needed_for_touchable">
            <Text style={[styles.cancel, styles.done]}>确定</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [context, field.name, field.value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.input_box}>
        {prefix ? prefix : null}
        <RNPickerSelect
          ref={pickerRef as React.LegacyRef<RNPickerSelect>}
          placeholder={_placeholder}
          {...rest}
          value={field.value}
          onValueChange={form.handleChange(field.name)}
          onClose={onClose}
          style={pickerSelectStyles}
          InputAccessoryView={InputAccessoryView}
          items={list.map(item => ({
            label: item.value,
            value: item.key,
          }))}
        />
        {suffix ? suffix(context) : null}
      </View>
      <View>
        <Text style={[styles.error, errorStyle]}>
          {form.touched[field.name] && form.errors[field.name]
            ? form.errors[field.name]
            : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingBottom: 16,
    borderColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  input_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal_view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 49,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cancel: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 15,
    color: '#666666',
    lineHeight: 21,
  },
  done: {
    color: '#AB7007',
  },
  picker_title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 25,
  },
  error: {
    position: 'absolute',
    color: 'red',
    marginTop: 3,
    fontSize: 12,
  },
});
const pickerSelectStyles = StyleSheet.create({
  placeholder: {
    color: '#ccc',
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
  },
  modalViewTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalViewBottom: {
    backgroundColor: '#fff',
  },
  viewContainer: {
    flex: 1,
  },
  inputIOS: {
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    fontFamily: 'PingFangSC-Medium',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
});

export default Picker;
