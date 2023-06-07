import React from 'react';
import {Button, Form, Input, Row, Space, Table} from 'antd';
import {displayDate, getErrorText} from '../../../../shared/lib';
import { GetRequestsApiParams, IRequest, REQUEST_STATUS_COLOR, REQUEST_STATUS_TITLE, RequestStatuses } from '../..';
import { Container, Typography } from '../../../../shared/ui';
import { Filters, FormData } from '../RequestTableFilters';
import Checkbox from "antd/es/checkbox/Checkbox";
import { useEffect, useState } from 'react';
import {authApi} from "../../../../widgets/auth/api";
import {useAppProcessStore} from "../../../appProcess";
import { Collapse } from 'antd';

interface PropTypes<T> {
  data: IRequest[] | undefined,
  loading: boolean,
  title?: string,
  disableFilters?: boolean,
  setFilters?: (data: GetRequestsApiParams) => void,
  clearFilters?: () => void
}

export function RequestsTable<T>({data, loading, disableFilters = false, title = 'Messsages', setFilters, clearFilters}: PropTypes<T>) {
    const {setIsLoading} = useAppProcessStore();

    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [existUsers, setExistUser] = useState<string[]>([]);

    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedRows, setCheckedRows] = useState<string[]>([]);

    const handleCheckAll = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setCheckedAll(event.target.checked);
        setCheckedRows([]);
    };

    const handleCheckRow = (id: string) => {
        const isChecked = checkedRows.includes(id);
        if (isChecked) setCheckedRows(checkedRows.filter((checkedId) => checkedId !== id));
        else setCheckedRows([...checkedRows, id]);
    };

    const handleFocus = async () => {

        const res = await authApi.getUsers();

        console.log('res', res)

        let usersNameArray = [];
        const users = res.data;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username) usersNameArray.push(users[i].username)
        }
        setExistUser(usersNameArray);
    };


    const handleSendMessage = async () => {
        try {

            const res = await authApi.createMessage(recipient, subject, message);
            console.log('res', res);

            //window.location.reload();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    const [tableData, setTableData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authApi.getMessages();
                setTableData(response.data);
                console.log('response', response.data.length)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div>
            <Container marginBottom={24}>
                <Form.Item
                    label="Username"
                    name="username"
                    colon={false}
                    initialValue={''}
                >
                    <Input type="text" id="username" value={recipient}
                           onChange={(event) => setRecipient(event.target.value)} list="recipients"
                           onFocus={handleFocus}/>
                    <datalist id="recipients">
                        {existUsers.map((username) => (
                            <option key={username} value={username}/>
                        ))}
                    </datalist>
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="subject"
                    colon={false}
                    initialValue={''}
                >
                    <Input type="text" id="subject" value={subject}
                           onChange={(event) => setSubject(event.target.value)}/>
                </Form.Item>
                <Form.Item
                    label="Message"
                    name="message"
                    colon={false}
                    initialValue={''}
                >
                    <Input id="message" value={message} onChange={(event) => setMessage(event.target.value)}/>
                    <Button color="inherit" onClick={() => handleSendMessage()}>Send</Button>
                </Form.Item>


            </Container>

            <Container marginBottom={24}>
                <Space size={'middle'}>
                    <Typography.Title level={3} $noMargin>
                        {title}
                    </Typography.Title>

                </Space>

            </Container>

            <Table
                dataSource={tableData}
                loading={loading}
            >

                <Table.Column
                    title={() => (
                        <Checkbox
                            onChange={handleCheckAll}
                            checked={checkedAll}/>
                    )}
                    dataIndex="id"
                    key="id"
                    render={(id) => (
                        <Checkbox
                            onChange={() => handleCheckRow(id)}
                            checked={checkedAll || checkedRows.includes(id)}
                        />
                    )}
                />

                <Table.Column
                    title="CreatedAt"
                    dataIndex="createdAt"
                    key="date"
                    render={(date: string) => displayDate(date, true)}
                />
                <Table.Column title="Sender" dataIndex="sender" key="sender"/>
                <Table.Column
                    title="Message"
                    dataIndex="message"
                    key="message"

                    render={(message: string, record: any) => (
                        <Collapse>
                            <Collapse.Panel header={record.title} key="message">
                                {message}
                            </Collapse.Panel>
                        </Collapse>
                    )}
                />
            </Table>

        </div>
    );
};
