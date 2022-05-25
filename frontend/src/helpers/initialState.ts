import { retrieveTokens } from './utils';

export const initialRegisterFormState = {
  first_name: {
    name: 'first_name',
    error: '',
    value: '',
    placeholder: 'First Name',
    type: 'text',
  },
  last_name: {
    name: 'last_name',
    error: '',
    value: '',
    placeholder: 'Last Name',
    type: 'text',
  },
  email: { name: 'email', error: '', value: '', placeholder: 'Email', type: 'email' },
  password: {
    name: 'password',
    error: '',
    value: '',
    placeholder: 'Password',
    type: 'password',
  },
  confirm_password: {
    name: 'confirm_password',
    error: '',
    value: '',
    placeholder: 'Confirm Password',
    type: 'password',
  },
};

export const initialLoginFormState = {
  email: { name: 'email', error: '', value: '', placeholder: 'Email', type: 'email' },
  password: {
    name: 'password',
    error: '',
    value: '',
    placeholder: 'Password',
    type: 'password',
  },
};

export const initialUserState = {
  avatar_url: null,
  email: '',
  first_name: '',
  full_name: '',
  id: null,
  initials: '',
  logged_in: false,
};

const tokens = retrieveTokens();
export const initialTokenState = {
  access_token: tokens?.access_token ? tokens.access_token : '',
  refresh_token: tokens?.refresh_token ? tokens.refresh_token : '',
};
