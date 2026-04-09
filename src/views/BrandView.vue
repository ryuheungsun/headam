<template>
  <div class="brand-container">

    <!-- 브랜드 타이틀 -->
    <div class="brand-header">
      <h1 class="brand-title">
        해담 <span class="hanja">海</span><span class="hanja">潭</span>
      </h1>
      <p class="brand-sub">한식 정과의 깊은 맛을 담다</p>
    </div>

    <!-- 메인 이미지 -->
    <div class="image-section">
      <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Hangwa.jpg/960px-Hangwa.jpg"
    alt="한식 정과 디저트"
  >
    </div>

    <!-- 소개 -->
    <div class="brand-text">

      <p><strong>해담</strong>은 한식 정과의 자존심입니다.</p>

      <p>
        해담은
        <span class="hanja">海</span>(바다)와 같은 넓은 맛과
        <span class="hanja">潭</span>(샘)과 같은 깊은 맛을 추구합니다.
      </p>

      <p>
        정과는 비교적 수분이 적은 식물의 뿌리나 줄기, 열매를 살짝 데쳐
        꿀 또는 조청에 오랜 시간 조린 것으로,
        쫄깃하고 달착지근한 맛이 특징입니다.
      </p>

      <p>
        보다 넓은 맛과 깊은 맛으로 최선을 다하겠습니다.
      </p>

      <p class="thanks">감사합니다.</p>

    </div>

    <!-- 갤러리 -->
    <div class="gallery">
      <img src="https://wimg.heraldcorp.com/news/cms/2025/07/16/news-p.v1.20250520.6c4f509cecd7462ba32e4607cda78bb9_P1.jpg">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/Geumgyul_jeonggwa_%28kumquat_sweet%29.jpg">
      <img src="https://www.hansik.or.kr/files/magazine/thumbnail/f36f9192-80b4-4218-a337-80297998b73f.png">
    </div>

  </div>
</template>

<script>
export default {
  name: "BrandView"
}
</script>

<style scoped>

/* 전체 레이아웃 */

.brand-container{
  max-width:1100px;
  margin:auto;
  padding:80px 40px;
  font-family:"Noto Sans KR", sans-serif;
  font-size:20px;
}

/* 타이틀 */

.brand-header{
  text-align:center;
  margin-bottom:70px;
}

.brand-title{
  font-size:48px;
  font-weight:700;
}

.brand-sub{
  color:#666;
  margin-top:15px;
  font-size:22px;
}

/* 한자 스타일 */

.hanja{
  color:#1e4db7;
  font-size:2em;
  font-weight:700;
  margin-left:6px;
}

/* 메인 이미지 */
.image-section{
  text-align:center;
}
.image-section img{
  width:50%;
  border-radius:14px;
  margin-bottom:70px;
}

/* 소개 */

.brand-text{
  line-height:2;
  margin-bottom:70px;
}

.brand-text p{
  margin-bottom:25px;
}

.thanks{
  font-weight:bold;
}

/* 갤러리 */

.gallery{
  display:flex;
  gap:25px;
}

.gallery img{
  width:33%;
  border-radius:12px;
  object-fit:cover;
}


/* ===================== */
/* 반응형 */
/* ===================== */

@media (max-width:768px){

.brand-container{
  padding:50px 20px;
  font-size:16px;
}

.brand-title{
  font-size:32px;
}

.brand-sub{
  font-size:18px;
}

.hanja{
  font-size:1.6em;
}

.gallery{
  flex-direction:column;
}

.gallery img{
  width:100%;
} 

}

.image-section img{
 /* width:50%;
 height:400px; /* 원하는 높이 * /
 object-fit:cover; /* 위아래 잘림 * /
 border-radius:14px; */

 
  width:100%;
  border-radius:14px;
  margin-bottom:70px;
}

</style>