import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { connect } from 'dva';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, Select, Row, Col, Icon, Popover } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
const { TextArea } = Input;
const { Option } = Select;

import styles from './style.less';
import { CustomerFormStateType } from '../data';

const fieldLabels = {
  name: '名称',
  url: 'url',
  up: '主管部门',
  channel: '行业',
  addr: '地址',
  desc: '描述',
};

interface MatchParams {
  id: string;
}

interface CustomerFormProps extends FormComponentProps, RouteComponentProps<MatchParams> {
  dispatch: Dispatch<any>;
  submitting: boolean;
  customer: CustomerFormStateType;
}

interface CustomerFormState {
  width: string;
}

@connect(
  ({
    customerforms,
    loading,
  }: {
    customerforms: CustomerFormStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    submitting: loading.effects['customerforms/submitAdvancedForm'],
    customer: customerforms,
  }),
)
class CustomerForm extends Component<CustomerFormProps, CustomerFormState> {
  constructor(props: CustomerFormProps) {
    super(props);
    this.state = {
      width: '100%',
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    console.log(id);
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'customerforms/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      if (!err) {
        dispatch({
          type: 'customerforms/submitAdvancedForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      customer: { data },
    } = this.props;
    const { customer } = data;

    const { width } = this.state;

    return (
      <>
        <PageHeaderWrapper content="管理客户、联系人、AppKey">
          <Card title="客户基本信息" className={styles.card} bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <Row gutter={16}>
                <Col lg={10} md={12} sm={24}>
                  <Form.Item label="名称">
                    {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: '需要输入名称',
                        },
                      ],
                      initialValue: customer ? customer.name : null,
                    })(<Input placeholder={'输入名称'} />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 12 }} sm={24}>
                  <Form.Item label="行业">
                    {getFieldDecorator('channel', {
                      rules: [{ required: true, message: '请选择行业' }],
                      initialValue: customer ? customer.channel : null,
                    })(
                      <Select placeholder="请选择行业">
                        <Option value="jiaoyu">教育</Option>
                        <Option value="jinrong">金融</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={10} md={12} sm={24}>
                  <Form.Item label="url">
                    {getFieldDecorator('url', {
                      rules: [{ required: false, message: '请输入公司网址' }],
                    })(<Input placeholder={'公司网址'} />)}
                  </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={10} md={12} sm={24}>
                  <Form.Item label="地址">
                    {getFieldDecorator('addr', {
                      rules: [{ required: false, message: '请输入公司地址' }],
                      initialValue: customer ? customer.addr : null,
                    })(<Input placeholder={'公司地址'} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={10} md={12} sm={24}>
                  <Form.Item label="主管单位">
                    {getFieldDecorator('up', {
                      rules: [{ required: false, message: '请输入上级主管单位' }],
                      initialValue: customer ? customer.up : null,
                    })(<Input placeholder={'上级主管单位'} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={{ span: 22 }} lg={{ span: 20 }} md={{ span: 24 }} sm={24}>
                  <Form.Item label="描述">
                    {getFieldDecorator('desc', {
                      rules: [
                        {
                          required: false,
                          message: '请输入描述',
                        },
                      ],
                      initialValue: customer ? customer.desc : null,
                    })(<TextArea style={{ minHeight: 32 }} placeholder={'输入描述'} rows={4} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          {customer && customer.id ? (
            <Card title="成员管理" className={styles.card} bordered={false}></Card>
          ) : null}

          <Card title="AppKey管理" className={styles.card} bordered={false}></Card>
        </PageHeaderWrapper>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create<CustomerFormProps>()(CustomerForm);
