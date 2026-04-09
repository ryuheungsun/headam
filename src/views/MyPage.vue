<template>
    <div class="container mt-5">
        <h3 class="mb-4 text-center">회원정보 수정</h3>

        <div class="card p-4">

            <!-- 아이디 -->
            <div class="mb-3">
                <label>아이디</label>
                <input type="text" v-model="user.userId" disabled class="form-control">
            </div>

            <!-- 이름 -->
            <div class="mb-3">
                <label>이름</label>
                <input type="text" v-model="user.userName" class="form-control" placeholder="아이디">
            </div>

            <!-- 비밀번호 -->
            <div class="mb-3">
                <label>비밀번호</label>
                <div class="password-row">
                    <input type="password" v-model="user.password" class="form-control" placeholder="비밀번호" disabled>
                    <button class="pw-btn" @click.prevent="showPasswordModal = true">비밀번호 변경</button>
                </div>
            </div>

            <!-- 이메일 -->
            <div class="mb-3">
                <label>이메일</label>
                <input type="email" v-model="user.email" class="form-control" placeholder="이메일">
            </div>

            <!-- 휴대폰 -->
            <div class="mb-3">
                <label>휴대폰</label>
                <input type="text" v-model="user.hp" class="form-control" placeholder="휴대폰">
            </div>

            <!-- 주소 -->
            <div class="mb-3">
                <label>주소</label>
                <div class="address-top">
                    <input v-model="user.zipCode" class="zipCode" placeholder="우편번호" readonly />
                    <button class="addr-btn" @click="searchAddress">주소찾기</button>
                </div>
                <input v-model="user.address" class="form-control mt-2" placeholder="기본주소" readonly />
                <input v-model="user.address2" class="form-control mt-2" placeholder="상세주소" />
            </div>

            <!-- 카드 -->
            <div class="mb-3">
                <label>카드번호</label>
                <input type="text" v-model="user.cardNum" class="form-control" placeholder="1234-5678-9123-4567">
            </div>
            <div class="mb-3">
                <label>유효기간</label>
                <input type="text" v-model="user.cardExp" class="form-control" placeholder="MM/YY">
            </div>

            <!-- 소셜 -->
            <div class="mb-4">
                <label class="text-center d-block">소셜 계정 연동</label>
                <div class="social-box">
                    <button class="btn btn-warning" @click="connectKakao">카카오 연결</button>
                    <button class="btn btn-success" @click="connectNaver">네이버 연결</button>
                </div>
                <div class="mt-2 text-muted text-center">
                    카카오: {{ user.kakaoId ? "연결됨" : "미연결" }} /
                    네이버: {{ user.naverId ? "연결됨" : "미연결" }}
                </div>
            </div>

            <!-- 버튼 -->
            <div class="text-center mt-4">
                <button class="btn btn-primary me-2" @click="updateUser">수정</button>
                <button class="btn btn-secondary" @click="$router.back()">취소</button>
            </div>

        </div>

        <!-- 비밀번호 변경 모달 -->
        <div v-if="showPasswordModal" class="modal-backdrop" @click.self="showPasswordModal = false">
            <div class="modal-content">
                <h4>비밀번호 변경</h4>
                <input type="password" v-model="password" placeholder="새 비밀번호" class="form-control mb-2" />
                <input type="password" v-model="passwordConfirm" placeholder="비밀번호 확인" class="form-control mb-3" />
                <div class="text-end">
                    <button class="btn btn-secondary me-2" @click="showPasswordModal = false">취소</button>
                    <button class="btn btn-primary" @click="changePassword">변경</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from "axios"
import { useUserStore } from "@/stores/userStore"
import Swal from "sweetalert2";

const server = process.env.VUE_APP_SERVER

