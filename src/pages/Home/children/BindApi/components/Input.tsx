import React from 'react';
import {View, Text, StyleSheet, TextInput, TextInputProps} from 'react-native';
import {FieldInputProps, FormikProps} from 'formik';

interface IProps extends TextInputProps {
  title: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

const Input: React.FC<IProps> = props => {
  const {form, field, title, ...rest} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.input_box}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#BEBEBE"
          autoCapitalize="none"
          clearButtonMode="while-editing"
          {...rest}
          onChangeText={form.handleChange(field.name)}
          onBlur={form.handleBlur(field.name)}
        />
      </View>
      <View>
        <Text style={styles.error}>
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
    paddingTop: 19,
    paddingLeft: 15,
    paddingRight: 19,
  },
  title: {
    fontFamily: 'PingFangSC-Semibold',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 21,
    marginBottom: 8,
  },
  input_box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    paddingHorizontal: 15,
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
    fontSize: 12,
  },
});

export default Input;
