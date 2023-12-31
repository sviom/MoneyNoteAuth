import { CustomError } from '@src/model/error.model';
import { User } from '@src/model/user.model';

const validEmail = 'kanghanstar@outlook.com';
const validPassword = 'dfkadjf@dfdmDd02';
const validName = 'hanbyulkang';

/** 올바른 입력 테스트 케이스 */
const user1 = new User();
user1.name = validName;
user1.email = validEmail;
user1.password = validPassword;

/** 이름 잘못 입력 테스트 케이스 - 빈 이름 */
const user2 = new User();
user2.email = validEmail;
user2.password = validPassword;
const user2Error = new CustomError({ message: '사용자의 닉네임을 입력해주세요.' });

/** 이름 잘못 입력 테스트 케이스 - 짧은 이름 */
const user2_1 = new User();
user2_1.name = `aa`;
user2_1.email = validEmail;
user2_1.password = validPassword;
const user2_1Error = new CustomError({ message: '사용자의 닉네임을 입력해주세요.' });

/** 이메일 잘못 입력 테스트 케이스 - 잘못된 이메일 */
const user3 = new User();
user3.name = validName;
user3.email = '@outlook.com';
user3.password = validPassword;
const user3Error = new CustomError({ message: '올바른 이메일을 입력해주세요.' });

/** 이메일 잘못 입력 테스트 케이스 - 빈 이메일 */
const user3_1 = new User();
user3_1.name = validName;
user3_1.password = validPassword;
const user3_1Error = new CustomError({ message: '이메일을 입력해주세요.' });

/** 비밀번호 잘못 입력 테스트 케이스 - 빈 비밀번호 */
const user5 = new User();
user5.name = validName;
user5.email = validEmail;
const user5Error = new CustomError({ message: '비밀번호가 입력되지 않았습니다. 비밀번호를 입력해주세요.' });

/** 비밀번호 잘못 입력 테스트 케이스 - 잘못된 비밀번호 */
const user5_1 = new User();
user5_1.name = validName;
user5_1.email = validEmail;
user5_1.password = 'aaaaaaaaaa';
const user5_1Error = new CustomError({ message: '올바른 비밀번호를 입력해주세요.' });

const mockList = [
    { user: user1, error: null, success: true, name: '올바른 입력 테스트 케이스' },
    { user: user2, error: user2Error, success: false, name: '이름 잘못 입력 테스트 케이스 - 빈 이름' },
    { user: user2_1, error: user2_1Error, success: false, name: '이름 잘못 입력 테스트 케이스 - 짧은 이름' },
    { user: user3, error: user3Error, success: false, name: '이메일 잘못 입력 테스트 케이스 - 잘못된 이메일' },
    { user: user3_1, error: user3_1Error, success: false, name: '이메일 잘못 입력 테스트 케이스 - 빈 이메일' },
    { user: user5, error: user5Error, success: false, name: '비밀번호 잘못 입력 테스트 케이스 - 빈 비밀번호' },
    { user: user5_1, error: user5_1Error, success: false, name: '비밀번호 잘못 입력 테스트 케이스 - 잘못된 비밀번호' },
];

export default mockList;
