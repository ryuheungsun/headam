<template>
  <div class="container mt-3">

    <!-- 제목 -->
    <div class="mb-3 border-bottom pb-2">
      <h3 class="fw-bold text-white bg-primary p-2 rounded">주문 내역</h3>
    </div>

    <!-- 검색 영역 -->
    <div class="row mb-3 g-2 align-items-end search-area">
      <div class="col-auto">
        <input type="text" v-model="searchOrderNo" class="form-control" placeholder="주문번호 검색">
      </div>
      <div class="col-auto" style="width: 120px;">
        <input type="text" v-model="searchOrderName" class="form-control" placeholder="주문자명">
      </div>
      <div class="col-auto">
        <select v-model="searchPayStatus" class="form-select">
          <option value="">결제여부</option>
          <option value="Y">Y</option>
          <option value="N">N</option>
        </select>
      </div>
      <div class="col-auto">
        <input type="date" v-model="searchStartDate" class="form-control">
      </div>
      <div class="col-auto d-flex align-items-center"> ~ </div>
      <div class="col-auto">
        <input type="date" v-model="searchEndDate" class="form-control">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="getOrderList">검색</button>
      </div>
    </div>

    <!-- 주문 없을 때 -->
    <div v-if="filteredOrders.length === 0" class="text-center py-5 text-muted">
      주문 내역이 없습니다.
    </div>

    <!-- 주문 테이블 -->
    <div v-else class="table-container">
      <table class="table table-hover align-middle" style="min-width: 2700px; table-layout: fixed;">
        <colgroup>
          <col style="width: 50px;"> <!-- 체크 -->
          <col style="width: 150px;"> <!-- 주문번호 -->
          <col style="width: 150px;"> <!-- 주문일 -->
          <col style="width: 150px;"> <!-- 주문자명 -->
          <col style="width: 140px;"> <!-- 전화 -->
          <col style="width: 200px;"> <!-- 이메일 -->
          <col style="width: 100px;"> <!-- 수령인 -->
          <col style="width: 160px;"> <!-- 수령인 전화 -->
          <col style="width: 110px;"> <!-- 우편번호 -->
          <col style="width: 220px;"> <!-- 주소 -->
          <col style="width: 160px;"> <!-- 상세주소 -->
          <col style="width: 180px;"> <!-- 카드 -->
          <col style="width: 100px;"> <!-- 결제수단 -->
          <col style="width: 150px;"> <!-- 제품 정보 -->
          <col style="width: 120px;"> <!-- 금액 -->
          <col style="width: 100px;"> <!-- 결제여부 -->
          <col style="width: 80px;"> <!-- 삭제 -->
        </colgroup>

        <thead class="table-primary">
          <tr>
            <th><input type="checkbox" v-model="selectAll"></th>
            <th>주문번호</th>
            <th>주문일</th>
            <th>주문자명</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>수령인</th>
            <th>수령인 전화</th>
            <th>우편번호</th>
            <th>주소</th>
            <th>상세주소</th>
            <th>카드번호</th>
            <th>결제수단</th>
            <th>제품 정보</th>
            <th>결제금액</th>
            <th>결제여부</th>
            <th>삭제</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" :class="order.pay === 'Y' ? 'paid' : 'unpaid'">
            <td><input type="checkbox" v-model="selectedOrders" :value="order.orderNo"></td>
            <td>{{ order.orderNo }}</td>
            <td>{{ order.orderDate }}</td>
            <td>{{ order.orderName }}</td>
            <td>{{ order.orderPhone }}</td>
            <td>{{ order.orderEmail }}</td>
            <td>{{ order.receiver }}</td>
            <td>{{ order.receiverPhone }}</td>
            <td>{{ order.zipCode }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.address2 }}</td>
            <td>{{ order.cardNum }}</td>
            <td><span class="badge bg-success">{{ order.payType }}</span></td>
            <td>
              <div v-for="(item, idx) in order.orderItem" :key="idx" class="product-box">
                <div>{{ item.productName }}</div>
                <div class="text-muted small">{{ item.optionName }}</div>
                <div class="qty">{{ item.quantity }}개</div>
                <hr v-if="idx !== order.orderItem.length - 1">
              </div>
            </td>
            <td class="text-danger fw-bold">{{ formatPrice(order.price) }}원</td>
            <td>
              <select v-model="order.pay" class="form-select form-select-sm">
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </td>
            <td>
              <button class="btn btn-sm btn-danger" @click="deleteOrder(order.orderNo)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 하단 버튼 -->
    <div class="mt-3 mb-5">
      <button class="btn btn-secondary me-2" @click="printSelected">선택 프린트</button>
      <button class="btn btn-info" @click="printInvoice">송장 출력</button>
    </div>

  </div>
