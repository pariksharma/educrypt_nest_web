const KEY_TOKEN = "token";
const KEY_REFRESH = "refresh_token";
const KEY_CRED = "cred";
 
const safeParse = (v) => {
  try { return JSON.parse(v); } catch (e) { return null; }
};
 
const isClient = () => typeof window !== "undefined";
 
const localStore = {
  getToken() {
    if(!isClient()) return null;
    try { return localStorage.getItem(KEY_TOKEN); } catch { return null; }
  },
  setToken(token) {
    if(!isClient()) return null;
    try { if (token) localStorage.setItem(KEY_TOKEN, token); } catch {}
  },
  getRefreshToken() {
    if(!isClient()) return null;
    try { return localStorage.getItem(KEY_REFRESH); } catch { return null; }
  },
  setRefreshToken(token) {
    if(!isClient()) return null;
    try { if (token) localStorage.setItem(KEY_REFRESH, token); } catch {}
  },
  getCred() {
    if(!isClient()) return null;
    try { return safeParse(localStorage.getItem(KEY_CRED)) || {}; } catch { return {}; }
  },
  setCred(obj) {
    if(!isClient()) return null;
    try { localStorage.setItem(KEY_CRED, JSON.stringify(obj || {})); } catch {}
  },
  clearAllAuth() {
    if(!isClient()) return null;
    try {
      localStorage.removeItem(KEY_TOKEN);
      localStorage.removeItem(KEY_REFRESH);
      localStorage.removeItem(KEY_CRED);
    } catch {}
  }
};
 
export default localStore;