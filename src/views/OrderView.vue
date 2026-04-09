<template>
    <div class="order-page">

        <h2 class="title">주문 / 결제</h2>

        <!-- 주문상품 -->
        <section class="box">

            <h3>주문상품</h3>

            <table class="order-table">

                <thead>
                    <tr>
                        <th>상품정보</th>
                        <th>판매가</th>
                        <th>수량</th>
                        <th>합계</th>
                    </tr>
                </thead>

                <tbody>

                    <tr v-for="item in cartList" :key="item.productCode">

                        <td class="product-info">

                            <img :src="item.image">

                            <div class="name">
                                <span style="font-size:1.2em; font-weight:bold;">{{ item.productName }}</span><br />
                                {{ item.optionName }}
                            </div>

                        </td>

                        <td>{{ format(item.price) }}원<br />{{ item.optionPrice }}</td>
                        <td>{{ item.quantity }}</td>
                        <td> {{ format(Number(item.price) * Number(item.quantity)) }}원
                            <br />
                            <span style="font-size:1.2em; font-weight:bold;">{{ format((Number(item.price) +
                                Number(item.optionPrice)) * Number(item.quantity))
                                }}원</span>
                        </td>

                    </tr>

                </tbody>

            </table>

        </section>


        <!-- 주문자 정보 -->
        <section class="box">

            <h3>주문자 정보</h3>

            <input v-model="user.userName" placeholder="이름">
            <input v-model="user.hp" placeholder="휴대폰번호" @input="e => user.hp = formatPhone(e.target.value)">
            <input v-model="user.email" placeholder="이메일">

        </section>


        <!-- 배송정보 -->
        <section class="box">

            <h3>배송정보</h3>

            <input v-model="order.receiver" placeholder="받는분">
            <input v-model="order.phone2" placeholder="연락처" @input="e => order.phone2 = formatPhone(e.target.value)">

            <div class=" address-row">

                <input v-model="order.zipCode" placeholder="우편번호" class="zipCode" readonly />

                <input v-model="order.address" placeholder="기본주소" class="addr" readonly />

                <button class="addr-btn" @click="searchAddress">
                    주소검색
                </button>

            </div>

            <input v-model="order.address2" placeholder="상세주소" />

        </section>


        <!-- 결제수단 -->
        <section class="box">

            <h3>결제수단</h3>

            <label><input type="radio" value="card" v-model="order.payType"> 신용카드</label>
            <label><input type="radio" value="bank" v-model="order.payType"> 무통장입금</label>
            <label><input type="radio" value="account" v-model="order.payType"> 계좌이체</label>

        </section>
        <div class="pay-info">

            <div>
                결제방법 : {{
                    order.payType === 'card' ? '신용카드' :
                        order.payType === 'bank' ? '무통장입금' :
                            order.payType === 'account' ? '계좌이체' :
                                order.payType
                }}
            </div>
            <!-- 카드 결제 -->
            <div v-if="order.payType === 'card'" class="card-box">

                <div class="mb-2">
                    카드번호
                    <input type="text" placeholder="1234-5678-9012-3456" class="form-control" v-model="user.cardNum"
                        maxlength="19" inputmode="numeric" @input="formatCardNum">
                </div>

                <div class="mb-2">
                    유효기간
                    <input type="text" placeholder="MM/YY" class="form-control" v-model="user.cardExp" maxlength="5"
                        inputmode="numeric" @input="formatCardExp">
                </div>

                <div class="mb-2">
                    CVC
                    <input type="text" placeholder="CVC" class="form-control" v-model="user.cardCvc" maxlength="3"
                        inputmode="numeric" @input="user.cardCvc = user.cardCvc.replace(/[^0-9]/g, '')">
                </div>

            </div>
            <!-- 무통장 -->
            <div v-if="order.payType === 'bank'" class="account-box">
                입금계좌 : <br />국민은행 123-456-789012 (라해심)
            </div>

            <!-- 계좌이체 -->
            <div v-if="order.payType === 'account'" class="account-box">
                계좌이체 계좌 : <br />농협 987-654-321098 (라해심)
            </div>

        </div>


        <!-- 결제금액 -->
        <div class="payment-bottom">

            <div class="payment-box">

                <div class="price-row">
                    <span>상품금액</span>
                    <span>{{ format(totalPrice) }}원</span>
                </div>

                <div class="price-row">
                    <span>배송비</span>
                    <span>{{ format(delivery) }}원</span>
                </div>

                <div class="price-total">
                    총 결제금액
                    <strong>
                        {{ format(totalPrice + delivery) }}원
                    </strong>
                </div>

                <button class="order-btn" @click="orderSubmit">
                    결제하기
                </button>

            </div>

        </div>

    </div>
</template>


<script>

