// src/i18n/routing.ts
import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const routing = {
  // 这里要和你 messages 文件夹下的语言文件名对应
  locales: ['en', 'zh'], 
  defaultLocale: 'en'
};

// 导出这个 Link，它会自动处理像 /zh/pricing 这样的路径
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation(routing);