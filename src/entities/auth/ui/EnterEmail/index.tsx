import React from 'react';
import { Typography, Input, Container, Button, Form } from 'shared/ui';
import { Rule } from 'shared/types';

const { Title } = Typography;

const userNameRules: Rule[] = [
    {
        required: true,
        message: 'Please input your username'
    },
];


export type EnterEmailForm = {
    username: string,
}

interface EnterEmailProps {
  onNext: (form: EnterEmailForm) => void
}

export const EnterEmailEntity = ({ onNext }: EnterEmailProps) => {

    return (
        <Form onFinish={onNext}>
            <Container marginBottom={24}>
                <Title level={3}>Enter username</Title>
            </Container>


            <Form.Item
                label="Username"
                name="username"
                rules={userNameRules}
                colon={false}
                initialValue={''}
            >
                <Input/>
            </Form.Item>


            <Form.Item style={{textAlign: 'right'}}>
                <Button type="primary" htmlType="submit">
                    Next
                </Button>
            </Form.Item>
        </Form>
    );
};
