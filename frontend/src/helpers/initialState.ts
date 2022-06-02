import { retrieveTokens } from './utils';

export const colors = [
  { id: 1, color: '#f45cb6' },
  { id: 2, color: '#546fbc' },
  { id: 3, color: '#6eac0e' },
  { id: 4, color: '#e1ad1f' },
  { id: 5, color: '#1e90ff' },
  { id: 6, color: '#a53745' },
  { id: 7, color: '#aadff2' },
  { id: 8, color: '#026963' },
];

export const initialCardDetailsState = {
  color: '',
  label: '',
  list: 0,
  text: '',
  user: 0,
  id: 0,
  start_date: new Date(),
  end_date: new Date(),
  details: '',
  list_title: '',
  created_at: new Date(),
  readable_date: '',
  date_range: '',
};

export const initialSpaceState = {
  id: null,
  title: '',
  color: '',
  background: '',
  thumbnail: '',
  has_background: false,
};

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
