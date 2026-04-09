<template>
    <div class="container mt-5">
        <h3 class="fw-bold mb-4">회원가입</h3>

        <form @submit.prevent="registerUser">
            <table class="table table-bordered align-middle">
                <tbody>

                    <!-- 아이디 -->
                    <tr>
                        <th class="th-required">
                            아이디 <span class="required">*</span>
                        </th>
                        <td>
                            <div class="d-flex gap-2">
                                <input type="text" v-model="user.userId" class="form-control" placeholder="ID">
                                <button type="button" class="btn btn-primary btn-fit" @click="checkId">중복검사</button>
                            </div>
                        </td>
                    </tr>

                    <!-- 이름 -->
                    <tr>
                        <th class="th-required">
                            이름 <span class="required">*</span>
                        </th>
                        <td>
                            <input type="text" v-model="user.userName" class="form-control" placeholder="이름"
                                autocomplete="off">
                        </td>
                    </tr>

                    <!-- 비밀번호 -->
                    <tr>
                        <th class="th-required">
                            비밀번호 <span class="required">*</span>
                        </th>
                        <td class="d-flex gap-2">
                            <input type="password" v-model="user.password" class="form-control" placeholder="비밀번호"
                                autocomplete="off">
                            <input type="password" v-model="user.passwordConfirm" class="form-control"
                                placeholder="비밀번호 확인">
                        </td>
                    </tr>

                    <!-- 이메일 -->
                    <tr>
                        <th class="th-required">
                            이메일 <span class="required">*</span>
                        </th>
                        <td>
                            <input type="email" v-model="user.email" class="form-control" placeholder="E-Mail">
                        </td>
                    </tr>

                    <!-- 전화번호 -->
                    <tr>
                        <th class="th-required">
                            전화번호 <span class="required">*</span>
                        </th>
                        <td>
                            <input type="text" v-model="user.hp" class="form-control" placeholder="010-1234-5678">
                        </td>
                    </tr>

                    <!-- 주소 -->
                    <tr>
                        <th class="th-required">
                            주소 <span class="required">*</span>
                        </th>
                        <td>
                            <div class="d-flex gap-2">
                                <input type="text" v-model="user.address" class="form-control" placeholder="주소 찾기 이용"
                                    readonly>
                                <button type="button" class="btn btn-secondary btn-fit"
                                    @click="findAddress">주소찾기</button>
                            </div>
                        </td>
                    </tr>

                    <!-- 상세주소 -->
                    <tr>
                        <th class="th-required">
                            상세주소<br />
                            우편번호
                            <span class="required">*</span>
                        </th>
                        <td class="d-flex gap-2">
                            <input type="text" v-model="user.address2" placeholder="상세주소" class="form-control">
                            <input type="text" v-model="user.zipCode" placeholder="우편번호" class="form-control zip-code">
                        </td>
                    </tr>

                    <!-- 카드 -->
                    <tr>
                        <th>카드 정보</th>
                        <td class="d-flex gap-2">
                            <input type="text" v-model="user.cardNum" class="form-control"
                                placeholder="6048-0812-3456-7894" @input="formatCardNum">
                            <input type="text" v-model="user.cardExp" class="form-control exp" placeholder="MM/YY"
                                @input="formatCardExp">
                        </td>
                    </tr>

                    <!-- SNS -->
                    <tr>
                        <th>Kakao / Naver</th>
                        <td>
                            <div class="sns-wrap">
                                <input type="text" v-model="user.kakaoId" class="form-control">
                                <button type="button" class="btn btn-warning sns-btn"
                                    @click="connectKakao">Kakao</button>

                                <input type="text" v-model="user.naverId" class="form-control">
                                <button type="button" class="btn btn-success sns-btn"
                                    @click="connectNaver">Naver</button>
                            </div>
                        </td>
                    </tr>

                </tbody>
            </table>

            <!-- 버튼 -->
            <div class="text-center mt-3">
                <button type="submit" class="btn btn-primary btn-register">
                    회원가입
                </button>
            </div>

        </form>
    </div>
</template>

