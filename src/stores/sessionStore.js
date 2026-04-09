// src/utils/sessionStorage.js

const SESSION_KEYS = {
  NAVER_JOIN: "naverJoin",
  NAVER_ID: "naverId"
};

export default {

  // 🔥 네이버 회원가입 여부 저장
  setNaverJoin() {
    sessionStorage.setItem(SESSION_KEYS.NAVER_JOIN, "Y");
  },

  // 🔥 네이버 회원가입 여부 조회
  getNaverJoin() {
    return sessionStorage.getItem(SESSION_KEYS.NAVER_JOIN);
  },

  // 🔥 네이버 회원가입 여부 삭제
  removeNaverJoin() {
    sessionStorage.removeItem(SESSION_KEYS.NAVER_JOIN);
  },

  // 🔥 네이버 ID 저장
  setNaverId(naverId) {
    sessionStorage.setItem(SESSION_KEYS.NAVER_ID, naverId);
  },

  // 🔥 네이버 ID 조회
  getNaverId() {
    return sessionStorage.getItem(SESSION_KEYS.NAVER_ID);
  },

  // 🔥 네이버 ID 삭제
  removeNaverId() {
    sessionStorage.removeItem(SESSION_KEYS.NAVER_ID);
  },

  // 🔥 전체 삭제 (디버깅용)
  clearAll() {
    sessionStorage.clear();
  }

};