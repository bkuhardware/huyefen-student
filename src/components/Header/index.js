import React from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import { Layout, Row, Col, Input, Popover, Divider, Avatar, Icon } from 'antd';
import UserAvatar from '@/components/Avatar';
import Categories from '@/components/Popover/Categories';
import MyCourses from '@/components/Popover/MyCourses';
import Cart from '@/components/Popover/Cart';
import Messenger from '@/components/Popover/Messenger';
import Notifications from '@/components/Popover/Notifications';
import { capitalText } from '@/utils/utils';
import logo from '@/assets/images/logo_trans.png';
import styles from './index.less';
import SearchEngine from '@/components/Header/SearchEngine';

const { Header: AntdHeader } = Layout;
const { Search } = Input;

const Header = ({ dispatch, user }) => {
    const handleLogout = () => {
        dispatch({
            type: 'user/logout'
        });
    };
    return (
        <AntdHeader className={styles.header}>
            <div className={styles.leftContent}>
                <div className={styles.logo}>
                    <Link to="/"><img src={logo} alt="Logo" /></Link>
                </div>
                <div className={styles.categories}>
                    <Categories />
                </div>
                <div className={styles.search}>
                    <SearchEngine />
                </div>
            </div>
            <div className={styles.rightContent}>
                {user ? (
                    <React.Fragment>
                        <div className={styles.account}>
                            <Popover
                                placement="bottomRight"
                                popupAlign={{ offset: [-8, -13] }}
                                popupClassName={styles.accountPopover}
                                content={(
                                    <div>
                                        <Row className={styles.info}>
                                            <Col span={4}>
                                                <UserAvatar
                                                    borderWidth={0}
                                                    src={user.avatar}
                                                    size={39}
                                                    textSize={39}
                                                    alt="user-avatar"
                                                    text={user.name}
                                                    style={{ backgroundColor: '#fada5e', color: 'white' }}
                                                />
                                            </Col>
                                            <Col span={20}>
                                                <div className={styles.name}><b>{user.name}</b></div>
                                                <div className={styles.mail}>{user.email}</div>
                                            </Col>
                                        </Row>
                                        <div className={styles.item} onClick={() => router.push('/settings')}>
                                            <span>{formatMessage({ id: 'header.account.settings' })}</span>
                                        </div>
                                        <div className={styles.item} onClick={() => router.push('/purchase-history')}>
                                            <span>{formatMessage({ id: 'header.account.purchase-history' })}</span>
                                        </div>
                                        <div className={styles.item} onClick={() => router.push('/my-friends')}>
                                            <span>{formatMessage({ id: 'header.account.myfriends' })}</span>
                                        </div>
                                        <div className={styles.item} onClick={() => router.push('/my-teachers')}>
                                            <span>{formatMessage({ id: 'header.account.myteachers' })}</span>
                                        </div>
                                        <div className={styles.divider}><Divider type="horizontal" className={styles.realDivider} /></div>
                                        <div className={styles.item}>
                                            {formatMessage({ id: 'header.account.help' })}
                                        </div>
                                        <div className={styles.item} onClick={handleLogout}>
                                            {formatMessage({ id: 'header.account.logout' })}
                                        </div>
                                    </div>
                                )}
                            >
                                <div className={styles.accountText}>
                                    <UserAvatar
                                        borderWidth={0}
                                        src={user.avatar}
                                        size={32}
                                        textSize={32}
                                        alt="user-avatar"
                                        text={user.name}
                                        style={{ backgroundColor: '#fada5e', color: 'white' }}
                                    />
                                </div>
                            </Popover>
                        </div>
                        <div className={styles.notifications}>
                            <Notifications />
                        </div>
                        <div className={styles.messenger}>
                            <Messenger />
                        </div>
                        <div className={styles.cart}>
                            <Cart />
                        </div>
                        <div className={styles.myCourses}>
                            <MyCourses />
                        </div>
                    </React.Fragment>
                ) : (
                    <div className={styles.login} onClick={() => router.push('/user/login')}>
                        <Icon type="login" />
                        <span className={styles.text}>Sign in</span>
                    </div>
                )}
                <div className={styles.teaching}>
                    <Popover
                        content={(
                            <div className={styles.content}>
                                <p>{formatMessage({ id: 'header.teaching.text' })}</p>
                                <div><Link to="/teaching">{formatMessage({ id: 'header.teaching.learnmore' })}</Link></div>
                            </div>
                        )}
                        popupClassName={styles.teachingPopover}
                        placement="bottomRight"
                        popupAlign={{ offset: [-5, -13] }}
                    >
                        <div className={styles.teachingText} onClick={() => router.push('/teaching')}>
                            {formatMessage({ id: 'header.teaching.trigger' })}
                        </div>
                    </Popover>
                </div>
            </div>
        </AntdHeader>
    )
}

export default connect(
    ({ user }) => ({ user: user })
)(Header);