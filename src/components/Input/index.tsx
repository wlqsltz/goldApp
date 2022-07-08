import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import {
  FieldInputProps,
  FormikContextType,
  FormikProps,
  useFormikContext,
} from 'formik';

interface IProps extends TextInputProps {
  prefix?: JSX.Element;
  suffix?: (context: FormikContextType<any>) => JSX.Element;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  containerStyle?: StyleProp<ViewStyle>;
  errorStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

const Input: React.FC<IProps> = props => {
  const context = useFormikContext();
  const {
    form,
    field,
    prefix,
    suffix,
    containerStyle,
    errorStyle,
    inputStyle,
    ...rest
  } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.input_box}>
        {prefix ? prefix : null}
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          {...rest}
          onChangeText={form.handleChange(field.name)}
          onBlur={form.handleBlur(field.name)}
          value={field.value}
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
    // height: 64,
    paddingTop: 25,
    paddingBottom: 16,
    borderColor: '#E3E3E3',
    borderBottomWidth: 1,
  },
  input_box: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontFamily: 'PingFangSC-Regular',
  },
  error: {
    position: 'absolute',
    color: 'red',
    marginTop: 3,
    // marginLeft: 10,
    fontSize: 12,
  },
});

export default Input;
