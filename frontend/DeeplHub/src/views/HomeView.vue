<template>
  <section class="home">
    <header class="home-head">
      <h2>Home</h2>
      <p>页面骨架已初始化，内容模块可按后续需求直接扩展。</p>
    </header>

    <div class="home-body">
      <article class="placeholder">
        <h3>Content Placeholder</h3>
        <p>此区域当前保持空白，用于后续接入实验系统、学习模块等业务内容。</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.home {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 14px;
}

.home-head h2 {
  font-size: 24px;
  font-weight: 700;
}

.home-head p {
  color: #6b7280;
}

.home-body {
  min-height: 360px;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 16px;
  background: #ffffff;
}

.placeholder h3 {
  font-size: 18px;
  color: #334155;
}

.placeholder p {
  margin-top: 10px;
  color: #64748b;
}
</style>
