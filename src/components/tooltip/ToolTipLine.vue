<template>
    <div class="item-hints" @mouseover="showTip" @mouseout="hideTip">
      <div class="hint" data-position="4">
        <div>
            <slot />
        </div>
        <div class="hint-content do--split-children">
          <p><slot name="content" /></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    setup() {
      const showTip = () => {
        const hintContent = document.querySelector('.hint-content');
        hintContent.style.opacity = '1';
        hintContent.style.visibility = 'visible';
      };
  
      const hideTip = () => {
        const hintContent = document.querySelector('.hint-content');
        hintContent.style.opacity = '0';
        hintContent.style.visibility = 'hidden';
      };
  
      return {
        showTip,
        hideTip,
      };
    },
  };
  </script>
  
  <style scoped>
  .item-hints {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
  }
  
  .item-hints .hint {
    margin: 10px 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .item-hints .hint-dot {
    z-index: 3;
    border: 1px solid var(--template-color-primary);
    border-radius: 50%;
    width: 60px;
    height: 60px;
    -webkit-transform: translate(-0%, -0%) scale(0.95);
    transform: translate(-0%, -0%) scale(0.95);
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--template-color-primary);
  }
  
  .item-hints .hint-radius {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -125px 0 0 -125px;
    opacity: 0;
    visibility: hidden;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  
  .item-hints .hint[data-position="4"] .hint-content {
    bottom: 85px;
    left: 50%;
    margin-left: 56px;
  }
  
  .item-hints .hint-content {
    width: 300px;
    position: absolute;
    z-index: 5;
    padding: 35px 0;
    opacity: 0;
    transition: opacity 0.7s ease, visibility 0.7s ease;
    color: var(--el-menu-text-color);
    visibility: hidden;
    pointer-events: none;
  }
  
  .item-hints .hint:hover .hint-content {
    position: absolute;
    z-index: 5;
    padding: 35px 0;
    opacity: 1;
    -webkit-transition: opacity 0.7s ease, visibility 0.7s ease;
    transition: opacity 0.7s ease, visibility 0.7s ease;
    color: black;
    visibility: visible;
    pointer-events: none;
  }
  
  .item-hints .hint-content::before {
    width: 0px;
    bottom: 29px;
    left: 0;
    content: "";
    background-color: var(--template-color-primary);
    height: 1px;
    position: absolute;
    transition: width 0.4s;
  }
  
  .item-hints .hint:hover .hint-content::before {
    width: 180px;
    transition: width 0.4s;
  }
  
  .item-hints .hint-content::after {
    -webkit-transform-origin: 0 50%;
    transform-origin: 0 50%;
    -webkit-transform: rotate(-225deg);
    transform: rotate(-225deg);
    bottom: 29px;
    left: 0;
    width: 80px;
    content: "";
    background-color: var(--template-color-primary);
    height: 1px;
    position: absolute;
    opacity: 1;
    -webkit-transition: opacity 0.5s ease;
    transition: opacity 0.5s ease;
    -webkit-transition-delay: 0s;
    transition-delay: 0s;
  }
  
  .item-hints .hint:hover .hint-content::after {
    opacity: 1;
    visibility: visible;
  }
  </style>
  