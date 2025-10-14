# Token Expiry Implementation - نظام انتهاء صلاحية التوكن

## 📋 نظرة عامة

تم تطبيق نظام تلقائي لإدارة صلاحية التوكن (Token) في التطبيق. النظام يحذف التوكن تلقائياً بعد 24 ساعة من وقت التسجيل، سواء كان المستخدم يستخدم التطبيق أو لا.

## 🔧 المكونات الرئيسية

### 1. StorageService (تحديث)

**المسار:** `src/app/shared/platform/storage.service.ts`

تم إضافة الوظائف التالية:

#### `setItemWithExpiry(key: string, value: string, expiryInHours: number = 24)`

- تخزين قيمة في localStorage مع وقت انتهاء الصلاحية
- افتراضياً: 24 ساعة
- البيانات المخزنة: `{ value: string, expiry: timestamp }`

#### `getItemWithExpiry(key: string): string | null`

- استرجاع القيمة إذا كانت صالحة
- يتحقق تلقائياً من وقت الانتهاء
- يحذف القيمة إذا انتهت صلاحيتها
- يرجع `null` إذا انتهت الصلاحية

#### `checkAndRemoveExpired(key: string): boolean`

- يتحقق من صلاحية القيمة
- يحذفها إذا انتهت
- يرجع `true` إذا انتهت الصلاحية، `false` إذا لم تنته

---

### 2. TokenExpiryService (جديد)

**المسار:** `src/app/core/services/token-expiry.service.ts`

سيرفس مخصص لإدارة صلاحية التوكن:

#### `initTokenExpiryCheck()`

- يبدأ نظام الفحص التلقائي
- يفحص التوكن فوراً عند تشغيل التطبيق
- يفحص كل ساعة (3600000 ms)

#### `storeTokenWithExpiry(token: string, expiryInHours: number = 24)`

- تخزين التوكن مع وقت انتهاء (افتراضي 24 ساعة)

#### `getValidToken(): string | null`

- الحصول على التوكن إذا كان صالحاً
- يرجع `null` إذا انتهت الصلاحية

#### `handleExpiredToken()` (خاص)

عند انتهاء صلاحية التوكن:

- حذف التوكن من localStorage
- حذف الكوكيز (Cookies)
- إرسال إشعارات للمكونات الأخرى
- إعادة توجيه المستخدم لصفحة تسجيل الدخول

---

### 3. App Component (تحديث)

**المسار:** `src/app/app.component.ts`

```typescript
ngOnInit(): void {
  // تشغيل نظام فحص صلاحية التوكن
  this._tokenExpiryService.initTokenExpiryCheck();
  // ... باقي الكود
}
```

---

### 4. Auth Login Component (تحديث)

**المسار:** `src/app/features/landing-page/components/auth-login/auth-login.component.ts`

عند تسجيل الدخول بنجاح:

```typescript
// تخزين التوكن مع expiry 24 ساعة
this.tokenExpiryService.storeTokenWithExpiry(res, 24);
```

بدلاً من:

```typescript
// ❌ الطريقة القديمة
localStorage.setItem("auth_token", res);
```

---

### 5. Navbar Component (تحديث)

**المسار:** `src/app/layout/components/navbar/navbar.component.ts`

فحص حالة تسجيل الدخول:

```typescript
private checkLoginStatus(): void {
  // استخدام TokenExpiryService للحصول على توكن صالح
  const token = this.tokenExpiryService.getValidToken();
  this.isLoggedIn = !!token;
}
```

---

### 6. Training Component (تحديث)

**المسار:** `src/app/features/landing-page/components/training/training.component.ts`

تحديث فحص التوكن:

```typescript
ngOnInit(): void {
  // التحقق من وجود توكن صالح
  this.isLoggedIn = !!this.tokenExpiryService.getValidToken();
}

handleLinkClick() {
  if (this.isLoggedIn) {
    // الحصول على توكن صالح
    const token = this.tokenExpiryService.getValidToken();
    // ... باقي الكود
  }
}
```

---

## ⚙️ كيفية عمل النظام

### 1. عند تسجيل الدخول

```
المستخدم يدخل البيانات ←
تسجيل دخول ناجح ←
تخزين التوكن مع وقت انتهاء (24 ساعة) ←
تخزين: { value: "token", expiry: timestamp }
```

### 2. عند بدء التطبيق