export default {
    data() {
        return {
            user: {
                userId: "",
                userName: "",
                password: "",
                passwordConfirm: "",
                email: "",
                hp: "",
                address: "",
                address2: "",
                zipCode: "",
                role: "user",
                kakaoId: "",
                naverId: "",
                cardNum: "",
                cardExp: ""
            },
            showPasswordModal: false,
            password: "",
            passwordConfirm: ""
        }
    },

    mounted() {
        this.getUser()
        window.addEventListener("message", this.handleNaverLogin);
    },

    methods: {

        async getUser() {
            const userStore = useUserStore()
            const res = await axios.post(`${server}/api/cart/getUser.do`, { userId: userStore.userId })
            this.user = res.data
        },

        searchAddress() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    this.user.zipCode = data.zonecode
                    this.user.address = data.address
                    this.$nextTick(() => {
                        const input = document.querySelector("input[placeholder='상세주소']")
                        if (input) input.focus()
                    })
                }
            }).open()
        },

        connectKakao() {
            const userStore = useUserStore()
            window.Kakao.Auth.login({
                scope: "account_email",
                success: () => {
                    window.Kakao.API.request({
                        url: "/v2/user/me",
                        success: async (res) => {
                            const kakaoId = res.id
                            await axios.post(`${server}/api/connectKakao.do`, { userId: userStore.userId, kakaoId })
                            this.user.kakaoId = kakaoId
                            Swal.fire({ text: "카카오 연동 완료", icon: "info", confirmButtonText: "확인", width: 300, heightAuto: false });
                        }
                    })
                }
            })
        },

        connectNaver() {
            const clientId = "uw_UOITT4pvej9YL5L5M";
            const redirectUri = "http://localhost:8080/naverCallBack";
            const state = "JOIN_" + Math.random().toString(36).substring(2);
            const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
            window.open(url, "naverJoin", "width=500,height=600");
        },

        handleNaverLogin(event) {
            if (event.data.type === "NAVER") {
                this.user.naverId = event.data.naverId
                Swal.fire({ text: "네이버 연동 완료", icon: "info", confirmButtonText: "확인", width: 300, heightAuto: false });
            }
        },

        async updateUser() {
            try {
                const res = await axios.post(`${server}/api/updateUser.do`, this.user)
                if (res.data === "success") {
                    Swal.fire("완료", "수정 완료", "success")
                    this.$router.push("/mypage")
                } else {
                    Swal.fire("오류", "수정 실패", "error")
                }
            } catch (e) {
                console.error(e)
                Swal.fire("오류", "서버 오류", "error")
            }
        },

        async changePassword() {
            if (!this.password || !this.passwordConfirm) {
                Swal.fire({
                    title: "경고",
                    text: "비밀번호를 입력해주세요.",
                    icon: "warning",
                    confirmButtonText: "확인"
                });
                return;
            }
            if (this.password !== this.passwordConfirm) {
                Swal.fire({
                    title: "경고",
                    text: "비밀번호가 일치하지 않습니다.",
                    icon: "warning",
                    confirmButtonText: "확인"
                });
                return;
            }

            try {
                await axios.post(`${server}/api/changePassword.do`, {
                    userId: this.user.userId,
                    password: this.password
                });
                Swal.fire("완료", "비밀번호가 변경되었습니다.", "success");
                this.showPasswordModal = false;
                this.password = "";
                this.passwordConfirm = "";
            } catch (e) {
                console.error(e);
                Swal.fire({
                    title: "오류",
                    text: "비밀번호 변경 실패",
                    icon: "error",
                    confirmButtonText: "확인"
                });;
            }
        }

    }
}
</script>

<style scoped>
.card {
    max-width: 500px;
    margin: auto;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

.address-top {
    display: flex;
    gap: 10px;
}

.zipCode {
    width: 140px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.addr-btn {
    padding: 10px 15px;
    border: 1px solid #ccc;
    background: #f8f9fa;
    border-radius: 6px;
    cursor: pointer;
}

.addr-btn:hover {
    background: #e9ecef;
}

.social-box {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.password-row {
    display: flex;
    gap: 10px;
}

.form-control {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.pw-btn {
    padding: 6px 12px;
    font-size: 13px;
    background: #2300d6;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
}

.pw-btn:hover {
    background: #1a00a8;
}

/* 비밀번호 변경 모달 */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    width: 320px;
    border-radius: 8px;
}

@media (max-width:768px) {
    .zipCode {
        flex: 1;
    }

    .addr-btn {
        width: 110px;
    }

    .card {
        margin: 10px;
    }
}
</style>