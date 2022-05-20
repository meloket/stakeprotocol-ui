const storageKey = "user_wallet_address";

export const saveAccount = (payload: any) => {
  const data = JSON.stringify(payload);
  localStorage.setItem(storageKey, data);
}

export const getAccount = () => {
  const data: any = localStorage.getItem(storageKey);
  return JSON.parse(data);
}

export const removeAccount = () => {
  localStorage.removeItem(storageKey);
}