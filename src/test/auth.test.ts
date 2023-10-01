import { afterEach, describe, expect, test } from '@jest/globals';
import { sum } from './sum';
import AuthService from '@src/service/auth.service';
import { User } from '@src/model/user.model';

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

/** 테스트용임을 알리는 텍스트, 추후 데이터베이스에서 삭제 시 필요 */
const testMock = '_test';

const user1 = new User();
user1.name = `hanbyul${testMock}`;
user1.email = '';
user1.passwword = '';

/** 테스트용 목업 리스트 */
const mockupList: User[] = [user1];

test('test', async () => {
    const user = new User();

    const service = new AuthService();
    const result = service.setAuthCode(user);

    // db get

    expect(user).toBe(user);
});

afterEach(() => {
    // clear database
});
