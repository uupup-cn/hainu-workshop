<template>
  <div class="dashboard-page site-setting-page flex flex-col gap-[18px]">
    <ArtPageHero
      tone="box"
      align="start"
      title="网站配置"
      description="统一维护品牌信息、登录体验、SEO 元信息、站点状态与对外联系资料。保存后同步影响登录页、浏览器标题、水印与系统品牌展示。"
    >
      <template #right>
        <div
          class="site-setting-hero__meta grid w-[min(420px,100%)] grid-cols-2 gap-3 self-stretch max-[760px]:grid-cols-1"
        >
          <div
            class="site-setting-meta-card flex min-w-0 flex-col justify-center rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="text-xs leading-normal text-g-500">最近更新</span>
            <strong
              class="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-[650] text-g-900"
              >{{ detail?.updatedAt ? formatDateTime(detail.updatedAt) : '-' }}</strong
            >
            <small class="text-xs leading-normal text-g-500">{{
              detail?.updatedByUser?.username || '系统初始化'
            }}</small>
          </div>
          <div
            class="site-setting-meta-card flex min-w-0 flex-col justify-center rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
          >
            <span class="text-xs leading-normal text-g-500">默认语言</span>
            <strong
              class="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-[650] text-g-900"
              >{{ form.defaultLanguage === 'en' ? 'English' : '简体中文' }}</strong
            >
            <small class="text-xs leading-normal text-g-500">登录与公共展示默认语言</small>
          </div>
        </div>
      </template>
    </ArtPageHero>

    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="site-setting-form"
    >
      <div
        class="site-setting-workspace grid grid-cols-[244px_minmax(0,1fr)] items-start gap-[18px] max-[1180px]:grid-cols-1"
      >
        <aside
          class="site-setting-sidebar art-surface-sm sticky top-[107px] flex flex-col gap-1.5 p-3.5 max-[1180px]:static max-[1180px]:grid max-[1180px]:grid-cols-3 max-[760px]:grid-cols-1"
        >
          <div
            class="site-setting-sidebar__title px-2 pt-1 pb-2 text-xs font-[650] text-g-500 max-[1180px]:col-span-full"
          >
            配置分组
          </div>
          <button
            v-for="item in sectionNav"
            :key="item.id"
            class="site-setting-nav-item flex w-full cursor-pointer items-center gap-2.5 rounded-[calc(var(--art-radius-surface-sm)-2px)] border-0 bg-transparent p-2.5 text-left text-sm font-normal text-g-700"
            type="button"
            @click="scrollToSection(item.id)"
          >
            <ArtSvgIcon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </button>

          <div
            class="site-setting-sidebar__note mt-2.5 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-3.5 max-[1180px]:col-span-full"
          >
            <span class="text-[13px] font-[650] text-g-900">发布影响</span>
            <p class="mt-1.5 mb-0 text-xs leading-relaxed text-g-600">
              配置保存后会立即同步到登录页、公共配置缓存和系统品牌展示。
            </p>
          </div>
        </aside>

        <main class="site-setting-content flex min-w-0 flex-col gap-[18px]">
          <section
            id="status-overview"
            class="site-setting-section site-setting-section--overview grid grid-cols-4 gap-3 p-0 max-[1180px]:grid-cols-1"
          >
            <div
              class="site-setting-overview-card site-setting-overview-card--status flex min-h-[118px] min-w-0 flex-col rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[18px] text-g-900 shadow-[var(--art-surface-shadow-sm)] transition-[background-color,border-color,box-shadow] duration-200"
              :class="form.maintenanceMode ? 'is-warning' : 'is-success'"
            >
              <div
                class="site-setting-overview-card__header flex items-center justify-between gap-3"
              >
                <span
                  class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-[650] text-g-500"
                  >站点状态</span
                >
                <ArtSvgIcon
                  :icon="form.maintenanceMode ? 'ri:alarm-warning-line' : 'ri:pulse-line'"
                />
              </div>
              <strong
                class="mt-3 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-[650] text-g-900"
                >{{ form.maintenanceMode ? '维护模式已开启' : '站点正常开放' }}</strong
              >
              <p class="mt-1.5 mb-0 text-xs leading-relaxed text-g-600">
                {{
                  form.maintenanceMode
                    ? '登录页将展示维护提示，请确认文案清晰。'
                    : '登录页和公共展示保持正常访问。'
                }}
              </p>
            </div>

            <div
              class="site-setting-overview-card flex min-h-[118px] min-w-0 flex-col rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[18px] text-g-900 shadow-[var(--art-surface-shadow-sm)] transition-[background-color,border-color,box-shadow] duration-200"
            >
              <div
                class="site-setting-overview-card__header flex items-center justify-between gap-3"
              >
                <span
                  class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-[650] text-g-500"
                  >开放注册</span
                >
                <ArtSvgIcon icon="ri:user-add-line" />
              </div>
              <strong
                class="mt-3 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-[650] text-g-900"
                >{{ form.allowRegister ? '已开启' : '已关闭' }}</strong
              >
              <p class="mt-1.5 mb-0 text-xs leading-relaxed text-g-600">{{
                form.allowRegister ? '新用户可从登录页进入注册流程。' : '公开注册入口已隐藏。'
              }}</p>
            </div>

            <div
              class="site-setting-overview-card flex min-h-[118px] min-w-0 flex-col rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[18px] text-g-900 shadow-[var(--art-surface-shadow-sm)] transition-[background-color,border-color,box-shadow] duration-200"
            >
              <div
                class="site-setting-overview-card__header flex items-center justify-between gap-3"
              >
                <span
                  class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-[650] text-g-500"
                  >验证码</span
                >
                <ArtSvgIcon icon="ri:shield-keyhole-line" />
              </div>
              <strong
                class="mt-3 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-[650] text-g-900"
                >{{
                  form.captchaEnabled ? resolveCaptchaTypeLabel(form.captchaType) : '已关闭'
                }}</strong
              >
              <p class="mt-1.5 mb-0 text-xs leading-relaxed text-g-600">
                {{
                  form.loginMaxRetryCount
                    ? `失败 ${form.loginMaxRetryCount} 次后锁定 ${form.loginLockMinutes} 分钟。`
                    : '未限制失败次数，适合公开演示账号。'
                }}
              </p>
            </div>

            <div
              class="site-setting-overview-card flex min-h-[118px] min-w-0 flex-col rounded-[var(--art-radius-surface-sm)] border border-[var(--art-surface-border)] bg-[var(--art-surface-bg)] p-[18px] text-g-900 shadow-[var(--art-surface-shadow-sm)] transition-[background-color,border-color,box-shadow] duration-200"
            >
              <div
                class="site-setting-overview-card__header flex items-center justify-between gap-3"
              >
                <span
                  class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-[650] text-g-500"
                  >品牌名称</span
                >
                <ArtSvgIcon icon="ri:bookmark-3-line" />
              </div>
              <strong
                class="mt-3 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-[650] text-g-900"
                >{{ form.siteName?.trim() || '未填写' }}</strong
              >
              <p class="mt-1.5 mb-0 text-xs leading-relaxed text-g-600">
                影响登录页、标题、水印和系统品牌展示。
              </p>
            </div>
          </section>

          <section
            id="system-identity"
            class="site-setting-section art-surface-sm p-[22px] max-[760px]:p-[18px]"
          >
            <header
              class="site-setting-section__header mb-[18px] flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-[18px]"
            >
              <div>
                <h2 class="m-0 text-lg leading-snug font-[650] text-g-900">系统标识</h2>
                <p class="mt-1.5 mb-0 max-w-[60ch] text-[13px] leading-relaxed text-g-600">
                  配置系统名称、简介与公共水印内容。
                </p>
              </div>
              <ArtSvgIcon icon="ri:gallery-view-2" />
            </header>

            <div
              class="site-setting-fields grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-x-4 gap-y-[18px]"
            >
              <div class="col-span-full w-1/2 max-[760px]:w-full">
                <ElFormItem label="系统名称" prop="siteName">
                  <ElInput
                    v-model="form.siteName"
                    maxlength="100"
                    placeholder="例如：企业运营管理平台"
                  />
                  <div class="site-setting-help mt-1.5 text-xs leading-normal text-g-500">
                    用于登录页、顶部栏、侧边栏、页签和浏览器标题。
                  </div>
                </ElFormItem>
              </div>
              <div
                class="site-setting-watermark-row col-span-full grid grid-cols-2 gap-x-4 gap-y-[18px] max-[760px]:grid-cols-1"
              >
                <ElFormItem label="水印内容" prop="watermarkMode">
                  <ElSelect v-model="form.watermarkMode" class="w-full">
                    <ElOption
                      v-for="item in watermarkModeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </ElSelect>
                  <div class="site-setting-help mt-1.5 text-xs leading-normal text-g-500">
                    默认使用当前登录用户名，也可叠加时间、使用站点名称或自定义文本。
                  </div>
                </ElFormItem>
                <ElFormItem
                  v-if="form.watermarkMode === 'CUSTOM_TEXT'"
                  label="自定义水印"
                  prop="watermarkText"
                >
                  <ElInput
                    v-model="form.watermarkText"
                    maxlength="100"
                    placeholder="例如：企业运营管理平台"
                  />
                  <div class="site-setting-help mt-1.5 text-xs leading-normal text-g-500">
                    仅在水印内容选择“自定义文本”时生效。
                  </div>
                </ElFormItem>
              </div>
              <ElFormItem
                label="站点简介"
                prop="siteDescription"
                class="site-setting-field-full col-span-full"
              >
                <ElInput
                  v-model="form.siteDescription"
                  type="textarea"
                  :rows="3"
                  maxlength="255"
                  show-word-limit
                  placeholder="用于后台说明、站点简介与扩展展示"
                />
              </ElFormItem>
              <div class="site-setting-toggle-list col-span-full mt-[-2px] grid gap-3">
                <div
                  class="site-setting-toggle-row art-surface-muted-xs flex min-w-0 items-center justify-between gap-[18px] px-4 py-3.5"
                >
                  <div>
                    <strong class="text-sm font-[650] text-g-900">启用水印</strong>
                    <p class="mt-[5px] mb-0 text-xs leading-relaxed text-g-600">
                      保存后作为站点级配置生效；用户仍可在系统设置抽屉里临时隐藏全局水印。
                    </p>
                  </div>
                  <ElSwitch v-model="form.watermarkEnabled" />
                </div>
              </div>
            </div>
          </section>

          <section
            id="login-experience"
            class="site-setting-section art-surface-sm p-[22px] max-[760px]:p-[18px]"
          >
            <header
              class="site-setting-section__header mb-[18px] flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-[18px]"
            >
              <div>
                <h2 class="m-0 text-lg leading-snug font-[650] text-g-900">登录体验</h2>
                <p class="mt-1.5 mb-0 max-w-[60ch] text-[13px] leading-relaxed text-g-600">
                  控制登录页欢迎文案、验证码、安全锁定、默认语言、维护模式与注册策略。
                </p>
              </div>
              <ArtSvgIcon icon="ri:shield-star-line" />
            </header>

            <div
              class="site-setting-fields grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-x-4 gap-y-[18px]"
            >
              <ElFormItem label="登录欢迎标题" prop="loginWelcomeTitle">
                <ElInput
                  v-model="form.loginWelcomeTitle"
                  maxlength="100"
                  placeholder="例如：欢迎使用企业运营后台"
                />
              </ElFormItem>
              <ElFormItem label="默认语言" prop="defaultLanguage">
                <ElSelect v-model="form.defaultLanguage" class="w-full">
                  <ElOption label="简体中文" value="zh" />
                  <ElOption label="English" value="en" />
                </ElSelect>
              </ElFormItem>
              <div
                class="site-setting-captcha-row col-span-full grid grid-cols-3 gap-x-4 gap-y-[18px] max-[960px]:grid-cols-1"
              >
                <ElFormItem label="验证码类型" prop="captchaType">
                  <ElSelect v-model="form.captchaType" class="w-full">
                    <ElOption label="图片验证码" value="IMAGE" />
                    <ElOption label="滑块验证码" value="SLIDER" />
                  </ElSelect>
                  <div class="site-setting-help mt-1.5 text-xs leading-normal text-g-500">
                    图片验证码由后端一次性校验，滑块验证码使用登录页交互验证。
                  </div>
                </ElFormItem>
                <ElFormItem label="最大重试次数" prop="loginMaxRetryCount">
                  <ElInputNumber
                    v-model="form.loginMaxRetryCount"
                    class="w-full!"
                    :min="1"
                    :max="20"
                    :value-on-clear="null"
                    clearable
                    controls-position="right"
                    placeholder="留空不限制"
                  />
                  <div class="site-setting-help mt-1.5 text-xs leading-normal text-g-500">
                    留空时不限制失败次数，适合公开演示账号或多人共用账号。
                  </div>
                </ElFormItem>
                <ElFormItem label="锁定时间（分钟）" prop="loginLockMinutes">
                  <ElInputNumber
                    v-model="form.loginLockMinutes"
                    class="w-full!"
                    :min="1"
                    :max="1440"
                    :disabled="!form.loginMaxRetryCount"
                    controls-position="right"
                  />
                </ElFormItem>
              </div>
              <ElFormItem
                label="登录欢迎描述"
                prop="loginWelcomeDescription"
                class="site-setting-field-full col-span-full"
              >
                <ElInput
                  v-model="form.loginWelcomeDescription"
                  type="textarea"
                  :rows="3"
                  maxlength="255"
                  show-word-limit
                  placeholder="展示在登录页左侧的品牌描述"
                />
              </ElFormItem>
            </div>

            <div class="site-setting-toggle-list mt-1 grid gap-3">
              <div
                class="site-setting-toggle-row art-surface-muted-xs flex min-w-0 items-center justify-between gap-[18px] px-4 py-3.5"
              >
                <div>
                  <strong class="text-sm font-[650] text-g-900">验证码</strong>
                  <p class="mt-[5px] mb-0 text-xs leading-relaxed text-g-600">
                    开启后，登录页会显示图片验证码，后端校验通过后才允许登录。
                  </p>
                </div>
                <ElSwitch v-model="form.captchaEnabled" />
              </div>
              <div
                class="site-setting-toggle-row art-surface-muted-xs flex min-w-0 items-center justify-between gap-[18px] px-4 py-3.5"
              >
                <div>
                  <strong class="text-sm font-[650] text-g-900">开放注册</strong>
                  <p class="mt-[5px] mb-0 text-xs leading-relaxed text-g-600">
                    关闭后，登录页和注册页不再提供公开注册入口。
                  </p>
                </div>
                <ElSwitch v-model="form.allowRegister" />
              </div>
              <div
                class="site-setting-toggle-row art-surface-muted-xs flex min-w-0 items-center justify-between gap-[18px] px-4 py-3.5"
              >
                <div>
                  <strong class="text-sm font-[650] text-g-900">反馈组件</strong>
                  <p class="mt-[5px] mb-0 text-xs leading-relaxed text-g-600">
                    控制右侧反馈入口是否启用，关闭后所有登录用户都不会看到反馈组件。
                  </p>
                </div>
                <ElSwitch v-model="form.feedbackEnabled" />
              </div>
              <div
                class="site-setting-toggle-row art-surface-muted-xs flex min-w-0 items-center justify-between gap-[18px] px-4 py-3.5"
              >
                <div>
                  <strong class="text-sm font-[650] text-g-900">维护模式</strong>
                  <p class="mt-[5px] mb-0 text-xs leading-relaxed text-g-600">
                    开启后，登录页将显示维护公告，用于版本升级或发布窗口。
                  </p>
                </div>
                <ElSwitch v-model="form.maintenanceMode" />
              </div>
              <ElFormItem
                label="维护提示文案"
                prop="maintenanceMessage"
                class="site-setting-maintenance-message mb-4"
              >
                <ElInput
                  v-model="form.maintenanceMessage"
                  maxlength="255"
                  placeholder="维护模式开启时建议填写，例如：系统今晚 23:00-24:00 升级维护"
                />
              </ElFormItem>
            </div>
          </section>
          <section
            id="seo-display"
            class="site-setting-section art-surface-sm p-[22px] max-[760px]:p-[18px]"
          >
            <header
              class="site-setting-section__header mb-[18px] flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-[18px]"
            >
              <div>
                <h2 class="m-0 text-lg leading-snug font-[650] text-g-900">SEO 与搜索展现</h2>
                <p class="mt-1.5 mb-0 max-w-[60ch] text-[13px] leading-relaxed text-g-600">
                  用于浏览器标题、搜索摘要和对外品牌检索。
                </p>
              </div>
              <ArtSvgIcon icon="ri:search-eye-line" />
            </header>

            <div
              class="site-setting-fields grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-x-4 gap-y-[18px]"
            >
              <ElFormItem label="SEO 标题" prop="seoTitle">
                <ElInput
                  v-model="form.seoTitle"
                  maxlength="100"
                  placeholder="例如：企业运营管理平台"
                />
              </ElFormItem>
              <ElFormItem label="SEO 关键词" prop="seoKeywords">
                <ElInput
                  v-model="form.seoKeywords"
                  maxlength="255"
                  placeholder="多个关键词用英文逗号分隔"
                />
              </ElFormItem>
              <ElFormItem label="SEO 描述" prop="seoDescription">
                <ElInput
                  v-model="form.seoDescription"
                  type="textarea"
                  :rows="3"
                  maxlength="500"
                  show-word-limit
                  placeholder="简要描述你的产品定位、服务对象与主要价值"
                />
              </ElFormItem>
            </div>
          </section>

          <section
            id="contact-compliance"
            class="site-setting-section art-surface-sm p-[22px] max-[760px]:p-[18px]"
          >
            <header
              class="site-setting-section__header mb-[18px] flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-[18px]"
            >
              <div>
                <h2 class="m-0 text-lg leading-snug font-[650] text-g-900">联系与合规信息</h2>
                <p class="mt-1.5 mb-0 max-w-[60ch] text-[13px] leading-relaxed text-g-600">
                  配置对外联系方式、地址与备案文案，便于后续扩展官网或登录页页脚。
                </p>
              </div>
              <ArtSvgIcon icon="ri:file-shield-2-line" />
            </header>

            <div
              class="site-setting-fields grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-x-4 gap-y-[18px]"
            >
              <ElFormItem label="联系邮箱" prop="supportEmail">
                <ElInput
                  v-model="form.supportEmail"
                  maxlength="100"
                  placeholder="如 support@example.com"
                />
              </ElFormItem>
              <ElFormItem label="联系电话" prop="supportPhone">
                <ElInput v-model="form.supportPhone" maxlength="30" placeholder="如 400-800-9000" />
              </ElFormItem>
              <ElFormItem
                label="联系地址"
                prop="contactAddress"
                class="site-setting-field-full col-span-full"
              >
                <ElInput
                  v-model="form.contactAddress"
                  maxlength="255"
                  placeholder="如 广东省深圳市南山区科技园"
                />
              </ElFormItem>
              <ElFormItem
                label="版权文案"
                prop="copyrightText"
                class="site-setting-field-full col-span-full"
              >
                <ElInput
                  v-model="form.copyrightText"
                  maxlength="255"
                  placeholder="如 Copyright © 2026 某某科技有限公司"
                />
              </ElFormItem>
              <ElFormItem label="ICP备案号" prop="icpNo">
                <ElInput
                  v-model="form.icpNo"
                  maxlength="100"
                  placeholder="如 粤ICP备2026000000号-1"
                />
              </ElFormItem>
              <ElFormItem label="公安备案号" prop="publicSecurityNo">
                <ElInput
                  v-model="form.publicSecurityNo"
                  maxlength="100"
                  placeholder="如 粤公网安备44030002000001号"
                />
              </ElFormItem>
            </div>
          </section>

          <section
            id="publish-summary"
            class="site-setting-section art-surface-sm p-[22px] max-[760px]:p-[18px]"
          >
            <header
              class="site-setting-section__header mb-[18px] flex items-start justify-between gap-4 border-b border-[var(--art-inner-surface-border)] pb-[18px]"
            >
              <div>
                <h2 class="m-0 text-lg leading-snug font-[650] text-g-900">发布预览</h2>
                <p class="mt-1.5 mb-0 max-w-[60ch] text-[13px] leading-relaxed text-g-600">
                  保存前快速确认即将影响公共展示的核心配置。
                </p>
              </div>
              <ArtSvgIcon icon="ri:edit-box-line" />
            </header>

            <div class="site-setting-preview grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
              <div
                class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
              >
                <span class="block text-xs leading-normal text-g-500">品牌名称</span>
                <strong
                  class="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-[650] text-g-900"
                  >{{ form.siteName?.trim() || '系统名称' }}</strong
                >
              </div>
              <div
                class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
              >
                <span class="block text-xs leading-normal text-g-500">默认语言</span>
                <strong
                  class="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-[650] text-g-900"
                  >{{ form.defaultLanguage === 'en' ? 'English' : '简体中文' }}</strong
                >
              </div>
              <div
                class="min-w-0 rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
              >
                <span class="block text-xs leading-normal text-g-500">水印内容</span>
                <strong
                  class="mt-2 block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-[650] text-g-900"
                  >{{ resolveWatermarkModeLabel(form.watermarkMode) }}</strong
                >
              </div>
            </div>
          </section>

          <div
            class="site-setting-action-bar art-card-sm sticky bottom-4 z-[5] flex items-center justify-between gap-[18px] px-4 py-3.5 max-[760px]:flex-col max-[760px]:items-stretch"
          >
            <div>
              <strong class="block text-sm font-[650] text-g-900">{{
                form.siteName?.trim() || '网站配置'
              }}</strong>
              <span class="mt-[3px] block text-xs leading-normal text-g-500">
                保存后会同步影响登录页、浏览器标题与系统品牌展示。
              </span>
            </div>
            <div
              class="site-setting-action-bar__buttons flex flex-none items-center gap-2.5 max-[760px]:w-full max-[760px]:flex-col max-[760px]:items-stretch"
            >
              <ElButton plain @click="resetToInitial" :disabled="loading || !hasAuth('edit')">
                重置当前表单
              </ElButton>
              <ElButton
                type="primary"
                @click="handleSubmit"
                :loading="saving"
                :disabled="!hasAuth('edit')"
              >
                保存并发布配置
              </ElButton>
            </div>
          </div>
        </main>
      </div>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { useAuth } from '@/hooks/core/useAuth'
  import { fetchAdminSiteSettings, fetchUpdateSiteSettings } from '@/api/site-settings'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'SiteSetting' })

  const { hasAuth } = useAuth()
  const siteSettingsStore = useSiteSettingsStore()
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const saving = ref(false)
  const detail = ref<Api.Settings.SiteSettingInfo>()
  const initialSnapshot = ref<Api.Settings.SiteSettingPayload>()

  const sectionNav = [
    { id: 'status-overview', label: '状态概览', icon: 'ri:pulse-line' },
    { id: 'system-identity', label: '系统标识', icon: 'ri:gallery-view-2' },
    { id: 'login-experience', label: '登录体验', icon: 'ri:shield-star-line' },
    { id: 'seo-display', label: 'SEO 展现', icon: 'ri:search-eye-line' },
    { id: 'contact-compliance', label: '联系合规', icon: 'ri:file-shield-2-line' },
    { id: 'publish-summary', label: '发布预览', icon: 'ri:edit-box-line' }
  ]

  const watermarkModeOptions: {
    label: string
    value: NonNullable<Api.Settings.SiteSettingPayload['watermarkMode']>
  }[] = [
    { label: '用户名', value: 'USERNAME' },
    { label: '用户名+时间', value: 'USERNAME_TIME' },
    { label: '站点名称', value: 'SITE_NAME' },
    { label: '自定义文本', value: 'CUSTOM_TEXT' }
  ]

  /**
   * 创建站点配置表单默认值。
   */
  const createDefaultForm = (): Api.Settings.SiteSettingPayload => ({
    siteName: '',
    siteDescription: '',
    loginWelcomeTitle: '',
    loginWelcomeDescription: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    supportEmail: '',
    supportPhone: '',
    contactAddress: '',
    copyrightText: '',
    icpNo: '',
    publicSecurityNo: '',
    maintenanceMode: false,
    maintenanceMessage: '',
    watermarkEnabled: true,
    watermarkMode: 'USERNAME',
    watermarkText: '',
    allowRegister: true,
    feedbackEnabled: true,
    captchaEnabled: false,
    captchaType: 'IMAGE',
    loginMaxRetryCount: null,
    loginLockMinutes: 10,
    defaultLanguage: 'zh'
  })

  const form = reactive<Api.Settings.SiteSettingPayload>(createDefaultForm())

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return

    const scroller = document.getElementById('app-main')
    if (!scroller) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    // 让 section 顶部对齐到 sidebar 导航项的视觉起始位置
    const FIXED_OFFSET = 107
    const targetTop = target.getBoundingClientRect().top
    const scrollerTop = scroller.getBoundingClientRect().top
    const nextTop = scroller.scrollTop + targetTop - scrollerTop - FIXED_OFFSET

    scroller.scrollTo({
      top: Math.max(nextTop, 0),
      behavior: 'smooth'
    })
  }

  /**
   * 校验可选邮箱字段，空值允许通过。
   */
  const validateOptionalEmail = (_rule: any, value: string, callback: (error?: Error) => void) => {
    const normalized = String(value || '').trim()
    if (!normalized) {
      callback()
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    callback(emailRegex.test(normalized) ? undefined : new Error('请输入正确的邮箱地址'))
  }

  const validateMaintenanceMessage = (
    _rule: any,
    value: string,
    callback: (error?: Error) => void
  ) => {
    if (!form.maintenanceMode) {
      callback()
      return
    }

    if (!String(value || '').trim()) {
      callback(new Error('开启维护模式后，请填写维护提示文案'))
      return
    }

    callback()
  }

  const validateWatermarkText = (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (form.watermarkMode !== 'CUSTOM_TEXT') {
      callback()
      return
    }

    if (!String(value || '').trim()) {
      callback(new Error('选择自定义文本后，请填写水印文案'))
      return
    }

    callback()
  }

  const resolveCaptchaTypeLabel = (type?: Api.Settings.SiteSettingPayload['captchaType']) => {
    const labelMap = {
      IMAGE: '图片验证码',
      SLIDER: '滑块验证码'
    }
    return labelMap[type || 'IMAGE']
  }

  const resolveWatermarkModeLabel = (mode?: Api.Settings.SiteSettingPayload['watermarkMode']) =>
    watermarkModeOptions.find((item) => item.value === mode)?.label || '用户名'

  const validateLoginMaxRetryCount = (
    _rule: any,
    value: unknown,
    callback: (error?: Error) => void
  ) => {
    if (isEmptyLoginMaxRetryCount(value)) {
      callback()
      return
    }

    const numericValue = Number(value)
    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 20) {
      callback(new Error('请输入 1 到 20 之间的次数，或留空表示不限制'))
      return
    }

    callback()
  }

  const isEmptyLoginMaxRetryCount = (value: unknown) =>
    value === null || value === undefined || String(value).trim() === ''

  const normalizeLoginMaxRetryCount = (value: unknown) =>
    isEmptyLoginMaxRetryCount(value) ? null : Number(value)

  /**
   * 站点配置表单校验规则。
   */
  const rules = computed<FormRules>(() => ({
    siteName: [
      { required: true, message: '请输入系统名称', trigger: 'blur' },
      { min: 2, max: 100, message: '长度需在 2 到 100 个字符之间', trigger: 'blur' }
    ],
    siteDescription: [{ max: 255, message: '长度不能超过 255 个字符', trigger: 'blur' }],
    loginWelcomeTitle: [{ max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }],
    loginWelcomeDescription: [{ max: 255, message: '长度不能超过 255 个字符', trigger: 'blur' }],
    seoTitle: [{ max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }],
    seoDescription: [{ max: 500, message: '长度不能超过 500 个字符', trigger: 'blur' }],
    seoKeywords: [{ max: 255, message: '长度不能超过 255 个字符', trigger: 'blur' }],
    supportEmail: [{ validator: validateOptionalEmail, trigger: 'blur' }],
    supportPhone: [{ max: 30, message: '长度不能超过 30 个字符', trigger: 'blur' }],
    contactAddress: [{ max: 255, message: '长度不能超过 255 个字符', trigger: 'blur' }],
    copyrightText: [{ max: 255, message: '长度不能超过 255 个字符', trigger: 'blur' }],
    icpNo: [{ max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }],
    publicSecurityNo: [{ max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }],
    maintenanceMessage: [{ validator: validateMaintenanceMessage, trigger: 'blur' }],
    watermarkMode: [{ required: true, message: '请选择水印内容', trigger: 'change' }],
    watermarkText: [
      { validator: validateWatermarkText, trigger: 'blur' },
      { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
    ],
    loginMaxRetryCount: [{ validator: validateLoginMaxRetryCount, trigger: 'change' }],
    loginLockMinutes: [
      {
        type: 'number',
        min: 1,
        max: 1440,
        message: '请输入 1 到 1440 之间的分钟数',
        trigger: 'change'
      }
    ]
  }))

  /**
   * 将接口返回的站点配置同步到表单和初始快照。
   */
  const syncForm = (payload: Api.Settings.SiteSettingInfo) => {
    detail.value = payload
    const nextForm: Api.Settings.SiteSettingPayload = {
      siteName: payload.siteName || '',
      siteDescription: payload.siteDescription || '',
      loginWelcomeTitle: payload.loginWelcomeTitle || '',
      loginWelcomeDescription: payload.loginWelcomeDescription || '',
      seoTitle: payload.seoTitle || '',
      seoDescription: payload.seoDescription || '',
      seoKeywords: payload.seoKeywords || '',
      supportEmail: payload.supportEmail || '',
      supportPhone: payload.supportPhone || '',
      contactAddress: payload.contactAddress || '',
      copyrightText: payload.copyrightText || '',
      icpNo: payload.icpNo || '',
      publicSecurityNo: payload.publicSecurityNo || '',
      maintenanceMode: payload.maintenanceMode,
      maintenanceMessage: payload.maintenanceMessage || '',
      watermarkEnabled: payload.watermarkEnabled !== false,
      watermarkMode: payload.watermarkMode || 'USERNAME',
      watermarkText: payload.watermarkText || '',
      allowRegister: payload.allowRegister,
      feedbackEnabled: payload.feedbackEnabled,
      captchaEnabled: payload.captchaEnabled,
      captchaType: payload.captchaType || 'IMAGE',
      loginMaxRetryCount: payload.loginMaxRetryCount ?? null,
      loginLockMinutes: payload.loginLockMinutes || 10,
      defaultLanguage: payload.defaultLanguage || 'zh'
    }

    Object.assign(form, nextForm)
    initialSnapshot.value = { ...nextForm }
  }

  /**
   * 清洗表单内容并组装更新站点配置的载荷。
   */
  const sanitizePayload = (): Api.Settings.SiteSettingPayload => ({
    siteName: String(form.siteName || '').trim(),
    siteDescription: String(form.siteDescription || '').trim(),
    loginWelcomeTitle: String(form.loginWelcomeTitle || '').trim(),
    loginWelcomeDescription: String(form.loginWelcomeDescription || '').trim(),
    seoTitle: String(form.seoTitle || '').trim(),
    seoDescription: String(form.seoDescription || '').trim(),
    seoKeywords: String(form.seoKeywords || '').trim(),
    supportEmail: String(form.supportEmail || '').trim(),
    supportPhone: String(form.supportPhone || '').trim(),
    contactAddress: String(form.contactAddress || '').trim(),
    copyrightText: String(form.copyrightText || '').trim(),
    icpNo: String(form.icpNo || '').trim(),
    publicSecurityNo: String(form.publicSecurityNo || '').trim(),
    maintenanceMode: Boolean(form.maintenanceMode),
    maintenanceMessage: String(form.maintenanceMessage || '').trim(),
    watermarkEnabled: Boolean(form.watermarkEnabled),
    watermarkMode: form.watermarkMode || 'USERNAME',
    watermarkText: String(form.watermarkText || '').trim(),
    allowRegister: Boolean(form.allowRegister),
    feedbackEnabled: Boolean(form.feedbackEnabled),
    captchaEnabled: Boolean(form.captchaEnabled),
    captchaType: form.captchaType || 'IMAGE',
    loginMaxRetryCount: normalizeLoginMaxRetryCount(form.loginMaxRetryCount),
    loginLockMinutes: Number(form.loginLockMinutes || 10),
    defaultLanguage: form.defaultLanguage || 'zh'
  })

  /**
   * 加载后台站点配置详情。
   */
  const loadDetail = async () => {
    loading.value = true
    try {
      const result = await fetchAdminSiteSettings()
      syncForm(result)
    } finally {
      loading.value = false
    }
  }

  /**
   * 将表单恢复到最近一次加载或保存后的快照。
   */
  const resetToInitial = () => {
    if (!initialSnapshot.value) return
    Object.assign(form, initialSnapshot.value)
    formRef.value?.clearValidate()
  }

  /**
   * 校验并保存站点配置。
   */
  const handleSubmit = async () => {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    saving.value = true
    try {
      const payload = sanitizePayload()
      const result = await fetchUpdateSiteSettings(payload)
      syncForm(result)
      siteSettingsStore.applyPublicConfig(result)
      ElMessage.success('网站配置已保存并生效')
    } finally {
      saving.value = false
    }
  }

  onMounted(async () => {
    await loadDetail()
  })
</script>

<style scoped lang="scss">
  .site-setting-nav-item {
    transition:
      color 0.18s ease,
      background-color 0.18s ease;

    &:hover,
    &:focus-visible {
      color: var(--art-gray-800);
      background: color-mix(in srgb, var(--art-gray-200) 72%, var(--default-box-color));
      outline: none;
    }

    :deep(.art-svg-icon) {
      flex: 0 0 auto;
      font-size: 18px;
    }
  }

  .site-setting-section {
    scroll-margin-top: 124px;
  }

  .site-setting-overview-card--status {
    &.is-success {
      .site-setting-overview-card__header > .art-svg-icon {
        color: var(--el-color-success);
      }
    }

    &.is-warning {
      .site-setting-overview-card__header > .art-svg-icon {
        color: var(--el-color-warning);
      }
    }
  }

  .site-setting-overview-card__header {
    > .art-svg-icon {
      flex: 0 0 auto;
      font-size: 20px;
      color: var(--art-gray-500);
    }
  }

  .site-setting-section__header {
    > .art-svg-icon {
      flex: 0 0 auto;
      font-size: 22px;
      color: var(--art-gray-500);
    }
  }

  .site-setting-maintenance-message {
    :deep(.el-form-item__error) {
      padding-top: 6px;
      line-height: 1.45;
    }
  }

  .site-setting-action-bar__buttons {
    :deep(.el-button + .el-button) {
      margin-left: 0;
    }

    @media (width <= 760px) {
      :deep(.el-button) {
        width: 100%;
      }
    }
  }
</style>
