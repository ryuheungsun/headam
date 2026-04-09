<template>
  <div class="location-container">

    <h1 class="title">오시는 길</h1>

    <!-- 회사 정보 -->
    <div class="company">
      <h2>해담</h2>
      <p>충남 천안시 서북구 부성6길 11</p>
    </div>

    <!-- 지도 -->
    <div id="map"></div>

    <!-- 길찾기 버튼 -->
    <div class="route-btn">
      <a
        href="https://map.naver.com/v5/search/충남%20천안시%20서북구%20부성6길%2011"
        target="_blank"
      >
        네이버 길찾기
      </a>

      <a
        href="https://map.kakao.com/link/search/충남 천안시 서북구 부성6길 11"
        target="_blank"
      >
        카카오 지도
      </a>
    </div>

    <!-- 안내 정보 -->
    <div class="info">

      <div class="item">
        <h3>📍 주소</h3>
        <p>충남 천안시 서북구 부성6길 11</p>
      </div>

      <div class="item">
        <h3>🚗 자동차</h3>
        <p>두정동 한성필하우스 아파트 인근</p>
      </div>

      <div class="item">
        <h3>🚌 버스</h3>
        <p>부성2동 주민센터 정류장 이용</p>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  mounted() {

    const script = document.createElement("script")

    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=a12b139def86863fcd7d3ead4b3a5a44&autoload=false&libraries=services"

    document.head.appendChild(script)

    script.onload = () => {

      window.kakao.maps.load(() => {

        const container = document.getElementById("map")

        const map = new kakao.maps.Map(container, {
          center: new kakao.maps.LatLng(36.815, 127.113),
          level: 3
        })

        const geocoder = new kakao.maps.services.Geocoder()

        // 주소 검색
        geocoder.addressSearch("충남 천안시 서북구 부성6길 11", (result, status) => {

          if (status === kakao.maps.services.Status.OK) {

            const coords = new kakao.maps.LatLng(result[0].y, result[0].x)

            const marker = new kakao.maps.Marker({
              map: map,
              position: coords
            })

            map.setCenter(coords)

          }

        })

      })

    }

  }
}
</script>

<style scoped>

.location-container{
  max-width:1000px;
  margin:auto;
  padding:40px 20px;
}

.title{
  font-size:32px;
  font-weight:bold;
  margin-bottom:30px;
}

.company{
  margin-bottom:20px;
}

#map{
  width:100%;
  height:420px;
  border-radius:10px;
  margin-bottom:25px;
  box-shadow:0 5px 15px rgba(0,0,0,0.1);
}

.route-btn{
  display:flex;
  gap:10px;
  margin-bottom:30px;
}

.route-btn a{
  flex:1;
  text-align:center;
  padding:12px;
  background:#03c75a;
  color:white;
  text-decoration:none;
  border-radius:6px;
  font-weight:bold;
}

.info{
  display:flex;
  gap:20px;
  flex-wrap:wrap;
}

.item{
  flex:1;
  min-width:200px;
  padding:20px;
  background:#f7f7f7;
  border-radius:10px;
}

.item h3{
  margin-bottom:10px;
}

</style>