import axios from "axios"
import { useUserStore } from "@/stores/userStore"
const server = process.env.VUE_APP_SERVER
export default {

    data() {

        return {

            cartList: [],

            order: {
                name: "",
                phone: "",
                email: "",
                receiver: "",
                phone2: "",
                zipCode: "",
                address1: "",
                address2: "",
                payType: "card",
                productList: "",
                optionList: "",
                quantityList: "",
                orderer: "",
                price: 0
            },
            user: {
                userName: "",
                email: "",
                hp: "010-",
                address: "",
                address2: "",
                zipCode: "",
                point: "",
                role: "",
                cardNum: "",
                cardExp: "",
                cardCvc: ""
            },

            delivery: 0

        }

    },

    computed: {
        userStore() {
            return useUserStore()
        },
        totalPrice() {
            return this.cartList.reduce((sum, item) => {
                return sum + (Number(item.price) + Number(item.optionPrice)) * item.quantity
            }, 0)
        }

    },

    methods: {
        async getOrderItems(itemList) {

            const res = await axios.post(`${server}/api/cart/orderItemList.do`, {
                userId: this.userStore.userId,
                items: itemList
            })
            this.cartList = res.data

            this.cartList.forEach(item => {
                this.order.productList += item.productCode + "|"
                this.order.optionList += item.optionCode + "|"
                this.order.quantityList += item.quantity + "|"
            })
        },
        async getUser() {
            const res = await axios.post(`${server}/api/cart/getUser.do`, {
                userId: this.userStore.userId
            })

            if (res.data && typeof res.data === 'object') {
                this.user = res.data

                this.order.receiver = this.user.userName
                this.order.phone2 = this.user.hp
                this.order.zipCode = this.user.zipCode
                this.order.address = this.user.address
                this.order.address2 = this.user.address2
            } else {
                console.warn("user 데이터 이상:", res.data)
                // 기본값 유지
            }
        },

        format(num) {
            //return num;//.toLocaleString()
            return Number(num).toLocaleString('ko-KR')
        },

        orderSubmit() {
            /// 주문자 정보
            // // 이름 체크
            if (!this.user.userName || this.user.userName.trim() === "") {
                alert("이름을 입력해주세요.")
                return
            }

            // 휴대폰 체크 (010-1234-5678 또는 01012345678)
            const hpPattern = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/

            if (!hpPattern.test(this.user.hp)) {
                alert("휴대폰 번호를 정확히 입력해주세요.")
                return
            }

            // 이메일 체크
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

            if (!emailPattern.test(this.user.email)) {
                alert("이메일 형식이 올바르지 않습니다.")
                return
            }

            ///배송정보 
            // 받는분
            if (!this.order.receiver || this.order.receiver.trim() === "") {
                alert("받는분을 입력해주세요.")
                return
            }

            // 연락처
            if (!hpPattern.test(this.order.phone2)) {
                alert("연락처를 정확히 입력해주세요.")
                return
            }

            // 우편번호 
            if (!this.order.zipCode) {
                alert("우편번호를 입력해주세요.")
                return
            }

            // 기본주소
            if (!this.order.address) {
                alert("기본주소를 입력해주세요.")
                return
            }

            // 상세주소
            if (!this.order.address2 || this.order.address2.trim() === "") {
                alert("상세주소를 입력해주세요.")
                return
            }

            // 카드 결제일 경우
            if (this.order.payType === "card") {

                // 카드번호 체크 (1234-5678-9012-3456)
                const cardNumPattern = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/

                if (!cardNumPattern.test(this.user.cardNum)) {
                    alert("카드번호를 정확히 입력해주세요.")
                    return
                }

                // 유효기간 체크 (MM/YY)
                const cardExpPattern = /^(0[1-9]|1[0-2])\/[0-9]{2}$/

                if (!cardExpPattern.test(this.user.cardExp)) {
                    alert("유효기간을 MM/YY 형식으로 입력해주세요.")
                    return
                }

                // CVC 체크
                const cvcPattern = /^[0-9]{3}$/

                if (!cvcPattern.test(this.user.cardCvc)) {
                    alert("CVC는 숫자 3자리입니다.")
                    return
                }

            }
            this.order.orderName = this.user.userName
            this.order.orderPhone = this.user.hp
            this.order.orderEmail = this.user.email
            this.order.cardNum = this.user.cardNum
            this.order.pay = 'N'
            this.order.orderer = this.userStore.userId
            this.order.price = this.totalPrice

            //alert("결제 진행" + JSON.stringify(this.order))
            axios.post(`${server}/api/cart/insertOrder.do`, this.order)
                .then(res => {
                    console.log(res)

                    if (res.data === "success") {
                        alert("주문이 완료 되었습니다.")
                        this.$router.push("/orderList")
                    } else {
                        alert("저장 실패")
                    }
                })
                .catch(err => {
                    console.error(err)
                    alert("서버 오류")
                })
        },

        searchAddress() {

            new window.daum.Postcode({

                oncomplete: (data) => {

                    // 우편번호
                    this.order.zipCode = data.zonecode

                    // 기본주소
                    this.order.address = data.address

                    // 상세주소 input 포커스
                    this.$nextTick(() => {
                        const detailInput = document.querySelector(
                            "input[v-model='order.address2']"
                        )
                        if (detailInput) detailInput.focus()
                    })

                }
            }).open()
        },
        formatCardExp(e) {

            let value = e.target.value.replace(/\D/g, '') // 숫자만

            if (value.length > 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4)
            }

            this.user.cardExp = value
        },
        formatCardNum(e) {

            let value = e.target.value.replace(/\D/g, '') // 숫자만

            value = value.substring(0, 16) // 16자리 제한

            let formatted = value.match(/.{1,4}/g)

            this.user.cardNum = formatted ? formatted.join('-') : value
        },
        formatPhone(value) {
            value = value.replace(/\D/g, '')

            // 서울 02
            if (value.startsWith('02')) {

                if (value.length < 3) return value

                // 02-123-4567 (9자리)
                if (value.length === 9) {
                    return value.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
                }

                // 02-1234-5678 (10자리)
                if (value.length === 10) {
                    return value.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
                }

                // 입력 중
                if (value.length > 2 && value.length < 6) {
                    return value.replace(/(\d{2})(\d+)/, '$1-$2')
                }

                if (value.length >= 6) {
                    return value.replace(/(\d{2})(\d{3,4})(\d{0,4})/, (m, p1, p2, p3) => {
                        return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                    })
                }
            }

            // 휴대폰 및 기타 지역번호
            else {

                if (value.length < 4) return value

                // 10자리 → 3-3-4
                if (value.length === 10) {
                    return value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                }

                // 11자리 → 3-4-4
                if (value.length === 11) {
                    return value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                }

                // 입력 중
                if (value.length < 8) {
                    return value.replace(/(\d{3})(\d+)/, '$1-$2')
                }

                return value.replace(/(\d{3})(\d{3,4})(\d{0,4})/, (m, p1, p2, p3) => {
                    return p3 ? `${p1}-${p2}-${p3}` : `${p1}-${p2}`
                })
            }
        }

    },

    mounted() {

        const items = this.$route.query.items
        if (!items) {
            console.log("is not items")
            return
        }
        const itemList = items.split(",").map(Number)
        console.log(itemList)
        this.getOrderItems(itemList)
        this.getUser();

        // this.cartList = [

        //     {
        //         productCode: "1001",
        //         productName: "한과 세트",
        //         price: 25000,
        //         quantity: 2,
        //         image: "https://via.placeholder.com/70"
        //     },

        //     {
        //         productCode: "1002",
        //         productName: "약과 세트",
        //         price: 15000,
        //         quantity: 1,
        //         image: "https://via.placeholder.com/70"
        //     }

        // ]

    }
}
</script>