<script>
import axios from "axios"
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
                kakaoId: "",
                naverId: "",
                cardNum: "",
                cardExp: ""
            }
        }
    },
    mounted() {
        //  네이버 결과 받기
        window.addEventListener("message", this.handleNaverLogin);
    },

    methods: {

        async registerUser() {
            if (!this.user.userId || !this.user.userName || !this.user.password || !this.user.email || !this.user.hp || !this.user.address || !this.user.address2) {
                Swal.fire({
                    // title: "상품선택",
                    text: "필수 항목을 입력해주세요.",
                    icon: "info",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                    heightAuto: false // 높이 자동 확대 방지
                });
                return;
            }

            if (this.user.checkId !== 'Y') {
                Swal.fire({
                    // title: "상품선택",
                    text: "ID 중복체크를 실행해 주세요",
                    icon: "info",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                return;

            }
            if (this.user.password !== this.user.passwordConfirm) {
                Swal.fire({
                    // title: "상품선택",
                    text: "비밀번호가 일치하지 않습니다.",
                    icon: "info",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                return;
            }

            const res = await axios.post(`${server}/api/registerUser.do`, this.user);
            if (res.data === "success") {
                Swal.fire({
                    // title: "상품선택",
                    text: "회원가입 완료",
                    icon: "success",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                this.$router.push("/login");
            } else {
                Swal.fire({
                    // title: "상품선택",
                    text: "회원가입 실패",
                    icon: "error",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                return;
            }
        },

        async checkId() {
            const res = await axios.post(`${server}/api/idCheck.do`, this.user);

            if (String(res.data).trim() === "true") {
                Swal.fire({
                    // title: "상품선택",
                    text: "사용가능한 ID입니다.",
                    icon: "success",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                this.user.checkId = 'Y'
            } else {
                Swal.fire({
                    // title: "상품선택",
                    text: "사용 불가능한 ID입니다.",
                    icon: "error",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                });
                this.user.checkId = 'N'
            }
        },

        findAddress() {
            new daum.Postcode({
                oncomplete: (data) => {
                    this.user.address = data.address;
                    this.user.zipCode = data.zonecode;
                }
            }).open();
        },

        connectKakao() {
            window.Kakao.Auth.login({
                success: () => {
                    window.Kakao.API.request({
                        url: '/v2/user/me',
                        success: (res) => {
                            this.user.kakaoId = res.id;
                            Swal.fire({
                                // title: "상품선택",
                                text: "카카오 연동 완료",
                                icon: "info",
                                confirmButtonText: "확인",
                                width: 300,       // 가로 크기 조절
                                heightAuto: false // 높이 자동 확대 방지
                            });
                        }
                    });
                }
            });
        },

        connectNaver() {
            const clientId = "uw_UOITT4pvej9YL5L5M";
            const redirectUri = "http://localhost:8080/naverCallBack";
            const state = "JOIN_" + Math.random().toString(36).substring(2);

            const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

            window.open(url, "naverJoin", "width=500,height=600");
        },
        // 네이버 결과 처리
        handleNaverLogin(event) {
            if (event.data.type === "NAVER") {
                this.user.naverId = event.data.naverId
                Swal.fire({
                    // title: "상품선택",
                    text: "네이버 연동 완료",
                    icon: "info",
                    confirmButtonText: "확인",
                    width: 300,       // 가로 크기 조절
                    heightAuto: false // 높이 자동 확대 방지
                });
            }
        },

        formatCardNum() {
            let value = this.user.cardNum.replace(/\D/g, "").substring(0, 16);
            this.user.cardNum = value.replace(/(\d{4})(?=\d)/g, "$1-");
        },

        formatCardExp() {
            let value = this.user.cardExp.replace(/\D/g, "").substring(0, 4);
            if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
            }
            this.user.cardExp = value;
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 900px;
}

/* 별표 오른쪽 정렬 */
.th-required {
    position: relative;
    padding-right: 20px;
}

.th-required .required {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: red;
    font-weight: bold;
}

.btn-fit {
    height: 38px;
    min-width: 120px;
}

.btn-register {
    width: 200px;
    height: 45px;
    border-radius: 25px;
}

.zip-code {
    width: 20%;
}

.exp {
    max-width: 120px;
}

/* ✅ SNS 가운데 정렬 + 버튼 작게 */
.sns-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.sns-btn {
    font-size: 14px;
    padding: 4px 30px;
    height: 32px;
    min-width: 70px;
}

.btn-success {
    margin: 0 30%;
}

@media (max-width: 768px) {
    .btn-fit {
        width: auto;
        padding: 2px 2px;
        font-size: 10px;
        min-width: 50px;
        border-radius: 10px;
    }

    .btn-warning,
    .btn-success {
        font-size: 15px;
        margin: 0 50px;
    }
}
</style>