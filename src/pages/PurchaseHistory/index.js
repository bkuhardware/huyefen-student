import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import { Table, Row, Col } from 'antd';
import Wrapper from '@/components/JumpotronWrapper';
import whiteShopping from '@/assets/images/white_shopping.png';
import styles from './index.less';

const CoursePurchaseItem = ({ avatar, title }) => {
    return (
        <Row className={styles.item}>
            <Col span={8} className={styles.avatar}>
                <img alt="avatar" src={avatar} />
            </Col>
            <Col span={16} className={styles.name}>
                {title}
            </Col>
        </Row>
    )
};

const BundlePurchaseItem = ({ courses }) => {
    return (
        <div className={styles.bundle}>
            {`Bundle: ${_.join(courses, ', ')}`}
        </div>
    );
};

const PurchaseHistory = ({ dispatch, ...props }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const {
        loading,
        data,
        total
    } = props;
    useEffect(() => {
        dispatch({
            type: 'purchase/fetch'
        });
        return () => dispatch({ type: 'purchase/reset' });
    }, []);

    const realData = data && _.map(data, purchaseItem => {
        let prices = [purchaseItem.totalPrice];
        if (purchaseItem.items.length > 1) {
            prices = [purchaseItem.totalPrice, ..._.map(purchaseItem.items, 'price')];
        }
        return {
            ...purchaseItem,
            prices
        };
    });
    const handleChangeCurrentPage = page => {
        if (page <= maxPage) {
            setCurrentPage(page);
        }
        else {
            setMaxPage(page);
            dispatch({
                type: 'purchase/more',
                payload: {
                    start: maxPage,
                    end: page,
                    callback: () => setCurrentPage(page)
                }
            });
        }
    };
    //const data = PURCHASE_HISTORY;
    const renderItems = items => {
        if (!items || _.isEmpty(items) === 0) return null;
        if (items.length === 1) {
            console.log(items);
            return items[0].type === 'Course' ? (
                <CoursePurchaseItem avatar={items[0].avatar} title={items[0].title} />
            ): (
                <BundlePurchaseItem courses={items[0].courses} />
            );
        }
        return (
            <div className={styles.items}>
                <CoursePurchaseItem avatar={whiteShopping} title={`${items.length} ${items.length > 1 ? 'Courses' : 'Course'} purchased`} />
                <div className={styles.subItems}>
                    {_.map(items, item => (
                        item.type === 'Course' ? (
                            <CoursePurchaseItem key={item._id} title={item.title} avatar={item.avatar} />
                        ) : (
                            <BundlePurchaseItem courses={item.courses} key={_.uniqueId('bundle_')}/>
                        )
                    ))}
                </div>
            </div>
        )
    };
    const renderPrices = prices => {
        return (
            <div className={styles.prices}>
                <div className={styles.total}>{`$${prices[0]}`}</div>
                <div className={styles.subPrices}>
                    {_.map(_.slice(prices, 1), price => (
                        <div className={styles.price} key={_.uniqueId('price_')}>{`$${_.round(price, 2)}`}</div>
                    ))}
                </div>
            </div>
        )
    };
    const columns = [
        {
            title: 'Items',
            key: 'items',
            dataIndex: 'items',
            width: '50%',
            render: items => renderItems(items)
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
            width: '12%',
            render: date => moment(date).format('D MMM, YYYY')
        },
        {
            title: 'Total Price',
            key: 'prices',
            dataIndex: 'prices',
            width: '12%',
            render: prices => renderPrices(prices)
        },
        {
            title: 'Payment Type',
            key: 'paymentType',
            width: '14%',
            dataIndex: 'paymentType'
        },
        {
            title: '',
            key: 'receipt',
            width: '11%',
            dataIndex: '',
            render: (txt, order) => <Link to={`/receipt/${order._id}`}>Receipt</Link>
        }
    ];
    return (
        <Wrapper title="Purchase history">
            <div className={styles.purchaseHistory}>
                <Table
                    className={styles.table}
                    pagination={total && (total > 4) ? {
                        total,
                        pageSize: 4,
                        current: currentPage,
                        onChange: handleChangeCurrentPage
                    } : false}
                    rowKey={order => order._id}
                    columns={columns}
                    dataSource={!realData ? [] : realData}
                    loading={!data || loading}
                />
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ purchase, loading }) => ({
        loading: !!loading.effects['purchase/fetch'] || !!loading.effects['purchase/more'],
        data: purchase.list,
        total: purchase.total
    })
)(PurchaseHistory);