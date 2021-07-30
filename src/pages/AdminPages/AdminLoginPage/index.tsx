import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { RootState } from '../../../redux/reducers';
import { Link, Redirect } from 'react-router-dom';
import { URL_ADMIN, URL_ADMIN_SIGNUP } from '../../../urls';
import Form from '../../../components/Form/Form';
import { joi } from '../../../lib/joi';
import { validateSchema } from '../../../components/Form/validation';
import { Field } from 'react-final-form';
import Input, { Password } from '../../../components/Form/Input';
import styles from './styles.module.less';
import { useHistory } from 'react-router';
import { Button, Image, Typography } from 'antd';
import logo from '../../../components/Layout/LandingLayout/logo.svg';
import If from '../../../components/If';
import { SpinnerOverlay } from '../../../components/SpinnerOverlay';
import { PageTitle } from '../../../components/Header';
const loginSchema = joi
  .object({
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .required(),
    password: joi.string().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(loginSchema);

export const AdminLoginPage = () => {
  const firebase = useFirebase();
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoaded(auth) && !isEmpty(auth)) {
    return <Redirect to={URL_ADMIN} />;
  }

  const loginWithFirebase = async ({ email, password }: any) => {
    setError(false);
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      history.push(URL_ADMIN);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageTitle title="Log in" />
      <If
        condition={!isLoaded(auth)}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <div className={styles.formContainer}>
            <Form
              onSubmit={loginWithFirebase}
              key="edit-contact"
              validator={validator}
              initialValues={{}}
            >
              {({ valid, pristine, form, values }) => (
                <Fragment>
                  <Link to="/" className={styles.logoContainer}>
                    <Image src={logo} preview={false} width={280} className={styles.logo} />
                  </Link>
                  <Field
                    name="email"
                    component={Input}
                    type="text"
                    label="E-mail Address"
                    placeholder="sample@email.com"
                  />
                  <Field
                    name="password"
                    component={Password}
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                  />
                  <Button
                    disabled={!valid || pristine}
                    type="primary"
                    block
                    size="large"
                    htmlType="submit"
                    loading={loading}
                  >
                    Login
                  </Button>
                  <If
                    condition={error}
                    then={() => (
                      <Typography.Text className={styles.error}>
                        Unsuccessful login due to invalid credentials.
                      </Typography.Text>
                    )}
                  />
                  <Link to={URL_ADMIN_SIGNUP} className={styles.signUp}>
                    <Button type="link">Want to organise an event? Sign up!</Button>
                  </Link>
                </Fragment>
              )}
            </Form>
          </div>
        )}
      />
    </div>
  );
};

export default AdminLoginPage;
