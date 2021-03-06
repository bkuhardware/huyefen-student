import { delay } from '@/utils/utils';
import COURSES from '@/assets/fakers/mostPopular';
import _ from 'lodash';
import * as teacherService from '@/services/teacher';
const COURSES_DATA = _.take(COURSES, 8);

const initialState = {
    info: null,
    courses: {
        hasMore: true,
        list: null
    }
};

export default {
    namespace: 'teacher',
    state: initialState,
    effects: {
        *fetch({ payload: teacherId }, { call, put }) {
            const response = yield call(teacherService.fetch, teacherId);
            if (response) {
                yield put({ type: 'save', payload: response.data });
            }
        },
        *fetchCourses({ payload: teacherId }, { call, put }) {
            const response = yield call(teacherService.fetchCourses, teacherId);
            if (response) {
                yield put({
                    type: 'saveCourses',
                    payload: response.data
                });
            }
        },
        *moreCourses({ payload: teacherId }, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.teacher);
            const response = yield call(teacherService.fetchCourses, teacherId, list.length);
            if (response) {
                yield put({
                    type: 'pushCourses',
                    payload: response.data
                });
            }
        },
        *allCourses({ payload: teacherId }, { call, put, select }) {
            const { courses: { list } } = yield select(state => state.teacher);
            const response = yield call(teacherService.fetchCourses, teacherId, list.length, -1);
            if (response) {
                yield put({
                    type: 'pushCourses',
                    payload: response.data
                });
            }
        },
        *follow({ payload: teacherId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: true
            });
            const response = yield call(teacherService.follow, teacherId);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 1)
                    yield put({
                        type: 'saveStatus',
                        payload: false
                    });
            }
        },
        *unfollow({ payload: teacherId }, { call, put }) {
            yield put({
                type: 'saveStatus',
                payload: false
            });
            const response = yield call(teacherService.unfollow, teacherId);
            if (response) {
                const errorCode = 1 * response.errorCode;
                if (errorCode === 1)
                    yield put({
                        type: 'saveStatus',
                        payload: true
                    });
            }
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                info: payload
            };
        },
        saveStatus(state, { payload: status }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    isFollowed: status
                }
            };
        },
        saveCourses(state, { payload }) {
            return {
                ...state,
                courses: { ...payload }
            };
        },
        pushCourses(state, { payload }) {
            const { hasMore, list } = payload;
            return {
                ...state,
                courses: {
                    hasMore,
                    list: [
                        ...state.courses.list,
                        ...list
                    ]
                }
            };
        },
        reset() {
            return { ...initialState };
        }
    }
}