</template>

<script>
import axios from "axios"
const server = process.env.VUE_APP_SERVER

export default {
  data() {
    const today = new Date().toISOString().split("T")[0]
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0]

    return {
      orders: [],
      searchOrderNo: "",
      searchOrderName: "",
      searchPayStatus: "",
      searchStartDate: sevenDaysAgo,
      searchEndDate: today,
      selectedOrders: []
    }
  },

  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchNo = this.searchOrderNo ? order.orderNo.includes(this.searchOrderNo) : true
        const matchName = this.searchOrderName ? order.orderName.includes(this.searchOrderName) : true
        const matchPay = this.searchPayStatus ? order.pay === this.searchPayStatus : true
        return matchNo && matchName && matchPay
      })
    },

    selectAll: {
      get() {
        return this.filteredOrders.length > 0 &&
          this.selectedOrders.length === this.filteredOrders.length
      },
      set(value) {
        this.selectedOrders = value
          ? this.filteredOrders.map(o => o.orderNo)
          : []
      }
    }
  },

  mounted() {
    this.getOrderList()
  },

  methods: {
    formatYMD(date) {
      const d = new Date(date)
      return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    },

    async getOrderList() {
      const res = await axios.post(`${server}/api/orderList.do`, {
        startDate: this.formatYMD(this.searchStartDate),
        endDate: this.formatYMD(this.searchEndDate)
      })
      // pay 값 정규화
      this.orders = res.data.map(o => ({ ...o, pay: String(o.pay).trim().toUpperCase() }))
    },

    formatPrice(price) {
      return Number(price).toLocaleString()
    },

    deleteOrder(orderNo) {
      if (!confirm("삭제하시겠습니까?")) return
      axios.post(`${server}/api/deletetOrder.do`, {
        orderNo: orderNo
      })
        .then(res => {
          console.log(res)

          if (res.data === "success") {
            alert("삭제 되었습니다.")
            this.getOrderList()
          } else {
            alert("저장 실패")
          }
        })
        .catch(err => {
          console.error(err)
          alert("서버 오류")
        })
    },

    printSelected() {
      if (!this.selectedOrders.length) return alert("선택 없음");

      const selectedData = this.orders.filter(o =>
        this.selectedOrders.includes(o.orderNo)
      );

      const printWindow = window.open('', '', 'width=900,height=700');

      printWindow.document.write(`
    <html>
    <head>
      <title>프린트 미리보기</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h3 { margin-bottom: 20px; }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #000;
          padding: 6px;
          font-size: 12px;
        }

        th {
          background: #f0f0f0;
        }

        /* 버튼 영역 */
        .btn-area {
          margin-bottom: 15px;
        }

        button {
          padding: 8px 15px;
          background: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        button:hover {
          background: #0056b3;
        }

        /*  프린트할 때 버튼 숨김 */
        @media print {
          .btn-area {
            display: none;
          }
        }
      </style>
    </head>
    <body>

      <!-- 버튼은 화면에서만 보임 -->
      <div class="btn-area">
        <button onclick="window.print()">프린트</button>
      </div>

      <h3>선택 주문 내역</h3>

      <table>
        <thead>
          <tr>
            <th>주문번호</th>
            <th>주문자</th>
            <th>제품</th>
            <th>수량</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
  `);

      selectedData.forEach(order => {
        order.orderItem.forEach(item => {
          printWindow.document.write(`
        <tr>
          <td>${order.orderNo}</td>
          <td>${order.orderName}</td>
          <td>${item.productName} (${item.optionName || ''})</td>
          <td>${item.quantity}</td>
          <td>${Number(order.price).toLocaleString()}원</td>
        </tr>
      `);
        });
      });

      printWindow.document.write(`
        </tbody>
      </table>

    </body>
    </html>
  `);

      printWindow.document.close();
    },

    printInvoice() {
      if (!this.selectedOrders.length) return alert("선택 없음");

      const selectedData = this.orders.filter(o =>
        this.selectedOrders.includes(o.orderNo)
      );

      const win = window.open('', '', 'width=400,height=600');

      win.document.write(`
  <html>
  <head>
    <title>우체국 송장</title>

    <style>
      @page {
        size: 100mm 150mm;
        margin: 0;
      }

      body {
        margin: 0;
        font-family: Arial;
      }

      .label {
        width: 100mm;
        height: 150mm;
        padding: 5mm;
        box-sizing: border-box;
        page-break-after: always;
      }

      .section {
        border: 1px solid #000;
        margin-bottom: 4px;
      }

      .row {
        display: flex;
        border-bottom: 1px solid #000;
      }

      .row:last-child {
        border-bottom: none;
      }

      .title {
        width: 30%;
        background: #eee;
        font-weight: bold;
        font-size: 11px;
        padding: 3px;
        border-right: 1px solid #000;
      }

      .content {
        width: 70%;
        font-size: 11px;
        padding: 3px;
        word-break: break-all;
      }

      .big {
        font-size: 14px;
        font-weight: bold;
      }

      .barcode {
        text-align: center;
        font-size: 18px;
        letter-spacing: 2px;
        padding: 5px 0;
      }

      .product {
        font-size: 10px;
        line-height: 1.2;
      }

      /* 버튼 (화면용) */
      .btn-area {
        text-align: center;
        margin: 10px;
      }

      button {
        padding: 8px 15px;
        background: black;
        color: white;
        border: none;
      }

      @media print {
        .btn-area {
          display: none;
        }
      }
    </style>
  </head>

  <body>

    <div class="btn-area">
      <button onclick="window.print()">프린트</button>
    </div>
  `);

      selectedData.forEach(order => {
        win.document.write(`

      <div class="label">

        <!-- 보내는 사람 -->
        <div class="section">
          <div class="row">
            <div class="title">보내는분</div>
            <div class="content">쇼핑몰</div>
          </div>
          <div class="row">
            <div class="title">연락처</div>
            <div class="content">010-0000-0000</div>
          </div>
        </div>

        <!-- 받는 사람 -->
        <div class="section">
          <div class="row">
            <div class="title">받는분</div>
            <div class="content big">${order.receiver}</div>
          </div>
          <div class="row">
            <div class="title">연락처</div>
            <div class="content">${order.receiverPhone}</div>
          </div>
          <div class="row">
            <div class="title">주소</div>
            <div class="content">
              (${order.zipCode}) ${order.address} ${order.address2}
            </div>
          </div>
        </div>

        <!-- 상품 -->
        <div class="section">
          <div class="row">
            <div class="title">상품</div>
            <div class="content product">
              ${order.orderItem.map(i =>
          `${i.productName} (${i.quantity})`
        ).join("<br>")}
            </div>
          </div>
        </div>

        <!-- 요청사항 -->
        <div class="section">
          <div class="row">
            <div class="title">요청</div>
            <div class="content">문 앞에 놓아주세요</div>
          </div>
        </div>

        <!-- 바코드 영역 -->
        <div class="section">
          <div class="barcode">${order.orderNo}</div>
        </div>

      </div>

    `);
      });

      win.document.write(`
  </body>
  </html>
  `);

      win.document.close();
    }
  }
}
</script>

<style scoped>
/* 테이블 색상 */
.table .paid>td {
  background-color: #e6f9e6;
}

.table .unpaid>td {
  background-color: #ffe6e6;
}

.table-hover tbody tr.paid:hover>td {
  background-color: #d4f5d4;
}

.table-hover tbody tr.unpaid:hover>td {
  background-color: #ffd6d6;
}

/* 테이블 높이 50% + 가로스크롤 */
.table-container {
  height: 65vh;
  /* 화면 높이 50% */
  overflow-x: auto;
  /* 가로 스크롤 */
  overflow-y: auto;
  /* 세로 스크롤 */
  border: 1px solid #ddd;
  background: #fff;
}

/* 제품 정보 줄바꿈 */
.product-box {
  word-break: break-word;
  white-space: normal;
}

/* 주소 컬럼 줄바꿈 */
td:nth-child(10),
td:nth-child(11) {
  word-break: break-word;
}

.qty {
  color: red;
  font-weight: bold;
}
</style>