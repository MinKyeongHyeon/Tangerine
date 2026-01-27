import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import TextInput from '../../../components/TextInput';
import { userAPI } from '../../../service/fetch/api';

type Props = {
  formName?: string;
  btnText?: string;
};

export default function LoginForm({ formName = '로그인', btnText = '다음' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [pwErrorMessage, setPwErrorMessage] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await userAPI.login(email, password);
      if (res.accountname && res.token) {
        localStorage.setItem('TOKEN_KEY', res.token);
        navigate('/');
      }
    } catch (err: any) {
      setPwError(true);
      setPwErrorMessage(err.message || '로그인에 실패했습니다.');
      console.error('login error', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-[24px] font-medium mt-[30px]">{formName}</h1>
      <div className="w-screen mt-[40px]">
        <form className="flex flex-col gap-[30px]" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-[16px]">
            <TextInput
              inputId="email"
              labelText="이메일"
              inputType="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              inputId="password"
              labelText="비밀번호"
              inputType="password"
              inputValue={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPwError(false);
              }}
              errorMessage={'*' + pwErrorMessage}
              showErrorMessage={pwError}
            />
          </div>

          <div className="flex justify-center">
            <Button
              btnTextContent={btnText}
              btnSize="large"
              btnColor={email && password.length >= 6 && !loading ? 'normal' : 'disable'}
              btnType="submit"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