<style scoped>
/* PC */

.order-page {
    max-width: 900px;
    margin: auto;
    padding: 40px;
}

.title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
}

.box {
    border: 1px solid #eee;
    padding: 25px;
    margin-bottom: 25px;
    border-radius: 10px;
}

/* 주문 테이블 */

.order-table {
    width: 100%;
    border-collapse: collapse;
}

.order-table th {
    background: #f5f5f5;
    padding: 14px;
    font-weight: bold;
    border-top: 2px solid #333;
    border-bottom: 1px solid #ddd;
}

.order-table td {
    padding: 15px;
    border-bottom: 1px solid #eee;
    text-align: center;
}

.product-info {
    display: flex;
    align-items: center;
    gap: 15px;
    text-align: left;
}

.product-info img {
    width: 70px;
    height: 70px;
    border-radius: 8px;
}

.product-info .name {
    font-weight: bold;
}

/* input */

input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

/* 주소 */

.address-row {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.zipCode {
    width: 120px;
}

.addr {
    flex: 1;
}

.addr-btn {
    width: 120px;
    height: 40px;
    /* 버튼 높이 */
    background: #444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    display: flex;
    /* 텍스트 중앙 */
    align-items: center;
    justify-content: center;
}

.addr-btn:hover {
    background: #333;
}

/* 결제 */

.payment-bottom {
    margin-top: 40px;
}

.payment-box {
    border: 2px solid #f1f1f1;
    padding: 30px;
    border-radius: 12px;
    background: #fafafa;
}

.price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.price-total {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: bold;
    color: #d60000;
    margin: 20px 0;
}

.order-btn {
    width: 30%;
    padding: 18px;
    font-size: 20px;
    background: #2300d6;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    display: block;
    margin: 0 auto;
}


/* 📱 모바일 */

@media (max-width:768px) {

    .order-page {
        max-width: 100%;
        margin: 0;
        padding: 0;
    }

    .box {
        border: none;
        border-radius: 0;
        padding: 15px;
        margin-bottom: 10px;
    }

    .order-table th,
    .order-table td {
        font-size: 14px;
        padding: 10px;
    }

    .product-info img {
        width: 50px;
        height: 50px;
    }

    .address-row {
        flex-direction: column;
    }

    .zipCode {
        width: 100%;
    }

    .addr-btn {
        width: 100%;
    }

    .payment-box {
        border: none;
        border-radius: 0;
        padding: 15px;
    }

    .order-btn {
        width: 100%;
    }

}
</style>