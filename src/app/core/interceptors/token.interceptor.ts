import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      withCredentials: true, // ✅ دا أهم حاجة
    })
  );
};