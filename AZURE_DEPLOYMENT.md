# دليل النشر على Azure

## المشاكل التي تم حلها

### 1. مشكلة Angular Routing

- **المشكلة**: خطأ `NG04002: 'home'` عند الوصول لـ routes مثل `/home`
- **الحل**: تحديث `web.config` ليتعامل مع Angular routing بشكل صحيح

### 2. مشكلة تحميل Assets

- **المشكلة**: الأصول لا تحمل أحياناً
- **الحل**: إضافة قواعد rewrite للأصول وتحسين MIME types

## خطوات النشر

### 1. بناء المشروع

```bash
# استخدام الـ script الجديد للبناء مع إعدادات Azure
npm run build:azure
```

### 2. رفع الملفات

- ارفع محتويات مجلد `dist/etf-app/` إلى Azure App Service
- تأكد من وجود `web.config` في المجلد الجذر

### 3. إعدادات Azure App Service

- تأكد من أن الـ Application Settings تحتوي على:
  - `WEBSITE_NODE_DEFAULT_VERSION`: `18.17.0` (أو أحدث)
  - `SCM_DO_BUILD_DURING_DEPLOYMENT`: `true`

## الملفات المحدثة

### 1. `src/web.config`

- إضافة قواعد rewrite للتعامل مع Angular routes
- تحسين MIME types للأصول
- إضافة إعدادات ضغط الملفات
- إضافة إعدادات الأمان

### 2. `angular.json`

- إضافة `baseHref` و `deployUrl` للإنتاج
- تحسين إعدادات البناء

### 3. `package.json`

- إضافة script `build:azure` للبناء مع إعدادات Azure

## اختبار الموقع

بعد النشر، اختبر:

1. الصفحة الرئيسية: `https://etfwebsite-gcf6ggathwd6ehgv.canadacentral-01.azurewebsites.net/`
2. Routes مختلفة: `/home`, `/news`, `/contact-us`
3. الأصول: الصور، CSS، JS files

## استكشاف الأخطاء

إذا واجهت مشاكل:

1. تحقق من console في المتصفح
2. تحقق من Network tab لرؤية الملفات التي لا تحمل
3. تحقق من Azure App Service logs
4. تأكد من أن `web.config` موجود في المجلد الجذر

## ملاحظات مهمة

- تأكد من استخدام `npm run build:azure` للبناء
- لا تستخدم `ng build` العادي لأنه قد لا يعمل مع Azure
- تأكد من رفع `web.config` مع الملفات
