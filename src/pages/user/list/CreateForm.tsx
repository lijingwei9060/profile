import { Form, Input, Switch, Select, Modal } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { IUser } from './model';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  roles: { name: string; id: string }[];
  user?: IUser;
  handleAdd: (fieldsValue: { [key: string]: string }) => void;
  handleModalVisible: () => void;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, user, form, roles, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: user ? user.id : null,
      })(<Input type="hidden" />)}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录名">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少四个字符！', min: 4 }],
          initialValue: user ? user.name : null,
        })(<Input placeholder="请输入登录名" />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('realName', {
          rules: [{ required: true, message: '请输入中文', pattern: /^[\u2E80-\u9FFF]{2,6}$/ }],
          initialValue: user ? user.realName : null,
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      {user ? null : (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入至少六个字符！', min: 6 }],
          })(<Input.Password placeholder="请输入密码" />)}
        </FormItem>
      )}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, pattern: /^1\d{10}$/ }],
          initialValue: user ? user.mobile : null,
        })(<Input placeholder="请输入手机号码" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="email">
        {form.getFieldDecorator('email', {
          rules: [
            { type: 'email', message: '请输入正确的email' },
            { required: true, message: '请输入至少四个字符的规则描述！', min: 4 },
          ],
          initialValue: user ? user.email : null,
        })(<Input placeholder="请输入email" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="登录">
        {form.getFieldDecorator('status', {
          rules: [],
          valuePropName: 'checked',
          initialValue: user ? user.status : true,
        })(<Switch />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色">
        {form.getFieldDecorator('role', {
          rules: [{ required: true, message: '选择角色' }],
          initialValue: user ? user.role.id : null,
        })(
          <Select style={{ width: '100%' }} placeholder="请选择角色">
            {roles.map(role => (
              <Select.Option key={role.id} value={role.id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
