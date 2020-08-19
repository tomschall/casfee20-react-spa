import { atom } from 'recoil';

export const messagesState = atom({
  key: 'messagesState',
  default: [],
});

export const newMessagesState = atom({
  key: 'newMessagesState',
  default: [],
});
