import { afterEach, describe, expect, test } from '@jest/globals';
import { validate } from '@src/service/auth.service';
import { User } from '@src/model/user.model';
import { CustomError } from '@src/model/error.model';
import mockList from './auth.mock';

/** 테스트용 목업 리스트 */
const mockupList: { user: User; error: CustomError | null; success: boolean; name: string }[] = mockList;

describe('Check User validate', () => {
    test.each(mockupList)('test case name', (arg: { user: User; error: CustomError | null; success: boolean; name: string }) => {
        const validateResult = validate(arg.user);
        expect(validateResult.error?.message).toEqual(arg.error?.message);
        expect(validateResult.success).toEqual(arg.success);
    });

    afterEach(() => {
        // clear database
    });
});
