import React, { useEffect } from 'react';
import _ from 'lodash';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import { List, Avatar, Skeleton, Button, Card } from 'antd';
import Spin from '@/elements/spin/secondary';
import Wrapper from '@/components/JumpotronWrapper';
import styles from './index.less';

const { Meta } = Card;

const Teacher = ({ teacher }) => {
    return (
        <Card
            className={styles.teacher}
            hoverable
            style={{ width: '100%', borderRadius: '6px' }}
        >
            <Meta
                avatar={<Avatar src={teacher.avatar} alt="avatar" size={48} />}
                title={<Link to="/teaching">{teacher.name}</Link>}
                description={`${teacher.numOfCourses} courses, ${teacher.numOfStudents} students`}
            />
        </Card>
    );
};

const MyTeachers = ({ dispatch, ...props }) => {
    let {
        hasMore,
        teachers,
        initLoading,
        loading
    } = props;
    useEffect(() => {
        dispatch({
            type: 'teachers/fetch'
        });
        return () => dispatch({
            type: 'teachers/reset'
        });
    }, [dispatch]);
    const handleMoreTeachers = () => {
        dispatch({
            type: 'teachers/more'
        });
    };
    const handleAllTeachers = () => {
        dispatch({
            type: 'teachers/all'
        });
    };
    const loadMore = (
        !loading && !initLoading && teachers && hasMore ? (
            <div className={styles.loadMore}>
                <Button size="small" type="default" onClick={handleMoreTeachers}>More teachers</Button>
                <Button size="small" type="primary" style={{ marginLeft: 10 }} onClick={handleAllTeachers}>All teachers</Button>
            </div>
        ) : null
    );
    if (loading) teachers = teachers ? _.concat(teachers, [{
        key: _.uniqueId('teacher_loading_'),
        loading: true
    }, {
        key: _.uniqueId('teacher_loading_'),
        loading: true
    },{
        key: _.uniqueId('teacher_loading_'),
        loading: true
    }]) : undefined;
    return (
        <Wrapper title="My teachers">
            <div className={styles.myTeachers}>
                <Spin spinning={initLoading} fontSize={8} isCenter>
                    <List
                        dataSource={!teachers ? [] : teachers}
                        rowKey={item => (item._id || item.key) + _.uniqueId('teacher_')}
                        loadMore={loadMore}
                        grid={{
                            column: 3,
                            gutter: 8
                        }}
                        renderItem={item => (
                            <div className={!item.loading ? styles.teacherItem : styles.loadingItem} onClick={!item.loading ? () => router.push(`/teacher/${item._id}` ) : () => {}}>
                                <List.Item style={{ paddingLeft: 12, paddingRight: 12 }}>
                                    <Skeleton active title={false} avatar loading={item.loading}
                                        paragraph={{
                                            rows: 2,
                                            width: ['60%', '40%']
                                        }}
                                    >
                                        <Teacher teacher={item} />
                                    </Skeleton>
                                </List.Item>
                                
                            </div>
                        )}
                    />
                </Spin>
            </div>
        </Wrapper>
    )
};

export default connect(
    ({ teachers, loading }) => ({
        teachers: teachers.list,
        hasMore: teachers.hasMore,
        initLoading: !!loading.effects['teachers/fetch'],
        loading: !!loading.effects['teachers/more'] || !!loading.effects['teachers/all']
    })
)(MyTeachers);