```
التطبيق يبدأ ←
TokenExpiryService.initTokenExpiryCheck() ←
فحص فوري للتوكن ←
إذا منتهي: حذف + إعادة توجيه للـ login ←
جدولة فحص دوري كل ساعة
```

### 3. أثناء استخدام التطبيق

```
كل ساعة:
  ↓
فحص صلاحية التوكن
  ↓
إذا انتهت (24 ساعة مرت):
  ↓
حذف التوكن تلقائياً
  ↓
إرسال إشعارات للمكونات
  ↓
إعادة توجيه للـ login
```

### 4. عند قراءة التوكن

```
Component يطلب التوكن ←
TokenExpiryService.getValidToken() ←
فحص الصلاحية:
  - صالح? → إرجاع التوكن
  - منتهي? → حذف + إرجاع null
```

---

## 🎯 المميزات

✅ **حذف تلقائي بعد 24 ساعة** - حتى لو التطبيق مش مفتوح
✅ **فحص دوري** - كل ساعة
✅ **فحص فوري** - عند فتح التطبيق
✅ **إعادة توجيه تلقائية** - للـ login عند انتهاء الصلاحية
✅ **تنظيف شامل** - حذف localStorage + Cookies
✅ **إشعارات للمكونات** - عبر Events

---

## 📝 ملاحظات مهمة

1. **الوقت الافتراضي:** 24 ساعة، يمكن تغييره عند الاستدعاء:

   ```typescript
   this.tokenExpiryService.storeTokenWithExpiry(token, 48); // 48 ساعة
   ```

2. **الفحص الدوري:** كل ساعة (3600000 ms)، يمكن تعديله في `token-expiry.service.ts`

3. **التوافق:** النظام يعمل فقط في المتصفح (Browser)، يتحقق من `isPlatformBrowser`

4. **الأمان:** يحذف localStorage و Cookies معاً لضمان تسجيل خروج كامل

---

## 🧪 الاختبار

### اختبار يدوي:

1. سجل دخول للتطبيق
2. افحص localStorage: `localStorage.getItem('auth_token')`
3. ستجد قيمة JSON: `{"value":"token","expiry":timestamp}`
4. غير الـ timestamp يدوياً لوقت في الماضي
5. حدث الصفحة
6. النظام سيحذف التوكن ويعيد توجيهك للـ login

### اختبار برمجي:

```typescript
// في Console
const token = localStorage.getItem("auth_token");
const parsed = JSON.parse(token);
console.log("Expiry:", new Date(parsed.expiry));
console.log("Now:", new Date());
```

---

## 🔄 سير العمل الكامل

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ↓
┌─────────────────────────────┐
│ Store Token with 24h Expiry │
└────────┬────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ App Starts                       │
│ → Check Token Immediately        │
│ → Schedule Hourly Check          │
└────────┬─────────────────────────┘
         │
         ↓
    ┌────────┐
    │ Valid? │
    └───┬────┘
        │
   ┌────┴────┐
   │         │
  Yes       No
   │         │
   │    ┌────↓──────────────────┐
   │    │ Delete Token          │
   │    │ Clear Cookies         │
   │    │ Notify Components     │
   │    │ Redirect to Login     │
   │    └───────────────────────┘
   │
   ↓
┌──────────────┐
│ Continue App │
└──────────────┘
```

---

## 📚 الملفات المعدلة

1. ✅ `src/app/shared/platform/storage.service.ts` - إضافة دوال التخزين مع expiry
2. ✅ `src/app/core/services/token-expiry.service.ts` - سيرفس جديد لإدارة التوكن
3. ✅ `src/app/app.component.ts` - تشغيل نظام الفحص
4. ✅ `src/app/features/landing-page/components/auth-login/auth-login.component.ts` - تخزين مع expiry
5. ✅ `src/app/layout/components/navbar/navbar.component.ts` - قراءة التوكن الصالح
6. ✅ `src/app/features/landing-page/components/training/training.component.ts` - فحص التوكن الصالح

---

## 🚀 للاستخدام المستقبلي

### تخزين أي بيانات مع expiry:

```typescript
// في أي component
constructor(private storageService: StorageService) {}

// تخزين
this.storageService.setItemWithExpiry('myKey', 'myValue', 48); // 48 hours

// قراءة
const value = this.storageService.getItemWithExpiry('myKey');
if (value) {
  // القيمة صالحة
} else {
  // القيمة انتهت أو غير موجودة
}
```

---

تم التطبيق بنجاح! 🎉
